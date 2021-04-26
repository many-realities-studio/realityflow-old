

import { FlowProject } from "../FlowLibrary/FlowProject";
import { FlowUser } from "../FlowLibrary/FlowUser";
import { FlowObject } from "../FlowLibrary/FlowObject";
import { FlowVSGraph } from "../FlowLibrary/FlowVSGraph";
import { FlowBehaviour } from "../FlowLibrary/FlowBehaviour";


import { ProjectOperations } from "../../ORMCommands/project"
import { ObjectOperations } from "../../ORMCommands/object"
import { VSGraphOperations } from "../../ORMCommands/vsgraph"
import { UserOperations } from "../../ORMCommands/user"
import { BehaviourOperations } from "../../ORMCommands/behaviour"

import { DBObject } from "../../entity/object";
import { VSGraph } from "../../entity/vsgraph";
import { Project } from "../../entity/project";

export default class TypeORMDatabase
{
    
  public constructor(url: string){}
    

  /**
   * Create a project and give a user ownership of the newly-created project
   * @param projectToCreate 
   * @param user 
   */
  public static async CreateProject(projectToCreate: FlowProject, user: string) {

    let projectId = await ProjectOperations.createProject(projectToCreate, user);
    
    return await ProjectOperations.findProject(projectId);
  }

  /**
  * Deletes the project and all its objects from the database
  * @param projectToDeleteId
  */
  public static async DeleteProject(projectToDeleteId: string): Promise<void> {
    
    await ProjectOperations.deleteProject(projectToDeleteId);
    return;
  }
  /**
   * Update a project. It's not implemented upstream so I didn't implement it here.
   * @param projectToUpdate 
   */
  public static async UpdateProject(projectToUpdate: FlowProject): Promise<void> {
    throw new Error("Method not implemented.");
  }

