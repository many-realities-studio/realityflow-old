import { FlowUser } from "./FlowLibrary/FlowUser";
import { FlowProject } from "./FlowLibrary/FlowProject";

import { TypeORMDatabase } from "./Database/TypeORMDatabase";
import { FlowClient } from "./FlowLibrary/FlowClient";
import { FlowObject } from "./FlowLibrary/FlowObject";
import { FlowVSGraph } from "./FlowLibrary/FlowVSGraph";

// Look into Pub/Sub architecture
export class Room
{
  
  private _UsersCurrentlyInTheRoom: Array<FlowUser> = [];
  private _CurrentProject: FlowProject;
  private _CurrentProjectId: string;
  private PlayMode: boolean;

  constructor(projectID: string)
  {
    this._CurrentProjectId = projectID;
    this.PlayMode = false;
    
    TypeORMDatabase.GetProject(this._CurrentProjectId).then((project: FlowProject) =>{
      this._CurrentProject = project;
    })

  }

  // TODO: finished: yes tested: yes
  // I think I want to have strings passed to these
 
  /**
   * Adds the desired user to the list of users in the room
   * @param userJoiningTheRoom the user that will be joining the room
   * @param clientJoiningTheRoom the client that the user is using
   */
  public async JoinRoom(userJoiningTheRoom: string, clientJoiningTheRoom: string) : Promise<void>
  {
    let user = this._UsersCurrentlyInTheRoom.find(element => element.Username == userJoiningTheRoom)

    //user is not already in this room
    if(user == undefined){
      user = await TypeORMDatabase.GetUser(userJoiningTheRoom)
      this._UsersCurrentlyInTheRoom.push(user);
    }
    
    user.ActiveClients.push(clientJoiningTheRoom)
    
  }

  // TODO: finished: yes tested: Yes
  /**
   * removes a client from a room - if that client was the only one using those credentials,
   * the room stops keeping track of that username
   * @param UserName username of the client leaving the room
   * @param ClientId client id of the client leaving the room
   */
  public LeaveRoom(UserName: string, ClientId: string){
    let userIndex = this._UsersCurrentlyInTheRoom.findIndex(element => element.Username == UserName)

    //user is already not in this room
    if(userIndex == -1){
      return;
    }
    // user is already in this room
    else{
      let clientIndex = this._UsersCurrentlyInTheRoom[userIndex].ActiveClients.findIndex(element => element == ClientId)
      this._UsersCurrentlyInTheRoom[userIndex].ActiveClients.splice(clientIndex, 1)
      
      //if the user doesn't have any more active clients, then remove user from the room
      if(this._UsersCurrentlyInTheRoom[userIndex].ActiveClients.length == 0)
        this._UsersCurrentlyInTheRoom.splice(userIndex, 1)
      
    }

  }

  // TODO: finished: yes tested: yes
  /**
   * returns whether or not any client using this given username is in here
   * @param username username to search for
   * @returns whether or not the user is in the room
   */
  public hasUser(username: string){
    let retval = (this._UsersCurrentlyInTheRoom.find(element => element.Username == username) != undefined)
    return retval
  }

  /**
   * Given a username and client Id, checks whether the user is in the room
   * @param username the username
   * @param ClientId the client Id
   * @returns whether or not the client is in the room
   */
  public hasClient(username: string, ClientId: string){
    let user = this._UsersCurrentlyInTheRoom.find(element => element.Username == username)
    return (this.hasUser(username) && user.ActiveClients.find(element => element == ClientId) != undefined)
  }

  // TODO: finished: yes tested: yes
  /**
   * Gets the room code of this room
   * @returns the room code/project Id of the room
   */
  public GetRoomCode() : string
  {
    return this._CurrentProjectId;
  }

  // TODO: finished: yes tested: yes
  /**
   * Gets the project that is currently being used by the project
   * @returns the project as a flowproject
   */
  public GetProject() : FlowProject
  {
    return this._CurrentProject; 
  }

  // TODO: finished: yes tested: yes
  /**
   * Get all of the clients that are currently in this room
   * @returns a map of users to array of clients associated with that user
   */
  public getClients() : Map<string, Array<string>>{
    let clients: Map<string, Array<string> > = new Map()

    this._UsersCurrentlyInTheRoom.forEach((user, index, arr) => clients.set(user.Username, user.ActiveClients))
    return clients
  }

// TODO: finished: yes tested: no
  /**
   * update an object, assuming the client sending the update is the client that has the object checked in.
   * @param objectToUpdate the object to update
   * @param client the id of the client sending the update
   * @returns success - whether or not the update actually happened in the FAM
   */
  public updateObject(objectToUpdate, client){
    let success = this._CurrentProject.UpdateFAMObject(objectToUpdate, client);
    return success;
  }

