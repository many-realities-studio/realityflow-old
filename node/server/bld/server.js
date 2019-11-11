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
const express = require("express");
const http = require("http");
const ws_1 = require("ws");
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const messageProcessor_1 = require("./common/messageProcessor");
const project_1 = require("./commands/project");
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
        ServerEventDispatcher.wss = new ws_1.Server({ server }, function (err) {
        });
        ServerEventDispatcher.wss.on("error", (err) => {
        });
        ServerEventDispatcher.callbacks = [];
        ServerEventDispatcher.wss.on("connection", this.connection);
    }
    static broadcast(json, newFlag) {
        return __awaiter(this, void 0, void 0, function* () {
            var payloadString = JSON.stringify(json);
            var project = yield project_1.ProjectOperations.findProject(json.project);
            var uniqueConnectionClients = [];
            var uniqueConnections = [];
            for (var i = 0; i < this.connections.length; i++) {
                if (uniqueConnectionClients.indexOf(this.connections[i].clientId) == -1) {
                    uniqueConnectionClients.push(this.connections[i].clientId);
                    uniqueConnections.push(this.connections[i]);
                }
            }
            var clientArray = String(project.clients);
            var filteredConnections = [];
            if (!newFlag) {
                for (var i = 0; i < uniqueConnections.length; i++) {
                    if (clientArray.includes(String(uniqueConnections[i].clientId)) && String(uniqueConnections[i].clientId) != String(json.client._id)) {
                        filteredConnections.push(uniqueConnections[i].connection);
                    }
                }
            }
            else {
                for (var i = 0; i < uniqueConnections.length; i++) {
                    if (clientArray.includes(String(uniqueConnections[i].clientId))) {
                        filteredConnections.push(uniqueConnections[i].connection);
                    }
                }
            }
            for (var i = 0; i < filteredConnections.length; i++) {
                this.send(payloadString, filteredConnections[i]);
            }
        });
    }
    static send(payloadString, connection) {
        connection.send(payloadString, function ack(err) {
            if (err) {
                console.log("ERROR SENDING\n" + err);
            }
        });
    }
    connection(ws, arg) {
        var connection = ws;
        function onMessageEvent(evt) {
            const json = JSON.parse(evt.data);
            console.log(json);
            messageProcessor_1.MessageProcessor.serverMessageProcessor(json, connection);
        }
        function onCloseEvent(evt) {
            var clientId;
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
function main() {
    const app = express();
    app.use(express.static("./static"));
    const server = http.createServer(app);
    const sockServ = new ServerEventDispatcher(server);
    server.listen(process.env.PORT || 8999, () => {
    });
}
main();
