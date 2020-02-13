import { FlowObject } from "./FlowLibrary/FlowObject";
import { FlowProject } from "./FlowLibrary/FlowProject";
import { FlowUser } from "./FlowLibrary/FlowUser"
import { RoomManager } from "./RoomManager";
import { ConnectionManager } from "./ConnectionManager";
import { MongooseDatabase } from "./Database/MongooseDatabase"
import { ConfigurationSingleton } from "./ConfigurationSingleton";
import { Room } from "./Room";
import { Connection } from "mongoose";
// TODO: Add logging system
// TODO: Add checkout system 

// Note: FAM is used to abbreviate "Fast Access Memory"

/**
 * Keeps track of the state of the project, allowing for faster access to data while
 * storing data to the database in the
 */

export class StateTracker{

  // Project Functions
  /**
   * Adds a project to the FAM and database
   * @param projectToCreate 
   */
  public static CreateProject(projectToCreate: FlowProject, user: FlowUser) : void
  {
    // if we can save to the database
    const promise = new Promise(function(resolve, reject) {
      setTimeout(function() {
        let success = projectToCreate.SaveToDatabase();
        resolve(success);
      }, 1000)
    });

    promise.then(function(success) {
      
      // add project to user array
      user.addProject(projectToCreate);

    });

    
  }

  /**
   * Deletes the project from the FAM and the database
   * @param projectToDelete 
   */
  public static DeleteProject(projectToDelete: FlowProject) : void
  {    
    // Remove object from database
    if(projectToDelete != null)
    {
      projectToDelete.Delete();
    }
  }
 
  /**
   * Finds a project with it's id, returns(?) it to the command context
   * ID type of flow project is "any" for now
   * @param projectToOpenID - ID of associated project
   * @param connectionToUser - websocket connection to user
   */
  public static OpenProject(projectToOpenID: any) : FlowProject
  {
    // find project in list of projects
    let projectFound : FlowProject = ConfigurationSingleton.Database.GetProject(projectToOpenID);
    return projectFound;
  }


  // User Functions

  /**
   * Creates a user, adding the user data to the FAM and the database
   * @param userToCreate 
   */
  public static CreateUser(userToCreate: FlowUser) : boolean
  { 
    userToCreate.SaveToDatabase();
    let success = true;

    const promise = new Promise(function(resolve, reject) {
      setTimeout(function() {
        let success = userToCreate.SaveToDatabase();
        resolve(success);
      }, 1000)
    });

    promise.then(function(success) {
      
      return success;

    });

    return !success;
  }

    /**
   * Deletes the user from the FAM and the database
   * @param userToDelete 
   */
  public static DeleteUser(userToDelete: FlowUser) : void
  {
    // Logout the user
    this.LogoutUser(userToDelete);

    // Delete user in the list of known users
    ConfigurationSingleton.Database.DeleteUser(userToDelete);
  }

  /**
   * Logs in the desired user, this only affects the FAM and is not saved to the database
   * @param userToLogin 
   */
  public static LoginUser(userToLogin: FlowUser, connectionToUser : WebSocket) : boolean
  {
    // check if logged in on another client 
    let userLoggedIn = ConnectionManager.GetSavedUser(userToLogin);
    // boolean to send back to Command Context
    let result = false;
    // Are they in a room already?
    if(userLoggedIn.roomCode)
    {
      // add new connection to the room - by adding connection to user
      ConnectionManager.LoginUser(userLoggedIn, connectionToUser);
      result = true;
    } 
    else 
    {
      // Find user in the list of known users - async 
      // for the first time in this session a user logs in on a client
      const promise = new Promise(function(resolve, reject) {
        setTimeout(function() {
          let userFound : FlowUser = ConfigurationSingleton.Database.GetUser(userToLogin.id);
          resolve(userFound);
        }, 1000)
        });
        promise.then(function(userFound: FlowUser) {
          let user : FlowUser = userFound;
          ConnectionManager.LoginUser(user, connectionToUser);
          result = true;
        });
    }
    return result;    
  }

  /**
   * Logs out the desired user, this only affects the FAM and is not saved to the database
   * @param userToLogin 
   */
  public static LogoutUser(userToLogout: FlowUser) : void
  {
    ConnectionManager.LogoutUser(userToLogout);
  }

  // Room Commands
  public static CreateRoom(projectID: Number) : Number
  {
    let roomCode = RoomManager.CreateRoom(projectID);
    return roomCode;
  }

  /**
   * Adds user to the room, does not worry about maintaining user connections
   * @param roomCode - code of room they are looking to join
   * @param user - user to be logged in
   */
  public static JoinRoom(roomCode: Number, user: FlowUser) : FlowProject
  {
    let room = RoomManager.FindRoom(roomCode);
    room.JoinRoom(user);
    // Pray this works
    //haha jk.. unless
    return room.GetProject();

  }

  // Object Commands
  public static CreateObject(objectToCreate : FlowObject) : void
  {
    RoomManager.FindRoom(objectToCreate.RoomNumber)
                .GetProject()
                .AddObject(objectToCreate);
  }

  public static DeleteObject(objectToDelete : FlowObject) : void
  {
    RoomManager.FindRoom(objectToDelete.RoomNumber)
                .GetProject()
                .DeleteObject(objectToDelete);
  }

  public static UpdateObject(objectToUpdate : FlowObject) : void
  {
    RoomManager.FindRoom(objectToUpdate.RoomNumber)
                .GetProject()
                .UpdateFAMObject(objectToUpdate);
  }

  /**
   * The final update to be sent to clients and saved in the database
   * @param objectToUpdate - object which holds the final truth of position for the databsse
   */
  public static FinalizedUpdateObject(objectToUpdate : FlowObject) : void
  {
    RoomManager.FindRoom(objectToUpdate.RoomNumber)
                .GetProject()
                .UpdateObject(objectToUpdate);
    //Send message to all clients notifying object change

    
  }
}