  /**
   * update a behaviour
   * @param BehaviourToUpdate the behaviour to update
   * @param client the client sending the update
   * @returns whether or not the update actually happened
   */
  public updateBehaviour(BehaviourToUpdate, client){
    let success = this._CurrentProject.UpdateBehaviour(BehaviourToUpdate, client);
    return success;
  }

  // TODO: finished: yes tested: yes
  /**
   * add an objec to the room
   * @param objectToCreate the object to add to the room
   * @returns whether the object was created
   */
  public AddObject(objectToCreate: FlowObject){
    return this._CurrentProject.AddObject(objectToCreate);
  }

  // TODO: optimize all of these
  /**
   * delete an object from the room, iff the client sending the delete call has the object checked out
   * @param objectId 
   * @param client 
   * @returns success value
   */
  public DeleteObject(objectId: string, client: string) {
    let success = this._CurrentProject.DeleteObject(objectId, client)
    return success;
  }

  // TODO: finished: yes tested: yes
  /**
   * Return the data of an object
   * @param objectId the Id of the object that you want
   * @returns the object to be read
   */
  public ReadObject(objectId:string){
    return this._CurrentProject.GetObject(objectId)
  }

  // TODO: finished: yes tested: yes
  /**
   * check in an object, if the object is checked out by client
   * @param objectId the object to be checked in
   * @param client the client trying to check in the object
   * @returns success
   */
  public checkinObject(objectId: string, client: string){
    return this._CurrentProject.CheckinObject(objectId, client)
  }

  // TODO: finished: yes tested: yes
  /**
   * check out an object, assuming that client is open for checkout
   * @param objectId  object to check out
   * @param client client who is checking out the object
   * @returns success
   */
  public checkoutObject(objectId: string, client: string): boolean
  {
    return this._CurrentProject.CheckoutObject(objectId, client)
  }

  // Visual Scripting Graph section

  // TODO: finished: no tested: no
  /**
   * update a graph, assuming the client sending the update is the client that has the graph checked in.
   * @param vsGraphToUpdate the graph to update
   * @param client the id of the client sending the update
   * @returns success - whether or not the update actually happened in the FAM
   */
  public updateVSGraph(vsGraphToUpdate, client){
    let success = this._CurrentProject.UpdateFAMVSGraph(vsGraphToUpdate, client);
    return success;
  }

  // TODO: finished: no tested: no
  /**
   * add a graph to the room
   * @param vsGraphToCreate the graph to add to the room
   * @returns whether the graph was created
   */
  public AddVSGraph(vsGraphToCreate: FlowVSGraph){
    return this._CurrentProject.AddVSGraph(vsGraphToCreate);
  }

  // TODO: optimize all of these
  /**
   * delete a graph from the room, iff the client sending the delete call has the graph checked out
   * @param vsGraphId
   * @param client 
   * @returns success value
   */
  public DeleteVSGraph(vsGraphId: string, client: string) {
    let success = this._CurrentProject.DeleteVSGraph(vsGraphId, client)
    return success;
  }

  // TODO: finished: no tested: no
  /**
   * Return the data of a graph
   * @param vsGraphId the Id of the graph that you want
   * @returns the graph to be read
   */
  public ReadVSGraph(vsGraphId:string){
    return this._CurrentProject.GetVSGraph(vsGraphId)
  }

  // TODO: finished: no tested: no
  /**
   * check in a graph, if the graph is checked out by client
   * @param vsGraphId the graph to be checked in
   * @param client the client trying to check in the graph
   * @returns success
   */
  public checkinVSGraph(vsGraphId: string, client: string){
    return this._CurrentProject.CheckinVSGraph(vsGraphId, client)
  }

  // TODO: finished: no tested: no
  /**
   * check out a graph, assuming that client is open for checkout
   * @param vsGraphId  object to check out
   * @param client client who is checking out the graph
   * @returns success
   */
  public checkoutVSGraph(vsGraphId: string, client: string): boolean
  {
    return this._CurrentProject.CheckoutVSGraph(vsGraphId, client)
  }

  /**
   * Turn on play mode
   * @returns success
   */
  public turnOnPlayMode() : boolean
  {
    if(this.PlayMode == true)
      return false;
    this.PlayMode = true;
    return true;
  }

  /**
   * turn off play mode
   * @returns success
   */
  public turnOffPlayMode() : boolean
  {
    if(this.PlayMode == false)
      return false;
    this.PlayMode = false;
    return true;
  }

}