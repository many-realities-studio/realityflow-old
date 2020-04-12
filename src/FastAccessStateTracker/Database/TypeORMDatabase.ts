

import { FlowProject } from "../FlowLibrary/FlowProject";
import { FlowUser } from "../FlowLibrary/FlowUser";
import { FlowObject } from "../FlowLibrary/FlowObject";
import { FlowBehaviour } from "../FlowLibrary/FlowBehaviour";


import { ProjectOperations } from "../../ORMCommands/project"
import { ObjectOperations } from "../../ORMCommands/object"
import { UserOperations } from "../../ORMCommands/user"
import { BehaviourOperations } from "../../ORMCommands/behaviour"

import { DBObject } from "../../entity/object";
import { Project } from "../../entity/project";
/**
 * Implementation of Mongoose Database
 */
export default class TypeORMDatabase
{
    
  public constructor(url: string){}
    

  // Project functions
  public static async CreateProject(projectToCreate: FlowProject, user: string) {

    let projectId = await ProjectOperations.createProject(projectToCreate, user);
    
    return await ProjectOperations.findProject(projectId);
  }

  /**
  * Deletes the project and all its objects from the database
  * This works because deletes cascade
  */
  public static async DeleteProject(projectToDeleteId: string): Promise<void> {
    
    await ProjectOperations.deleteProject(projectToDeleteId);
    return;
  }

  public static async UpdateProject(projectToUpdate: FlowProject): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public static async GetProject(projectId: string): Promise<FlowProject> {
    let project = await ProjectOperations.findProject(projectId);

    if(!project)
      return null;

    let objects = await ProjectOperations.getObjects(projectId);
    let behaviours = await BehaviourOperations.getBehaviours(projectId)
    
    
    let returnProject = new FlowProject(project);
    
    returnProject._ObjectList = objects.map((val, index, arr) => new FlowObject(val))
    
    returnProject._BehaviourList = behaviours.map((Behaviour)=>{
      let ret:any = {};
      ret.Id = Behaviour.Id;
      ret.TypeOfTrigger = Behaviour.TypeOfTrigger
      ret.TriggerObjectId = Behaviour.TriggerObjectId;
      ret.TargetObjectId = Behaviour.TargetObjectId;
      ret.Action = Behaviour.Action
      ret.NextBehaviour = JSON.parse(Behaviour.NextBehaviour);
      ret.ProjectId = Behaviour.ProjectId
      return new FlowBehaviour(ret);
    })

    return returnProject;
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
  * Get a user based on their username 
  */
  public static async GetUser(Username: string): Promise<FlowUser> {
    
    let UserProjects = await ProjectOperations.fetchProjects(Username)
    let projects = UserProjects.map((val, index, list) => val.Id)

    return new FlowUser(Username, undefined, projects) 
  }

  public static async fetchProjects(Username: string): Promise<Array<Project>>{
    return ( await ProjectOperations.fetchProjects(Username))
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
    console.log("typeORM update")
    console.log(objectToUpdate)
    await ObjectOperations.updateObject(objectToUpdate, projectId);
  }
  
  /**Get an object from the database */
  public static async GetObject(ObjectId: string, projectId: string): Promise<FlowObject> {
    return new FlowObject(await ObjectOperations.findObject(ObjectId, projectId))
  }


  // Behaviour functions
  /**
  *  Create an Behaviour and add it to a pre-existing project in the database
  *  Assumes that the project already exists
  */
  public static async CreateBehaviour(BehaviourToCreate: FlowBehaviour){
    let ret:any = {};
    ret.Id = BehaviourToCreate.Id;
    ret.TypeOfTrigger = BehaviourToCreate.TypeOfTrigger
    ret.TriggerObjectId = BehaviourToCreate.TriggerObjectId;
    ret.TargetObjectId = BehaviourToCreate.TargetObjectId;
    ret.Action = JSON.stringify(BehaviourToCreate.Action)
    ret.NextBehaviour = JSON.stringify(BehaviourToCreate.NextBehaviour);
    ret.ProjectId = BehaviourToCreate.ProjectId
    console.log(BehaviourToCreate.Action)
    
    await BehaviourOperations.CreateBehaviour(ret);
  }

  /** Delete a Behaviour chain from a project in the database*/
  public static async DeleteBehaviour(BehaviourId: string): Promise<void> {
    await BehaviourOperations.deleteBehaviour(BehaviourId);
  }

  public static async LinkNewToOld(projectId: string, child: string, parents: string[]) {
    await BehaviourOperations.LinkNewToOld(projectId, child, parents);
  }

  public static async UpdateBehaviour(BehaviourToUpdate): Promise<void>{
    let ret:any = {};
    ret.Id = BehaviourToUpdate.Id;
    ret.TypeOfTrigger = BehaviourToUpdate.TypeOfTrigger
    ret.TriggerObjectId = BehaviourToUpdate.TriggerObjectId;
    ret.TargetObjectId = BehaviourToUpdate.TargetObjectId;
    ret.Action = JSON.stringify(BehaviourToUpdate.Action)
    ret.NextBehaviour = JSON.stringify(BehaviourToUpdate.NextBehaviour);
    ret.ProjectId = BehaviourToUpdate.ProjectId
    await BehaviourOperations.updateBehaviour(ret)
  }

  public static async getBehaviours(projectId){
    let Behaviours = await BehaviourOperations.getBehaviours(projectId);
    let flowBehaviours = Behaviours.map((Behaviour)=>{
      let ret:any = {};
      ret.Id = Behaviour.Id;
      ret.TypeOfTrigger = Behaviour.TypeOfTrigger
      ret.TriggerObjectId = Behaviour.TriggerObjectId;
      ret.TargetObjectId = Behaviour.TargetObjectId;
      ret.Action = Behaviour.Action
      ret.NextBehaviour = JSON.parse(Behaviour.NextBehaviour);
      ret.ProjectId = Behaviour.ProjectId
      return new FlowBehaviour(ret);
    })
    return flowBehaviours;
  }
}
export {TypeORMDatabase};