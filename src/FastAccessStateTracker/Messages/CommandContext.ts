/**
 * This file serves as the container for the different message types 
 * that can be received. Each class is its own message type, 
 * each of which has a single method allowing said command to 
 * be executed with the JSON data provided.
 */

import { FlowConversion } from "../FlowLibrary/FlowConversion";
import { RoomManager } from "../RoomManager";
import { StateTracker } from "../StateTracker";

interface ICommand
{
  ExecuteCommand(data: any) : void;
}

// Project Commands

class Command_CreateProject implements ICommand
{
  ExecuteCommand(data: any): void 
  {
    let project = FlowConversion.ConvertToFlowProject(data);
    
    StateTracker.CreateProject(project);
  }
}

class Command_DeleteProject implements ICommand
{
  ExecuteCommand(data: any): void 
  {
    let project = FlowConversion.ConvertToFlowProject(data);
    
    StateTracker.DeleteProject(project);
  }
}

// TODO: Find out what this is supposed to do
class Command_OpenProject implements ICommand
{
  ExecuteCommand(data: any): void {
    throw new Error("Method not implemented.");
  }
}

// User Commands

class Command_CreateUser implements ICommand
{
  ExecuteCommand(data: any): void 
  {
    let user = FlowConversion.ConvertToFlowUser(data);
    
    StateTracker.CreateUser(user);
  }
}

class Command_DeleteUser implements ICommand
{
  ExecuteCommand(data: any): void 
  {
    let user = FlowConversion.ConvertToFlowUser(data);
    StateTracker.DeleteUser(user);
  }
}
 
class Command_LoginUser implements ICommand
{
  ExecuteCommand(data: any): void 
  {
    let user = FlowConversion.ConvertToFlowUser(data);
    StateTracker.LoginUser(user);
  }
}

class Command_LogoutUser implements ICommand
{
  ExecuteCommand(data: any): void 
  {
    let user = FlowConversion.ConvertToFlowUser(data);
    StateTracker.LogoutUser(user);
  }
}

// Room Commands
class Command_CreateRoom implements ICommand
{
  ExecuteCommand(data: any): void 
  {
    throw new Error("Method not implemented.");
  }
}

class Command_DeleteRoom implements ICommand
{
  ExecuteCommand(data: any): void {
    throw new Error("Method not implemented.");
  }
}

// Object Commands
class Command_CreateObject implements ICommand
{
  ExecuteCommand(data: any): void 
  {
    let flowObject = FlowConversion.ConvertToFlowObject(data);

    StateTracker.CreateObject(flowObject);
  }
}

class Command_DeleteObject implements ICommand
{
  ExecuteCommand(data: any): void 
  {
    let flowObject = FlowConversion.ConvertToFlowObject(data);

    StateTracker.DeleteObject(flowObject);
  }
}

class Command_UpdateObject implements ICommand
{
  ExecuteCommand(data: any): void 
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
  ExecuteCommand(commandToExecute: string, data: any) : void
  {
    this._CommandList.get(commandToExecute).ExecuteCommand(data);
  }
}