import { FlowUser } from "./FlowLibrary/FlowUser";
import { FlowProject } from "./FlowLibrary/FlowProject";

import { MongooseDatabase } from "./Database/MongooseDatabase";
import { FlowClient } from "./FlowLibrary/FlowClient";

// Look into Pub/Sub architecture
export class Room
{
  private _UsersCurrentlyInTheRoom: Array<FlowUser> = [];
  private _CurrentProject: FlowProject;
  private _CurrentProjectId: String;

  constructor(projectID: String)
  {
    this._CurrentProjectId = projectID;
    
    MongooseDatabase.GetProject(this._CurrentProjectId).then((project) =>{
      this._CurrentProject = project;
    })
  }

  // FIXME: code to notify Users of change should be happening somewhere else, probably
  // Notifies all users in the room to a change
  public NotifyUsersOfChange(data: string) : void
  {
    // ConnectionManager.SendMessage(data, this._UsersCurrentlyInTheRoom);    
  }

  /**
   * Adds the desired user to the list of users in the room
   * @param userJoiningTheRoom the user that will be joining the room
   * @param clientJoiningTheRoom the client that the user is using
   */
  public JoinRoom(userJoiningTheRoom: FlowUser, clientJoiningTheRoom: FlowClient) : void
  {
    let user = this._UsersCurrentlyInTheRoom.find(element => element.Id == userJoiningTheRoom.Id)

    //user is not already in this room
    if(user == undefined){
      this._UsersCurrentlyInTheRoom.push(userJoiningTheRoom);
    }
    // user is already in this room
    else{
      user.ActiveClients.push(clientJoiningTheRoom)
    }
  }

  public LeaveRoom(userLeavingTheRoom: FlowUser, clientLeavingTheRoom: FlowClient){
    let userIndex = this._UsersCurrentlyInTheRoom.findIndex(element => element.Id == userLeavingTheRoom.Id)

    //user is already not in this room
    if(userIndex == -1){
      return;
    }
    // user is already in this room
    else{
      let clientIndex = this._UsersCurrentlyInTheRoom[userIndex].ActiveClients.findIndex(element => element.Id == clientLeavingTheRoom.Id)
      this._UsersCurrentlyInTheRoom[userIndex].ActiveClients.splice(clientIndex, 1)
      
      //if the user doesn't have any more active clients, then remove user from the room
      if(this._UsersCurrentlyInTheRoom[userIndex].ActiveClients.length == 0)
        this._UsersCurrentlyInTheRoom.splice(userIndex, 1)
      
    }

  }

  /**
   * Gets the room code of this room
   */
  public GetRoomCode() : String
  {
    return this._CurrentProjectId;
  }


  /**
   * Gets the project that is currently being used by the project
   * Calls to database, use in Async manner
   */
  public GetProject() : FlowProject
  {
    return this._CurrentProject; 
  }
}