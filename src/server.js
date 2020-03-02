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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express = require("express");
var http = require("http");
var ws_1 = require("ws");
var uuid_1 = require("uuid");
var mongoose = require("mongoose");
mongoose.Promise = Promise;
var NewMessageProcessor_1 = require("./FastAccessStateTracker/Messages/NewMessageProcessor");
var project_1 = require("./commands/project");
var database;
var dburl = "mongodb://127.0.0.1:27017/realityflowdb";
//The main Server class
var ServerEventDispatcher = /** @class */ (function () {
    function ServerEventDispatcher(server) {
        //Setting up the connection to the DB. Currently the address is the
        //default Mongo address
        mongoose.connect(dburl);
        database = mongoose.connection;
        database.on('error', console.error.bind(console, 'connection error: '));
        database.once('open', function () {
            console.log('Database connection successful at ' + dburl);
        });
        ServerEventDispatcher.wss = new ws_1.Server({ server: server }, function (err) {
        });
        ServerEventDispatcher.wss.on("error", function (err) {
        });
        ServerEventDispatcher.callbacks = [];
        ServerEventDispatcher.wss.on("connection", this.connection);
    }
    //Broadcasts to all clients and may or may not include original sender
    ServerEventDispatcher.broadcast = function (json, newFlag) {
        return __awaiter(this, void 0, void 0, function () {
            var payloadString, project, uniqueConnectionClients, uniqueConnections, i, clientArray, filteredConnections, i, i, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payloadString = JSON.stringify(json);
                        return [4 /*yield*/, project_1.ProjectOperations.findProject(json.project)];
                    case 1:
                        project = _a.sent();
                        uniqueConnectionClients = [];
                        uniqueConnections = [];
                        //This ensures uniqueness of the connections, as there was an issue with
                        //connections being added to the array multiple times
                        for (i = 0; i < this.connections.length; i++) {
                            if (uniqueConnectionClients.indexOf(this.connections[i].clientId) == -1) {
                                uniqueConnectionClients.push(this.connections[i].clientId);
                                uniqueConnections.push(this.connections[i]);
                            }
                        }
                        clientArray = String(project.clients);
                        filteredConnections = [];
                        if (!newFlag) {
                            for (i = 0; i < uniqueConnections.length; i++) {
                                //This checks what clients from the client array are from the project in question
                                //as well as making sure it is not the client ID of the original sender
                                if (clientArray.includes(String(uniqueConnections[i].clientId)) && String(uniqueConnections[i].clientId) != String(json.client._id)) {
                                    filteredConnections.push(uniqueConnections[i].connection);
                                }
                            }
                        }
                        else {
                            for (i = 0; i < uniqueConnections.length; i++) {
                                //This checks what clients from the client array are from the project in question
                                if (clientArray.includes(String(uniqueConnections[i].clientId))) {
                                    filteredConnections.push(uniqueConnections[i].connection);
                                }
                            }
                        }
                        //Send the payload to each client that is part of the project,
                        //possibly including the original sender
                        for (i = 0; i < filteredConnections.length; i++) {
                            this.send(payloadString, filteredConnections[i]);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //This function simply takes in whatever JSON payload and sends it to the connection
    ServerEventDispatcher.send = function (payloadString, connection) {
        // let payload = Buffer.alloc(payloadString.length, payloadString);
        connection.send(payloadString, function ack(err) {
            if (err) {
                console.log(err);
            }
        });
    };
    ServerEventDispatcher.prototype.connection = function (ws, arg) {
        // Assign this connection an ID
        ws.ID = uuid_1.v4();
        function onMessageEvent(evt) {
            var json = JSON.parse(evt.data);
            ServerEventDispatcher.SocketConnections[ws.ID] = ws;
            console.log("The ID is ");
            console.log(ws.ID);
            // Swap out for new message processor
            console.log(evt.data);
            var response = NewMessageProcessor_1.NewMessageProcessor.ParseMessage(ws.ID, json);
            for (var i = 0; i < response.affectedClients.length(); i++) {
                ServerEventDispatcher.SocketConnections[i].send(response.payload);
            }
        }
        function onCloseEvent(evt) {
            var clientId;
            delete ServerEventDispatcher.SocketConnections[ws.ID];
        }
        function onErrorEvent(evt) {
        }
        ws.onmessage = onMessageEvent;
        ws.onclose = onCloseEvent;
        ws.onerror = onErrorEvent;
    };
    //This array contains objects that have the client ID and corresponding
    //connection object, so something like [{clientId:whatever, connection: connectionObject }]
    ServerEventDispatcher.connections = [];
    ServerEventDispatcher.SocketConnections = {};
    return ServerEventDispatcher;
}());
exports.ServerEventDispatcher = ServerEventDispatcher;
;
var app = express();
// Use Passport with express
// app.use(passport.initialize());
// app.use(passport.session());
// const initializePassport = require('./passport-config')
// initializePassport(
//   passport,
//   username => User.find(user => user.Username === username),
//   password => User.find(user => user.Password === password)
// );
// passport.serializeUser(User.serializeUser());
// Responsible for reading the session, taking data from the session and unencoding it
// passport.deserializeUser(User.deserializeUser());
app.use(express.static("./static"));
var server = http.createServer(app);
var sockServ = new ServerEventDispatcher(server);
server.listen(process.env.PORT || 8999, function () {
});
