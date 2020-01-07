import { IStringable } from "./IStringable";
import { MongooseDatabase } from "../Database/MongooseDatabase";

export class FlowUser implements IStringable
{
  // ID used by FAM for unique identification
  public id : number;
  public connectionList : Array<WebSocket> = [];
  
  ToString() : string 
  {
    throw new Error("Method not implemented.");
  }

  /**
   * Saves this user to the database
   */
  public SaveToDatabase() : void
  {
    MongooseDatabase.UpdateUser(this);
  }

  /**
   * Saves the connection information
   * @param websocketConnection 
   */
  public Login(websocketConnection : WebSocket) : void
  {
    this.connectionList.push(websocketConnection);
  }

  /**
   * Deletes the connection information
   * @param websocketConnection 
   */
  public Logout(connection : WebSocket) : void
  {
    const index = this.connectionList.findIndex((element) => element == connection);

    var ClosedConnection : WebSocket = null;
    if(index > -1)
    {
      ClosedConnection = this.connectionList.splice(index, 1)[0];
    }
  }

  /**
   * Deletes this user from the database
   */
  public Delete() : void
  {
    MongooseDatabase.DeleteUser(this);
  }
}