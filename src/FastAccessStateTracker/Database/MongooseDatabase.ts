

import { FlowProject } from "../FlowLibrary/FlowProject";
import { FlowUser } from "../FlowLibrary/FlowUser";
import { FlowObject } from "../FlowLibrary/FlowObject";
import { FlowClient } from "../FlowLibrary/FlowClient";

import { ProjectOperations } from "../../commands/project"
import { ClientOperations } from "../../commands/client"
import { ObjectOperations } from "../../commands/object"
import { UserOperations } from "../../commands/user"
import { IObjectModel } from "../../models/object";
import { ObjectID, ObjectId } from "mongodb";
import { IProjectModel } from "../../models/project";
/**
 * Implementation of Mongoose Database
 */
export default class MongooseDatabase
{
    
  public constructor(url: string){}
    

  // Project functions
  public static async CreateProject(projectToCreate: FlowProject) {
    var project = await ProjectOperations.createProject(projectToCreate);
    await project.save();
    
    return project
  }

  /**
  * Deletes the project and all its objects from the database
  */
  public static async DeleteProject(projectToDeleteId: string): Promise<void> {
    var project = await ProjectOperations.findProject(projectToDeleteId)
    var objects = project.ObjectList
    
    objects.forEach(async (element: any) => {
      await ObjectOperations.deleteObject(element)
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
  
    await newUser.save();
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
    await UserOperations.updateUser(userToUpdate);
  }

  /**
  * Get a user based on their username 
  */
  public static async GetUser(Username: string): Promise<FlowUser> {
    let userToReturn = await UserOperations.findUser(Username)
    let UserProjects = await ProjectOperations.fetchProjects(Username)
    
    return new FlowUser(userToReturn.Username, undefined, UserProjects ) 
  }

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
  public static async CreateObject(objectToCreate: FlowObject, projectId: string): Promise<Object> {
    var object = await ObjectOperations.createObject(objectToCreate);

    var project: IProjectModel = await ProjectOperations.findProject(projectId);

    project.ObjectList.push(object._id)
    await project.save();

    return object;
  }

  /** Delete an object from a project in the database*/

  public static async DeleteObject(projectToDelete:string, ObjectId: string): Promise<void> {
    
    await ProjectOperations.deleteObject(projectToDelete, ObjectId)
    
  }

  /**Update a given object */
  public static async UpdateObject(objectToUpdate: FlowObject): Promise<void> {
    await ObjectOperations.updateObject(objectToUpdate);
  }
  
  /**Get an object from the database */
  public static async GetObject(ObjectId: string): Promise<FlowObject> {
    return new FlowObject(await ObjectOperations.findObject(ObjectId))
  }



  /**Get a client */
  public static async GetClient(ClientId: string): Promise<FlowClient>{
    return new FlowClient(await ClientOperations.findClient(ClientId))

  } 

}
export {MongooseDatabase};