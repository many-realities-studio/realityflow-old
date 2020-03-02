import { CommandContext } from "./CommandContext";
import WebSocket = require("ws");
import { ServerEventDispatcher } from '../../server';

export class NewMessageProcessor
{
  private static _CommandContext : CommandContext = new CommandContext();

  public static ParseMessage(socketId : String, json: any) : any
  {    
    let response = this._CommandContext.ExecuteCommand(socketId, json);

    return response;
  }
}