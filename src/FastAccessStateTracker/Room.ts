import { FlowUser } from "./FlowLibrary/FlowUser";
import { FlowProject } from "./FlowLibrary/FlowProject";
import { ConnectionManager } from "./ConnectionManager";
import { MongooseDatabase } from "./Database/MongooseDatabase";

// Look into Pub/Sub architecture
export class Room
{
  private _UsersCurrentlyInTheRoom: Array<FlowUser> = [];
  private _CurrentProject: FlowProject;
  private _CurrentProjectId: Number;

  constructor(projectID: Number)
  {
    this._CurrentProjectId = projectID;
    
    MongooseDatabase.GetProject(this._CurrentProjectId).then((project) =>{
      this._CurrentProject = project;
    })
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