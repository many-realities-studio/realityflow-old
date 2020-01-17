import { FlowObject } from "./FlowLibrary/FlowObject";
import { FlowProject } from "./FlowLibrary/FlowProject";
import { FlowUser } from "./FlowLibrary/FlowUser"
import { RoomManager } from "./RoomManager";
import { ConnectionManager } from "./ConnectionManager";
import { MongooseDatabase } from "./Database/MongooseDatabase"
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
  public static CreateProject(projectToCreate: FlowProject) : void
  {
    projectToCreate.SaveToDatabase();
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
    let projectFound : FlowProject = MongooseDatabase.GetProject(projectToOpenID);
    return projectFound;
  }

  // User Functions

  /**
   * Creates a user, adding the user data to the FAM and the database
   * @param userToCreate 
   */
  public static CreateUser(userToCreate: FlowUser) : void
  { 
    userToCreate.SaveToDatabase();
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
    MongooseDatabase.DeleteUser(userToDelete);
  }

  /**
   * Logs in the desired user, this only affects the FAM and is not saved to the database
   * @param userToLogin 
   */
  public static LoginUser(userToLogin: FlowUser, connectionToUser : WebSocket) : void
  {
    // Find user in the list of known users
    let userFound : FlowUser = MongooseDatabase.GetUser(userToLogin.id);

    ConnectionManager.LoginUser(userFound, connectionToUser);
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
  public static CreateRoom(project: FlowProject) : void
  {
    RoomManager.CreateRoom(project);
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
                .UpdateObject(objectToUpdate);
  }
}