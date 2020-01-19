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
  CreateProject(projectToCreate : FlowProject) : boolean;
  DeleteProject(projectToDelete : FlowProject) : boolean;
  UpdateProject(projectToUpdate : FlowProject) : boolean;
  GetProject(projectId : number) : FlowProject;

  // User functions
  CreateUser(userToCreate : FlowUser) : boolean;
  DeleteUser(userToDelete : FlowUser) : boolean;
  UpdateUser(userToUpdate : FlowUser) : boolean;
  GetUser(UserId : number) : FlowUser;

  // Object functions
  CreateObject(objectToCreate : FlowObject) : boolean;
  DeleteObject(objectToDelete : FlowObject) : boolean;
  UpdateObject(objectToUpdate : FlowObject) : boolean;
  GetObject(ObjectId : number) : FlowObject;
}