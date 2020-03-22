

import { FlowClient } from "./FlowClient";

export class FlowUser
{
  // used by FAM
  public ActiveClients : Array<string> = [];
  
  // Data storage fields
  public Username: string;
  public Projects: Array<string>;

  constructor(username: string, ActiveClients: Array<string> = [], Projects: Array<string> = [] ){
      this.Username = username;
      this.ActiveClients = ActiveClients;
      this.Projects = Projects

  }
  public tostring(){
    return JSON.stringify({
      ActiveClients: this.ActiveClients,

      Username: this.Username,
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