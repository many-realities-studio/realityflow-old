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
const bcrypt = require('bcrypt');
const saltRounds = 10;
const project_1 = require("../commands/project");
class MessageProcessor {
    static serverMessageProcessor(json, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            var command = json.command;
            if (command >= commands_1.Commands.object.CREATE && command <= commands_1.Commands.object.DELETE) {
                switch (command) {
                    case commands_1.Commands.object.CREATE: {
                        var ret = yield databaseController_1.databaseController.createObject(json);
                        server_1.ServerEventDispatcher.broadcast(ret, true);
                    }
                    case commands_1.Commands.object.UPDATE: {
                        server_1.ServerEventDispatcher.broadcast(json, false);
                        break;
                    }
                    case commands_1.Commands.object.UPDATELONGTERM: {
                        yield databaseController_1.databaseController.updateObject(json);
                        break;
                    }
                    case commands_1.Commands.object.DELETE: {
                        server_1.ServerEventDispatcher.broadcast(json, true);
                        yield databaseController_1.databaseController.deleteObject(json);
                        break;
                    }
                }
            }
            else if (command >= commands_1.Commands.project.CREATE && command <= commands_1.Commands.project.DELETE) {
                switch (command) {
                    case commands_1.Commands.project.CREATE: {
                        var payload = yield databaseController_1.databaseController.createProject(json);
                        server_1.ServerEventDispatcher.send(payload, connection);
                        break;
                    }
                    case commands_1.Commands.project.UPDATE: {
                        break;
                    }
                    case commands_1.Commands.project.FETCH: {
                        break;
                    }
                    case commands_1.Commands.project.OPEN: {
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
                    case commands_1.Commands.project.DELETE: {
                        yield databaseController_1.databaseController.deleteProject(json);
                        break;
                    }
                }
            }
            else if (command >= commands_1.Commands.scene.CREATE && command <= commands_1.Commands.scene.DELETE) {
                switch (command) {
                    case commands_1.Commands.scene.CREATE: {
                        break;
                    }
                    case commands_1.Commands.scene.UPDATE: {
                        break;
                    }
                    case commands_1.Commands.scene.DELETE: {
                        break;
                    }
                }
            }
            else if (command >= commands_1.Commands.user.CREATE && command <= commands_1.Commands.user.DELETE) {
                switch (command) {
                    case commands_1.Commands.user.CREATE: {
                        newClientId = newClientId._id;
                        var connectionTracker = {
                            clientId: newClientId,
                            connection: connection
                        };
                        json = yield databaseController_1.databaseController.createUser(json);
                        server_1.ServerEventDispatcher.connections.push(connectionTracker);
                        var payloadString = JSON.stringify(json);
                        server_1.ServerEventDispatcher.send(payloadString, connection);
                        break;
                    }
                    case commands_1.Commands.user.LOGIN: {
                        var loginData = yield databaseController_1.databaseController.loginUser(json);
                        var newClientId = loginData.newClientId;
                        if (loginData != null) {
                            var connectionTracker = {
                                clientId: newClientId,
                                connection: connection
                            };
                            server_1.ServerEventDispatcher.connections.push(connectionTracker);
                            for (var x in server_1.ServerEventDispatcher.connections) { }
                            loginData.currentUser.clients.push(newClientId);
                            loginData.currentUser.save();
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
                    case commands_1.Commands.user.LOGOUT: {
                        yield databaseController_1.databaseController.logoutUser(json);
                        var connectionIndex = server_1.ServerEventDispatcher.connections.findIndex(x => x.clientId === json.client._id);
                        delete server_1.ServerEventDispatcher.connections[connectionIndex];
                        break;
                    }
                    case commands_1.Commands.user.FIND: {
                        break;
                    }
                    case commands_1.Commands.user.DELETE: {
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
