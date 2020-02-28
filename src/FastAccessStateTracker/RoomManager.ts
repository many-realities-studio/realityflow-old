import { Room } from "./Room";
import { FlowProject } from "./FlowLibrary/FlowProject";

// TODO: Make a check for how many people are in a room and delete the room if there is nobody inside
export class RoomManager
{
  // TODO: Why is this static
  public static _RoomList : Array<Room> = [];
  public static _RoomCount : number = 0;

  // TODO: finished: yes Tested: no
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

  // TODO: Finished: yes Tested: no
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

  // TODO: Finished: Yes Tested: No 
  /**
   * @param roomCode the code of the room to destroy
   */
  public static DestroyRoom(roomCode: string): void {
    let roomIndex = this._RoomList.findIndex(element => element.GetRoomCode() == roomCode)

    if(roomIndex > 0) {
      this._RoomList.splice(roomIndex, 1);
      this._RoomCount--;
    }
      

  }
}