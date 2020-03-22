export class FlowClient
{

  // Data fields
  public Id : string;
  public UserId : string;
  public DeviceType: number;
  
  constructor(clientJson: any)
  {
    
    this.Id = clientJson.Id;
    this.UserId = clientJson.user.Id;
    this.DeviceType = clientJson.DeviceType;
  }
}