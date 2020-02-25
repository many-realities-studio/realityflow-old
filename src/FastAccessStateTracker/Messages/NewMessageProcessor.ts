import { CommandContext } from "./CommandContext";
import WebSocket = require("ws");


export class NewMessageProcessor
{
  private static _CommandContext : CommandContext = new CommandContext();

  public static ParseMessage(json: any, connection: WebSocket) : void
  {    
    let commandToExecute : string = json.command;
    return this._CommandContext.ExecuteCommand(commandToExecute, json, connection);
  }
}