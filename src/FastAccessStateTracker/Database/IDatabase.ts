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
CreateProject(projectToCreate: FlowProject, projectUser: FlowUser, projectClient: FlowClient) : void;
DeleteProject(projectToDelete : FlowProject) : void;
UpdateProject(projectToUpdate : FlowProject) : void;
GetProject(projectId : number) : Promise<FlowProject>;

// User functions
CreateUser(userToCreate: FlowUser, userClient: FlowClient): void;
DeleteUser(userToDelete : FlowUser) : void;
UpdateUser(userToUpdate : FlowUser) : void;
GetUser(UserId: number): Promise<FlowUser> ;

// Object functions
CreateObject(objectToCreate: FlowObject, objectProject: FlowProject): Promise<Object>;
DeleteObject(projectToDelete : FlowProject, projectObject:FlowObject): Promise<void>;
UpdateObject(objectToUpdate : FlowObject) : void;
GetObject(ObjectId : number): Promise<FlowObject>;
}