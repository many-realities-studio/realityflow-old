import { IStringable } from "./IStringable";
import { MongooseDatabase } from "../Database/MongooseDatabase";
import { FlowProject } from "../../temp";
import { FlowClient } from "./FlowClient";
import { ConfigurationSingleton } from "../ConfigurationSingleton";

export class FlowUser implements IStringable
{
  // ID used by FAM for unique identification
  public Id : number;
  public ClientList : Array<FlowClient> = [];
  
  // Data storage fields
  public Username: string;
  public Password: string;
  public Clients: Array<FlowClient>;
  public Projects: Array<FlowProject>;

  constructor(json:any){
      this.Username = json.Username;
      this.Password = json.Password;
  }
  ToString() : string 
  {
    throw new Error("Method not implemented.");
  }

  /**
   * Saves this user to the database
   */
  public SaveToDatabase() : void
  {
    ConfigurationSingleton.Database.UpdateUser(this);
  }

  /**
   * Saves the connection information
   * @param websocketConnection 
   */
  public Login(websocketConnection : WebSocket) : void
  {
    this.ClientList.push(websocketConnection);
  }

  /**
   * Deletes the connection information
   * @param websocketConnection 
   */
  public Logout(connection : WebSocket) : void
  {
    const index = this.ClientList.findIndex((element) => element == connection);

    var ClosedConnection : WebSocket = null;
    if(index > -1)
    {
      ClosedConnection = this.ClientList.splice(index, 1)[0];
    }
  }

  /**
   * Deletes this user from the database
   */
  public Delete() : void
  {
    ConfigurationSingleton.Database.DeleteUser(this);
  }
}