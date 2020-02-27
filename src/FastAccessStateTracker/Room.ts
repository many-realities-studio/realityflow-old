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

  // TODO: finished: no tested: no
  // I think I want to have strings passed to these
 
  /**
   * Adds the desired user to the list of users in the room
   * @param userJoiningTheRoom the user that will be joining the room
   * @param clientJoiningTheRoom the client that the user is using
   */
  public JoinRoom(userJoiningTheRoom: FlowUser, clientJoiningTheRoom: String) : void
  {
    let user = this._UsersCurrentlyInTheRoom.find(element => element.Username == userJoiningTheRoom.Username)

    //user is not already in this room
    if(user == undefined){
      this._UsersCurrentlyInTheRoom.push(userJoiningTheRoom);
    }
    
    user.ActiveClients.push(clientJoiningTheRoom)
    
  }

  // TODO: finished: yes? tested: no
  /**
   * removes a client from a room - if that client was the only one using those credentials,
   * the room stops keeping track of that username
   * @param UserName username of the client leaving the room
   * @param ClientId client id of the client leaving the room
   */
  public LeaveRoom(UserName: String, ClientId: String){
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

  // TODO: finished: yes? tested: no
  /**
   * returns whether or not any client using this given username is in here
   * @param username username to search for
   */
  public hasUser(username: String){
    let retval = (this._UsersCurrentlyInTheRoom.find(element => element.Username == username) != undefined)
    return retval
  }


  // TODO: finished: yes tested: no
  /**
   * Gets the room code of this room
   */
  public GetRoomCode() : String
  {
    return this._CurrentProjectId;
  }

  // TODO: finished: yes tested: no
  /**
   * Gets the project that is currently being used by the project
   * Calls to database, use in Async manner
   */
  public GetProject() : FlowProject
  {
    return this._CurrentProject; 
  }
}