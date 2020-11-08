import { CommandContext } from "./CommandContext";

export class NewMessageProcessor
{
  private static _CommandContext : CommandContext = new CommandContext();

  public static ParseMessage(socketId : string, json: any) : any
  {    
    let response = this._CommandContext.ExecuteCommand(json.MessageType, json, socketId);

    return response;
  }
}