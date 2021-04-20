import { Room } from "./Room";
import { FlowObject } from "./FlowLibrary/FlowObject";
import { FlowAvatar } from "./FlowLibrary/FlowAvatar";
import { FlowVSGraph } from "./FlowLibrary/FlowVSGraph";
import { FlowBehaviour } from "./FlowLibrary/FlowBehaviour";
import { FlowNodeView } from "./FlowLibrary/FlowNodeView";


// TODO: Make a check for how many people are in a room and delete the room if there is nobody inside
export class RoomManager
{
  // Why is this static
  // It works, though, so I can't really complain
  public static _RoomList : Array<Room> = [];
  public static _RoomCount : number = 0;

  // TEST
  /**
   * Creates a new room. This room must be tied to a project.
   * @param projectId aka the room code
   * @returns the project Id
   */
  public static CreateRoom(projectID : string) : string
  {
    let newRoom = new Room(projectID);
    
    this._RoomList.push(newRoom);
    this._RoomCount++;
    
    return projectID;
  }

  
  // TODO: perhaps find a way to do this that doesn't return undefined
  /**
   * Searches all active rooms for a room with an associated room code
   * @param roomCode 
   * @returns if found, the Room; else, undefined 
   */
  public static FindRoom(roomCode: string) : Room
  {
    return this._RoomList.find(element => element.GetRoomCode() == roomCode);
  }

  
  /**
   * @param roomCode the code of the room to destroy
   * @returns a map of the users to arrays of the associated clients that were in the room
   */
  public static DestroyRoom(roomCode: string): Map<string, Array<string>> {
    let clients = RoomManager.getClients(roomCode)

    clients.forEach((clientList, userName, map)=> clientList.forEach( (client, index, arr) => {
      this.LeaveRoom(roomCode, userName, client)
      this.JoinRoom("noRoom", userName, client)
    }))
    
    let roomIndex = this._RoomList.findIndex(element => element.GetRoomCode() == roomCode)

    if(roomIndex > -1) {
      this._RoomList.splice(roomIndex, 1);
      this._RoomCount--;
    }
    return clients
  }

  // TODO: Finished: Yes Tested: No
  // Bottom-up integration!
  /**
   * Given a client and the user that they're registered under, allow the client to join a room
   * @param roomCode room to join
   * @param user user to join room
   * @param clientId client to join room
   */
  public static JoinRoom(roomCode: string, user: string, clientId: string){
    let roomToLogin: Room = this.FindRoom(roomCode)
    roomToLogin.JoinRoom(user, clientId)
  }

  //TODO: finished: yes tested: no
  /**
   * Given a client and the user that they're registered under, allow the client to leave a room
   * @param roomCode room to leave
   * @param user user to leave room
   * @param clientId client to leave room
   */
  public static LeaveRoom(roomCode: string, user: string, clientId: string){
    let roomToLeave: Room = this.FindRoom(roomCode)

    if(roomToLeave)
      roomToLeave.LeaveRoom(user, clientId)
  }

  //TODO: finished: yes tested: no
  /**
   * given a room, return a map of usernames with all of the users and their clients
   * @param roomCode 
   * @returns a map of usernames to their clients that are in the room
   */
  public static getClients(roomCode: string){

    let room = this.FindRoom(roomCode);
    return room.getClients();
  }

  /**
   * update an object, iff client is allowed to check out
   * @param objectToUpdate object to update
   * @param projectId id of the project the object is in
   * @param client the client who is trying to update the object
   * @return success
   */
  public static updateObject(objectToUpdate: FlowObject, projectId: string, client:string){
    // "user" is going to be the client variable used to keep track of checkIns/Out
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.updateObject(objectToUpdate, client)
  }

  /**
   * Update a behaviour
   * @param BehaviourToUpdate behaviour to update 
   * @param projectId the project that the object is in
   * @param client the client who is trying to update the object
   * @returns success
   */
  public static updateBehaviour(BehaviourToUpdate: FlowBehaviour, projectId: string, client:string){
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.updateBehaviour(BehaviourToUpdate, client)
  }

