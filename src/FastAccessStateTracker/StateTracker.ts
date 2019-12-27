import { FlowObject } from "./FlowLibrary/FlowObject";
import { FlowProject } from "./FlowLibrary/FlowProject";
import { FlowUser } from "./FlowLibrary/FlowUser";

import {Object, IObjectModel} from "../models/object";

// TODO: Add logging system
// TODO: Add checkout system check
// Note: FAM is used to abbreviate "Fast Access Memory"
export class StateTracker{

  // TODO: populate on startup with values stored in DB
  private static _ProjectList: Array<FlowProject> = []; 
  private static _UserList: Array<FlowUser> = [];
  private static _LoggedInUsers: Array<FlowUser> = [];
  
  /**
   * Creates an object and attaches it to the desired project in both the FAM and the Database
   * @param objectToCreate 
   */
  public static CreateObject(objectToCreate: FlowObject, desiredProject: FlowProject)
  {
    // Save for fast access
    desiredProject.AddObject(objectToCreate);

    // Async save to database
    var databaseFlowObject = new Object({
      type:           objectToCreate.type,
      name:           objectToCreate.name,
      triangles:      objectToCreate.triangles,
      x:              objectToCreate.x,
      y:              objectToCreate.y,
      z:              objectToCreate.z,
      q_x:            objectToCreate.q_x,
      q_y:            objectToCreate.q_y,
      q_z:            objectToCreate.q_z,
      q_w:            objectToCreate.q_w,
      s_x:            objectToCreate.s_x,
      s_y:            objectToCreate.s_y,
      s_z:            objectToCreate.s_z,
      color:          objectToCreate.color,
      vertices:       objectToCreate.vertices,
      uv:             objectToCreate.uv,
      texture:        objectToCreate.texture,
      textureHeight:  objectToCreate.textureHeight,
      textureWidth:   objectToCreate.textureWidth,
      textureFormat:  objectToCreate.textureFormat,
      mipmapCount:    objectToCreate.mipmapCount,
      locked:         objectToCreate.locked
    });

    databaseFlowObject.save()
      .then( (doc) => {
          desiredProject.SaveToDatabase();
      });
  }

  /**
   * Updates the data of a desired object, first in the FAM and then (asynchronously) to the database
   * @param objectToUpdate 
   */
  public static UpdateObject(newObject: FlowObject, desiredProject: FlowProject)
  {
    // Get the object that we are changing from the specified project
    var oldObject: FlowObject = desiredProject.GetObject(newObject.id);

    // Update all properties of the old object to the new object.
    oldObject.UpdateProperties(newObject);

    // Update the database
    oldObject.SaveToDatabase();
  }

  /**
   * Deletes the desired object from both the FAM and the database
   * @param objectToDelete 
   */
  public static DeleteObject(objectToDelete: FlowObject, desiredProject: FlowProject)
  {
    // Remove object from FAM
    var DeletedObject : FlowObject= desiredProject.DeleteObject(objectToDelete);

    // Remove object from database
    if(DeletedObject != null)
    {
      DeletedObject.DeleteFromDatabase();
    }
  }

  /**
   * Adds a project to the FAM and database
   * @param projectToCreate 
   */
  public static CreateProject(projectToCreate: FlowProject)
  {
    this._ProjectList.push(projectToCreate);

    projectToCreate.SaveToDatabase();
  }

  /**
   * Deletes the project from the FAM and the database
   * @param projectToDelete 
   */
  public static DeleteProject(projectToDelete: FlowProject)
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

  // TODO: Find out what this does (or needs to do)
  public static OpenProject(projectToOpen: FlowProject)
  {

  }

  public static CreateUser(userToCreate: FlowUser)
  {
    this._UserList.push(userToCreate);

    userToCreate.AddToDatabase();
  }

  public static LoginUser(userToLogin: FlowUser)
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

  public static LogoutUser(userToLogin: FlowUser)
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

  /**
   * Deletes the user from the FAM and the database
   * @param userToDelete 
   */
  public static DeleteUser(userToDelete: FlowUser)
  {
    // Logout the user
    this.LogoutUser(userToDelete);

    // Delete user in the list of known users
    let index = this._UserList.findIndex((element) => element.id == userToDelete.id);

    let foundUser : FlowUser = null;
    if(index > -1)
    {
      foundUser = this._UserList.splice(index, 1)[0]; // Deletes user from logged in users
    }

  }
}