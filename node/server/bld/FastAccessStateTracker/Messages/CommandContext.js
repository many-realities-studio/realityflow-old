"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const StateTracker_1 = require("../StateTracker");
const FlowProject_1 = require("../FlowLibrary/FlowProject");
const FlowObject_1 = require("../FlowLibrary/FlowObject");
const MessageBuilder_1 = require("./MessageBuilder");
const uuid_1 = require("uuid");
class Command_CreateProject {
    ExecuteCommand(data, client) {
        return __awaiter(this, void 0, void 0, function* () {
            data.Project.Id = uuid_1.v4();
            let project = new FlowProject_1.FlowProject(data.Project);
            let returnData = yield StateTracker_1.StateTracker.CreateProject(project, data.FlowUser.Username, client);
            let message = returnData[0] == null ? "Failed to Create Project" : returnData[0];
            let returnContent = {
                "MessageType": "CreateProject",
                "WasSuccessful": returnData[0] == null ? false : true,
                "FlowProject": message
            };
            let returnMessage = MessageBuilder_1.MessageBuilder.CreateMessage(returnContent, returnData[1]);
            return returnMessage;
        });
    }
}
class Command_DeleteProject {
    ExecuteCommand(data, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let project = new FlowProject_1.FlowProject(data.project);
            let returnData = yield StateTracker_1.StateTracker.DeleteProject(project.Id, data.user.Username, client);
            let returnMessage = MessageBuilder_1.MessageBuilder.CreateMessage(returnData[0], returnData[1]);
            return returnMessage;
        });
    }
}
class Command_OpenProject {
    ExecuteCommand(data, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let returnData = yield StateTracker_1.StateTracker.OpenProject(data.ProjectId, client);
            let returnMessage = MessageBuilder_1.MessageBuilder.CreateMessage(returnData[0], returnData[1]);
            return returnMessage;
        });
    }
}
class Command_CreateUser {
    ExecuteCommand(data, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let returnData = yield StateTracker_1.StateTracker.CreateUser(data.FlowUser.Username, data.FlowUser.Password, client);
            let returnContent = {
                "Message": "message",
                "MessageType": "Register",
                "WasSuccessful": returnData[0]
            };
            let returnMessage = MessageBuilder_1.MessageBuilder.CreateMessage(returnContent, returnData[1]);
            return returnMessage;
        });
    }
}
class Command_DeleteUser {
    ExecuteCommand(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let returnData = yield StateTracker_1.StateTracker.DeleteUser(data.Username, data.Password);
            let returnMessage = MessageBuilder_1.MessageBuilder.CreateMessage(returnData[0], returnData[1]);
            return returnMessage;
        });
    }
}
class Command_LoginUser {
    ExecuteCommand(data, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let returnData = yield StateTracker_1.StateTracker.LoginUser(data.FlowUser.Username, data.FlowUser.Password, client);
            let returnMessage = MessageBuilder_1.MessageBuilder.CreateMessage(returnData[0], returnData[1]);
            return returnMessage;
        });
    }
}
class Command_LogoutUser {
    ExecuteCommand(data, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let returnData = yield StateTracker_1.StateTracker.LogoutUser(data.FlowUser.Username, data.FlowUser.Password, client);
            let returnContent = {
                "Message": "message",
                "MessageType": "LogoutUser",
                "WasSuccessful": returnData[0]
            };
            let returnMessage = MessageBuilder_1.MessageBuilder.CreateMessage(returnContent, returnData[1]);
            return returnMessage;
        });
    }
}
class Command_CreateRoom {
    ExecuteCommand(data, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let projectID = data.projectID;
            let returnData = yield StateTracker_1.StateTracker.CreateRoom(projectID, client);
            let returnMessage = MessageBuilder_1.MessageBuilder.CreateMessage(returnData[0], returnData[1]);
            return returnMessage;
        });
    }
}
class Command_JoinRoom {
    ExecuteCommand(data, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let returnData = yield StateTracker_1.StateTracker.JoinRoom(data.Project.Id, data.user.Username, client);
            let returnMessage = MessageBuilder_1.MessageBuilder.CreateMessage(returnData[0], returnData[1]);
            return returnMessage;
        });
    }
}
class Command_DeleteRoom {
    ExecuteCommand(data, client) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
}
class Command_CreateObject {
    ExecuteCommand(data, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let flowObject = new FlowObject_1.FlowObject(data);
            let returnData = yield StateTracker_1.StateTracker.CreateObject(flowObject, client);
            let returnMessage = MessageBuilder_1.MessageBuilder.CreateMessage(returnData[0], returnData[1]);
            return returnMessage;
        });
    }
}
class Command_DeleteObject {
    ExecuteCommand(data, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let flowObject = new FlowObject_1.FlowObject(data);
            let returnData = yield StateTracker_1.StateTracker.DeleteObject(flowObject, data.Project);
            let returnMessage = MessageBuilder_1.MessageBuilder.CreateMessage(returnData[0], returnData[1]);
            return returnMessage;
        });
    }
}
class Command_UpdateObject {
    ExecuteCommand(data, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let flowObject = new FlowObject_1.FlowObject(data);
            let returnData = yield StateTracker_1.StateTracker.UpdateObject(flowObject, data.Project.Id);
            let returnMessage = MessageBuilder_1.MessageBuilder.CreateMessage(returnData[0], returnData[1]);
            return returnMessage;
        });
    }
}
class Command_FinalizedUpdateObject {
    ExecuteCommand(data, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let flowObject = new FlowObject_1.FlowObject(data);
            let returnData = yield StateTracker_1.StateTracker.FinalizedUpdateObject(flowObject, data.Project.Id);
            let returnMessage = MessageBuilder_1.MessageBuilder.CreateMessage(returnData[0], returnData[1]);
            return returnMessage;
        });
    }
}
class CommandContext {
    constructor() {
        this._CommandList = new Map();
    }
    CommandContext() {
    }
    ExecuteCommand(commandToExecute, data, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._CommandList.size == 0) {
                this._CommandList.set("CreateProject", new Command_CreateProject());
                this._CommandList.set("DeleteProject", new Command_DeleteProject());
                this._CommandList.set("OpenProject", new Command_OpenProject());
                this._CommandList.set("CreateUser", new Command_CreateUser());
                this._CommandList.set("DeleteUser", new Command_DeleteUser());
                this._CommandList.set("LoginUser", new Command_LoginUser());
                this._CommandList.set("LogoutUser", new Command_LogoutUser());
                this._CommandList.set("CreateRoom", new Command_CreateRoom());
                this._CommandList.set("DeleteRoom", new Command_DeleteRoom());
                this._CommandList.set("JoinRoom", new Command_JoinRoom());
                this._CommandList.set("CreateObject", new Command_CreateObject());
                this._CommandList.set("DeleteObject", new Command_DeleteObject());
                this._CommandList.set("UpdateObject", new Command_UpdateObject());
                this._CommandList.set("FinalizedUpdateObject", new Command_FinalizedUpdateObject());
            }
            return (yield this._CommandList.get(commandToExecute).ExecuteCommand(data, client));
        });
    }
}
exports.CommandContext = CommandContext;
//# sourceMappingURL=CommandContext.js.map