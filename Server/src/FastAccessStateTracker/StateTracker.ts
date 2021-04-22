import { FlowObject } from "./FlowLibrary/FlowObject";
import { FlowAvatar } from "./FlowLibrary/FlowAvatar";
import { FlowVSGraph } from "./FlowLibrary/FlowVSGraph";
import { FlowProject } from "./FlowLibrary/FlowProject";
import { FlowBehaviour } from "./FlowLibrary/FlowBehaviour";
import { FlowNodeView } from "./FlowLibrary/FlowNodeView";

import { RoomManager } from "./RoomManager";
import { TypeORMDatabase } from "./Database/TypeORMDatabase"

// TODO: Add logging system

// Note: FAM is used to abbreviate "Fast Access Memory"

/**
 * Keeps track of the state of the project, allowing for faster access 
 * to data while storing data to the database when necessary
 */

export class StateTracker{

  /* 
  * <projectId: Project>
  */
  public static currentProjects: RoomManager = new RoomManager();
  
  /** 
   * Map< username: Map<client: projectId> >
   */
  public static currentUsers: Map<string, Map<string, string> > = new Map()
  
  // Project Functions

  // TODO: finished: yes Tested: yes 
  /**
   * Adds a project to the database
   * @param projectToCreate 
   */
  public static async CreateProject(projectToCreate: FlowProject, username: string, client: string) : Promise<[any, Array<string>]>
  {
    let userLoggedIn = this.currentUsers.has(username);

    // Don't allow users to create projects if they are not logged in
    if(!userLoggedIn)
      return [null, [client]]

    let newProject = await TypeORMDatabase.CreateProject(projectToCreate, username);

    return [ newProject, [client] ];
  }

  /**
   * 
   * @param projectToReadId The id to reference in the room manager to recieve all FlowProject Data
   * @param client current client to send data to
   */
  public static async ReadProject(projectToReadId: string, client: string): Promise<[any, Array<string>]>
  {
    let project = RoomManager.FindRoom(projectToReadId).GetProject()
    let affectedClients = [];
    affectedClients.push(client);
    
    return [project, affectedClients];
  } 


  // TODO: finished: yes tested: yes
  /**]
   * Deletes the project from the FAM and the database - assumes that nobody is in the room
   * @param projectToDeleteId
   */
  public static async DeleteProject(projectToDeleteId: string, user: string, client: string) : Promise<[any, Array<string>]>
  {    

    if(RoomManager.FindRoom == undefined || ! await TypeORMDatabase.GetProject(projectToDeleteId))
      return [ false, [client] ];

    // remove roomManager, get the list of all affected users/clients
    let clients = RoomManager.DestroyRoom(projectToDeleteId);

    // Remove project from database 
    await TypeORMDatabase.DeleteProject(projectToDeleteId);

    return [true, [client] ];
  }


   // TODO: finished: yes tested: no
  /**
   * Returns all projects associated with a username
   * @param username
   */
  public static async FetchProjects(username: string, client: string) : Promise<[any, Array<string>]>
  {    
    let projects = await TypeORMDatabase.fetchProjects(username);

    return [projects, [client] ];
  }
 
  // TODO: finished: yes tested: no
  /**
   * Finds a project with id projectToOpenId, returns it to the command context
   * @param projectToOpenID - ID of associated project
   */
  public static async OpenProject(projectToOpenID: any, username: string, client: string) : Promise<[any, Array<string>, [any, Array<string>]]>
  {
    let userLoggedIn = this.currentUsers.has(username);

    // Don't allow users to create projects if they are not logged in
    if(!userLoggedIn)
      return [ null, [client], null ];

    // find project in list of projects so that we can return it
    let projectFound = await TypeORMDatabase.GetProject(projectToOpenID);

    if(!projectFound)
      [ null, [client], null];
    
    // grabs all the clients from the room manager
    let affectedClients: string[] = []
    affectedClients.push(client);

    let projectFoundId: string;
    if (projectFound)
      projectFoundId = projectFound.Id;

    let userJoinedRoom = await this.JoinRoom(projectFoundId, username, client);

    return [projectFound, affectedClients, userJoinedRoom];
  }


