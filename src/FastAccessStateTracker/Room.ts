import { FlowUser } from "./FlowLibrary/FlowUser";
import { FlowProject } from "./FlowLibrary/FlowProject";
import { ConnectionManager } from "./ConnectionManager";
import { MongooseDatabase } from "./Database/MongooseDatabase";

// Look into Pub/Sub architecture
export class Room
{
  private _UsersCurrentlyInTheRoom: Array<FlowUser> = [];
  private _RoomCode: Number;
  private _CurrentProject: FlowProject;

  constructor(roomCode : Number, project: FlowProject)
  {
    this._RoomCode = roomCode;
    this._CurrentProject = project;
  }

  // Notifies all users in the room to a change
  public NotifyUsersOfChange(data: string) : void
  {
    ConnectionManager.SendMessage(data, this._UsersCurrentlyInTheRoom);    
  }

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
   * Sets the current project to the desired project from the database
   * @param projectId 
   */
  public SetProject(projectId : number) : void
  {
    MongooseDatabase.GetProject(projectId);
  }

  /**
   * Gets the project that is currently being used by the project
   */
  public GetProject() : FlowProject
  {
    return this._CurrentProject;
  }
}