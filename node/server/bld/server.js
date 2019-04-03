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
                        console.log('Object: ' + json.obj);
                        var object = yield object_1.ObjectOperations.createObject(json.obj);
                        var project = yield project_1.ProjectOperations.findProject(json.project);
                        console.log('Project: ' + project);
                        project.objs.push(object._id);
                        yield project.save();
                        json.project = project;
                        json.obj._id = object._id;
                        this.broadcast(json, true);
                        break;
                    }
                    case commands_1.Commands.object.UPDATE: {
                        this.broadcast(json, false);
                        yield object_1.ObjectOperations.updateObject(json.obj);
                        break;
                    }
                    case commands_1.Commands.object.DELETE: {
                        this.broadcast(json, true);
                        object_1.ObjectOperations.deleteObject(json.obj);
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
                        console.log('Project Created. Project ID: ' + project);
                        json.project = project;
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
                        var project = yield project_1.ProjectOperations.findProject(json.project);
                        console.log("Project Clients: " + project.clients);
                        project.clients.push(json.client._id);
                        yield project.save();
                        console.log('Project: ' + project);
                        var objectIds = project.objs;
                        var objects = [];
                        console.log('Object IDs Length: ' + objectIds.length);
                        console.log("Object IDs: " + objectIds);
                        if (objectIds.length > 0) {
                            console.log('CHECK');
                            for (var i = 0; i < objectIds.length; i++) {
                                console.log('X: ' + objectIds[i]);
                                var currentObject = yield object_1.ObjectOperations.findObject(objectIds[i]);
                                objects.push(currentObject);
                            }
                            console.log("Objects: " + objects);
                        }
                        json.objs = objects;
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
                        json.user._id = newUserPayload._id;
                        json.client._id = newClientId;
                        var payloadString = JSON.stringify(json);
                        this.send(payloadString, connection);
                        break;
                    }
                    case commands_1.Commands.user.LOGIN: {
                        var returnedUser = yield user_1.UserOperations.loginUser(json.user);
                        if (returnedUser._id != '' && returnedUser._id != undefined) {
                            json.user._id = returnedUser._id;
                            var projects = yield project_1.ProjectOperations.fetchProjects(returnedUser);
                            var newClientId = client_1.ClientOperations.createClient(json.client, returnedUser._id);
                            json.client._id = newClientId;
                            var currentUser = yield user_1.UserOperations.findUser(returnedUser);
                            console.log('Current User: ' + currentUser);
                            var connectionTracker = {
                                clientId: newClientId,
                                connection: connection
                            };
                            this.connections.push(connectionTracker);
                            console.log('Connections: ' + this.connections.length);
                            for (var x in this.connections) {
                                console.log('Connection Client IDs: ' + this.connections[x].clientId);
                            }
                            currentUser.clients.push(newClientId);
                            currentUser.save();
                            console.log('Current User 2: ' + currentUser);
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
    static broadcast(json, newFlag) {
        return __awaiter(this, void 0, void 0, function* () {
            var payloadString = JSON.stringify(json);
            var project = yield project_1.ProjectOperations.findProject(json.project);
            var clientArray = String(project.clients);
            var filteredClientArray = [];
            var filteredConnections = [];
            if (!newFlag) {
                for (x in this.connections) {
                    if (clientArray.includes(String(this.connections[x].clientId)) && String(this.connections[x].clientId != String(json.client_id))) {
                        filteredConnections.push(this.connections[x].connection);
                    }
                }
            }
            else {
                for (x in this.connections) {
                    if (clientArray.includes(String(this.connections[x].clientId))) {
                        filteredConnections.push(this.connections[x].connection);
                    }
                }
            }
            for (var x in filteredConnections) {
                this.send(payloadString, filteredConnections[x]);
            }
        });
    }
    static send(payloadString, connection) {
        let payload = Buffer.alloc(payloadString.length, payloadString);
        connection.send(payload, function ack(err) {
            if (err == undefined) {
                console.log('Payload sent successfully!');
            }
        });
    }
    connection(ws, arg) {
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
