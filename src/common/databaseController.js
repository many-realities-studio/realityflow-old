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
// DB API
var user_1 = require("../commands/user");
var client_1 = require("../commands/client");
var project_1 = require("../commands/project");
var object_1 = require("../commands/object");
// note to self - fix things so that they have type declarations
// another note - add error handling
var databaseController = /** @class */ (function () {
    function databaseController() {
    }
    databaseController.CreateObject = function (inputObj, inputProject) {
        return __awaiter(this, void 0, void 0, function () {
            var object, project;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, object_1.ObjectOperations.createObject(inputObj)];
                    case 1:
                        object = _a.sent();
                        return [4 /*yield*/, project_1.ProjectOperations.findProject(inputProject)];
                    case 2:
                        project = _a.sent();
                        project.objs.push(object._id);
                        return [4 /*yield*/, project.save()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { project: project, object: object }];
                }
            });
        });
    };
    databaseController.UpdateObject = function (inputObj) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, object_1.ObjectOperations.updateObject(inputObj)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // weird type shit to beware of here. As far as I can tell it's realistically all just strings,
    // but there's some weird type specification on the mongo side that is definitely not coming from the client
    // so for now I'm going to say that obj._id is of any type. Yay type coercion!
    databaseController.DeleteObject = function (inputProject, inputObj) {
        return __awaiter(this, void 0, void 0, function () {
            var project;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, project_1.ProjectOperations.findProject(project)];
                    case 1:
                        project = _a.sent();
                        project.objs.splice(project.objs.indexOf(inputObj._id), 1);
                        return [4 /*yield*/, project.save()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, object_1.ObjectOperations.deleteObject(inputObj)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    databaseController.CreateProject = function (inProject, inUser, inClient) {
        return __awaiter(this, void 0, void 0, function () {
            var project;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, project_1.ProjectOperations.createProject(inProject, inClient, inUser)];
                    case 1:
                        project = _a.sent();
                        project.clients.push(inClient._id);
                        return [4 /*yield*/, project.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, project];
                }
            });
        });
    };
    databaseController.FetchObjects = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var project, objectIds, objects, i, currentObject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, project_1.ProjectOperations.findProject(json.project)];
                    case 1:
                        project = _a.sent();
                        objectIds = project.objs;
                        objects = [];
                        if (!(objectIds.length > 0)) return [3 /*break*/, 5];
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < objectIds.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, object_1.ObjectOperations.findObject(objectIds[i])];
                    case 3:
                        currentObject = _a.sent();
                        objects.push(currentObject);
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, objects];
                }
            });
        });
    };
    databaseController.DeleteProject = function (project) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, project_1.ProjectOperations.deleteProject(project)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    databaseController.LogoutUser = function (inUser, inClient) {
        return __awaiter(this, void 0, void 0, function () {
            var user, clientArray, filteredArray;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.UserOperations.findUser(inUser)];
                    case 1:
                        user = _a.sent();
                        clientArray = user.clients;
                        filteredArray = clientArray.filter(function (value, index, array) {
                            return value != inClient._id;
                        });
                        user.clients = filteredArray;
                        client_1.ClientOperations.deleteClient(inClient._id);
                        return [2 /*return*/];
                }
            });
        });
    };
    // authenticate user and then return projects
    // and add a client
    databaseController.LoginUser = function (inUser, inClient) {
        return __awaiter(this, void 0, void 0, function () {
            var returnedUser, newUserId, projects, newClient, newClientId, currentUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.UserOperations.loginUser(inUser)];
                    case 1:
                        returnedUser = _a.sent();
                        if (returnedUser == undefined) {
                            return [2 /*return*/, null];
                        }
                        newUserId = returnedUser._id;
                        return [4 /*yield*/, project_1.ProjectOperations.fetchProjects(returnedUser)];
                    case 2:
                        projects = _a.sent();
                        return [4 /*yield*/, client_1.ClientOperations.createClient(inClient, returnedUser._id)];
                    case 3:
                        newClient = _a.sent();
                        newClientId = newClient._id;
                        return [4 /*yield*/, user_1.UserOperations.findUser(returnedUser)];
                    case 4:
                        currentUser = _a.sent();
                        currentUser.clients.push(newClientId);
                        currentUser.save();
                        return [2 /*return*/, { projects: projects, newClientId: newClientId, newUserId: newUserId }];
                }
            });
        });
    };
    databaseController.CreateUser = function (inClient, inUser) {
        return __awaiter(this, void 0, void 0, function () {
            var newUserPayload, newClientId, newUserId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.UserOperations.createUser(inUser)];
                    case 1:
                        newUserPayload = _a.sent();
                        return [4 /*yield*/, client_1.ClientOperations.createClient(inClient, newUserPayload._id)];
                    case 2:
                        newClientId = _a.sent();
                        newUserPayload.clients.push(newClientId);
                        newUserPayload.save();
                        newUserId = newUserPayload._id;
                        return [2 /*return*/, { newUserId: newUserId, newClientId: newClientId }];
                }
            });
        });
    };
    databaseController.DeleteUser = function (inUser) {
        return __awaiter(this, void 0, void 0, function () {
            var User, clientArray, _a, _b, _i, arr;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, user_1.UserOperations.findUser(inUser)];
                    case 1:
                        User = _c.sent();
                        clientArray = User.clients;
                        _a = [];
                        for (_b in clientArray)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        arr = _a[_i];
                        return [4 /*yield*/, client_1.ClientOperations.deleteClient(arr)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, user_1.UserOperations.deleteUser(inUser)];
                    case 6:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return databaseController;
}());
exports.databaseController = databaseController;
