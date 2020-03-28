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
require("reflect-metadata");
const express = require("express");
const http = require("http");
const ws_1 = require("ws");
const uuid_1 = require("uuid");
const NewMessageProcessor_1 = require("./FastAccessStateTracker/Messages/NewMessageProcessor");
const typeorm_1 = require("typeorm");
const project_1 = require("./ORMCommands/project");
const object_1 = require("./entity/object");
const user_1 = require("./entity/user");
const project_2 = require("./entity/project");
const UserSubscriber_1 = require("./entity/UserSubscriber");
const behavior_1 = require("./entity/behavior");
const RoomManager_1 = require("./FastAccessStateTracker/RoomManager");
const user_2 = require("./ORMCommands/user");
const FlowProject_1 = require("./FastAccessStateTracker/FlowLibrary/FlowProject");
var database;
class ServerEventDispatcher {
    constructor(server) {
        ServerEventDispatcher.wss = new ws_1.Server({ server }, function (err) {
        });
        ServerEventDispatcher.wss.on("error", (err) => {
        });
        ServerEventDispatcher.callbacks = [];
        ServerEventDispatcher.wss.on("connection", this.connection);
    }
    static send(payloadString, connection) {
        connection.send(payloadString, function ack(err) {
            if (err) {
                console.log(err);
            }
        });
    }
    connection(ws, arg) {
        ws.ID = uuid_1.v4();
        ServerEventDispatcher.SocketConnections.set(ws.ID, ws);
        function onMessageEvent(evt) {
            try {
                const json = JSON.parse(evt.data);
                NewMessageProcessor_1.NewMessageProcessor.ParseMessage(ws.ID, json).then((res) => {
                    let clients = res[1];
                    if (!clients) {
                        console.log("Didn't receive a clients array ");
                    }
                    else {
                        for (var i = 0; i < clients.length; i++) {
                            let key = clients[i];
                            ServerEventDispatcher.SocketConnections.get(key).send(res[0]);
                        }
                    }
                });
            }
            catch (error) {
                ServerEventDispatcher.SocketConnections.get(ws.ID).send("Error:\n" + error);
            }
        }
        function onCloseEvent(evt) {
            ServerEventDispatcher.SocketConnections.delete(ws.ID);
        }
        function onErrorEvent(evt) {
        }
        ws.onmessage = onMessageEvent;
        ws.onclose = onCloseEvent;
        ws.onerror = onErrorEvent;
    }
}
exports.ServerEventDispatcher = ServerEventDispatcher;
ServerEventDispatcher.connections = [];
ServerEventDispatcher.SocketConnections = new Map();
;
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield typeorm_1.createConnection({
            "name": "prod",
            "type": "sqlite",
            "database": "./database/prod.db",
            "logging": true,
            "synchronize": true,
            "entities": [
                object_1.DBObject,
                user_1.User,
                project_2.Project,
                behavior_1.Behavior
            ],
            subscribers: [
                UserSubscriber_1.UserSubscriber
            ]
        }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
            process.env.NODE_ENV = "prod";
            console.log("Is connected", res.isConnected);
            try {
                yield user_2.UserOperations.createUser("God", "Jesus");
                yield project_1.ProjectOperations.createProject(new FlowProject_1.FlowProject({
                    Id: "noRoom",
                    Description: "this is not a room",
                    DateModified: Date.now(),
                    ProjectName: "noRoom"
                }), "God");
            }
            catch (err) {
                console.log(err);
            }
            RoomManager_1.RoomManager.CreateRoom("noRoom");
        }))
            .catch((err) => {
            console.log(err);
        });
    }
    catch (err) {
        console.log(err);
    }
    console.log(process.env.NODE_ENV);
}))();
const app = express();
app.use(express.static("./static"));
const server = http.createServer(app);
const sockServ = new ServerEventDispatcher(server);
server.listen(process.env.PORT || 8999, () => {
    console.log("SYSTEM READY");
});
//# sourceMappingURL=server.js.map