    // TODO: finished: yes tested: no
  /**
   * Leaves a project with id projectToOpenId, returns it to the command context
   * @param projectToOpenID - ID of associated project
   */
  public static async LeaveProject(projectToLeaveID: any, username: string, client: string) : Promise<[any, Array<string>, [any, Array<string>]]>
  {
    let userLoggedIn = this.currentUsers.has(username);

    // Don't allow users to leave projects if they are not logged in
    if(!userLoggedIn)
      return [ null, [client], null ];


    let userLeftRoom = await this.LeaveRoom(projectToLeaveID, username, client);

    // check that user has been removed
    let operationStatus = RoomManager.FindRoom(projectToLeaveID).hasClient(username, client);

    return [ !operationStatus, [client], userLeftRoom ];
  }


  // User Functions

  // TODO: Finished: yes tested: yes
/**
 * Creates a user, adding the user data to the database
 * @param username 
 * @param password 
 */
  public static async CreateUser(username: string, password: string, client: string) : Promise<[any, Array<string>]>
  { 
    let success = false;
    await TypeORMDatabase.CreateUser(username, password)

    return [!success, [client] ];
  }

  public static async ReadUser(username: string, client: string): Promise<[any, Array<string>]>
  {
    let user = TypeORMDatabase.GetUser(username);
    return [user, [client]];
  }

  // TODO: finished: Yes? tested: partially
  /**
  * TODO: Finish delete user method 
  * Kicks out all clients logged in under the user and
  * deletes the user from the FAM and the database
  * @param userName 
  * @param password 
  */
  public static async DeleteUser(userName: string, password: string) : Promise<[any, Array<string>]>
  {
    //find every client that's currently logged in with these credentials
    let clients = StateTracker.currentUsers.get(userName)
    
    let affectedClients : Array<string>= []

    // if there's any client that is logged in with these credentials, log them out 
    if(clients != undefined)
      clients.forEach( (roomCode, clientId, map) => {
        this.LogoutUser(userName, password, clientId)
        affectedClients.push(clientId)
      })
    
    //remove user from the database too
    await TypeORMDatabase.DeleteUser(userName);

    return [true, affectedClients];
  }


  // TODO: Finished: yes Tested: yes
  /**
   * 
   * @param userName 
   * @param password 
   * @param ClientId 
   */
  public static async LoginUser(userName:string, password: string, ClientId : string) : Promise<[any, Array<string>, any]>
  {

    let affectedClients = [];
    affectedClients.push(ClientId);

    //Authenticate user
    if(! await TypeORMDatabase.AuthenticateUser(userName, password))
      return [false, affectedClients, null];

    // check if user is already logged in - 
    // user could be logged in on another client
    let userLoggedIn = this.currentUsers.has(userName);

    // If the user is not already logged in, then we need to start keeping track of them.
    if(!userLoggedIn)
      this.currentUsers.set(userName, new Map<string, string>());

    // put the client in limbo - aka, an empty room
    this.currentUsers.get(userName).set(ClientId, "noRoom") 

    RoomManager.JoinRoom("noRoom", userName, ClientId)


    let projects = await TypeORMDatabase.fetchProjects(userName);

    return [true, affectedClients, projects];    
  }

  // TODO: Finished: Yes Tested: Yes
  /**
   * 
   * @param Username 
   * @param password 
   * @param ClientId 
   */
  public static async LogoutUser(Username: string, password: string,  ClientId: string) : Promise<[any, Array<string>]>
  {
    let affectedClients = [];
    affectedClients.push();
    // //Authenticate user, I guess. Don't want someone trying to log someone else out
    // if(!TypeORMDatabase.AuthenticateUser(Username, password))
    //   return ['Failure', affectedClients];

    // check if user is already logged in - 
    // user could be logged in on another client
    let userLoggedIn = this.currentUsers.has(Username);
    let operationStatus = false;

    if(userLoggedIn)
    {
      // find what room the client is currently in and leave it
      let userRoomId = this.currentUsers.get(Username).get(ClientId)
      RoomManager.LeaveRoom(userRoomId, Username, ClientId)
      
      // kick the client out of currentUsers (a misnomer, I know) 
      operationStatus = this.currentUsers.get(Username).delete(ClientId)

      //if the current user doesn't have any more active clients, then stop keeping track of that user
      if(this.currentUsers.get(Username).size == 0)
        this.currentUsers.delete(Username)
    } 

    return [operationStatus, affectedClients];
  }



  // TODO: Finished: yes Tested: yes
  // Room Commands
  public static async CreateRoom(projectID: string, clientId: string) : Promise<[any, Array<string>]>
  {
    let roomCode = RoomManager.CreateRoom(projectID);
    
    return [true, [clientId]];
  }

