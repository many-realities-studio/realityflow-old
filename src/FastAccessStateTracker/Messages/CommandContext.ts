/**
 * This file serves as the container for the different message types 
 * that can be received. Each class is its own message type, 
 * each of which has a single method allowing said command to 
 * be executed with the JSON data provided.
 */
import { StateTracker } from "../StateTracker";
import { ConnectionManager } from "../ConnectionManager";

import { FlowProject } from "../FlowLibrary/FlowProject";
import { FlowUser } from "../FlowLibrary/FlowUser";
import { FlowObject } from "../FlowLibrary/FlowObject";

import { MessageBuilder } from "./MessageBuilder";

import WebSocket = require("ws");
import MongooseDatabase from "../Database/MongooseDatabase";


interface ICommand
{
  ExecuteCommand(data: any, connection: WebSocket) : void;
}

// Project Commands

class Command_CreateProject implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): string 
  {
    let project : FlowProject = new FlowProject(data);
    
    let userConnected : FlowUser = ConnectionManager.FindUserWithConnection(connection);
    
    StateTracker.CreateProject(project, userConnected);

    // Create Project only requires a success message being sent
    //TODO: Ensure success before sending success message
    let returnMessage = MessageBuilder.SuccessMessage("CreateProject");
    
    return returnMessage;
  }
}

class Command_DeleteProject implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): string 
  {
    let project = new FlowProject(data);
    let userConnected : FlowUser = ConnectionManager.FindUserWithConnection(connection);
    StateTracker.DeleteProject(project);
    
    let returnMessage = MessageBuilder.SuccessMessage("DeleteProject");

    return returnMessage;
  }
}

// TODO: Find out what this is supposed to do
class Command_OpenProject implements ICommand
{
  async ExecuteCommand(data: any, connection: WebSocket): Promise<string>
  {
    
    let project = await StateTracker.OpenProject(data.ProjectId, data.UserId)

    return project.toString()
  }
}

// User Commands

class Command_CreateUser implements ICommand
{
  async ExecuteCommand(data: any, connection: WebSocket): Promise<string> 
  {
    let user = new FlowUser(data);

    // create boolean if message was sent
    let success = await StateTracker.CreateUser(user);
    let returnMessage = ""
    
    if(success)
    {
      returnMessage = MessageBuilder.SuccessMessage("CreateUser");
    } else 
    {
      returnMessage = MessageBuilder.FailureMessage("CreateUser");
    }
    
    return returnMessage;


  }
}

class Command_DeleteUser implements ICommand
{
  async ExecuteCommand(data: any, connection: WebSocket): Promise<void> 
  {
    let user = new FlowUser(data);
    await StateTracker.DeleteUser(user, connection);
  }
}
 
class Command_LoginUser implements ICommand
{
  async ExecuteCommand(data: any, connection: WebSocket): Promise<string> 
  {
    let user = new FlowUser(data);
    let success = await StateTracker.LoginUser(user, connection);
    let returnMessage = ""

    if(success)
    {
      returnMessage = MessageBuilder.SuccessMessage("LoginUser");
    } else 
    {
      returnMessage = MessageBuilder.FailureMessage("LoginUser");
    }
    
    return returnMessage;
  }
}

class Command_LogoutUser implements ICommand
{
  async ExecuteCommand(data: any, connection: WebSocket): Promise<string> 
  {
    let user = new FlowUser(data);
    StateTracker.LogoutUser(user, connection);
    let returnMessage = MessageBuilder.SuccessMessage("LogoutUser");
    
    return returnMessage;
  }
}

// Room Commands

class Command_CreateRoom implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): void  
  {
    // grab the projectID from the JSON, confirm format
    // TODO: ensure the message json is being extracted properly 
    let projectID = data.projectID;
    let userConnected : FlowUser = ConnectionManager.FindUserWithConnection(connection)

    // send confirmation message & room code to client
    let roomCode = StateTracker.CreateRoom(projectID);
    let returnMessage;

    // error catch
    if(roomCode) 
    {
      let returnMessage = MessageBuilder.CreateMessage(roomCode.toString());
      
    } else 
    {
      let returnMessage = MessageBuilder.FailureMessage("CreateRoom");
      
    }
    return returnMessage;
  }
}

class Command_JoinRoom implements ICommand
{
  async ExecuteCommand(data: any, connection: WebSocket): Promise<string>
  {
    let userConnected : FlowUser = ConnectionManager.FindUserWithConnection(connection);
    //TODO: Ensure proper JSON recieval
    let roomCode = data.roomCode;
    let messages: String[];
    let returnMessage; 
    //error catch 
    if(roomCode)
    {
      let project = StateTracker.JoinRoom(roomCode, userConnected);
      //send success message to user
      let successMessage = MessageBuilder.SuccessMessage("JoinRoom");
      
      messages.push(successMessage, project.toString());

      returnMessage = MessageBuilder.CreateMessage(messages);
      
    } else 
    {      
      //send fail message to user
      returnMessage = MessageBuilder.FailureMessage("JoinRoom");
      
    }

    return returnMessage;
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
  ExecuteCommand(data: any, connection: WebSocket): string  
  {
    let flowObject = new FlowObject(data);
    let userConnected : FlowUser = ConnectionManager.FindUserWithConnection(connection);
    let successMessage = MessageBuilder.SuccessMessage("CreateObject");
    
    //TODO: Add failure check and message
    StateTracker.CreateObject(flowObject);
    
    return successMessage;
  }
}

class Command_DeleteObject implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): string  
  {
    let flowObject = new FlowObject(data);
    StateTracker.DeleteObject(flowObject);

    let userConnected : FlowUser = ConnectionManager.FindUserWithConnection(connection);
    let successMessage = MessageBuilder.SuccessMessage("DeleteObject");
    
    //TODO: Add failure check and message
    return successMessage;
  }
}

class Command_UpdateObject implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): string  
  {
    let flowObject = new FlowObject(data);
    StateTracker.UpdateObject(flowObject);
    let userConnected : FlowUser = ConnectionManager.FindUserWithConnection(connection);
    let successMessage = MessageBuilder.SuccessMessage("UpdateObject");
    
    //TODO: Add failure check and message
    return successMessage;
  }
}

class Command_FinalizedUpdateObject implements ICommand
{
  ExecuteCommand(data: any, connection: WebSocket): string
  {
    let flowObject = new FlowObject(data);
    StateTracker.FinalizedUpdateObject(flowObject);
    
    let userConnected : FlowUser = ConnectionManager.FindUserWithConnection(connection);
    let successMessage = MessageBuilder.SuccessMessage("FinalizedObjectUpdate");
    
    //TODO: Add failure check and message
    return successMessage;

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
    this._CommandList.set("FinalizedUpdateObject", new Command_FinalizedUpdateObject());
  }

  /**
   * Executes the desired command
   * @param commandToExecute The command to be executed
   * @param data The data which is needed for the command to execute.
   */
  ExecuteCommand(commandToExecute: string, data: any, connection: WebSocket) : any
  {
    return this._CommandList.get(commandToExecute).ExecuteCommand(data, connection);
  }
}