  /**
   * add an object to a specific room
   * @param objectToCreate 
   * @param projectId 
   * @returns success
   */
  public static AddObject(objectToCreate: FlowObject, projectId:string){
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.AddObject(objectToCreate)
  }

  /**
   * delete an object from the Fast Access State Tracker
   * @param projectId the id of the project from which to delete the obejct
   * @param objectId the Id of the object to delete
   * @param client the client who wants to delete the object
   * @returns success
   */
  public static DeleteObject(projectId: string, objectId: string, client:string){
    let success = this._RoomList.find(element => element.GetRoomCode() == projectId).DeleteObject(objectId, client);
    return success
  }

  /**
   * return the data of a given object
   * @param projectId the id of the project that the object is in
   * @param objectId the Id of the object to delete
   * @returns the object
   */
  public static ReadObject(projectId:string, objectId:string){
    return this._RoomList.find(element => element.GetRoomCode() == projectId).ReadObject(objectId);
  }

  /**
   * checkout an object, iff the client is allowed to check it out
   * @param projectId the Id of the project that the object is in
   * @param objectId the Id of the  object to check out
   * @param client the Id of the client who wants to check out the object
   * @returns success
   */
  public static checkoutObject(projectId: string, objectId: string, client: string){
    //"user" is going to stand as the "client" used to keep tack of CheckIn/Out
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.checkoutObject(objectId, client);
  }

  /**
   * check in an object iff the client is allowed to check out the object
   * @param projectId the project the object is in
   * @param objectId the object to be checked in
   * @param client the client who is trying to check in the object
   * @returns success
   */
  public static checkinObject(projectId: string, objectId: string,  client: string){
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.checkinObject(objectId, client)
  }


  // Avatar Section
  /**
     * update an Avatar, iff client is allowed to check out
     * @param AvatarToUpdate Avatar to update
     * @param projectId id of the project the Avatar is in
     * @param client the client who is trying to update the Avatar
     * @return success
     */
  public static updateAvatar(AvatarToUpdate: FlowAvatar, projectId: string, client:string){
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.updateAvatar(AvatarToUpdate, client)
  }

  /**
     * add an Avatar to a specific room
     * @param AvatarToCreate 
     * @param projectId 
     * @returns success
     */
  public static AddAvatar(AvatarToCreate: FlowAvatar, projectId:string){
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.AddAvatar(AvatarToCreate)
  }

    /**
     * Get Avatar List
     */
  public static GetAvatarList(projectId:string){
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.GetAvatarList()
  }

  /**
     * delete an Avatar from the Fast Access State Tracker
     * @param projectId the id of the project from which to delete the obejct
     * @param AvatarId the Id of the Avatar to delete
     * @param client the client who wants to delete the Avatar
     * @returns success
     */
  public static DeleteAvatar(projectId: string, AvatarId: string, client:string){
    let success = this._RoomList.find(element => element.GetRoomCode() == projectId).DeleteAvatar(AvatarId, client);
    return success
  }

  // /**
  //  * return the data of a given Avatar
  //  * @param projectId the id of the project that the Avatar is in
  //  * @param AvatarId the Id of the Avatar to delete
  //  * @returns the Avatar
  //  */
  // public static ReadAvatar(projectId:string, AvatarId:string){
  //   return this._RoomList.find(element => element.GetRoomCode() == projectId).ReadAvatar(AvatarId);
  // }

  // /**
  //  * checkout an Avatar, iff the client is allowed to check it out
  //  * @param projectId the Id of the project that the Avatar is in
  //  * @param AvatarId the Id of the  Avatar to check out
  //  * @param client the Id of the client who wants to check out the Avatar
  //  * @returns success
  //  */
  // public static checkoutAvatar(projectId: string, AvatarId: string, client: string){
  //   let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
  //   return room.checkoutAvatar(AvatarId, client);
  // }

  //   END OF AVATAR SECTION

