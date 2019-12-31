import { FlowObject } from "./FlowLibrary/FlowObject";
import { FlowProject } from "./FlowLibrary/FlowProject";
import { FlowUser } from "./FlowLibrary/FlowUser"
import { RoomManager } from "./RoomManager";

// TODO: Add logging system
// TODO: Add checkout system 

// Note: FAM is used to abbreviate "Fast Access Memory"

/**
 * Keeps track of the state of the project, allowing for faster access to data while
 * storing data to the database in the
 */

export class StateTracker{

  // TODO: populate on startup with values stored in DB
  private static _ProjectList: Array<FlowProject> = [];
  private static _UserList: Array<FlowUser> = [];
  private static _LoggedInUsers: Array<FlowUser> = [];
  
  // Project Functions
  /**
   * Adds a project to the FAM and database
   * @param projectToCreate 
   */
  public static CreateProject(projectToCreate: FlowProject) : void
  {
    this._ProjectList.push(projectToCreate);

    projectToCreate.SaveToDatabase();
  }

  /**
   * Deletes the project from the FAM and the database
   * @param projectToDelete 
   */
  public static DeleteProject(projectToDelete: FlowProject) : void
  {
    // Remove object from FAM
    const index = this._ProjectList.findIndex((element) => element.id == projectToDelete.id);

    let foundProject : FlowProject = null;
    if(index > -1)
    {
      projectToDelete = this._ProjectList.splice(index, 1)[0];
    }
    
    // Remove object from database
    if(projectToDelete != null)
    {
      projectToDelete.Delete();
    }
  }

  // User Functions

  /**
   * Creates a user, adding the user data to the FAM and the database
   * @param userToCreate 
   */
  public static CreateUser(userToCreate: FlowUser) : void
  {
    this._UserList.push(userToCreate);

    userToCreate.AddToDatabase();
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
    let index = this._UserList.findIndex((element) => element.id == userToDelete.id);

    let foundUser : FlowUser = null;
    if(index > -1)
    {
      foundUser = this._UserList.splice(index, 1)[0]; // Deletes user from logged in users
      foundUser.Delete();
    }
  }

  /**
   * Logs in the desired user, this only affects the FAM and is not saved to the database
   * @param userToLogin 
   */
  public static LoginUser(userToLogin: FlowUser) : void
  {
    // Find user in the list of known users
    let knownUser : FlowUser = this._UserList.find((element) => element.id == userToLogin.id);

    if(knownUser != undefined)
    {
      this._LoggedInUsers.push(knownUser);
      knownUser.Login();
    }
    else
    {
      // TODO: Implement what happens when user is not found
    }

  }

  /**
   * Logs out the desired user, this only affects the FAM and is not saved to the database
   * @param userToLogin 
   */
  public static LogoutUser(userToLogin: FlowUser) : void
  {
    // Find user in the list of known users
    let index = this._LoggedInUsers.findIndex((element) => element.id == userToLogin.id);

    let foundUser : FlowUser = null;
    if(index > -1)
    {
      foundUser = this._LoggedInUsers.splice(index, 1)[0];
    }
    else
    {
      // TODO: Implement what happens when user is not found
    }
  }

  // Room Commands
  public static CreateRoom()
  {
    throw console.error("Method not implemented");
  }

  public static DeleteRoom()
  {
    throw console.error("Method not implemented");
  }

  // Object Commands
  public static CreateObject(objectToCreate : FlowObject)
  {
    RoomManager.FindRoom(objectToCreate.RoomNumber)
                .GetProject()
                .AddObject(objectToCreate);
  }

  public static DeleteObject(objectToDelete : FlowObject)
  {
    RoomManager.FindRoom(objectToDelete.RoomNumber)
                .GetProject()
                .DeleteObject(objectToDelete);
  }

  public static UpdateObject(objectToUpdate : FlowObject)
  {
    RoomManager.FindRoom(objectToUpdate.RoomNumber)
                .GetProject()
                .UpdateObject(objectToUpdate);
  }
}