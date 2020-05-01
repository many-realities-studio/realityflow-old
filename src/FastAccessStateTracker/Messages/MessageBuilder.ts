
export class MessageBuilder
{
  /**
   * stringify the payload and then repackage it into a tuple
   * @param payload 
   * @param clients 
   */
  public static CreateMessage( payload : any, clients: string[]) : [string, Array<string>]
  {
    let returnPayload = JSON.stringify(payload)
    
    return [returnPayload, clients]
  }
}