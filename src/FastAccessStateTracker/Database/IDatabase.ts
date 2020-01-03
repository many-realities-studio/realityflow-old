import { FlowProject } from "../FlowLibrary/FlowProject";
import { FlowUser } from "../FlowLibrary/FlowUser";
import { FlowObject } from "../FlowLibrary/FlowObject";

/**
 * IDatabase defines all of the necessary methods needed to connect an arbitrary database to the system.
 * NOTE: Typescript does not allow access modifiers (public, private, static) in interfaces
 */
export interface IDatabase
{ 
  // Project functions
  CreateProject(projectToCreate : FlowProject) : void;
  DeleteProject(projectToDelete : FlowProject) : void;
  UpdateProject(projectToUpdate : FlowProject) : void;
  GetProject(projectId : number) : FlowProject;

  // User functions
  CreateUser(userToCreate : FlowUser) : void;
  DeleteUser(userToDelete : FlowUser) : void;
  UpdateUser(userToUpdate : FlowUser) : void;
  GetUser(UserId : number) : FlowUser;

  // Object functions
  CreateObject(objectToCreate : FlowObject) : void;
  DeleteObject(objectToDelete : FlowObject) : void;
  UpdateObject(objectToUpdate : FlowObject) : void;
  GetObject(ObjectId : number) : FlowObject;
}