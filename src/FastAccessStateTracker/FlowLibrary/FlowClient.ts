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
    this.UserId = clientJson.user.UserId;
    this.DeviceType = clientJson.DeviceType;
  }
}