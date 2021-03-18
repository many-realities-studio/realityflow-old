/**
 * This file serves as the container for the different message types 
 * that can be received. Each class is its own message type, 
 * each of which has a single method allowing said command to 
 * be executed with the JSON data provided.
 */
import { StateTracker } from "../StateTracker";

import { FlowProject } from "../FlowLibrary/FlowProject";
import { FlowObject } from "../FlowLibrary/FlowObject";
import { FlowBehaviour } from "../FlowLibrary/FlowBehaviour";
import { FlowVSGraph } from "../FlowLibrary/FlowVSGraph";

import { MessageBuilder } from "./MessageBuilder";

import { v4 as uuidv4 } from 'uuid';
import { ServerEventDispatcher } from "../../server";



interface ICommand
{
  ExecuteCommand(data: any, client: string) : Promise<[String, Array<String>]>;
}

// Project Commands

class Command_CreateProject implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]>
  {
    data.FlowProject.Id = uuidv4();

    let project : FlowProject = new FlowProject(data.FlowProject);

    let returnData = await StateTracker.CreateProject(project, data.FlowUser.Username, client);

    let message = returnData[0] == null ? "Failed to Create Project" : returnData[0];
      
    let returnContent = {
      "MessageType": "CreateProject",
      "WasSuccessful": returnData[0] == null ? false : true,
      "FlowProject": message
    }

    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])
    
    return returnMessage;
  }
}
/**
 * Read Project simply pulls in and returns Flow project data when given a project ID
 */
class Command_ReadProject implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]>
  {
    let returnData = await StateTracker.ReadProject(data.FlowProject.Id, client);
    let message = returnData[0] == null ? "Failed to Read Project" : returnData[0];

    let returnContent = {
      "MessageType": "ReadProject",
      "WasSuccessful": returnData[0] == null ? false : true,
      "FlowProject": message
    }

    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])

    return returnMessage;

  }
}

class Command_DeleteProject implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]>
  {

    let returnData = await StateTracker.DeleteProject(data.FlowProject.Id, data.FlowUser.Username, client);
    let returnContent = {
      "MessageType": "DeleteProject",
      "WasSuccessful": returnData[0],
    }
    
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])

    return returnMessage;
  }
}


class Command_OpenProject implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]>
  {
    
    let returnData = await StateTracker.OpenProject(data.ProjectId, data.FlowUser.Username, client);
    
    // notify others in the room that user has joined
    Command_OpenProject.SendRoomAnnouncement(returnData[2], "UserJoinedRoom");

    let returnContent = {
      "MessageType": "OpenProject",
      "WasSuccessful": returnData[0] == null ? false : true,
      "FlowProject": returnData[0]
    }

    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])

    return returnMessage;
  }

  static async SendRoomAnnouncement(roomBulletin: [String, Array<String>], messageType : string): Promise<void>
  {

    if(roomBulletin)
    {
      let roomMessage = roomBulletin[0];
      let message = {
        "MessageType": messageType,
        "Message": roomMessage,
      }

      let roomClients : Array<String> = roomBulletin[1];
      
      for(let i = 0; i < roomClients.length; i++)
      {
        let clientSocket = ServerEventDispatcher.SocketConnections.get(roomClients[i]);
        ServerEventDispatcher.send(JSON.stringify(message), clientSocket);
      }
    }
    
  }
}


class Command_FetchProjects implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]>
  {
    
    let returnData = await StateTracker.FetchProjects(data.FlowUser.Username, client);
    

    let message = returnData[0] == null ? "Failed to fetch projects" : returnData[0];

    let returnContent = {
      "MessageType": "FetchProjects",
      "WasSuccessful": returnData[0] == null ? false : true,
      "Projects": message
    }

    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])

    return returnMessage;
  }
}


