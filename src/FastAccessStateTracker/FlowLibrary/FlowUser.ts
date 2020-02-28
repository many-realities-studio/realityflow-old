

import { FlowClient } from "./FlowClient";

export class FlowUser
{
  // ID used by FAM for unique identification
  public Id : number;
  public ActiveClients : Array<string> = [];
  public RoomCode: number;
  
  // Data storage fields
  public Username: string;
  public Clients: Array<FlowClient>;
  public Projects: Array<string>;

  constructor(json:any){
      this.Username = json.Username;

  }
  public tostring(){
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
   * @param newClientLogin 
   */
  public Login(newClientLogin : string) : void
  {
    this.ActiveClients.push(newClientLogin);
  }

  /**
   * Deletes the connection information
   * @param client 
   */
  public Logout(client : string) : void
  {
    const index = this.ActiveClients.findIndex((element) => element == client);

    var ClosedConnection : string = null;
    if(index > -1)
    {
      ClosedConnection = this.ActiveClients.splice(index, 1)[0];
    }
  }

  /**
   * @projectToAdd : Flow Project to include in user array
   */
  public addProject(projectIdToAdd: string) : void 
  {
    this.Projects.push(projectIdToAdd);
  }


}