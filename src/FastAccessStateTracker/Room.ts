import { FlowUser } from "./FlowLibrary/FlowUser";
import { FlowProject } from "./FlowLibrary/FlowProject";

import { TypeORMDatabase } from "./Database/TypeORMDatabase";
import { FlowClient } from "./FlowLibrary/FlowClient";

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
   */
  public hasUser(username: string){
    let retval = (this._UsersCurrentlyInTheRoom.find(element => element.Username == username) != undefined)
    return retval
  }


  public hasClient(username: string, ClientId: string){
    let user = this._UsersCurrentlyInTheRoom.find(element => element.Username == username)
    return (this.hasUser(username) && user.ActiveClients.find(element => element == ClientId) != undefined)
  }

  // TODO: finished: yes tested: yes
  /**
   * Gets the room code of this room
   */
  public GetRoomCode() : string
  {
    return this._CurrentProjectId;
  }

  // TODO: finished: yes tested: yes
  /**
   * Gets the project that is currently being used by the project
   * Calls to database, use in Async manner
   */
  public GetProject() : FlowProject
  {
    return this._CurrentProject; 
  }

  // TODO: finished: yes tested: yes
  public getClients() : Map<string, Array<string> >{
    let clients: Map<string, Array<string> > = new Map()

    this._UsersCurrentlyInTheRoom.forEach( (user, index, arr) => clients.set(user.Username, user.ActiveClients))
    // console.log(clients.get("Yash"))
    return clients
  }

  public turnOnPlayMode() 
  {
    this.PlayMode = true;
  }
  public turnOffPlayMode()
  {
    this.PlayMode = false;
  }

}