class Command_LeaveProject implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]>
  {
    
    let returnData = await StateTracker.LeaveProject(data.ProjectId, data.FlowUser.Username, client);
    
    // notify others in the room that user has joined
    Command_OpenProject.SendRoomAnnouncement(returnData[2], "UserLeftRoom");

    let message = returnData[0] == false ? "Failed to Leave Project" : "Successfully Left Project";

    let returnContent = {
      "MessageType": "LeaveProject",
      "WasSuccessful": returnData[0]
    }

    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])

    return returnMessage;
  }
}


// // User Commands
//TODO: Make it such that the user is logged in when the account is created? 
class Command_CreateUser implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    let returnData = await StateTracker.CreateUser(data.FlowUser.Username, data.FlowUser.Password, client);
    let returnContent = {
      "MessageType": "CreateUser",
      "WasSuccessful": returnData[0]
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])
    
    return returnMessage;
  }
}

class Command_DeleteUser implements ICommand
{
  async ExecuteCommand(data: any): Promise<[String, Array<String>]>
  {
    let returnData = await StateTracker.DeleteUser(data.Username, data.Password);
    let returnContent = {
      "MessageType": "DeleteUser",
      "WasSuccessful": returnData[0]
    }

    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])
    return returnMessage
  }
}
 
class Command_LoginUser implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    let returnData = await StateTracker.LoginUser(data.FlowUser.Username, data.FlowUser.Password, client);
    
    let returnContent = {
      "MessageType": "LoginUser",
      "WasSuccessful": returnData[0],
      "Projects": returnData[2]
    };


    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1]);
    
    return returnMessage;
  }
}

class Command_LogoutUser implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    let returnData = await StateTracker.LogoutUser(data.FlowUser.Username, data.FlowUser.Password, client);
    let returnContent = {
      "MessageType": "LogoutUser",
      "WasSuccessful": returnData[0]
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])
    
    return returnMessage;
  }
}

class Command_ReadUser implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    let returnData = await StateTracker.ReadUser(data.FlowUser.Username, client);
    let returnContent = {};
    if(returnData[0] == null) {
      returnContent = {
        "MessageType": "ReadUser",
        "WasSuccessful": false
      }
    } else {
      returnContent = {
        "MessageType": "ReadUser",
        "WasSuccessful": true,
        "FlowUser": returnData[0]
      } 
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1]);

    return returnMessage;
  }
  
}

// // Room Commands

class Command_CreateRoom implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]>  
  {
    // grab the projectID from the JSON, confirm format
    // TODO: ensure the message json is being extracted properly 
    let projectID = data.ProjectID;

    // send confirmation message & room code to client
    let returnData = await StateTracker.CreateRoom(projectID, client);
    let returnContent = {
      "MessageType": "CreateRoom",
      "WasSuccessful": returnData[0],
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1]);

    return returnMessage;
  }
}

class Command_JoinRoom implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]>
  {
    let returnData = await StateTracker.JoinRoom(data.ProjectId, data.FlowUser.Username, client); 
    let returnContent = {
      "MessageType": "JoinRoom",
      "WasSuccessful": true
    }

    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])

    return returnMessage;
  }
}

class Command_DeleteRoom implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]>  
  {
    throw new Error("Method not implemented.");
  }
}

// Object Commands
class Command_CreateObject implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    let flowObject = new FlowObject(data.FlowObject);
    //flowObject.Id = uuidv4();
    
    console.log(flowObject)

    let returnData = await StateTracker.CreateObject(flowObject, data.ProjectId);
    let returnContent = {
      "MessageType": "CreateObject",
      "FlowObject": returnData[0],
      "WasSuccessful": (returnData[0] == null) ? false: true
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])

    return returnMessage;
  }
}

class Command_CheckinObject implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    let object = await StateTracker.ReadObject(data.ObjectId, data.ProjectId, client);
    console.log(object)
    let finalUpdate =  await StateTracker.UpdateObject(object[0], data.ProjectId, client, true);

    let returnData = await StateTracker.CheckinObject(data.ProjectId, data.ObjectId, client)
    let returnContent = {
      "MessageType": "CheckinObject",
      "WasSuccessful": ((returnData[0]) && finalUpdate[0] != null) ? true: false,
      "ObjectID": data.ObjectId
    }

    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1]);

    return returnMessage;

  }
}

