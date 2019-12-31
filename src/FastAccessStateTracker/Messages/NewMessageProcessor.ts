import { CommandContext } from "./CommandContext";

export class NewMessageProcessor
{
  private static _CommandContext : CommandContext = new CommandContext();

  public static ParseMessage(json: any)
  {    
    let commandToExecute : string = json.command;
    this._CommandContext.ExecuteCommand(commandToExecute, json);
  }
}