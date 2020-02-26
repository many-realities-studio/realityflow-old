import { IStringable } from "./IStringable";


import { FlowClient } from "./FlowClient";
import { FlowProject } from "./FlowProject";
import WebSocket = require("ws");


export class FlowUser implements IStringable
{
  // ID used by FAM for unique identification
  public Id : number;
  public ActiveClients : Array<WebSocket> = [];
  public RoomCode: number;
  
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

  public toString(){
    return JSON.stringify({
      Id: this.Id,
      ClientList: this.ActiveClients,
      RoomCode: this.RoomCode,
      Username: this.Username,
      Clients: this.Clients,
      Projects: this.Projects
    })
  }

  /**
   * Saves the connection information
   * @param websocketConnection 
   */
  public Login(websocketConnection : WebSocket) : void
  {
    this.ActiveClients.push(websocketConnection);
  }

  /**
   * Deletes the connection information
   * @param websocketConnection 
   */
  public Logout(connection : WebSocket) : void
  {
    const index = this.ActiveClients.findIndex((element) => element == connection);

    var ClosedConnection : WebSocket = null;
    if(index > -1)
    {
      ClosedConnection = this.ActiveClients.splice(index, 1)[0];
    }
  }

  /**
   * @projectToAdd : Flow Project to include in user array
   */
  public addProject(projectToAdd: FlowProject) : void 
  {
    this.Projects.push(projectToAdd);
  }


}