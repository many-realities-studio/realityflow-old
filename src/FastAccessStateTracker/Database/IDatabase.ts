import { FlowProject } from "../FlowLibrary/FlowProject";
import { FlowUser } from "../FlowLibrary/FlowUser";
import { FlowObject } from "../FlowLibrary/FlowObject";
import {FlowClient} from "../FlowLibrary/FlowClient";

/**
 * IDatabase defines all of the necessary methods needed to connect an arbitrary database to the system.
 * NOTE: Typescript does not allow access modifiers (public, private, static) in interfaces
 */
export interface IDatabase
{ 
// Project functions
CreateProject(projectToCreate: FlowProject) : Promise<Object>;
DeleteProject(projectToDelete : FlowProject) : Promise<void>;
UpdateProject(projectToUpdate : FlowProject) : Promise<void>;
GetProject(projectId : number) : Promise<FlowProject>;

// User functions
CreateUser(userToCreate: FlowUser): Promise<void>;
DeleteUser(userToDelete : FlowUser) : Promise<void>;
UpdateUser(userToUpdate : FlowUser) : Promise<void>;
GetUser(UserId: number): Promise<FlowUser>;

// Object functions
CreateObject(objectToCreate: FlowObject, objectProject: FlowProject): Promise<Object>;
DeleteObject(projectToDelete : FlowProject, projectObject:FlowObject): Promise<void>;
UpdateObject(objectToUpdate : FlowObject) : Promise<void>;
GetObject(ObjectId : number): Promise<FlowObject>;

}