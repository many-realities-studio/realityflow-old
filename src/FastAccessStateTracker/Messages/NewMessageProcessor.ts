import { CommandContext } from "./CommandContext";
import WebSocket = require("ws");

export class NewMessageProcessor
{
  private static _CommandContext : CommandContext = new CommandContext();

  public static ParseMessage(json: any, connection: WebSocket) : void
  {    
    let commandToExecute : string = json.command;
    //EDIT THIS TO RETURN JSON
    //ignore command to execute
    this._CommandContext.ExecuteCommand(commandToExecute, json);
  }
}