  // Visual Scripting Graph section

  /**
   * update a graph, iff client is allowed to check out
   * @param vsGraphToUpdate graph to update
   * @param projectId id of the project the graph is in
   * @param client the client who is trying to update the graph
   * @return success
   */
  public static updateVSGraph(vsGraphToUpdate: FlowVSGraph, projectId: string, client:string){
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.updateVSGraph(vsGraphToUpdate, client)
  }

  /**
   * add a graph to a specific room
   * @param vsGraphToCreate 
   * @param projectId 
   * @returns success
   */
  public static AddVSGraph(vsGraphToCreate: FlowVSGraph, projectId:string){
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.AddVSGraph(vsGraphToCreate)
  }

  /**
   * delete a graph from the Fast Access State Tracker
   * @param projectId the id of the project from which to delete the graph
   * @param vsGraphId the Id of the graph to delete
   * @param client the client who wants to delete the graph
   * @returns success
   */
  public static DeleteVSGraph(projectId: string, vsGraphId: string, client:string){
    let success = this._RoomList.find(element => element.GetRoomCode() == projectId).DeleteVSGraph(vsGraphId, client);
    return success
  }

  /**
   * return the data of a given graph
   * @param projectId the id of the project that the graph is in
   * @param vsGraphId the Id of the graph to read
   * @returns the graph
   */
  public static ReadVSGraph(projectId:string, vsGraphId:string){
    return this._RoomList.find(element => element.GetRoomCode() == projectId).ReadVSGraph(vsGraphId);
  }

  // /**
  //  * checkout a graph, iff the client is allowed to check it out
  //  * @param projectId the Id of the project that the graph is in
  //  * @param vsGraphId the Id of the graph to check out
  //  * @param client the Id of the client who wants to check out the graph
  //  * @returns success
  //  */
  // public static checkoutVSGraph(projectId: string, vsGraphId: string, client: string){
  //   let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
  //   return room.checkoutVSGraph(vsGraphId, client);
  // }

  // /**
  //  * check in a graph iff the client is allowed to check out the graph
  //  * @param projectId the project the graph is in
  //  * @param vsGraphId the graph to be checked in
  //  * @param client the client who is trying to check in the graph
  //  * @returns success
  //  */
  // public static checkinVSGraph(projectId: string, vsGraphId: string,  client: string){
  //   let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
  //   return room.checkinVSGraph(vsGraphId, client)
  // }

  /**
   * checkout a nodeview, iff the client is allowed to check it out
   * @param projectId the Id of the project that the nodeview is in
   * @param nodeGUID the Id of the nodeview to check out
   * @param client the Id of the client who wants to check out the graph
   * @returns success
   */
   public static checkoutNodeView(projectId: string, flowNodeView: FlowNodeView, client: string){
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.checkoutNodeView(flowNodeView, client);
  }

  /**
   * check in a NodeView iff the client is allowed to check out the NodeView
   * @param projectId the project the graph is in
   * @param nodeGUID the nodeGUID to be checked in
   * @param client the client who is trying to check in the NodeView
   * @returns success
   */
  public static checkinNodeView(projectId: string, nodeGUID: string,  client: string){
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.checkinNodeView(nodeGUID, client)
  }

  /**
   * return the data of a given nodeview
   * @param projectId the id of the project that the nodeview is in
   * @param nodeGUID the Id of the nodeview to read
   * @returns the nodeview
   */
   public static ReadNodeView(projectId:string, nodeGUID:string){
    return this._RoomList.find(element => element.GetRoomCode() == projectId).ReadNodeView(nodeGUID);
  }

  /**
   * update a nodeview, iff client is allowed to check out
   * @param nodeViewToUpdate nodeview to update
   * @param projectId id of the project the nodeview is in
   * @param client the client who is trying to update the nodeview
   * @return success
   */
   public static updateNodeView(nodeViewToUpdate: FlowNodeView, projectId: string, client:string){
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.updateNodeView(nodeViewToUpdate, client)
  }

}