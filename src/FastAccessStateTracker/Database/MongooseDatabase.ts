import { IDatabase } from "./IDatabase";
import { FlowProject } from "../FlowLibrary/FlowProject";
import { FlowUser } from "../FlowLibrary/FlowUser";
import { FlowObject } from "../FlowLibrary/FlowObject";

/**
 * Implementation of Mongoose Database
 */
export class MongooseDatabase implements IDatabase
{
  CreateProject(projectToCreate: FlowProject): boolean {
    throw new Error("Method not implemented.");
  }
  DeleteProject(projectToDelete: FlowProject): boolean {
    throw new Error("Method not implemented.");
  }
  UpdateProject(projectToUpdate: FlowProject): boolean {
    throw new Error("Method not implemented.");
  }
  GetProject(projectId: number): FlowProject {
    throw new Error("Method not implemented.");
  }
  CreateUser(userToCreate: FlowUser): boolean {
    throw new Error("Method not implemented.");
  }
  DeleteUser(userToDelete: FlowUser): boolean {
    throw new Error("Method not implemented.");
  }
  UpdateUser(userToUpdate: FlowUser): boolean {
    throw new Error("Method not implemented.");
  }
  GetUser(UserId: number): FlowUser {
    throw new Error("Method not implemented.");
  }
  CreateObject(objectToCreate: FlowObject): boolean {
    throw new Error("Method not implemented.");
  }
  DeleteObject(objectToDelete: FlowObject): boolean {
    throw new Error("Method not implemented.");
  }
  UpdateObject(objectToUpdate: FlowObject): boolean {
    throw new Error("Method not implemented.");
  }
  GetObject(ObjectId: number): FlowObject {
    throw new Error("Method not implemented.");
  }
  private _URL: string;

  constructor(url : string)
  {
    this._URL = url;
  }

}