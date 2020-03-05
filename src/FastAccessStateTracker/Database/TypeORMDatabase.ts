

import { FlowProject } from "../FlowLibrary/FlowProject";
import { FlowUser } from "../FlowLibrary/FlowUser";
import { FlowObject } from "../FlowLibrary/FlowObject";


import { ProjectOperations } from "../../ORMCommands/project"
import { ObjectOperations } from "../../ORMCommands/object"
import { UserOperations } from "../../ORMCommands/user"

import { DBObject } from "../../entity/object";
/**
 * Implementation of Mongoose Database
 */
export default class TypeORMDatabase
{
    
  public constructor(url: string){}
    

  // Project functions
  public static async CreateProject(projectToCreate: FlowProject, user: string) {
    let newProject = await ProjectOperations.createProject(projectToCreate, user);
  }

  /**
  * Deletes the project and all its objects from the database
  */
  public static async DeleteProject(projectToDeleteId: string): Promise<void> {
    var project = await ProjectOperations.findProject(projectToDeleteId)
    var objects = project.ObjectList
    
    objects.forEach(async (element: DBObject) => {
      await ObjectOperations.deleteObject(element.Id, projectToDeleteId)
    }); 

    await ProjectOperations.deleteProject(projectToDeleteId);
    return;
  }

  public static async UpdateProject(projectToUpdate: FlowProject): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public static async GetProject(projectId: string): Promise<FlowProject> {
    return new FlowProject(ProjectOperations.findProject(projectId))
  }

  // User functions
  /** 
  * Create a User in the database
  */
  public static async CreateUser(username: string, password: string): Promise<void> {
    var newUser = await UserOperations.createUser(username, password);
  }

  /** 
  * Delete a User from the database
  */
  public static async DeleteUser(userToDelete: string): Promise<void> {
    await UserOperations.deleteUser(userToDelete);
  }

  /** 
  * Update a User in the database
  */ 
  public static async UpdateUser(userToUpdate: FlowUser): Promise<void> {
    await UserOperations.updateUser(userToUpdate.Username, userToUpdate);
  }

  /**
  * Get a user based on their username 
  */
  public static async GetUser(Username: string): Promise<FlowUser> {
    
    let UserProjects = await ProjectOperations.fetchProjects(Username)
    let projects = UserProjects.map((val, index, list) => val.Id)

    return new FlowUser(Username, undefined, projects) 
  }

  /**
   * Authenticate a user based on username and password
   * @param Username 
   * @param Password 
   */
  public static async AuthenticateUser(Username: string, Password: string): Promise<Boolean>{
    let user = await UserOperations.authenticateUser(Username, Password)
    
    if(!user)
      return false

    return true
  }


  // Object functions


  /**
  *  Create an object and add it to a pre-existing project in the database
  *  Assumes that the project already exists
  */
  public static async CreateObject(objectToCreate: FlowObject, projectId: string){
    await ObjectOperations.createObject(objectToCreate, projectId);
  }

  /** Delete an object from a project in the database*/

  public static async DeleteObject(objectId:string, projectId: string): Promise<void> {
    await ObjectOperations.deleteObject(objectId, projectId)
  }

  /**Update a given object */
  public static async UpdateObject(objectToUpdate: FlowObject, projectId: string): Promise<void> {
    await ObjectOperations.updateObject(objectToUpdate, projectId);
  }
  
  /**Get an object from the database */
  public static async GetObject(ObjectId: string, projectId: string): Promise<FlowObject> {
    return new FlowObject(await ObjectOperations.findObject(ObjectId, projectId))
  }

}
export {TypeORMDatabase};