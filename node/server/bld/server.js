"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("./common/commands");
const express = require("express");
const http = require("http");
const ws_1 = require("ws");
const user_1 = require("./commands/user");
const client_1 = require("./commands/client");
const project_1 = require("./commands/project");
const scene_1 = require("./commands/scene");
const object_1 = require("./commands/object");
var mongoose = require('mongoose');
var database;
let user_hash = [];
let client_hash = [];
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
        console.log("Entering Message Processor");
        var command = json.command;
        if (command >= commands_1.Commands.object.CREATE && command <= commands_1.Commands.object.DELETE) {
            switch (command) {
                case commands_1.Commands.object.CREATE: {
                    var object = object_1.ObjectOperations.createObject(json.object);
                    var project = project_1.ProjectOperations.findProject(json.project._id);
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
                    project = project_1.ProjectOperations.createProject(json.project, json.client, json.user);
                    json.scene._parentId = project._id;
                    var scene = scene_1.SceneOperations.createScene(json.scene);
                    project.currentScene = scene._id;
                    var payloadString = JSON.stringify({
                        project: project,
                        scene: scene
                    });
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
                    var project = project_1.ProjectOperations.findProject(json.project._id);
                    var scene = scene_1.SceneOperations.findScene(project.currentScene);
                    var objectIds = scene.objects;
                    var objects = [];
                    for (var x in objectIds) {
                        objects.push(object_1.ObjectOperations.findObject({ _id: x }));
                    }
                    var payloadString = JSON.stringify({
                        scene: scene,
                        object: objects
                    });
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
                    var newUser = user_1.UserOperations.createUser(json.user);
                    var newClientId = client_1.ClientOperations.createClient(json.client, newUser._id, connection);
                    console.log("Received user registration!");
                    var connectionTracker = {
                        clientId: newClientId,
                        connection: connection
                    };
                    this.connections.push(connectionTracker);
                    newUser.clients.push(newClientId);
                    json.user = newUser;
                    json.client._id = newClientId;
                    var payloadString = JSON.stringify(json);
                    this.send(payloadString, connection);
                    break;
                }
                case commands_1.Commands.user.LOGIN: {
                    var returnedUser = user_1.UserOperations.loginUser(json.user);
                    if (returnedUser.isLoggedIn) {
                        var projects = project_1.ProjectOperations.fetchProjects(returnedUser._id);
                        var newClientId = client_1.ClientOperations.createClient(json.client, returnedUser._id, connection);
                        var currentUser = user_1.UserOperations.findUser(returnedUser._id);
                        var connectionTracker = {
                            clientId: newClientId,
                            connection: connection
                        };
                        this.connections.push(connectionTracker);
                        currentUser.clients.push(newClientId);
                        var payloadString = JSON.stringify({
                            response: 'Login Successful',
                            projects: projects,
                            user: { _id: returnedUser._id },
                            client: { _id: newClientId }
                        });
                        this.send(payloadString, connection);
                    }
                    else {
                        var payloadString = JSON.stringify({
                            response: 'Login Unsuccessful'
                        });
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
                    var payloadString = JSON.stringify({
                        response: 'Logout Successful'
                    });
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
                    var payloadString = JSON.stringify({
                        response: 'User deleted successfully'
                    });
                    break;
                }
            }
        }
        else {
            console.log('ERROR: Invalid Command');
        }
    }
    static broadcast(json) {
        var payloadString = JSON.stringify(json);
        var project = project_1.ProjectOperations.findProject(json.project._id);
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
