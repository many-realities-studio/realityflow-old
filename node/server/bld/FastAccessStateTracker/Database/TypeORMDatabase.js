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
const FlowProject_1 = require("../FlowLibrary/FlowProject");
const FlowUser_1 = require("../FlowLibrary/FlowUser");
const FlowObject_1 = require("../FlowLibrary/FlowObject");
const project_1 = require("../../ORMCommands/project");
const object_1 = require("../../ORMCommands/object");
const user_1 = require("../../ORMCommands/user");
class TypeORMDatabase {
    constructor(url) { }
    static CreateProject(projectToCreate, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let newProject = yield project_1.ProjectOperations.createProject(projectToCreate, user);
        });
    }
    static DeleteProject(projectToDeleteId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield project_1.ProjectOperations.deleteProject(projectToDeleteId);
            return;
        });
    }
    static UpdateProject(projectToUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
    static GetProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new FlowProject_1.FlowProject(project_1.ProjectOperations.findProject(projectId));
        });
    }
    static CreateUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var newUser = yield user_1.UserOperations.createUser(username, password);
        });
    }
    static DeleteUser(userToDelete) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_1.UserOperations.deleteUser(userToDelete);
        });
    }
    static GetUser(Username) {
        return __awaiter(this, void 0, void 0, function* () {
            let UserProjects = yield project_1.ProjectOperations.fetchProjects(Username);
            let projects = UserProjects.map((val, index, list) => val.Id);
            return new FlowUser_1.FlowUser(Username, undefined, projects);
        });
    }
    static AuthenticateUser(Username, Password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield user_1.UserOperations.authenticateUser(Username, Password);
            if (!user)
                return false;
            return true;
        });
    }
    static CreateObject(objectToCreate, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield object_1.ObjectOperations.createObject(objectToCreate, projectId);
        });
    }
    static DeleteObject(objectId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield object_1.ObjectOperations.deleteObject(objectId, projectId);
        });
    }
    static UpdateObject(objectToUpdate, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield object_1.ObjectOperations.updateObject(objectToUpdate, projectId);
        });
    }
    static GetObject(ObjectId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new FlowObject_1.FlowObject(yield object_1.ObjectOperations.findObject(ObjectId, projectId));
        });
    }
}
exports.default = TypeORMDatabase;
exports.TypeORMDatabase = TypeORMDatabase;
//# sourceMappingURL=TypeORMDatabase.js.map