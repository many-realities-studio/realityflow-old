"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const commands_1 = require("./commands");
const databaseController_1 = require("./databaseController");
const project_1 = require("../commands/project");
const FlowClasses_1 = require("./FlowClasses");
class MessageProcessor {
    static serverMessageProcessor(json, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            var command = json.command;
            var request = command / 1000;
            var action = command % 100;
            if (request == commands_1.Commands.request.object) {
                switch (action) {
                    case commands_1.Commands.action.CREATE: {
                        var obj = new FlowClasses_1.FlowObject(json.obj);
                        var proj = new FlowClasses_1.FlowProject(json.project);
                        var ret = yield databaseController_1.databaseController.createObject(obj, proj);
                        json.project = ret.project;
                        json.obj._id = ret.object._id;
                        server_1.ServerEventDispatcher.broadcast(ret, true);
                    }
                    case commands_1.Commands.action.UPDATE: {
                        server_1.ServerEventDispatcher.broadcast(json, false);
                        break;
                    }
                    case commands_1.Commands.action.DELETE: {
                        server_1.ServerEventDispatcher.broadcast(json, true);
                        yield databaseController_1.databaseController.deleteObject(new FlowClasses_1.FlowProject(json.project), new FlowClasses_1.FlowObject(json.obj));
                        break;
                    }
                }
            }
            else if (request == commands_1.Commands.request.project) {
                switch (action) {
                    case commands_1.Commands.action.CREATE: {
                        let inProj = new FlowClasses_1.FlowProject(json.project);
                        let inClient = new FlowClasses_1.FlowClient(json.client);
                        let inUser = new FlowClasses_1.FlowUser(json.user);
                        var newProject = yield databaseController_1.databaseController.createProject(inProj, inUser, inClient);
                        json.project = newProject;
                        server_1.ServerEventDispatcher.send(json, connection);
                        break;
                    }
                    case commands_1.Commands.action.UPDATE: {
                        break;
                    }
                    case commands_1.Commands.action.FETCH: {
                        var project = yield project_1.ProjectOperations.findProject(json.project);
                        var projectClientsArray = String(project.clients);
                        var clientInProject = false;
                        for (var i = 0; i < projectClientsArray.length; i++) {
                            if (projectClientsArray[i] == json.client._id) {
                                clientInProject = true;
                            }
                        }
                        if (!clientInProject) {
                            project.clients.push(json.client._id);
                            yield project.save();
                        }
                        var objects = yield databaseController_1.databaseController.fetchObjects(json);
                        json.objs = objects;
                        var payloadString = JSON.stringify(json);
                        server_1.ServerEventDispatcher.send(payloadString, connection);
                        break;
                    }
                    case commands_1.Commands.action.DELETE: {
                        yield databaseController_1.databaseController.deleteProject(new FlowClasses_1.FlowProject(json.project));
                        break;
                    }
                }
            }
            else if (request == commands_1.Commands.request.scene) {
                switch (command) {
                    case commands_1.Commands.action.CREATE: {
                        break;
                    }
                    case commands_1.Commands.action.UPDATE: {
                        break;
                    }
                    case commands_1.Commands.action.DELETE: {
                        break;
                    }
                }
            }
            else if (request == commands_1.Commands.request.user) {
                switch (action) {
                    case commands_1.Commands.action.CREATE: {
                        let ids = yield databaseController_1.databaseController.createUser(new FlowClasses_1.FlowClient(json.client), new FlowClasses_1.FlowUser(json.user));
                        var connectionTracker = {
                            clientId: ids.newClientId,
                            connection: connection
                        };
                        json.client._id = ids.newClientId;
                        json.user._id = ids.newUserId;
                        server_1.ServerEventDispatcher.connections.push(connectionTracker);
                        var payloadString = JSON.stringify(json);
                        server_1.ServerEventDispatcher.send(payloadString, connection);
                        break;
                    }
                    case commands_1.Commands.action.LOGIN: {
                        var loginData = yield databaseController_1.databaseController.loginUser(new FlowClasses_1.FlowUser(json.user), new FlowClasses_1.FlowClient(json.client));
                        if (loginData != null) {
                            var connectionTracker = {
                                clientId: loginData.newClientId,
                                connection: connection
                            };
                            server_1.ServerEventDispatcher.connections.push(connectionTracker);
                            for (var x in server_1.ServerEventDispatcher.connections) { }
                            json.client._id = loginData.newClientId;
                            json.user._id = loginData.newUserId;
                            json.projects = loginData.projects;
                            var payloadString = JSON.stringify(json);
                            server_1.ServerEventDispatcher.send(payloadString, connection);
                        }
                        else {
                            var payloadString = JSON.stringify(json);
                            server_1.ServerEventDispatcher.send(payloadString, connection);
                        }
                        break;
                    }
                    case commands_1.Commands.action.LOGOUT: {
                        yield databaseController_1.databaseController.logoutUser(new FlowClasses_1.FlowUser(json.user), new FlowClasses_1.FlowClient(json.client));
                        var connectionIndex = server_1.ServerEventDispatcher.connections.findIndex(x => x.clientId === json.client._id);
                        delete server_1.ServerEventDispatcher.connections[connectionIndex];
                        break;
                    }
                    case commands_1.Commands.action.FETCH: {
                        break;
                    }
                    case commands_1.Commands.action.DELETE: {
                        yield databaseController_1.databaseController.deleteUser(json);
                        var payloadString = JSON.stringify(json);
                        break;
                    }
                }
            }
            else {
            }
        });
    }
}
exports.MessageProcessor = MessageProcessor;
//# sourceMappingURL=messageProcessor.js.map