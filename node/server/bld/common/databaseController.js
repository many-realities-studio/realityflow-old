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
    static createObject(inputObj, inputProject) {
        return __awaiter(this, void 0, void 0, function* () {
            var object = yield object_1.ObjectOperations.createObject(inputObj);
            var project = yield project_1.ProjectOperations.findProject(inputProject);
            project.objs.push(object._id);
            yield project.save();
            return { project, object };
        });
    }
    static updateObject(inputObj) {
        return __awaiter(this, void 0, void 0, function* () {
            yield object_1.ObjectOperations.updateObject(inputObj);
        });
    }
    static deleteObject(inputProject, inputObj) {
        return __awaiter(this, void 0, void 0, function* () {
            var project = yield project_1.ProjectOperations.findProject(project);
            project.objs.splice(project.objs.indexOf(inputObj._id), 1);
            yield project.save();
            yield object_1.ObjectOperations.deleteObject(inputObj);
        });
    }
    static createProject(inProj, inUser, inClient) {
        return __awaiter(this, void 0, void 0, function* () {
            var project = yield project_1.ProjectOperations.createProject(inProj, inClient, inUser);
            project.clients.push(inClient._id);
            yield project.save();
            return project;
        });
    }
    static fetchObjects(json) {
        return __awaiter(this, void 0, void 0, function* () {
            var project = yield project_1.ProjectOperations.findProject(json.project);
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
    static logoutUser(inUser, inClient) {
        return __awaiter(this, void 0, void 0, function* () {
            var user = yield user_1.UserOperations.findUser(inUser);
            var clientArray = user.clients;
            var filteredArray = clientArray.filter(function (value, index, array) {
                return value != inClient._id;
            });
            user.clients = filteredArray;
            client_1.ClientOperations.deleteClient(inClient._id);
            return;
        });
    }
    static loginUser(inUser, inClient) {
        return __awaiter(this, void 0, void 0, function* () {
            let returnedUser = yield user_1.UserOperations.loginUser(inUser);
            if (returnedUser == undefined) {
                return null;
            }
            let newUserId = returnedUser._id;
            let projects = yield project_1.ProjectOperations.fetchProjects(returnedUser);
            var newClient = yield client_1.ClientOperations.createClient(inClient, returnedUser._id);
            let newClientId = newClient._id;
            let currentUser = yield user_1.UserOperations.findUser(returnedUser);
            currentUser.clients.push(newClientId);
            currentUser.save();
            return { projects, newClientId, newUserId };
        });
    }
    static createUser(inClient, inUser) {
        return __awaiter(this, void 0, void 0, function* () {
            var newUserPayload = yield user_1.UserOperations.createUser(inUser);
            var newClientId = yield client_1.ClientOperations.createClient(inClient, newUserPayload._id);
            newUserPayload.clients.push(newClientId);
            newUserPayload.save();
            let newUserId = newUserPayload._id;
            return { newUserId, newClientId };
        });
    }
    static deleteUser(inUser) {
        return __awaiter(this, void 0, void 0, function* () {
            var User = yield user_1.UserOperations.findUser(inUser);
            var clientArray = User.clients;
            for (var arr in clientArray) {
                yield client_1.ClientOperations.deleteClient(arr);
            }
            yield user_1.UserOperations.deleteUser(inUser);
        });
    }
}
exports.databaseController = databaseController;
//# sourceMappingURL=databaseController.js.map