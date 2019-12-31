import { FlowUser } from "./FlowLibrary/FlowUser";
import { FlowProject } from "./FlowLibrary/FlowProject";

// Look into Pub/Sub architecture
export class Room
{
  private _UsersCurrentlyInTheRoom: Array<FlowUser> = [];
  private _RoomCode: Number;
  private _CurrentProject: FlowProject;

  public Room(roomCode : Number, project: FlowProject)
  {
    this._RoomCode = roomCode;
    this._CurrentProject = project;
  }

  // Notifies all users in the room to a change
  public NotifyUsersOfChange(changeType: string, data: ) : void
  {
    throw console.error("Method not implemented");
    
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

  // TODO: implement functionality
  public GetProject() : FlowProject
  {
    console.error("Not implmented: GetProject() in Room.ts");
    
    return null;
  }
}