  // TODO: Finished: Yes Tested: Yes
  /**
   * Adds user to the room, does not worry about maintaining user connections
   * @param roomCode - code of room they are looking to join
   * @param user - user to be logged in
   */
  public static async JoinRoom(roomCode: string, user: string, client: string) :  Promise<[any, Array<string>]>
  {

    if(RoomManager.FindRoom(roomCode) == undefined)
      RoomManager.CreateRoom(roomCode)

    // move the user from whatever room they were in into whatever room they want to be in
    let oldRoom = this.currentUsers.get(user).get(client)
    await RoomManager.LeaveRoom(oldRoom, user, client)

    await RoomManager.JoinRoom(roomCode, user, client)
    this.currentUsers.get(user).set(client, roomCode)

    let affectedClients: Array<string> = [];

    // get all of the clients that are in that room so that we can tell them 
    let clients = await RoomManager.getClients(roomCode)

    clients.forEach((value: string[], key: string) => {
      
      value.forEach((client: string) => {
        affectedClients.push(client);
      })
      
    });

    // to differentiate multiple clients under same user
    let shortClientId = client.slice(0, 8);

    return [ user + "-" + shortClientId + ' has joined the room', affectedClients];
  }

  public static async PopulateRoom(roomCode: string, client: string) : Promise<[any, Array<string>]>
  {
    if(RoomManager.FindRoom(roomCode) == undefined)
      return [null, [client]];

    let affectedClients: Array<string> = [];

    let project = RoomManager.FindRoom(roomCode).GetProject()

    affectedClients.push(client);
    return[project, affectedClients];
  } 


  // TODO: Finished: Yes Tested: No
  /**
   * Removes user from the room, does not worry about maintaining user connections
   * @param roomCode - code of room they are looking to leave
   * @param user - user to be logged in
   */
  public static async LeaveRoom(roomCode: string, user: string, client: string) :  Promise<[any, Array<string>]>
  {
    if(RoomManager.FindRoom(roomCode) == undefined)
      return [ null, [client] ];

    // move the user from whatever room they were in into the lobby
    await RoomManager.LeaveRoom(roomCode, user, client)

    await RoomManager.JoinRoom("noRoom", user, client)
    this.currentUsers.get(user).set(client, "noRoom");

    let affectedClients: Array<string> = [];

    // get all of the clients that are in that room so that we can tell them 
    let clients = await RoomManager.getClients(roomCode)
    clients.forEach((value: string[], key: string) => {
      value.forEach((client: string) => {
        affectedClients.push(client);
      })
    });

    // to differentiate multiple clients under same user
    let shortClientId = client.slice(0, 8);

    return [ user + "-" + shortClientId + 'has left the room', affectedClients];
  }

  // Object Commands
  /**
   * create an object in both the Fast Access State Tracker and the Database.
   * @param objectToCreate 
   * @param projectId 
   */
  public static async CreateObject(objectToCreate : FlowObject, projectId: string) : Promise<[any, Array<string>]>
  {
    let FAMSucccess = RoomManager.AddObject(objectToCreate, projectId);
    //TypeORMDatabase.CreateObject(objectToCreate, projectId)

    // get all of the clients that are in that room so that we can tell them 
    let affectedClients: Array<string> = [];
    let roomClients = await RoomManager.getClients(projectId)  
    roomClients.forEach((clients, username, map) => {
      affectedClients = affectedClients.concat(clients)
    })

    return [objectToCreate, affectedClients]
  }

  /**
   * check out an object from the Fast Access State Tracker
   * @param projectId 
   * @param objectId 
   * @param client (user)
   */
  public static async CheckoutObject(projectId: string, objectId: string, client: string, user: string) : Promise<[any, Array<string>]>
  {
    // make sure the object is available for checkout
    let success = RoomManager.checkoutObject(projectId, objectId, user);
    
    return[success, [client]]
  }

  /**
   * check in an object from the Fast Access State Tracker
   * @param projectId 
   * @param objectId 
   * @param client 
   */
  public static async CheckinObject(projectId: string, objectId: string, client: string, user: string) : Promise<[any, Array<string>]>
  {
    // make sure the actual person that checked an object out is the one checking it back in
    // Using Username to keep track of checkIn/Out and have client return the socketId for server updates.
    let success = RoomManager.checkinObject(projectId, objectId, user)
     
    return[success, [client]]
  }

