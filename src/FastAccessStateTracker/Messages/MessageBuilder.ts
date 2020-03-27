
export class MessageBuilder
{
  
  public static CreateMessage( payload : any, clients: string[]) : [string, Array<string>]
  {
    let returnPayload = JSON.stringify(payload)
    
    return [returnPayload, clients]
  }
}