  /**
   * Get a project from the database
   * @param projectId 
   */
  public static async GetProject(projectId: string): Promise<FlowProject> {
    let idLength = projectId.length;
    let foundprojectId;
    let project;
    
    if (idLength == 5)
    {
      project = await ProjectOperations.findProjectShortCode(projectId);
    }
    else
    {
      project = await ProjectOperations.findProject(projectId);
    }

    if(!project)
      return null;

    foundprojectId = project.Id

    let objects = await ProjectOperations.getObjects(foundprojectId);
    let vsgraphs = await ProjectOperations.getVSGraphs(foundprojectId);
    let behaviours = await BehaviourOperations.getBehaviours(foundprojectId);
    
    // For VSGraphs, certain fields must be returned to clients as strings so that NewtonSoft does not fail to deserialze them.
    // Here, JSON.parse is used to unstringify data from the database, except for exposedParameters and paramIdToObjId as those
    // need to be received as strings, at least with the current way things are being deserialized.
    vsgraphs.forEach(function(vsGraph) {
      vsGraph.serializedNodes = JSON.parse(vsGraph.serializedNodes);
      vsGraph.edges = JSON.parse(vsGraph.edges);
      vsGraph.groups = JSON.parse(vsGraph.groups);
      vsGraph.stackNodes = JSON.parse(vsGraph.stackNodes);
      vsGraph.pinnedElements = JSON.parse(vsGraph.pinnedElements);
      vsGraph.exposedParameters = vsGraph.exposedParameters;
      vsGraph.stickyNotes = JSON.parse(vsGraph.stickyNotes);
      vsGraph.position = JSON.parse(vsGraph.position);
      vsGraph.scale = JSON.parse(vsGraph.scale);
      vsGraph.references = JSON.parse(vsGraph.references);
      vsGraph.paramIdToObjId = vsGraph.paramIdToObjId;
    });
    
    let returnProject = new FlowProject(project);
    
    returnProject._ObjectList = objects.map((val, index, arr) => new FlowObject(val))
    returnProject._VSGraphList = vsgraphs.map((val, index, arr) => new FlowVSGraph(val))
    
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

  /** 
  * Create a User in the database
  * @param username the username
  * @param the password
  */
  public static async CreateUser(username: string, password: string): Promise<void> {
    var newUser = await UserOperations.createUser(username, password);
  }

  /** 
  * Delete a User from the database
  * @param userToDelete the Id of the user to delete
  */
  public static async DeleteUser(userToDelete: string): Promise<void> {
    await UserOperations.deleteUser(userToDelete);
  }


  /**
  * Get a user based on their username 
  * @param Username the username of the user
  */
  public static async GetUser(Username: string): Promise<FlowUser> {
    
    let UserProjects = await ProjectOperations.fetchProjects(Username)
    let projects = UserProjects.map((val, index, list) => val.Id)

    return new FlowUser(Username, undefined, projects) 
  }

  /**
   * Fetch all of the projects that are associated with a given user.
   * @param Username the username of the user
   */
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
   * Create an object and associate a project with that object
   * @param objectToCreate the FlowObject to use to create the object
   * @param projectId the id of the project to associate the object with.
   */
  public static async CreateObject(objectToCreate: FlowObject, projectId: string){
    await ObjectOperations.createObject(objectToCreate, projectId);
  }

  /**
   * Delete an object from a project in the database
   * @param objectId the object to delete 
   * @param projectId the project with which the object is associated
   */
  public static async DeleteObject(objectId:string, projectId: string): Promise<void> {
    await ObjectOperations.deleteObject(objectId, projectId)
  }

  /**
   * update a given object
   * @param objectToUpdate the Id of the object to update 
   * @param projectId the project with which the object is associated
   */
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
   * Create an Behaviour and add it to a pre-existing project in the database
   * Assumes that the project already exists
   * @param BehaviourToCreate the FlowBehaviour used to create the behaviour
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

  /** Delete a Behaviour chain from a project in the database
   * @param BehaviourIds the behaviours to delete
  */
  public static async DeleteBehaviour(BehaviourIds: Array<string>): Promise<void> {
    await BehaviourOperations.deleteBehaviour(BehaviourIds);
  }

  /**
   * Link a child behavior to one or more parent behaviours
   * @param projectId the project that the behaviours are in
   * @param child the id of the child behaviour
   * @param parents a list of the id(s) of the parent behaviour(s)
   */
  public static async LinkNewToOld(projectId: string, child: string, parents: string[]) {
    await BehaviourOperations.LinkNewToOld(projectId, child, parents);
  }

  /**
   * Update a behaviour
   * @param BehaviourToUpdate 
   */
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

  /**
   * Get all of the behaviours in a given project
   * @param projectId 
   */
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

  // Visual Scripting Graph functions
   /**
   * Create a graph and associate a project with that graph
   * @param vsGraphToCreate the FlowGraph to use to create the graph
   * @param projectId the id of the project to associate the graph with.
   */
  public static async CreateVSGraph(vsGraphToCreate: FlowVSGraph, projectId: string){
    await VSGraphOperations.createVSGraph(vsGraphToCreate, projectId);
  }

  /**
   * Delete a graph from a project in the database
   * @param graphId the graph to delete 
   * @param projectId the project with which the graph is associated
   */
  public static async DeleteVSGraph(graphId:string, projectId: string): Promise<void> {
    await VSGraphOperations.deleteVSGraph(graphId, projectId)
  }

  /**
   * update a given graph
   * @param vsGraphToUpdate the Id of the graph to update 
   * @param projectId the project with which the graph is associated
   */
  public static async UpdateVSGraph(vsGraphToUpdate: FlowVSGraph, projectId: string): Promise<void> {
    console.log("typeORM VSGRAPH update")
    console.log(vsGraphToUpdate)
    await VSGraphOperations.updateVSGraph(vsGraphToUpdate, projectId);
  }
  
  /**Get a graph from the database */
  public static async GetVSGraph(VSGraphId: string, projectId: string): Promise<FlowVSGraph> {
    return new FlowVSGraph(await VSGraphOperations.findVSGraph(VSGraphId, projectId))
  }
}
export {TypeORMDatabase};