  /**
   * Delete an object from both the FAM and the Database
   * @param objectId 
   * @param projectId 
   * @param client 
   */
  public static async DeleteObject(objectId: string, projectId: string, client: string) : Promise<[any, Array<string>]>
  {

    // Perform the delete in both the FAM and the Database
    RoomManager.DeleteObject(projectId, objectId, client);
    //TypeORMDatabase.DeleteObject(objectId, projectId)

    // get all of the clients that are in that room so that we can tell them 
    let affectedClients: Array<string> = [];
    let roomClients = await RoomManager.getClients(projectId)
    roomClients.forEach((clients, username, map) => {
      affectedClients = affectedClients.concat(clients)
    })

    return [objectId, affectedClients]
  }

  /**
   * update an object in the FAM (and, if necessary, in the database)
   * @param objectToUpdate the object data to update - includes the Id of the object
   * @param projectId project Id that the client is in
   * @param client client Id to make sure they have the object checked out
   * @param saveToDatabase Flag to save the object update to the database 
   */
  public static async UpdateObject(objectToUpdate : FlowObject, projectId: string,  client: string,  saveToDatabase:boolean, user : string) : Promise<[any, Array<string>]>
  {  
    // perform the updates
    let famSuccess = RoomManager.updateObject(objectToUpdate, projectId, user);
    console.log(RoomManager.ReadObject(projectId, objectToUpdate.Id))
    if(!famSuccess)
      return [null, [client]]; // since gql dosnt have client how do we reply error?
    
    // Check GraphQL related documentation to understand why this was commented out.
    // if(saveToDatabase)
    //   TypeORMDatabase.UpdateObject(objectToUpdate, projectId)

    // get all of the clients that are in that room so that we can tell them 
    let affectedClients: Array<string> = [];
    let roomClients = await RoomManager.getClients(projectId)
    
    roomClients.forEach((clients, username, map) => {
      // console.log(user)
      affectedClients = affectedClients.concat(clients)
    })

    return [objectToUpdate , affectedClients]
  }

  /**
   * return the data for a single object
   * @param objectId the Id of the object
   * @param projectId the Id of the project that the object is in
   * @param client the client who wants the object
   */
  public static async ReadObject(objectId: string, projectId: string, client: string) :  Promise<[any, Array<string>]>
  {
    let objectRead = RoomManager.ReadObject(projectId, objectId)
    return [objectRead, [client]];
  }

  
  // Avatar Commands
  /**
   * create an Avatar in both the Fast Access State Tracker
   * @param AvatarToCreate 
   * @param projectId 
   */
   public static async CreateAvatar(AvatarToCreate : FlowAvatar, projectId: string) : Promise<[any, Array<string>, Array<FlowAvatar>]>
   {
     let FAMSucccess = RoomManager.AddAvatar(AvatarToCreate, projectId)
     let AvatarList = RoomManager.GetAvatarList(projectId);
     //TypeORMDatabase.CreateAvatar(AvatarToCreate, projectId)
 
     // get all of the clients that are in that room so that we can tell them 
     let affectedClients: Array<string> = [];
     let roomClients = await RoomManager.getClients(projectId)  
     roomClients.forEach((clients, username, map) => {
       affectedClients = affectedClients.concat(clients)
     })
 
     return [AvatarToCreate, affectedClients, AvatarList]
   }
 
  //  /**
  //   * check out an Avatar from the Fast Access State Tracker
  //   * @param projectId 
  //   * @param AvatarId 
  //   * @param client 
  //   */
  //  public static async CheckoutAvatar(projectId: string, AvatarId: string, client: string) : Promise<[any, Array<string>]>
  //  {
  //    // make sure the Avatar is available for checkout
  //    let success = RoomManager.checkoutAvatar(projectId, AvatarId, client);
     
  //    return[success, [client]]
  //  }
 
  //  /**
  //   * check in an Avatar from the Fast Access State Tracker
  //   * @param projectId 
  //   * @param AvatarId 
  //   * @param client 
  //   */
  //  public static async CheckinAvatar(projectId: string, AvatarId: string, client: string) : Promise<[any, Array<string>]>
  //  {
  //    // make sure the actual person that checked an Avatar out is the one checking it back in
  //    let success = RoomManager.checkinAvatar(projectId, AvatarId, client)
      
  //    return[success, [client]]
  //  }
 
