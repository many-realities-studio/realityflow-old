import { Room } from "./Room";
import { FlowObject } from "./FlowLibrary/FlowObject";
import { FlowBehaviour } from "./FlowLibrary/FlowBehaviour";

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
   */
  public static CreateRoom(projectID : string) : string
  {
    let newRoom = new Room(projectID);
    
    this._RoomList.push(newRoom);
    this._RoomCount++;
    
    return projectID;
  }

  // TODO: Finished: yes Tested: yes
  /**
   * Searches all active rooms for a room with an associated room code
   * If found, the room with said room code is returned. Otherwise, 
   * FindRoom returns undefined
   * @param roomCode 
   */
  public static FindRoom(roomCode: string) : Room
  {
    return this._RoomList.find(element => element.GetRoomCode() == roomCode);
  }

  // TODO: Finished: Yes Tested: yes 
  /**
   * @param roomCode the code of the room to destroy
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
   */
  public static getClients(roomCode: string){

    let room = this.FindRoom(roomCode);
    return room.getClients();
  }

  public static updateObject(objectToUpdate: FlowObject, projectId: string, client:string){
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.updateObject(objectToUpdate, client)
  }

  public static updateBehaviour(BehaviourToUpdate: FlowBehaviour, projectId: string, client:string){
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.updateBehaviour(BehaviourToUpdate, client)
  }

  public static AddObject(objectToCreate: FlowObject, projectId:string){
    return this._RoomList.find(element => element.GetRoomCode() == projectId).AddObject(objectToCreate)
  }

  public static DeleteObject(projectId: string, objectId: string, client:string){
    let success = this._RoomList.find(element => element.GetRoomCode() == projectId).DeleteObject(objectId, client);
    return success
  }

  public static ReadObject(projectId:string, objectId:string){
    return this._RoomList.find(element => element.GetRoomCode() == projectId).ReadObject(objectId);
  }

  public static checkoutObject(projectId: string, objectId: string, client: string){
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.checkoutObject(objectId, client);
  }

  public static checkinObject(projectId: string, objectId: string,  client: string){
    let room = this._RoomList.find(element => element.GetRoomCode() == projectId)
    return room.checkinObject(objectId, client)
  }

}