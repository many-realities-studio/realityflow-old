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
var server_1 = require("../server");
var commands_1 = require("./commands");
var databaseController_1 = require("./databaseController");
// DB API
var project_1 = require("../commands/project");
var FlowClient_1 = require("../flow_classes/FlowClient");
var FlowUser_1 = require("../flow_classes/FlowUser");
var FlowProject_1 = require("../flow_classes/FlowProject");
var FlowObject_1 = require("../flow_classes/FlowObject");
var MessageProcessor = /** @class */ (function () {
    function MessageProcessor() {
    }
    MessageProcessor.serverMessageProcessor = function (json, connection) {
        return __awaiter(this, void 0, void 0, function () {
            var command, request, action, _a, obj, proj, ret, _b, inProj, inClient, inUser, newProject, project, projectClientsArray, clientInProject, i, objects, payloadString, _c, ids, connectionTracker, payloadString, loginData, connectionTracker, x, payloadString, payloadString, connectionIndex, payloadString;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        command = json.command;
                        request = command / 1000;
                        action = command % 100;
                        if (!(request == commands_1.Commands.request.object)) return [3 /*break*/, 7];
                        _a = action;
                        switch (_a) {
                            case commands_1.Commands.action.CREATE: return [3 /*break*/, 1];
                            case commands_1.Commands.action.UPDATE: return [3 /*break*/, 3];
                            case commands_1.Commands.action.DELETE: return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 1:
                        obj = new FlowObject_1.FlowObject(json.obj);
                        proj = new FlowProject_1.FlowProject(json.project);
                        return [4 /*yield*/, databaseController_1.databaseController.CreateObject(obj, proj)];
                    case 2:
                        ret = _d.sent();
                        json.project = ret.project;
                        json.obj._id = ret.object._id;
                        server_1.ServerEventDispatcher.broadcast(ret, true);
                        _d.label = 3;
                    case 3:
                        {
                            server_1.ServerEventDispatcher.broadcast(json, false);
                            return [3 /*break*/, 6];
                        }
                        _d.label = 4;
                    case 4:
                        server_1.ServerEventDispatcher.broadcast(json, true);
                        return [4 /*yield*/, databaseController_1.databaseController.DeleteObject(new FlowProject_1.FlowProject(json.project), new FlowObject_1.FlowObject(json.obj))];
                    case 5:
                        _d.sent();
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 31];
                    case 7:
                        if (!(request == commands_1.Commands.request.project)) return [3 /*break*/, 19];
                        _b = action;
                        switch (_b) {
                            case commands_1.Commands.action.CREATE: return [3 /*break*/, 8];
                            case commands_1.Commands.action.UPDATE: return [3 /*break*/, 10];
                            case commands_1.Commands.action.FETCH: return [3 /*break*/, 11];
                            case commands_1.Commands.action.DELETE: return [3 /*break*/, 16];
                        }
                        return [3 /*break*/, 18];
                    case 8:
                        inProj = new FlowProject_1.FlowProject(json.project);
                        inClient = new FlowClient_1.FlowClient(json.client);
                        inUser = new FlowUser_1.FlowUser(json.user);
                        return [4 /*yield*/, databaseController_1.databaseController.CreateProject(inProj, inUser, inClient)];
                    case 9:
                        newProject = _d.sent();
                        json.project = newProject;
                        server_1.ServerEventDispatcher.send(json, connection);
                        return [3 /*break*/, 18];
                    case 10:
                        {
                            // there's nothing in here????
                            return [3 /*break*/, 18];
                        }
                        _d.label = 11;
                    case 11: return [4 /*yield*/, project_1.ProjectOperations.findProject(json.project)];
                    case 12:
                        project = _d.sent();
                        projectClientsArray = String(project.clients);
                        clientInProject = false;
                        // fix
                        for (i = 0; i < projectClientsArray.length; i++) {
                            if (projectClientsArray[i] == json.client._id) {
                                clientInProject = true;
                            }
                        }
                        if (!!clientInProject) return [3 /*break*/, 14];
                        project.clients.push(json.client._id);
                        return [4 /*yield*/, project.save()];
                    case 13:
                        _d.sent();
                        _d.label = 14;
                    case 14: return [4 /*yield*/, databaseController_1.databaseController.FetchObjects(json)];
                    case 15:
                        objects = _d.sent();
                        json.objs = objects;
                        payloadString = JSON.stringify(json);
                        server_1.ServerEventDispatcher.send(payloadString, connection);
                        return [3 /*break*/, 18];
                    case 16: return [4 /*yield*/, databaseController_1.databaseController.DeleteProject(new FlowProject_1.FlowProject(json.project))];
                    case 17:
                        _d.sent();
                        return [3 /*break*/, 18];
                    case 18: return [3 /*break*/, 31];
                    case 19:
                        if (!(request == commands_1.Commands.request.scene)) return [3 /*break*/, 20];
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
                        return [3 /*break*/, 31];
                    case 20:
                        if (!(request == commands_1.Commands.request.user)) return [3 /*break*/, 31];
                        _c = action;
                        switch (_c) {
                            case commands_1.Commands.action.CREATE: return [3 /*break*/, 21];
                            case commands_1.Commands.action.LOGIN: return [3 /*break*/, 23];
                            case commands_1.Commands.action.LOGOUT: return [3 /*break*/, 25];
                            case commands_1.Commands.action.FETCH: return [3 /*break*/, 27];
                            case commands_1.Commands.action.DELETE: return [3 /*break*/, 28];
                        }
                        return [3 /*break*/, 30];
                    case 21: return [4 /*yield*/, databaseController_1.databaseController.CreateUser(new FlowClient_1.FlowClient(json.client), new FlowUser_1.FlowUser(json.user))];
                    case 22:
                        ids = _d.sent();
                        connectionTracker = {
                            clientId: ids.newClientId,
                            connection: connection
                        };
                        json.client._id = ids.newClientId;
                        json.user._id = ids.newUserId;
                        server_1.ServerEventDispatcher.connections.push(connectionTracker);
                        payloadString = JSON.stringify(json);
                        server_1.ServerEventDispatcher.send(payloadString, connection);
                        return [3 /*break*/, 30];
                    case 23: return [4 /*yield*/, databaseController_1.databaseController.LoginUser(new FlowUser_1.FlowUser(json.user), new FlowClient_1.FlowClient(json.client))];
                    case 24:
                        loginData = _d.sent();
                        if (loginData != null) {
                            connectionTracker = {
                                clientId: loginData.newClientId,
                                connection: connection
                            };
                            // None of this code in itself should be in --messageprocessor.ts--
                            server_1.ServerEventDispatcher.connections.push(connectionTracker);
                            for (x in server_1.ServerEventDispatcher.connections) { }
                            json.client._id = loginData.newClientId;
                            json.user._id = loginData.newUserId;
                            json.projects = loginData.projects;
                            payloadString = JSON.stringify(json);
                            server_1.ServerEventDispatcher.send(payloadString, connection);
                        }
                        else {
                            payloadString = JSON.stringify(json);
                            server_1.ServerEventDispatcher.send(payloadString, connection);
                        }
                        return [3 /*break*/, 30];
                    case 25: return [4 /*yield*/, databaseController_1.databaseController.LogoutUser(new FlowUser_1.FlowUser(json.user), new FlowClient_1.FlowClient(json.client))];
                    case 26:
                        _d.sent();
                        connectionIndex = server_1.ServerEventDispatcher.connections.findIndex(function (x) { return x.clientId === json.client._id; });
                        delete server_1.ServerEventDispatcher.connections[connectionIndex];
                        return [3 /*break*/, 30];
                    case 27:
                        {
                            return [3 /*break*/, 30];
                        }
                        _d.label = 28;
                    case 28: return [4 /*yield*/, databaseController_1.databaseController.DeleteUser(json)];
                    case 29:
                        _d.sent();
                        payloadString = JSON.stringify(json);
                        return [3 /*break*/, 30];
                    case 30: return [3 /*break*/, 31];
                    case 31: return [2 /*return*/];
                }
            });
        });
    };
    return MessageProcessor;
}());
exports.MessageProcessor = MessageProcessor;