   /**
    * Delete an Avatar from both the FAM and the Database
    * @param AvatarId 
    * @param projectId 
    * @param client 
    */
   public static async DeleteAvatar(AvatarId: string, projectId: string, client: string) : Promise<[any, Array<string>]>
   {
 
     // Perform the delete in both the FAM and the Database
     RoomManager.DeleteAvatar(projectId, AvatarId, client);
     //TypeORMDatabase.DeleteAvatar(AvatarId, projectId)
 
     // get all of the clients that are in that room so that we can tell them 
     let affectedClients: Array<string> = [];
     let roomClients = await RoomManager.getClients(projectId)
     roomClients.forEach((clients, username, map) => {
       affectedClients = affectedClients.concat(clients)
     })
 
     return [AvatarId, affectedClients]
   }
 
   /**
    * update an Avatar in the FAM
    * @param AvatarToUpdate the Avatar data to update - includes the Id of the Avatar
    * @param projectId project Id that the client is in
    * @param client client Id to make sure they have the Avatar checked out
    */
   public static async UpdateAvatar(AvatarToUpdate : FlowAvatar, projectId: string,  client: string,  saveToDatabase:boolean,user=null) : Promise<[any, Array<string>]>
   {  
     // perform the updates
     let famSuccess = RoomManager.updateAvatar(AvatarToUpdate, projectId, client);
     //console.log(RoomManager.ReadAvatar(projectId, AvatarToUpdate.Id))
     if(!famSuccess)
       return [null, [client]];
 
     // get all of the clients that are in that room so that we can tell them 
     let affectedClients: Array<string> = [];
     let roomClients = await RoomManager.getClients(projectId)
     
     roomClients.forEach((clients, username, map) => {
       // console.log(user)
       affectedClients = affectedClients.concat(clients)
     })
 
     return [AvatarToUpdate , affectedClients]
   }
 
  //  /**
  //   * return the data for a single Avatar
  //   * @param AvatarId the Id of the Avatar
  //   * @param projectId the Id of the project that the Avatar is in
  //   * @param client the client who wants the Avatar
  //   */
  //  public static async ReadAvatar(AvatarId: string, projectId: string, client: string) :  Promise<[any, Array<string>]>
  //  {
  //    let AvatarRead = RoomManager.ReadAvatar(projectId, AvatarId)
  //    return [AvatarRead, [client]];
  //  }

  /**
   * Create a behaviour in both the Database and the Fast Access State Tracker
   * @param BehaviourToCreate 
   * @param projectId 
   */
  public static async CreateBehaviour(BehaviourToCreate : FlowBehaviour, projectId: string) : Promise<[any, Array<string>]>
  {
    console.log(projectId)
    RoomManager.FindRoom(projectId)
                .GetProject()
                .AddBehaviour(BehaviourToCreate);
    
    TypeORMDatabase.CreateBehaviour(BehaviourToCreate);

    let affectedClients: Array<string> = [];

    // get all of the clients that are in that room so that we can tell them 
    let roomClients = await RoomManager.getClients(projectId)
    roomClients.forEach((clients, username, map) => {
      affectedClients = affectedClients.concat(clients)
    })
    BehaviourToCreate.Action = JSON.stringify(BehaviourToCreate.Action)

    return [BehaviourToCreate, affectedClients]
  }

  /**
   * Delete a behaviour from both the Fast Access State Tracker and the database
   * @param projectId the project that the behaviour is in
   * @param BehaviourIds the behaviour to delete
   * @param client the client that is trying to delete the behaviour
   */
  public static async DeleteBehaviour(projectId: string, BehaviourIds: Array<string>, client: string) : Promise<[any, Array<string>]>
  {
    let success = RoomManager.FindRoom(projectId)
                .GetProject()
                .DeleteBehaviour(BehaviourIds);

    TypeORMDatabase.DeleteBehaviour(BehaviourIds)

    let affectedClients: Array<string> = [];

    // get all of the clients that are in that room so that we can tell them 
    let roomClients = await RoomManager.getClients(projectId)

    roomClients.forEach((clients, username, map) => {
      affectedClients = affectedClients.concat(clients)
    })
    if(success)
      return [BehaviourIds, affectedClients];
    else  
      return [null, affectedClients];
  }

