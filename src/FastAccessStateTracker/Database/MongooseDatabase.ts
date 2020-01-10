import { IDatabase } from "./IDatabase";
import { FlowProject } from "../FlowLibrary/FlowProject";
import { FlowUser } from "../FlowLibrary/FlowUser";
import { FlowObject } from "../FlowLibrary/FlowObject";

/**
 * Implementation of Mongoose Database
 */
export class MongooseDatabase implements IDatabase
{
  private _URL: string;

  constructor(url : string)
  {
    this._URL = url;
  }

  // Project functions
  CreateProject(projectToCreate: FlowProject): void {
    throw new Error("Method not implemented.");
  }
  DeleteProject(projectToDelete: FlowProject): void {
    throw new Error("Method not implemented.");
  }
  UpdateProject(projectToUpdate: FlowProject): void {
    throw new Error("Method not implemented.");
  }
  GetProject(projectId: number): FlowProject {
    throw new Error("Method not implemented.");
  }

  // User functions
  CreateUser(userToCreate: FlowUser): void {
    throw new Error("Method not implemented.");
  }
  DeleteUser(userToDelete: FlowUser): void {
    throw new Error("Method not implemented.");
  }
  UpdateUser(userToUpdate: FlowUser): void {
    throw new Error("Method not implemented.");
  }
  GetUser(UserId: number): FlowUser {
    throw new Error("Method not implemented.");
  }

  // Object functions
  CreateObject(objectToCreate: FlowObject): void {
    throw new Error("Method not implemented.");
  }
  DeleteObject(objectToDelete: FlowObject): void {
    throw new Error("Method not implemented.");
  }
  UpdateObject(objectToUpdate: FlowObject): void {
    throw new Error("Method not implemented.");
  }
  GetObject(ObjectId: number): FlowObject {
    throw new Error("Method not implemented.");
  }
}