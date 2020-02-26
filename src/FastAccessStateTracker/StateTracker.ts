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
  
  // {username: ProjectId}
  public static currentUsers: Map<String, String> = new Map()
  
}

  // // Project Functions
  // /**
  //  * Adds a project to the FAM and database
  //  * @param projectToCreate 
  //  */
  // public static async CreateProject(projectToCreate: FlowProject, user: FlowUser) : Promise<void>
  // {
  //   // Create the project in the database
  //   let newProject = await MongooseDatabase.CreateProject(projectToCreate)

  //   // Give the user who created the project ownership of the project and update
  //   user.addProject(newProject.Id)
    
  //   await MongooseDatabase.UpdateUser(user)

  // }

  // /**
  //  * Deletes the project from the FAM and the database
  //  * @param projectToDelete 
  //  */
  // public static async  DeleteProject(projectToDeleteId: String) : Promise<void>
  // {    
  //   // Remove object from database
  //   if(projectToDeleteId != null )
  //   {
  //     MongooseDatabase.DeleteProject(projectToDeleteId);
  //   }
  // }
 
  // /**
  //  * Finds a project with it's id, returns(?) it to the command context
  //  * ID type of flow project is "any" for now
  //  * @param projectToOpenID - ID of associated project
  //  */
  // public static async  OpenProject(projectToOpenID: any, openingUser: FlowUser) : Promise<FlowProject>
  // {
  //   // find project in list of projects so that we can return it
  //   let projectFound : FlowProject = await MongooseDatabase.GetProject(projectToOpenID);
    
  //   // start keeping track of current project in the FAST
  //   if(RoomManager.FindRoom(projectToOpenID) == undefined)
  //     RoomManager.CreateRoom(projectToOpenID)

  //   RoomManager.FindRoom(projectToOpenID).JoinRoom(openingUser)
    
  //   // send the data back to the client
  //   return projectFound;
  // }


  // // User Functions

  // /**
  //  * Creates a user, adding the user data to the FAM and the database
  //  * @param userToCreate 
  //  */
  // public static async CreateUser(userToCreate: FlowUser) : Promise<boolean>
  // { 
  //   let success = false;

  //   await MongooseDatabase.CreateUser(userToCreate)

  //   return !success;
  // }


  // // /**
  // // * Deletes the user from the FAM and the database
  // // * @param userToDelete 
  // // */
  // public static async DeleteUser(userToDelete: FlowUser) : Promise<void>
  // {
  //   // Logout the user
  //   this.LogoutUser(userToDelete);

  //   // Delete user in the list of known users
  //   await MongooseDatabase.DeleteUser(userToDelete);
  // }


  /**
   * Logs in the desired user, this only affects the FAM and is not saved to the database
   * @param userToLogin 
   */
//   public static async LoginUser(Username:String, password: String, ClientId : String) : Promise<boolean>
//   {
//     //Authenticate user


//     // check if user is already logged in - 
//     // user could be logged in on another client
//     let userLoggedIn = this.currentUsers.has(Username);
//     let client = MongooseDatabase.GetClient(ClientId)


//     // If there are multiple clients
//     if(userLoggedIn)
//     {
//       // find what room the user is currently in
//       let userRoomId = this.currentUsers.get(Username)

//       RoomManager.FindRoom(userRoomId).JoinRoom()
      
//     } 
//     else 
//     {
//       // Find user in the list of known users - async 
//       // for the first time in this session a user logs in on a client
//       let userFound : FlowUser = await MongooseDatabase.GetUser(userToLogin.Username);
//       ConnectionManager.LoginUser(userFound, connectionToUser);
//     }
//     return result;    
//   }

//   /**
//    * Logs out the desired user, this only affects the FAM and is not saved to the database
//    * @param userToLogin 
//    */
//   public static LogoutUser(userToLogout: FlowUser) : void
//   {
//     ConnectionManager.LogoutUser(userToLogout);
//   }

// }


//   // Room Commands
//   public static CreateRoom(projectID: Number) : Number
//   {
//     let roomCode = RoomManager.CreateRoom(projectID);
//     return roomCode;
//   }

//   /**
//    * Adds user to the room, does not worry about maintaining user connections
//    * @param roomCode - code of room they are looking to join
//    * @param user - user to be logged in
//    */
//   public static JoinRoom(roomCode: Number, user: FlowUser) : FlowProject
//   {
//     let room = RoomManager.FindRoom(roomCode);
//     room.JoinRoom(user);

//     // Pray this works
//     //haha jk.. unless
//     return room.GetProject();

//   }

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