  // TODO: do this through the Room Manager instead of directly accessing variables
  /**
   * link a child behaviour to one or more parent Behaviors in both the Fast Access State tracker and the Database
   * @param projectId 
   * @param child 
   * @param parents 
   */
  public static async LinkNewBehaviorToExistingBehaviors(projectId: string, child: string, parents: Array<string>){
    let behaviorsToModify = RoomManager.FindRoom(projectId)
      .GetProject()
      ._BehaviourList
      .filter((x) => parents !== undefined && parents.indexOf(x.Id) !== -1)

    behaviorsToModify.map((x) => {
      x.NextBehaviour.push(child)
      return x;
    })

    await TypeORMDatabase.LinkNewToOld(projectId, child, parents)
  }


  /**
   * Return a single behaviour
   * @param BehaviourId 
   * @param projectId 
   * @param client 
   */
  public static async ReadBehaviour(BehaviourId: string, projectId: string, client: string) : Promise<[any, Array<string>]>
  {
    let BehaviourRead = RoomManager.FindRoom(projectId).GetProject().GetBehaviour(BehaviourId);    
    return [BehaviourRead, [client]];
  }

  /**
   * update a behaviour
   * @param BehaviourToUpdate the Id of the behaviour to update 
   * @param projectId the project that the behaviour is in 
   * @param client the client who is trying to update the behaviour
   * @param saveToDatabase flag for saving to database
   */
  public static async UpdateBehaviour(BehaviourToUpdate : FlowBehaviour, projectId: string,  client: string, saveToDatabase:boolean=false) : Promise<[any, Array<string>]>
  {  
    // perform the updates
    let famSuccess = RoomManager.updateBehaviour(BehaviourToUpdate, projectId, client);
    if(!famSuccess)
      return [null, [client]];
    if(saveToDatabase)
      TypeORMDatabase.UpdateBehaviour(BehaviourToUpdate);

    // get all of the clients that are in that room so that we can tell them 
    let affectedClients: Array<string> = [];
    let roomClients = await RoomManager.getClients(projectId)
    roomClients.forEach((clients, username, map) => {
      affectedClients = affectedClients.concat(clients)
    })

    return [BehaviourToUpdate , affectedClients]
  }

  // Visual Scripting Graph Commands

  /**
   * create a graph in both the Fast Access State Tracker and the Database.
   * @param vsGraphToCreate 
   * @param projectId 
   */
  public static async CreateVSGraph(vsGraphToCreate : FlowVSGraph, projectId: string) : Promise<[any, Array<string>]>
  {
    let FAMSucccess = RoomManager.AddVSGraph(vsGraphToCreate, projectId);
    TypeORMDatabase.CreateVSGraph(vsGraphToCreate, projectId)

    // get all of the clients that are in that room so that we can tell them 
    let affectedClients: Array<string> = [];
    let roomClients = await RoomManager.getClients(projectId)  
    roomClients.forEach((clients, username, map) => {
      affectedClients = affectedClients.concat(clients)
    })

    return [vsGraphToCreate, affectedClients]
  }

  /**
   * check out a nodeview from the Fast Access State Tracker
   * @param projectId 
   * @param nodeGUID 
   * @param client 
   */
   public static async CheckoutNodeView(projectId: string, flowNodeView: FlowNodeView, client: string) : Promise<[any, Array<string>]>
   {
     // make sure the nodeview is available for checkout
     let success = RoomManager.checkoutNodeView(projectId, flowNodeView, client);
     
     return[success, [client]]
   }
 
   /**
    * check in a NodeView from the Fast Access State Tracker
    * @param projectId 
    * @param vsGraphId 
    * @param client 
    */
   public static async CheckinNodeView(projectId: string, nodeGUID: string, client: string) : Promise<[any, Array<string>]>
   {
     // make sure the actual person that checked a graph out is the one checking it back in
     let success = RoomManager.checkinNodeView(projectId, nodeGUID, client)
      
     return[success, [client]]
   }

  /**
   * Delete a graph from both the FAM and the Database
   * @param vsGraphId 
   * @param projectId 
   * @param client 
   */
  public static async DeleteVSGraph(vsGraphId: string, projectId: string, client: string) : Promise<[any, Array<string>]>
  {

    // Perform the delete in both the FAM and the Database
    RoomManager.DeleteVSGraph(projectId, vsGraphId, client);
    TypeORMDatabase.DeleteVSGraph(vsGraphId, projectId)

    // get all of the clients that are in that room so that we can tell them 
    let affectedClients: Array<string> = [];
    let roomClients = await RoomManager.getClients(projectId)
    roomClients.forEach((clients, username, map) => {
      affectedClients = affectedClients.concat(clients)
    })

    return [vsGraphId, affectedClients]
  }

