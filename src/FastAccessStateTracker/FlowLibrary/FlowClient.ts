import WebSocket = require("ws");

export class FlowClient
{
  public Connection : WebSocket;

  // Data fields
  public Id : string;
  public UserId : string;
  public DeviceType: number;
  
  constructor(clientJson: any, connection: WebSocket)
  {
    this.Connection = connection;
    this.UserId = clientJson.user.Id;
    this.DeviceType = clientJson.DeviceType;
  }
}