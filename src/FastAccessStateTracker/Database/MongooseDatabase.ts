import { IDatabase } from "./IDatabase";

import { FlowProject } from "../FlowLibrary/FlowProject";
import { FlowUser } from "../FlowLibrary/FlowUser";
import { FlowObject } from "../FlowLibrary/FlowObject";
import { FlowClient } from "../FlowLibrary/FlowClient";

import { ProjectOperations } from "../../commands/project"
import { ClientOperations } from "../../commands/client"
import { ObjectOperations } from "../../commands/object"
import { UserOperations } from "../../commands/user"
/**
 * Implementation of Mongoose Database
 */
export default class MongooseDatabase implements IDatabase
{
    
    public constructor(url: string){}
    static CreateUser(arg0: FlowUser): any {
        throw new Error("Method not implemented.");
    }

  // Project functions
  public async CreateProject(projectToCreate: FlowProject) {
    var project = await ProjectOperations.createProject(projectToCreate);
    await project.save();
    
    return project
  }

  public async DeleteProject(projectToDelete: FlowProject): Promise<void> {
    await ProjectOperations.deleteProject(projectToDelete);
    return;
  }

  public async UpdateProject(projectToUpdate: FlowProject): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public async GetProject(projectId: number): Promise<FlowProject> {
    throw new Error("Method not implemented.");
  }

  // User functions

  // This returns type any because mongoose is written in javascript so I literally don't know the return type here
  public async CreateUser(userToCreate: FlowUser): Promise<void> {
    var newUser = await UserOperations.createUser(userToCreate);
  
    await newUser.save();
  }

  public async DeleteUser(userToDelete: FlowUser): Promise<void> {
    var User = await UserOperations.findUser(userToDelete);
    var clientArray = User.Clients;

    for(var arr in clientArray){

        await ClientOperations.deleteClient(arr);

    }

    await UserOperations.deleteUser(userToDelete);
  }

  public async UpdateUser(userToUpdate: FlowUser): Promise<void> {
    await UserOperations.updateUser(userToUpdate);
  }

  public async GetUser(UserId: number): Promise<FlowUser> {
    let userToReturn = await UserOperations.findUser({username: UserId})
    return new FlowUser(userToReturn) 
  }

  // Object functions
  public async CreateObject(objectToCreate: FlowObject, objectProject: FlowProject): Promise<Object> {
    var object = await ObjectOperations.createObject(objectToCreate);
    var project = await ProjectOperations.findProject(objectProject);

    project.objs.push(object._id);
    await project.save();

    return object;
  }

  public async DeleteObject(projectToDelete:FlowProject, projectObject:FlowObject): Promise<void> {
    var project: any = await ProjectOperations.findProject(project);

    await project.save();
    await ObjectOperations.deleteObject(projectObject);
  }
  public async UpdateObject(objectToUpdate: FlowObject): Promise<void> {
    await ObjectOperations.updateObject(objectToUpdate);
  }
  public async GetObject(ObjectId: number): Promise<FlowObject> {
    return new FlowObject(await ObjectOperations.findObject(ObjectId))
  }

}
export {MongooseDatabase};