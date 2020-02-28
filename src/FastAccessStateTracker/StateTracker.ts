import { FlowObject } from "./FlowLibrary/FlowObject";
import { FlowProject } from "./FlowLibrary/FlowProject";
import { FlowUser } from "./FlowLibrary/FlowUser"

import { RoomManager } from "./RoomManager";

import { MongooseDatabase } from "./Database/MongooseDatabase"
import { FlowClient } from "./FlowLibrary/FlowClient";

  

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
  
  // I feel like I've used this data structure before
  // <username: <client: projectId>>
  public static currentUsers: Map<string, Map<string, string> > = new Map()
  
  // Project Functions

  // TODO: finished: yes? Tested: no 
  /**
   * Adds a project to the FAM and database
   * @param projectToCreate 
   */
  public static async CreateProject(projectToCreate: FlowProject, user: FlowUser) : Promise<void>
  {
    // Create the project in the database
    let newProject = await MongooseDatabase.CreateProject(projectToCreate)
    let owner = await MongooseDatabase.GetUser(user.Username)

    // Give the user who created the project ownership of the project and update
    owner.addProject(newProject.Id)
    
    await MongooseDatabase.UpdateUser(owner)

  }


  // TODO: finished: no tested: no
  /**
   * Deletes the project from the FAM and the database
   * @param projectToDelete 
   */
  public static async DeleteProject(projectToDeleteId: string) : Promise<void>
  {    

    //kick everyone out of the room of the project if it's open

    //remove project from the FAM

    // Remove object from database - Mongoose database should have it set up such that 
    // deleting a project also cascades in such a way that it's removed from every user's 
    // project list that owns it. that has yet to be tested
    if(projectToDeleteId != null )
    {
      MongooseDatabase.DeleteProject(projectToDeleteId);
    }


  }
 
  // TODO: finished: yes? tested: no
  /**
   * Finds a project with id projectToOpenId, returns it to the command context
   * @param projectToOpenID - ID of associated project
   */
  public static async OpenProject(projectToOpenID: any) : Promise<FlowProject>
  {
    // find project in list of projects so that we can return it
    let projectFound : FlowProject = await MongooseDatabase.GetProject(projectToOpenID);
    
    // send the data back to the client
    return projectFound;
  }


  // User Functions

  // TODO: Finished: yes tested: no
  /**
   * Creates a user, adding the user data to the FAM and the database
   * @param userToCreate 
   */
  public static async CreateUser(username: string, password: string) : Promise<boolean>
  { 
    let success = false;

    await MongooseDatabase.CreateUser(username, password)

    return !success;
  }

  // TODO: finished: Yes? tested: no
  /**
  * Kicks out all clients logged in under the user and
  * deletes the user from the FAM and the database
  * @param userToDelete 
  */
  public static async DeleteUser(userName: string, password: string) : Promise<void>
  {
    //force kick every client that's logged in with these credentials to out of the FAM
    let clients = this.currentUsers.get(userName)
    clients.forEach( (roomCode, clientId, map) => this.LogoutUser(userName, password, clientId))
    
    //remove user from the database to0
    await MongooseDatabase.DeleteUser(userName);
  }


  // TODO: Finished: ..kinda? Tested: no
  /**
   * Logs in the desired client using the given credentials 
   * this only affects the FAM and is not saved to the database
   * @param userToLogin 
   */
  public static async LoginUser(userName:string, password: string, ClientId : string) : Promise<boolean>
  {
    //Authenticate user
    if(!MongooseDatabase.AuthenticateUser(userName, password))
      return false;

    // check if user is already logged in - 
    // user could be logged in on another client
    let userLoggedIn = this.currentUsers.has(userName);

    let user: FlowUser = await MongooseDatabase.GetUser(userName)

    // If the user is not already logged in, then we need to start keeping track of them.
    if(!userLoggedIn)
      this.currentUsers.set(userName, new Map<string, string>())
    
    
    // put the client in limbo - aka, an empty room
    // TODO: figure out noRoom situation
    this.currentUsers.get(userName).set(ClientId, "noRoom") 
    RoomManager.FindRoom("noRoom").JoinRoom(userName, ClientId)
    
    return true;    
  }

    // TODO: Finished: ...Yes? Tested: no
  /**
   * Logs out the desired client using the specified credentials, this only affects the FAM and is not saved to the database
   * @param userToLogin 
  */
  public static async LogoutUser(Username: string, password: string,  ClientId: string) : Promise<void>
  {
      //Authenticate user, I guess. Don't want someone trying to log someone else out
      if(!MongooseDatabase.AuthenticateUser(Username, password))
        return;
  
      // check if user is already logged in - 
      // user could be logged in on another client
      let userLoggedIn = this.currentUsers.has(Username);

      if(userLoggedIn)
      {
        // find what room the client is currently in and leave it
        let userRoomId = this.currentUsers.get(Username).get(ClientId)
        RoomManager.FindRoom(userRoomId).LeaveRoom(Username, ClientId)
        
        // kick the client out of currentUsers (a misnomer, I know) 
        this.currentUsers.get(Username).delete(ClientId)

        //if the current user doesn't have any more active clients, then stop keeping track of that user
        if(this.currentUsers.get(Username).size == 0)
          this.currentUsers.delete(Username)
      } 
      // If the user wasn't logged in in the first place, then ??
      else 
      {
        return;
      }
  }



  // TODO: Finished: yes? Tested: no
  // Room Commands
  public static CreateRoom(projectID: string) : string
  {
    let roomCode = RoomManager.CreateRoom(projectID);
    
    return roomCode;
  }

  // TODO: Finished: No Tested: no
  /**
   * Adds user to the room, does not worry about maintaining user connections
   * @param roomCode - code of room they are looking to join
   * @param user - user to be logged in
   */
  public static async JoinRoom(roomCode: string, user: FlowUser, client: FlowClient) : Promise<FlowProject>
  {
   throw new Error("not implemented yet");
  }

}
//   // Object Commands
//   public static CreateObject(objectToCreate : FlowObject) : void
//   {
//     RoomManager.FindRoom(objectToCreate.RoomNumber)
//                 .GetProject()
//                 .AddObject(objectToCreate);
//   }

//   public static DeleteObject(objectToDelete : FlowObject) : void
//   {
//     RoomManager.FindRoom(objectToDelete.RoomNumber)
//                 .GetProject()
//                 .DeleteObject(objectToDelete);
//   }

//   public static UpdateObject(objectToUpdate : FlowObject) : void
//   {
//     RoomManager.FindRoom(objectToUpdate.RoomNumber)
//                 .GetProject()
//                 .UpdateFAMObject(objectToUpdate);
//   }

//   /**
//    * The final update to be sent to clients and saved in the database
//    * @param objectToUpdate - object which holds the final truth of position for the databsse
//    */
//   public static FinalizedUpdateObject(objectToUpdate : FlowObject) : void
//   {
//     RoomManager.FindRoom(objectToUpdate.RoomNumber)
//                 .GetProject()
//                 .UpdateFAMObject(objectToUpdate);
    
//     //Send message to all clients notifying object change

    
//   }
// }