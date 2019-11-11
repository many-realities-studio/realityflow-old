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
const bcrypt = require('bcrypt');
const saltRounds = 10;
const user_1 = require("../commands/user");
const client_1 = require("../commands/client");
const project_1 = require("../commands/project");
const object_1 = require("../commands/object");
class MessageProcessor {
    static serverMessageProcessor(json, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            var command = json.command;
            if (command >= commands_1.Commands.object.CREATE && command <= commands_1.Commands.object.DELETE) {
                switch (command) {
                    case commands_1.Commands.object.CREATE: {
                        var object = yield object_1.ObjectOperations.createObject(json.obj);
                        var project = yield project_1.ProjectOperations.findProject(json.project);
                        project.objs.push(object._id);
                        yield project.save();
                        json.project = project;
                        json.obj._id = object._id;
                        server_1.ServerEventDispatcher.broadcast(json, true);
                        break;
                    }
                    case commands_1.Commands.object.UPDATE: {
                        server_1.ServerEventDispatcher.broadcast(json, false);
                        yield object_1.ObjectOperations.updateObject(json.obj);
                        break;
                    }
                    case commands_1.Commands.object.DELETE: {
                        server_1.ServerEventDispatcher.broadcast(json, true);
                        var project = yield project_1.ProjectOperations.findProject(json.project);
                        project.objs.splice(project.objs.indexOf(json.obj._id), 1);
                        yield project.save();
                        yield object_1.ObjectOperations.deleteObject(json.obj);
                        break;
                    }
                }
            }
            else if (command >= commands_1.Commands.project.CREATE && command <= commands_1.Commands.project.DELETE) {
                switch (command) {
                    case commands_1.Commands.project.CREATE: {
                        var project = yield project_1.ProjectOperations.createProject(json.project, json.client, json.user);
                        project.clients.push(json.client._id);
                        yield project.save();
                        json.project = project;
                        var payloadString = JSON.stringify(json);
                        server_1.ServerEventDispatcher.send(payloadString, connection);
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
                        var existsFlag = false;
                        for (var i = 0; i < projectClientsArray.length; i++) {
                            if (projectClientsArray[i] == json.client._id) {
                                existsFlag = true;
                            }
                        }
                        if (!existsFlag) {
                            project.clients.push(json.client._id);
                            yield project.save();
                        }
                        var objectIds = project.objs;
                        var objects = [];
                        if (objectIds.length > 0) {
                            for (var i = 0; i < objectIds.length; i++) {
                                var currentObject = yield object_1.ObjectOperations.findObject(objectIds[i]);
                                objects.push(currentObject);
                            }
                        }
                        json.objs = objects;
                        var payloadString = JSON.stringify(json);
                        server_1.ServerEventDispatcher.send(payloadString, connection);
                        break;
                    }
                    case commands_1.Commands.project.DELETE: {
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
                        var newUserPayload = yield user_1.UserOperations.createUser(json.user);
                        var newClientId = yield client_1.ClientOperations.createClient(json.client, newUserPayload._id);
                        newClientId = newClientId._id;
                        var connectionTracker = {
                            clientId: newClientId,
                            connection: connection
                        };
                        server_1.ServerEventDispatcher.connections.push(connectionTracker);
                        newUserPayload.clients.push(newClientId);
                        newUserPayload.save();
                        json.user._id = newUserPayload._id;
                        json.client._id = newClientId;
                        var payloadString = JSON.stringify(json);
                        server_1.ServerEventDispatcher.send(payloadString, connection);
                        break;
                    }
                    case commands_1.Commands.user.LOGIN: {
                        var returnedUser = yield user_1.UserOperations.loginUser(json.user);
                        if (returnedUser != undefined) {
                            if (bcrypt.compareSync(json.user.password, returnedUser.password)) {
                                json.user._id = returnedUser._id;
                                var projects = yield project_1.ProjectOperations.fetchProjects(returnedUser);
                                var newClientId = yield client_1.ClientOperations.createClient(json.client, returnedUser._id);
                                newClientId = newClientId._id;
                                json.client._id = newClientId;
                                var currentUser = yield user_1.UserOperations.findUser(returnedUser);
                                var connectionTracker = {
                                    clientId: newClientId,
                                    connection: connection
                                };
                                server_1.ServerEventDispatcher.connections.push(connectionTracker);
                                for (var x in server_1.ServerEventDispatcher.connections) {
                                }
                                if (currentUser.clients) {
                                    currentUser.clients.push(newClientId);
                                    currentUser.save();
                                }
                                json.projects = projects;
                                var payloadString = JSON.stringify(json);
                                console.log(payloadString);
                                server_1.ServerEventDispatcher.send(payloadString, connection);
                            }
                            else {
                                var payloadString = JSON.stringify(json);
                                server_1.ServerEventDispatcher.send(payloadString, connection);
                            }
                        }
                        else {
                            var payloadString = JSON.stringify(json);
                            server_1.ServerEventDispatcher.send(payloadString, connection);
                        }
                        break;
                    }
                    case commands_1.Commands.user.LOGOUT: {
                        var user = yield user_1.UserOperations.findUser(json.user);
                        var clientArray = user.clients;
                        var filteredArray = clientArray.filter(function (value, index, array) {
                            return value != json.client._id;
                        });
                        user.clients = filteredArray;
                        client_1.ClientOperations.deleteClient(json.client._id);
                        var payloadString = JSON.stringify(json);
                        var connectionIndex = server_1.ServerEventDispatcher.connections.findIndex(x => x.clientId === json.client._id);
                        delete server_1.ServerEventDispatcher.connections[connectionIndex];
                        break;
                    }
                    case commands_1.Commands.user.FIND: {
                        break;
                    }
                    case commands_1.Commands.user.DELETE: {
                        var User = user_1.UserOperations.findUser(json.user);
                        var clientArray = User.clients;
                        for (var arr in clientArray) {
                            client_1.ClientOperations.deleteClient(arr);
                        }
                        user_1.UserOperations.deleteUser(json.user);
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