class Command_CheckoutObject implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    let returnData = await StateTracker.CheckoutObject(data.ProjectId, data.ObjectId, client)
    let returnContent = {
      "MessageType": "CheckoutObject",
      "WasSuccessful": returnData[0],
      "ObjectID": data.ObjectId
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1]);

    return returnMessage;

  }
}

class Command_DeleteObject implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    let returnData = await StateTracker.DeleteObject(data.ObjectId, data.ProjectId, client);
    let returnContent = {
      "MessageType": "DeleteObject",
      "ObjectId": returnData[0],
      "WasSuccessful": (returnData[0] == null) ? false: true,
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])

    return returnMessage;
  }
}

class Command_UpdateObject implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    let flowObject = new FlowObject(data.FlowObject);
    let returnData = await StateTracker.UpdateObject(flowObject, data.ProjectId, client,false, data.user);

    let index = returnData[1].indexOf(client);
    returnData[1].splice(index,1)

    let returnContent = {
      "MessageType": "UpdateObject",
      "FlowObject": returnData[0],
      "WasSuccessful": (returnData[0] == null) ? false: true,
    }

    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])

    return returnMessage;
  }
}

class Command_ReadObject implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    let returnData = await StateTracker.ReadObject(data.FlowObject.Id, data.ProjectId, client);
    let returnContent = {
      "MessageType": "ReadObject",
      "FlowObject": returnData[0],
      "WasSuccessful": (returnData[0] == null) ? false: true,
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])
    return returnMessage;

  }
}


class Command_FinalizedUpdateObject implements ICommand
{
  async ExecuteCommand(data: any, client:string): Promise<[String, Array<String>]> 
  {
    let flowObject = new FlowObject(data.FlowObject);
    let returnData = await StateTracker.UpdateObject(flowObject, data.ProjectId, client, true);
    let index = returnData[1].indexOf(client);
    returnData[1].splice(index,1);

    let returnContent = {
      "MessageType": "UpdateObject",
      "FlowObject": returnData[0],
      "WasSuccessful": (returnData[0] == null) ? false: true,
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1]);
    
    return returnMessage;

  }
}

// behaviour Commands
class Command_CreateBehaviour implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    
    let flowBehaviour = new FlowBehaviour(data.FlowBehaviour);
    flowBehaviour.ProjectId = data.ProjectId;
    
    let returnData = await StateTracker.CreateBehaviour(flowBehaviour, data.ProjectId);
    await StateTracker.LinkNewBehaviorToExistingBehaviors(data.ProjectId, flowBehaviour.Id, data.BehaviorsToLinkTo)
    let returnContent = {
      "MessageType": "CreateBehaviour",
      "BehaviorsToLinkTo": data.BehaviorsToLinkTo,
      "FlowBehaviour": returnData[0],
      "WasSuccessful": (returnData[0] == null) ? false: true
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])

    return returnMessage;
  }
}

class Command_DeleteBehaviour implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  { 
    let returnData = await StateTracker.DeleteBehaviour(data.ProjectId, data.BehaviourIds, client);
    let returnContent = {
      "MessageType": "DeleteBehaviour",
      "BehaviourId": returnData[0],
      "WasSuccessful": (returnData[0] == null) ? false: true,
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])

    return returnMessage;
  }
}

class Command_UpdateBehaviour implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    let flowBehaviour = new FlowBehaviour(data.FlowBehaviour);
    let returnData = await StateTracker.UpdateBehaviour(flowBehaviour, data.ProjectId, client, true);
    let returnContent = {
      "MessageType": "UpdateBehaviour",
      "FlowBehaviour": returnData[0],
      "WasSuccessful": (returnData[0] == null) ? false: true,
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])

    return returnMessage;
  }
}


class Command_ReadBehaviour implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {

