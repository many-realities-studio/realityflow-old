import { FlowUser } from "./FlowLibrary/FlowUser";
import { FlowProject } from "./FlowLibrary/FlowProject";
import { ConnectionManager } from "./ConnectionManager";
import { MongooseDatabase } from "./Database/MongooseDatabase";

// Look into Pub/Sub architecture
export class Room
{
  private _UsersCurrentlyInTheRoom: Array<FlowUser> = [];
  private _RoomCode: Number;
  private _CurrentProjectID: Number;

  constructor(roomCode : Number, projectID: Number)
  {
    this._RoomCode = roomCode;
    this._CurrentProjectID = projectID;
  }

  // Notifies all users in the room to a change
  public NotifyUsersOfChange(data: string) : void
  {
    ConnectionManager.SendMessage(data, this._UsersCurrentlyInTheRoom);    
  }

  /**
   * Adds the desired user to the list of users in the room
   * @param userJoiningTheRoom the user that will be joining the room
   */
  public JoinRoom(userJoiningTheRoom: FlowUser) : void
  {

    this._UsersCurrentlyInTheRoom.push(userJoiningTheRoom);
  }

  /**
   * Gets the room code of this room
   */
  public GetRoomCode() : Number
  {
    return this._RoomCode;
  }

  /**
   * Gets the project that is currently being used by the project
   * Calls to database, use in Async manner
   */
  public GetProject() : FlowProject
  {
    return ConfigurationSingleton.Database.GetProject(this._CurrentProjectID); 
  }
}