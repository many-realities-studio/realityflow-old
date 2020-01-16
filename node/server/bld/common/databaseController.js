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
const user_1 = require("../commands/user");
const client_1 = require("../commands/client");
const project_1 = require("../commands/project");
const object_1 = require("../commands/object");
class databaseController {
    static createObject(json) {
        return __awaiter(this, void 0, void 0, function* () {
            var object = yield object_1.ObjectOperations.createObject(json.obj);
            var project = yield project_1.ProjectOperations.findProject(json.project);
            project.objs.push(object._id);
            yield project.save();
            json.project = project;
            json.obj._id = object._id;
            return json;
        });
    }
    static updateObject(json) {
        return __awaiter(this, void 0, void 0, function* () {
            yield object_1.ObjectOperations.updateObject(json.obj);
        });
    }
    static deleteObject(json) {
        return __awaiter(this, void 0, void 0, function* () {
            var project = yield project_1.ProjectOperations.findProject(json.project);
            project.objs.splice(project.objs.indexOf(json.obj._id), 1);
            yield project.save();
            yield object_1.ObjectOperations.deleteObject(json.obj);
        });
    }
    static createProject(json) {
        return __awaiter(this, void 0, void 0, function* () {
            var project = yield project_1.ProjectOperations.createProject(json.project, json.client, json.user);
            project.clients.push(json.client._id);
            yield project.save();
            json.project = project;
            var payloadString = JSON.stringify(json);
            return payloadString;
        });
    }
    static fetchObjects(json) {
        return __awaiter(this, void 0, void 0, function* () {
            var project = yield project_1.ProjectOperations.findProject(json.project);
            console.log("hello hello hello \n\n" + project);
            var objectIds = project.objs;
            var objects = [];
            if (objectIds.length > 0) {
                for (var i = 0; i < objectIds.length; i++) {
                    var currentObject = yield object_1.ObjectOperations.findObject(objectIds[i]);
                    objects.push(currentObject);
                }
            }
            return objects;
        });
    }
    static deleteProject(project) {
        return __awaiter(this, void 0, void 0, function* () {
            yield project_1.ProjectOperations.deleteProject(project);
            return;
        });
    }
    static logoutUser(json) {
        return __awaiter(this, void 0, void 0, function* () {
            var user = yield user_1.UserOperations.findUser(json.user);
            var clientArray = user.clients;
            var filteredArray = clientArray.filter(function (value, index, array) {
                return value != json.client._id;
            });
            user.clients = filteredArray;
            client_1.ClientOperations.deleteClient(json.client._id);
            return;
        });
    }
    static loginUser(json) {
        return __awaiter(this, void 0, void 0, function* () {
            json.returnedUser = yield user_1.UserOperations.loginUser(json.user);
            if (json.returnedUser == undefined) {
                return null;
            }
            json.user._id = json.returnedUser._id;
            json.projects = yield project_1.ProjectOperations.fetchProjects(json.returnedUser);
            var newClientId = yield client_1.ClientOperations.createClient(json.client, json.returnedUser._id);
            json.client._id = newClientId.id;
            json.currentUser = yield user_1.UserOperations.findUser(json.returnedUser);
            return json;
        });
    }
    static createUser(json) {
        return __awaiter(this, void 0, void 0, function* () {
            var newUserPayload = yield user_1.UserOperations.createUser(json.user);
            var newClientId = yield client_1.ClientOperations.createClient(json.client, newUserPayload._id);
            newUserPayload.clients.push(newClientId);
            newUserPayload.save();
            json.user._id = newUserPayload._id;
            json.client._id = newClientId;
            return json;
        });
    }
    static deleteUser(json) {
        return __awaiter(this, void 0, void 0, function* () {
            var User = user_1.UserOperations.findUser(json.user);
            var clientArray = User.clients;
            for (var arr in clientArray) {
                client_1.ClientOperations.deleteClient(arr);
            }
            user_1.UserOperations.deleteUser(json.user);
        });
    }
}
exports.databaseController = databaseController;
