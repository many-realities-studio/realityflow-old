import { FlowObject } from "./FlowLibrary/FlowObject";
import { FlowProject } from "./FlowLibrary/FlowProject";


import { RoomManager } from "./RoomManager";

import { TypeORMDatabase } from "./Database/TypeORMDatabase"
import { UserOperations } from "../ORMCommands/user";
import { ProjectOperations } from "../ORMCommands/project";


  

// TODO: Add logging system
// TODO: Add checkout system 

// Note: FAM is used to abbreviate "Fast Access Memory"

/**
 * Keeps track of the state of the project, allowing for faster access to data while
 * storing data to the database in the
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
  public static async CreateProject(projectToCreate: FlowProject, user: string, client: string) : Promise<[any, Array<string>]>
  {
    let userLoggedIn = this.currentUsers.has(user);

    // Don't allow users to create projects if they are not logged in
    if(!userLoggedIn)
      return [null, [client]]

    let newProject = await TypeORMDatabase.CreateProject(projectToCreate, user);

    return [ newProject, [client] ];
  }


  // TODO: finished: yes tested: yes
  /**
   * Deletes the project from the FAM and the database
   * @param projectToDeleteId
   */
  public static async DeleteProject(projectToDeleteId: string, user: string, client: string) : Promise<[any, Array<string>]>
  {    

    if(!projectToDeleteId)
      return

    // remove roomManager, get the list of all affected users/clients
    let clients = RoomManager.DestroyRoom(projectToDeleteId)

    // Remove project from database 
    await TypeORMDatabase.DeleteProject(projectToDeleteId);

    let clientIds : Array<string> = []
    clientIds.push(client)
    clients.forEach((userClients: Array<string>, user: string, map) =>{
      
      // add clients of a given user to the list of clients to send back
      clientIds.concat(userClients)

      // move the clients into limbo
      userClients.forEach((client, index, arr) => {
        this.currentUsers.get(user).set(client, "noRoom")
      });

    });

    return ['Success', clientIds];
  }
 
  // TODO: finished: yes? tested: no
  /**
   * Finds a project with id projectToOpenId, returns it to the command context
   * @param projectToOpenID - ID of associated project
   */
  public static async OpenProject(projectToOpenID: any, username: string, client: string) : Promise<[any, Array<string>, [any, Array<string>]]>
  {
    // find project in list of projects so that we can return it
    let projectFound = await TypeORMDatabase.GetProject(projectToOpenID);
    
    // grabs all the clients from the room manager
    let affectedClients: string[] = []
    affectedClients.push(client);

    let userJoinedRoom = await this.JoinRoom(projectToOpenID, username, client);

   /* let clients = RoomManager.getClients(projectToOpenID);
    clients.forEach((value: string[], key: string) => {
      
      value.forEach((client: string) => {
        affectedClients.push(client);
      })
      
    });
*/
    // send the data back to the client
    return [projectFound, affectedClients, userJoinedRoom];
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
    console.log("Username is " + username+ " password is " + password)
    await TypeORMDatabase.CreateUser(username, password)

    return [!success, [client] ];
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

    return ['Deleted', affectedClients];
  }


  // TODO: Finished: yes Tested: yes
  /**
   * 
   * @param userName 
   * @param password 
   * @param ClientId 
   */
  public static async LoginUser(userName:string, password: string, ClientId : string) : Promise<[any, Array<string>]>
  {

    let affectedClients = [];
    affectedClients.push(ClientId);

    //Authenticate user
    if(!TypeORMDatabase.AuthenticateUser(userName, password))
      return ['Failure', affectedClients];

    // check if user is already logged in - 
    // user could be logged in on another client
    let userLoggedIn = this.currentUsers.has(userName);

    // If the user is not already logged in, then we need to start keeping track of them.
    if(!userLoggedIn)
      this.currentUsers.set(userName, new Map<string, string>());
    
      console.log("\n\n\is the user logged in after logging in");
      console.log(this.currentUsers.has(userName));

    // put the client in limbo - aka, an empty room
    // TODO: figure out noRoom situation
    this.currentUsers.get(userName).set(ClientId, "noRoom") 

    RoomManager.JoinRoom("noRoom", userName, ClientId)

    let returnMessage = {username: userName, projects: await ProjectOperations.fetchProjects(userName)}
    console.log(returnMessage.projects)
    console.log(affectedClients)
    return [returnMessage, affectedClients];    
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
    affectedClients.push(ClientId);
    //Authenticate user, I guess. Don't want someone trying to log someone else out
    if(!TypeORMDatabase.AuthenticateUser(Username, password))
      return ['Failure', affectedClients];

    // check if user is already logged in - 
    // user could be logged in on another client
    let userLoggedIn = this.currentUsers.has(Username);

    if(userLoggedIn)
    {
      // find what room the client is currently in and leave it
      let userRoomId = this.currentUsers.get(Username).get(ClientId)
      RoomManager.LeaveRoom(userRoomId, Username, ClientId)
      
      // kick the client out of currentUsers (a misnomer, I know) 
      this.currentUsers.get(Username).delete(ClientId)

      //if the current user doesn't have any more active clients, then stop keeping track of that user
      if(this.currentUsers.get(Username).size == 0)
        this.currentUsers.delete(Username)
    } 
    // If the user wasn't logged in in the first place, then ??
    else 
    {
      return ['Failure', affectedClients];;
    }
    return ['Success', affectedClients];
  }



  // TODO: Finished: yes Tested: yes
  // Room Commands
  public static async CreateRoom(projectID: string, clientId: string) : Promise<[any, Array<string>]>
  {
    let roomCode = RoomManager.CreateRoom(projectID);

    return ['Success', [clientId]];
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

   /* roomClients.forEach((clients, username, map) => {
      affectedClients.concat(clients)
    })

    let clients = RoomManager.getClients(projectToOpenID);*/
    clients.forEach((value: string[], key: string) => {
      
      value.forEach((client: string) => {
        affectedClients.push(client);
      })
      
    });

    return [ user + ' has joined the room', affectedClients];
  }

  // Object Commands
  public static async CreateObject(objectToCreate : FlowObject, projectId: string) : Promise<[any, Array<string>]>
  {
    RoomManager.FindRoom(projectId)
                .GetProject()
                .AddObject(objectToCreate);
  
    TypeORMDatabase.CreateObject(objectToCreate, projectId)

    let affectedClients: Array<string> = [];

    // get all of the clients that are in that room so that we can tell them 
    let roomClients = await RoomManager.getClients(projectId)

    roomClients.forEach((clients, username, map) => {
      affectedClients.concat(clients)
    })
    return [objectToCreate, affectedClients]
  }

  public static async DeleteObject(objectToDelete : FlowObject, projectId: string) : Promise<[any, Array<string>]>
  {
    RoomManager.FindRoom(projectId)
                .GetProject()
                .DeleteObject(objectToDelete);

    TypeORMDatabase.DeleteObject(objectToDelete.Id, projectId)

    let affectedClients: Array<string> = [];

    // get all of the clients that are in that room so that we can tell them 
    let roomClients = await RoomManager.getClients(projectId)

    roomClients.forEach((clients, username, map) => {
      affectedClients.concat(clients)
    })

    return ["deleted " + objectToDelete.Id, affectedClients]
  }

  public static async UpdateObject(objectToUpdate : FlowObject, projectId: string) : Promise<[any, Array<string>]>
  {
    RoomManager.FindRoom(projectId)
                .GetProject()
                .UpdateFAMObject(objectToUpdate);

    let affectedClients: Array<string> = [];

    // get all of the clients that are in that room so that we can tell them 
    let roomClients = await RoomManager.getClients(projectId)

    roomClients.forEach((clients, username, map) => {
      affectedClients.concat(clients)
    })
    return [objectToUpdate , affectedClients]
  }

//   /**
//    * The final update to be sent to clients and saved in the database
//    * @param objectToUpdate - object which holds the final truth of position for the databsse
//    */
  public static async FinalizedUpdateObject(objectToUpdate : FlowObject, projectId: string) : Promise<[any, Array<string>]>
  {
    RoomManager.FindRoom(projectId)
                .GetProject()
                .UpdateFAMObject(objectToUpdate);
    
    //Send message to all clients notifying object change
    let affectedClients: Array<string> = [];

    // get all of the clients that are in that room so that we can tell them 
    let roomClients = await RoomManager.getClients(projectId)

    roomClients.forEach((clients, username, map) => {
      affectedClients.concat(clients)
    })
    return [ objectToUpdate, affectedClients ]
  }
}