    let returnData = await StateTracker.ReadBehaviour(data.FlowBehaviour.Id, data.ProjectId, client);
    let returnContent = {
      "MessageType": "ReadBehaviour",
      "FlowBehaviour": returnData[0],
      "WasSuccessful": (returnData[0] == null) ? false: true,
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])

    return returnMessage;

  }
}

class Command_StartPlayMode implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]>
  {
    let returnData = await StateTracker.TogglePlayMode(data.ProjectId, true);
    let returnContent = {
      "MessageType": "StartPlayMode",
      "WasSuccessful": returnData[0]
    }

    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])
    return returnMessage;
  }
}

class Command_EndPlayMode implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]>
  {
    let returnData = await StateTracker.TogglePlayMode(data.ProjectId, false);
    let returnContent = {
      "MessageType": "EndPlayMode",
      "WasSuccessful": returnData[0]
    }

    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])
    return returnMessage;
  }
}

// Visual Scripting Graph Commands
class Command_CreateVSGraph implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    //console.log("INSIDE COMMANDCONTEXT -> Command_CreateVSGraph");
    let flowVSGraph = new FlowVSGraph(data.FlowVSGraph);
    
    console.log(flowVSGraph)

    let returnData = await StateTracker.CreateVSGraph(flowVSGraph, data.ProjectId);
    let returnContent = {
      "MessageType": "CreateVSGraph",
      "FlowVSGraph": returnData[0],
      "WasSuccessful": (returnData[0] == null) ? false: true
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])

    return returnMessage;
  }
}

class Command_CheckinVSGraph implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    let vsGraph = await StateTracker.ReadVSGraph(data.VSGraphId, data.ProjectId, client);
    console.log(vsGraph)
    let finalUpdate =  await StateTracker.UpdateVSGraph(vsGraph[0], data.ProjectId, client, true);

    let returnData = await StateTracker.CheckinVSGraph(data.ProjectId, data.VSGraphId, client)
    let returnContent = {
      "MessageType": "CheckinVSGraph",
      "WasSuccessful": ((returnData[0]) && finalUpdate[0] != null) ? true: false,
      "VSGraphID": data.VSGraphId
    }

    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1]);

    return returnMessage;

  }
}

class Command_CheckoutVSGraph implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    let returnData = await StateTracker.CheckoutVSGraph(data.ProjectId, data.VSGraphId, client)
    let returnContent = {
      "MessageType": "CheckoutVSGraph",
      "WasSuccessful": returnData[0],
      "VSGraphID": data.VSGraphId
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1]);

    return returnMessage;

  }
}

class Command_DeleteVSGraph implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    let returnData = await StateTracker.DeleteVSGraph(data.VSGraphId, data.ProjectId, client);
    let returnContent = {
      "MessageType": "DeleteVSGraph",
      "VSGraphId": returnData[0],
      "WasSuccessful": (returnData[0] == null) ? false: true,
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])

    return returnMessage;
  }
}

class Command_UpdateVSGraph implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    let flowVSGraph = new FlowVSGraph(data.FlowVSGraph);
    let returnData = await StateTracker.UpdateVSGraph(flowVSGraph, data.ProjectId, client,false, data.user);

    let index = returnData[1].indexOf(client);
    returnData[1].splice(index,1)

    let returnContent = {
      "MessageType": "UpdateVSGraph",
      "FlowVSGraph": returnData[0],
      "WasSuccessful": (returnData[0] == null) ? false: true,
    }

    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])

    return returnMessage;
  }
}

class Command_ReadVSGraph implements ICommand
{
  async ExecuteCommand(data: any, client: string): Promise<[String, Array<String>]> 
  {
    let returnData = await StateTracker.ReadVSGraph(data.FlowVSGraph.Id, data.ProjectId, client);
    let returnContent = {
      "MessageType": "ReadVSGraph",
      "FlowVSGraph": returnData[0],
      "WasSuccessful": (returnData[0] == null) ? false: true,
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1])
    return returnMessage;

  }
}