  /**
   * update a graph in the FAM (and, if necessary, in the database)
   * @param vsGraphToUpdate the graph data to update - includes the Id of the graph
   * @param projectId project Id that the client is in
   * @param client client Id to make sure they have the graph checked out
   * @param saveToDatabase Flag to save the graph update to the database 
   */
  public static async UpdateVSGraph(vsGraphToUpdate : FlowVSGraph, projectId: string,  client: string,  saveToDatabase:boolean,user=null) : Promise<[any, Array<string>]>
  {  
    // perform the updates
    let famSuccess = RoomManager.updateVSGraph(vsGraphToUpdate, projectId, client);
    console.log(RoomManager.ReadVSGraph(projectId, vsGraphToUpdate.Id))
    if(!famSuccess)
      return [null, [client]];
    if(saveToDatabase)
      TypeORMDatabase.UpdateVSGraph(vsGraphToUpdate, projectId)

    // get all of the clients that are in that room so that we can tell them 
    let affectedClients: Array<string> = [];
    let roomClients = await RoomManager.getClients(projectId)
    
    roomClients.forEach((clients, username, map) => {
      // console.log(user)
      affectedClients = affectedClients.concat(clients)
    })

    return [vsGraphToUpdate , affectedClients]
  }

  /**
   * return the data for a single graph
   * @param vsGraphId the Id of the graph
   * @param projectId the Id of the project that the graph is in
   * @param client the client who wants the graph
   */
  public static async ReadVSGraph(vsGraphId: string, projectId: string, client: string) :  Promise<[any, Array<string>]>
  {
    let vsGraphRead = RoomManager.ReadVSGraph(projectId, vsGraphId)
    return [vsGraphRead, [client]];
  }

  /**
   * return the data for a single NodeView
   * @param nodeGUID the Id of the nodeview
   * @param projectId the Id of the project that the nodeview is in
   * @param client the client who wants the nodeview
   */
   public static async ReadNodeView(nodeGUID: string, projectId: string, client: string) :  Promise<[any, Array<string>]>
   {
     let nodeViewRead = RoomManager.ReadNodeView(projectId, nodeGUID)
     return [nodeViewRead, [client]];
   }

  public static async UpdateNodeView(nodeViewToUpdate : FlowNodeView, projectId: string,  client: string, user=null) : Promise<[any, Array<string>]>
  {  
    // perform the updates
    let famSuccess = RoomManager.updateNodeView(nodeViewToUpdate, projectId, client);
    console.log(RoomManager.ReadNodeView(projectId, nodeViewToUpdate.NodeGUID))
    if(!famSuccess)
      return [null, [client]];

    // get all of the clients that are in that room so that we can tell them 
    let affectedClients: Array<string> = [];
    let roomClients = await RoomManager.getClients(projectId)
    
    roomClients.forEach((clients, username, map) => {
      // console.log(user)
      affectedClients = affectedClients.concat(clients)
    })

    return [nodeViewToUpdate , affectedClients]
  }

  public static async RunVSGraph(vsGraphIdToRun : string, projectId: string,  client: string) : Promise<[any, Array<string>]>
  {  
    // get all of the clients that are in that room so that we can tell them 
    let affectedClients: Array<string> = [];
    let roomClients = await RoomManager.getClients(projectId)
    
    roomClients.forEach((clients, username, map) => {
      // console.log(user)
      affectedClients = affectedClients.concat(clients)
    })

    return [vsGraphIdToRun , affectedClients]
  }

  /**
   * turn play mode on or off
   * @param projectId the id of the project for which play mode needs to be toggled
   * @param toggle on vs. off
   */
  public static async TogglePlayMode(projectId: string, toggle: boolean) : Promise<[any, Array<string>]>
  {
    let affectedClients: Array<string> = [];
    let room = RoomManager.FindRoom(projectId);
    let success = false;
    if(toggle)
    {
      success = room.turnOnPlayMode();
    } else 
    {
      success = room.turnOffPlayMode();
    }

    let roomClients = room.getClients();
    roomClients.forEach((clients, username, map) => 
      {
        affectedClients = affectedClients.concat(clients)
      });
    return [success, affectedClients];
  }
}