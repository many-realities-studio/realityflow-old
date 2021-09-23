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
exports.ServerEventDispatcher = exports.prisma = void 0;
require("reflect-metadata");
const http = require("http");
const WebSocket = require("ws");
const uuid_1 = require("uuid");
const NewMessageProcessor_1 = require("./FastAccessStateTracker/Messages/NewMessageProcessor");
const typeorm_1 = require("typeorm");
const project_1 = require("./ORMCommands/project");
const RoomManager_1 = require("./FastAccessStateTracker/RoomManager");
const user_1 = require("./ORMCommands/user");
const FlowProject_1 = require("./FastAccessStateTracker/FlowLibrary/FlowProject");
const util_1 = require("util");
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const { GraphQLScalarType } = require('graphql');
const fs = require('fs');
const path = require('path');
const fs1 = require('fs');
const path1 = require('path');
const { ApolloServer } = require('apollo-server');
const { info } = require('console');
const { resolvers } = require('./graphql-prisma');
var pm2 = require('pm2');
console.log("Server starting...");
class ServerEventDispatcher {
    constructor(server) {
        ServerEventDispatcher.wss = new WebSocket.Server({
            noServer: true,
        });
        ServerEventDispatcher.wss.on("error", (err) => {
            console.log();
        });
        ServerEventDispatcher.callbacks = [];
        ServerEventDispatcher.wss.on('connection', this.connection);
        server.on("upgrade", (request, socket, head) => __awaiter(this, void 0, void 0, function* () {
            let auth_header;
            let dashboardConnection = false;
            if (request.headers.authorization === null || request.headers.authorization === undefined) {
                auth_header = request.headers.cookie;
                dashboardConnection = true;
            }
            else
                auth_header = request.headers.authorization;
            let [authenticated, id, user, payload] = yield ServerEventDispatcher.authenticate(auth_header);
            if (authenticated)
                ServerEventDispatcher.wss.handleUpgrade(request, socket, head, function done(ws) {
                    ServerEventDispatcher.wss.emit('connection', ws, request);
                    ws.ID = id;
                    ws.username = user;
                    ws.send(JSON.stringify(payload));
                    if (dashboardConnection) {
                        ServerEventDispatcher.dashboardConnections.set(id, ws);
                        ws.dashboard = true;
                    }
                    ServerEventDispatcher.SocketConnections.set(id, ws);
                });
            else
                socket.destroy();
        }));
    }
    static send(payloadString, connection) {
        connection.send(payloadString, function ack(err) {
            if (err) {
                console.log(err);
            }
        });
    }
    static authenticate(auth_header) {
        return __awaiter(this, void 0, void 0, function* () {
            if (util_1.isNullOrUndefined(auth_header) || auth_header == "") {
                console.log("authentication header not sent");
                return [false, "", "", ""];
            }
            let rawAuth = Buffer.from(auth_header.replace('Basic ', ''), 'base64').toString();
            let splitIndex = rawAuth.indexOf(":");
            let user = rawAuth.slice(0, splitIndex);
            let pass = rawAuth.slice(splitIndex + 1);
            console.log("user is " + user);
            let message = {
                "__type": "Login_SendToServer:#Packages.realityflow_package.Runtime.scripts.Messages.UserMessages",
                "Message": null,
                "MessageType": "LoginUser",
                "FlowUser": {
                    "Password": pass,
                    "Username": user
                }
            };
            let id = uuid_1.v4();
            let res = yield NewMessageProcessor_1.NewMessageProcessor.ParseMessage(id, message);
            console.log(res);
            let payload = JSON.parse(res[0]);
            console.log(payload);
            return [payload["WasSuccessful"], id, user, payload];
        });
    }
    connection(ws, req) {
        console.log("tried connect");
        function onMessageEvent(evt) {
            console.log(evt);
            try {
                const json = JSON.parse(evt);
                json.user = ws.username;
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
        function onCloseEvent() {
            NewMessageProcessor_1.NewMessageProcessor.ParseMessage(ws.ID, {
                "FlowUser": {
                    "Username": ws.username,
                    "Password": "pass"
                },
                "MessageType": "LogoutUser"
            });
            ServerEventDispatcher.SocketConnections.delete(ws.ID);
        }
        function onErrorEvent(evt) {
        }
        ws.on('message', onMessageEvent);
        pm2.connect(function (err) {
            if (err) {
                console.error(err);
                process.exit(2);
            }
            pm2.launchBus(function (err, bus) {
                console.log("connected bus");
                bus.on('log:out', function (packet) {
                    if (ws.dashboard)
                        ws.send(JSON.stringify(packet));
                });
            });
        });
        ws.on('close', () => {
            pm2.disconnect();
            let logoutMessage = JSON.stringify({
                "FlowUser": {
                    "Username": ws.username,
                    "Password": "pass"
                },
                "MessageType": "LogoutUser"
            });
            ws.emit('message', logoutMessage);
        });
    }
}
exports.ServerEventDispatcher = ServerEventDispatcher;
ServerEventDispatcher.connections = [];
ServerEventDispatcher.SocketConnections = new Map();
ServerEventDispatcher.dashboardConnections = new Map();
;
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield typeorm_1.createConnection("prod").then((res) => __awaiter(void 0, void 0, void 0, function* () {
            process.env.NODE_ENV = "prod";
            console.log("Is connected", res.isConnected);
            try {
                yield user_1.UserOperations.createUser("God", "Jesus");
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
const server1 = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, '../../../schema.graphql'), 'utf8'),
    resolvers,
    context: {
        prisma: exports.prisma,
    }
});
const server = http.createServer();
new ServerEventDispatcher(server);
try {
    let port = process.env.PORT || 8999;
    server.listen({ "port": port, "host": "localhost" }, () => {
        console.log("SYSTEM READY on port " + port);
    });
}
catch (err) {
    console.log(err);
}
server1
    .listen()
    .then(({ url }) => console.log(`Server is running on ${url}`));
//# sourceMappingURL=server.js.map