class Command_FinalizedUpdateVSGraph implements ICommand
{
  async ExecuteCommand(data: any, client:string): Promise<[String, Array<String>]> 
  {
    let flowVSGraph = new FlowVSGraph(data.FlowVSGraph);
    let returnData = await StateTracker.UpdateVSGraph(flowVSGraph, data.ProjectId, client, true);
    let index = returnData[1].indexOf(client);
    returnData[1].splice(index,1);

    let returnContent = {
      "MessageType": "UpdateVSGraph",
      "FlowVSGraph": returnData[0],
      "WasSuccessful": (returnData[0] == null) ? false: true,
    }
    let returnMessage = MessageBuilder.CreateMessage(returnContent, returnData[1]);
    
    return returnMessage;

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
  }

  /**
   * Executes the desired command
   * @param commandToExecute The command to be executed
   * @param data The data which is needed for the command to execute.
   */
  async ExecuteCommand(commandToExecute: string, data: any, client: string) : Promise<[String, Array<String>]>
  {
    if(this._CommandList.size == 0) {
      this._CommandList.set("CreateProject", new Command_CreateProject());
      this._CommandList.set("DeleteProject", new Command_DeleteProject());
      this._CommandList.set("OpenProject", new Command_OpenProject());
      this._CommandList.set("LeaveProject", new Command_LeaveProject());
      this._CommandList.set("ReadProject", new Command_ReadProject());
      this._CommandList.set("FetchProjects", new Command_FetchProjects());

      // User Commands
      this._CommandList.set("CreateUser", new Command_CreateUser());
      this._CommandList.set("DeleteUser", new Command_DeleteUser());
      this._CommandList.set("LoginUser", new Command_LoginUser());
      this._CommandList.set("LogoutUser", new Command_LogoutUser());
      this._CommandList.set("ReadUser", new Command_ReadUser());

      // Room Commands
      this._CommandList.set("CreateRoom", new Command_CreateRoom());
      this._CommandList.set("DeleteRoom", new Command_DeleteRoom());
      this._CommandList.set("JoinRoom", new Command_JoinRoom());

      // Object Commands
      this._CommandList.set("CreateObject", new Command_CreateObject());
      this._CommandList.set("DeleteObject", new Command_DeleteObject());
      this._CommandList.set("UpdateObject", new Command_UpdateObject());
      this._CommandList.set("FinalizedUpdateObject", new Command_FinalizedUpdateObject());
      this._CommandList.set("ReadObject", new Command_ReadObject());
      this._CommandList.set("CheckinObject", new Command_CheckinObject());
      this._CommandList.set("CheckoutObject", new Command_CheckoutObject());

      // Visual Scripting Graph Commands
      this._CommandList.set("CreateVSGraph", new Command_CreateVSGraph());
      this._CommandList.set("DeleteVSGraph", new Command_DeleteVSGraph());
      this._CommandList.set("UpdateVSGraph", new Command_UpdateVSGraph());
      this._CommandList.set("FinalizedUpdateVSGraph", new Command_FinalizedUpdateVSGraph());
      this._CommandList.set("ReadVSGraph", new Command_ReadVSGraph());
      this._CommandList.set("CheckinVSGraph", new Command_CheckinVSGraph());
      this._CommandList.set("CheckoutVSGraph", new Command_CheckoutVSGraph());

      // behaviour Commands
      this._CommandList.set("CreateBehaviour", new Command_CreateBehaviour());
      this._CommandList.set("DeleteBehaviour", new Command_DeleteBehaviour());
      this._CommandList.set("ReadBehaviour", new Command_ReadBehaviour());
      this._CommandList.set("UpdateBehaviour", new Command_UpdateBehaviour());

      // PlayMode Commands
      this._CommandList.set("StartPlayMode", new Command_StartPlayMode());
      this._CommandList.set("EndPlayMode", new Command_EndPlayMode());
    }
    console.log(commandToExecute)
    
    return (await this._CommandList.get(commandToExecute).ExecuteCommand(data, client));
  }
}