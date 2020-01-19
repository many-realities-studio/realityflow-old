/**
 * This file serves as the container for the different message types 
 * that can be received. Each class is its own message type, 
 * each of which has a single method allowing said command to 
 * be executed with the JSON data provided.
 */

import { FlowConversion } from "../FlowLibrary/FlowConversion";
import { StateTracker } from "../StateTracker";
import { ConnectionManager } from "../ConnectionManager";
import { FlowProject } from "../FlowLibrary/FlowProject";
import { FlowUser } from "../FlowLibrary/FlowUser";
import { MessageBuilder } from "./MessageBuilder";

interface ICommand
{
  ExecuteCommand(data: any, connection: WebSocket) : void;
}

// Project Commands

class Command_CreateProject implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): void 
  {
    let project : FlowProject= FlowConversion.ConvertToFlowProject(data);
    
    StateTracker.CreateProject(project);

    let userConnected : FlowUser = ConnectionManager.FindUserWithConnection(connection);
    // TODO: Form message
    let returnMessage = MessageBuilder.CreateMessage();
    ConnectionManager.SendMessage(returnMessage, [userConnected]);
  }
}

class Command_DeleteProject implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): void 
  {
    let project = FlowConversion.ConvertToFlowProject(data);
    
    StateTracker.DeleteProject(project);
  }
}

// TODO: Find out what this is supposed to do
class Command_OpenProject implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): void 
  {
    let project = StateTracker.OpenProject(data.id)

    let userConnected : FlowUser = ConnectionManager.FindUserWithConnection(connection);
    // send flowproject, not the string?
    ConnectionManager.SendMessage(project.ToString(), [userConnected]);
  }
}

// User Commands

class Command_CreateUser implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): void 
  {
    let user = FlowConversion.ConvertToFlowUser(data);
    
    StateTracker.CreateUser(user);
  }
}

class Command_DeleteUser implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): void 
  {
    let user = FlowConversion.ConvertToFlowUser(data);
    StateTracker.DeleteUser(user);
  }
}
 
class Command_LoginUser implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): void 
  {
    let user = FlowConversion.ConvertToFlowUser(data);
    StateTracker.LoginUser(user, connection);
  }
}

class Command_LogoutUser implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): void 
  {
    let user = FlowConversion.ConvertToFlowUser(data);
    StateTracker.LogoutUser(user);
  }
}

// Room Commands

class Command_CreateRoom implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): void  
  {
    // grab the projectID from the JSON, confirm format
    //TODO: ensure the message json is being extracted properly 
    let projectID = data.projectID;
    let userConnected : FlowUser = ConnectionManager.FindUserWithConnection(connection)
    // send confirmation message & room code to client
    let roomCode = StateTracker.CreateRoom(projectID);
    // error catch
    if(roomCode) 
    {
      let roomMessage = MessageBuilder.CreateMessage(roomCode);
      ConnectionManager.SendMessage(roomMessage, [userConnected])
    } else 
    {
      let failMessage = MessageBuilder.FailureMessage();
      ConnectionManager.SendMessage(failMessage, [userConnected])
    }

  }
}

class Command_JoinRoom implements ICommand
{
  ExecuteCommand(data: any, connection: Websocket): void
  {
    let userConnected : FlowUser = ConnectionManager.FindUserWithConnection(connection);
    //TODO: Ensure proper JSON recieval
    let roomCode = data.roomCode;
    //error catch 
    if(roomCode)
    {
      StateTracker.JoinRoom(roomCode, userConnected);
      //send success message to user
      let successMessage = MessageBuilder.SuccessMessage();
      ConnectionManager.SendMessage(successMessage, [userConnected])
    } else 
    {      
      //send fail message to user
      let failMessage = MessageBuilder.FailMessage();
      ConnectionManager.SendMessage(failMessage, [userConnected])
    }
  }
}

class Command_DeleteRoom implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): void  
  {
    throw new Error("Method not implemented.");
  }
}

// Object Commands

class Command_CreateObject implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): void  
  {
    let flowObject = FlowConversion.ConvertToFlowObject(data);

    StateTracker.CreateObject(flowObject);
  }
}

class Command_DeleteObject implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): void  
  {
    let flowObject = FlowConversion.ConvertToFlowObject(data);

    StateTracker.DeleteObject(flowObject);
  }
}

class Command_UpdateObject implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): void  
  {
    let flowObject = FlowConversion.ConvertToFlowObject(data);

    StateTracker.UpdateObject(flowObject);
  }
}

/**
 * Holds the set of commands that can be executed and executes said commands 
 * with the provided data (JSON)
 */
export class CommandContext
{
  private _CommandList: Map<string, ICommand> = new Map<string, ICommand>();
  
  public CommandContext()
  {
    // Project Commands
    this._CommandList.set("CreateProject", new Command_CreateProject());
    this._CommandList.set("DeleteProject", new Command_DeleteProject());
    this._CommandList.set("OpenProject", new Command_OpenProject());

    // User Commands
    this._CommandList.set("CreateUser", new Command_CreateUser());
    this._CommandList.set("DeleteUser", new Command_DeleteUser());
    this._CommandList.set("LoginUser", new Command_LoginUser());
    this._CommandList.set("LogoutUser", new Command_LogoutUser());

    // Room Commands
    this._CommandList.set("CreateRoom", new Command_CreateRoom());
    this._CommandList.set("DeleteRoom", new Command_DeleteRoom());
    this._CommandList.set("JoinRoom", new Command_JoinRoom());

    // Object Commands
    this._CommandList.set("CreateObject", new Command_CreateObject());
    this._CommandList.set("DeleteObject", new Command_DeleteObject());
    this._CommandList.set("UpdateObject", new Command_UpdateObject());
  }

  /**
   * Executes the desired command
   * @param commandToExecute The command to be executed
   * @param data The data which is needed for the command to execute.
   */
  ExecuteCommand(commandToExecute: string, data: any, connection: WebSocket) : void
  {
    this._CommandList.get(commandToExecute).ExecuteCommand(data, connection);
  }
}