export class FlowClient
{
  public Connection : WebSocket;

  constructor(connection: WebSocket)
  {
    this.Connection = connection;
  }
}