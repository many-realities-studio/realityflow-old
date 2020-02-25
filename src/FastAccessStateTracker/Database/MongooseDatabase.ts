

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
  public static async DeleteProject(projectToDelete: FlowProject): Promise<void> {
    var project = await ProjectOperations.findProject(projectToDelete)
    var objects = project.ObjectList
    objects.forEach(async element => {
      await ObjectOperations.deleteObject(element)
    }); 
    await ProjectOperations.deleteProject(projectToDelete);
    return;
  }

  public static async UpdateProject(projectToUpdate: FlowProject): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public static async GetProject(projectId: Number): Promise<FlowProject> {
    throw new Error("Method not implemented.");
  }

  // User functions
  /** 
  * Create a User in the database
  */
  public static async CreateUser(userToCreate: FlowUser): Promise<void> {
    var newUser = await UserOperations.createUser(userToCreate);
  
    await newUser.save();
  }

  /** 
  * Delete a User from the database
  */
  public static async DeleteUser(userToDelete: FlowUser): Promise<void> {
    var User = await UserOperations.findUser(userToDelete);
    var clientArray = User.Clients;

    for(var arr in clientArray){

        await ClientOperations.deleteClient(arr);

    }

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
  public static async GetUser(Username: String): Promise<FlowUser> {
    let userToReturn = await UserOperations.findUser({Username: Username})
    return new FlowUser(userToReturn) 
  }

  // Object functions
  /**
  *  Create an object and add it to a pre-existing project in the database
  */
  public static async CreateObject(objectToCreate: FlowObject, objectProject: FlowProject): Promise<Object> {
    var object = await ObjectOperations.createObject(objectToCreate);
    var project = await ProjectOperations.findProject(objectProject);

    project.objs.push(object._id);
    await project.save();

    return object;
  }

  /** Delete an object from a project in the database*/

  public static async DeleteObject(projectToDelete:FlowProject, projectObject:FlowObject): Promise<void> {
    var project: any = await ProjectOperations.findProject(project);

    await project.save();
    await ObjectOperations.deleteObject(projectObject);
  }
  /**Update a given object */
  public static async UpdateObject(objectToUpdate: FlowObject): Promise<void> {
    await ObjectOperations.updateObject(objectToUpdate);
  }
  /**Get an object from the database */
  public static async GetObject(ObjectId: number): Promise<FlowObject> {
    return new FlowObject(await ObjectOperations.findObject(ObjectId))
  }

}
export {MongooseDatabase};