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
const commands_1 = require("./common/commands");
const express = require("express");
const http = require("http");
const ws_1 = require("ws");
const mongoose = require("mongoose");
const user_1 = require("./commands/user");
const client_1 = require("./commands/client");
const project_1 = require("./commands/project");
const scene_1 = require("./commands/scene");
const object_1 = require("./commands/object");
var database;
const dburl = "mongodb://127.0.0.1:27017/realityflowdb";
class ServerEventDispatcher {
    constructor(server) {
        mongoose.connect(dburl);
        database = mongoose.connection;
        database.on('error', console.error.bind(console, 'connection error: '));
        database.once('open', function () {
            console.log('Database connection successful at ' + dburl);
        });
        console.log("Setting up server");
        ServerEventDispatcher.wss = new ws_1.Server({ server }, function (err) {
            console.log("Connections set up " + err);
        });
        ServerEventDispatcher.wss.on("error", (err) => {
            console.log("error");
        });
        ServerEventDispatcher.callbacks = [];
        ServerEventDispatcher.wss.on("connection", this.connection);
    }
    static serverMessageProcessor(json, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Entering Message Processor");
            var command = json.command;
            if (command >= commands_1.Commands.object.CREATE && command <= commands_1.Commands.object.DELETE) {
                switch (command) {
                    case commands_1.Commands.object.CREATE: {
                        var object = yield object_1.ObjectOperations.createObject(json.object);
                        var project = yield project_1.ProjectOperations.findProject(json.project._id);
                        var sceneId = project.currentScene;
                        var scene = scene_1.SceneOperations.findScene(sceneId);
                        scene.objects.push(object._id);
                        var payloadString = JSON.stringify({
                            object: object
                        });
                        this.send(payloadString, connection);
                        break;
                    }
                    case commands_1.Commands.object.UPDATE: {
                        this.broadcast(json);
                        object_1.ObjectOperations.updateObject(json.object);
                        break;
                    }
                    case commands_1.Commands.object.DELETE: {
                        this.broadcast(json);
                        object_1.ObjectOperations.deleteObject(json.object);
                        break;
                    }
                }
            }
            else if (command >= commands_1.Commands.project.CREATE && command <= commands_1.Commands.project.DELETE) {
                switch (command) {
                    case commands_1.Commands.project.CREATE: {
                        var projectId = yield project_1.ProjectOperations.createProject(json.project, json.client, json.user);
                        console.log('Project ID: ' + projectId);
                        json.project._id = projectId;
                        var payloadString = JSON.stringify(json);
                        this.send(payloadString, connection);
                        break;
                    }
                    case commands_1.Commands.project.UPDATE: {
                        break;
                    }
                    case commands_1.Commands.project.FETCH: {
                        break;
                    }
                    case commands_1.Commands.project.OPEN: {
                        var project = yield project_1.ProjectOperations.findProject(json.project._id);
                        var objectIds = project.objects;
                        var objects = [];
                        for (var x in objectIds) {
                            var currentObject = yield object_1.ObjectOperations.findObject({ _id: x });
                            objects.push(currentObject);
                        }
                        json.object = objects;
                        var payloadString = JSON.stringify(json);
                        this.send(payloadString, connection);
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
                        var newClientId = client_1.ClientOperations.createClient(json.client, newUserPayload._id);
                        var connectionTracker = {
                            clientId: newClientId,
                            connection: connection
                        };
                        this.connections.push(connectionTracker);
                        newUserPayload.clients.push(newClientId);
                        newUserPayload.save();
                        json.user._id = newUserPayload.user._id;
                        json.client._id = newClientId;
                        var payloadString = JSON.stringify(json);
                        this.send(payloadString, connection);
                        break;
                    }
                    case commands_1.Commands.user.LOGIN: {
                        var returnedUser = yield user_1.UserOperations.loginUser(json.user);
                        console.log('ReturnedUser LoggedIn Server: ' + returnedUser.isLoggedIn);
                        if (returnedUser._id != '' && returnedUser._id != undefined) {
                            json.user._id = returnedUser._id;
                            var projects = yield project_1.ProjectOperations.fetchProjects(returnedUser);
                            console.log('Projects in Server: ' + projects);
                            var newClientId = client_1.ClientOperations.createClient(json.client, returnedUser._id);
                            json.client._id = newClientId;
                            var currentUser = yield user_1.UserOperations.findUser(returnedUser);
                            console.log('Current User: ' + currentUser);
                            var connectionTracker = {
                                clientId: newClientId,
                                connection: connection
                            };
                            this.connections.push(connectionTracker);
                            currentUser.clients.push(newClientId);
                            currentUser.save();
                            json.projects = projects;
                            var payloadString = JSON.stringify(json);
                            this.send(payloadString, connection);
                        }
                        else {
                            var payloadString = JSON.stringify(json);
                            this.send(payloadString, connection);
                        }
                        break;
                    }
                    case commands_1.Commands.user.LOGOUT: {
                        var user = user_1.UserOperations.findUser(json.user._id);
                        var clientArray = user.clients;
                        var filteredArray = clientArray.filter(function (value, index, array) {
                            return value != json.client._id;
                        });
                        user.clients = filteredArray;
                        client_1.ClientOperations.deleteClient(json.client._id);
                        var payloadString = JSON.stringify(json);
                        this.send(payloadString, connection);
                        var connectionIndex = this.connections.findIndex(x => x.clientId === json.client._id);
                        delete this.connections[connectionIndex];
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
                console.log('ERROR: Invalid Command');
            }
        });
    }
    static broadcast(json) {
        return __awaiter(this, void 0, void 0, function* () {
            var payloadString = JSON.stringify(json);
            var project = yield project_1.ProjectOperations.findProject(json.project._id);
            var clientArray = project.clients;
            var filteredClientArray = clientArray.filter(function (value, index, arr) {
                return value != json.client._id;
            });
            var index;
            var filteredConnections = [];
            for (var x in filteredClientArray) {
                index = this.connections.findIndex(y => y.clientId === x);
                filteredConnections.push(this.connections[index].connection);
            }
            for (var x in filteredConnections) {
                this.send(payloadString, x);
            }
        });
    }
    static send(payloadString, connection) {
        let payload = Buffer.alloc(payloadString.length, payloadString);
        connection.send(payload);
    }
    connection(ws, arg) {
        console.log(ws);
        ServerEventDispatcher.connections.push(ws);
        var connection = ws;
        function onMessageEvent(evt) {
            const json = JSON.parse(evt.data);
            ServerEventDispatcher.serverMessageProcessor(json, connection);
        }
        function onCloseEvent(evt) {
        }
        function onErrorEvent(evt) {
        }
        ws.onmessage = onMessageEvent;
        ws.onclose = onCloseEvent;
        ws.onerror = onErrorEvent;
    }
}
ServerEventDispatcher.connections = [];
exports.ServerEventDispatcher = ServerEventDispatcher;
;
const apiFuncGroup = ["state",
    "client", "user", "event", "transform"];
function main() {
    console.log("Test");
    const app = express();
    app.use(express.static("./static"));
    const server = http.createServer(app);
    const sockServ = new ServerEventDispatcher(server);
    function loadApiFunctions() {
        for (let i = 0; i < apiFuncGroup.length; i++) {
            delete require.cache[require.resolve("./commands/" + apiFuncGroup[i] + ".js")];
        }
    }
    server.listen(process.env.PORT || 8999, () => {
    });
}
main();
