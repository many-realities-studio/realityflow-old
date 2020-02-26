

import { FlowClient } from "./FlowClient";

export class FlowUser
{
  // ID used by FAM for unique identification
  public Id : number;
  public ActiveClients : Array<FlowClient> = [];
  public RoomCode: number;
  
  // Data storage fields
  public Username: string;
  public Password: string;
  public Clients: Array<FlowClient>;
  public Projects: Array<String>;

  constructor(json:any){
      this.Username = json.Username;
      this.Password = json.Password;
  }
  public toString(){
    return JSON.stringify({
      Id: this.Id,
      ActiveClients: this.ActiveClients,
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
  public Login(newClientLogin : FlowClient) : void
  {
    this.ActiveClients.push(newClientLogin);
  }

  /**
   * Deletes the connection information
   * @param websocketConnection 
   */
  public Logout(connection : FlowClient) : void
  {
    const index = this.ActiveClients.findIndex((element) => element == connection);

    var ClosedConnection : FlowClient = null;
    if(index > -1)
    {
      ClosedConnection = this.ActiveClients.splice(index, 1)[0];
    }
  }

  /**
   * @projectToAdd : Flow Project to include in user array
   */
  public addProject(projectIdToAdd: String) : void 
  {
    this.Projects.push(projectIdToAdd);
  }


}