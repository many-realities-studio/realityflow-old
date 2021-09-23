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
exports.TypeORMDatabase = void 0;
const FlowProject_1 = require("../FlowLibrary/FlowProject");
const FlowUser_1 = require("../FlowLibrary/FlowUser");
const FlowObject_1 = require("../FlowLibrary/FlowObject");
const FlowVSGraph_1 = require("../FlowLibrary/FlowVSGraph");
const FlowBehaviour_1 = require("../FlowLibrary/FlowBehaviour");
const project_1 = require("../../ORMCommands/project");
const object_1 = require("../../ORMCommands/object");
const vsgraph_1 = require("../../ORMCommands/vsgraph");
const user_1 = require("../../ORMCommands/user");
const behaviour_1 = require("../../ORMCommands/behaviour");
class TypeORMDatabase {
    constructor(url) { }
    static CreateProject(projectToCreate, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let projectId = yield project_1.ProjectOperations.createProject(projectToCreate, user);
            return yield project_1.ProjectOperations.findProject(projectId);
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
            let idLength = projectId.length;
            let foundprojectId;
            let project;
            if (idLength == 5) {
                project = yield project_1.ProjectOperations.findProjectShortCode(projectId);
            }
            else {
                project = yield project_1.ProjectOperations.findProject(projectId);
            }
            if (!project)
                return null;
            foundprojectId = project.Id;
            let objects = yield project_1.ProjectOperations.getObjects(foundprojectId);
            let vsgraphs = yield project_1.ProjectOperations.getVSGraphs(foundprojectId);
            let behaviours = yield behaviour_1.BehaviourOperations.getBehaviours(foundprojectId);
            vsgraphs.forEach(function (vsGraph) {
                vsGraph.serializedNodes = JSON.parse(vsGraph.serializedNodes);
                vsGraph.edges = JSON.parse(vsGraph.edges);
                vsGraph.groups = JSON.parse(vsGraph.groups);
                vsGraph.stackNodes = JSON.parse(vsGraph.stackNodes);
                vsGraph.pinnedElements = JSON.parse(vsGraph.pinnedElements);
                vsGraph.exposedParameters = vsGraph.exposedParameters;
                vsGraph.stickyNotes = JSON.parse(vsGraph.stickyNotes);
                vsGraph.position = JSON.parse(vsGraph.position);
                vsGraph.scale = JSON.parse(vsGraph.scale);
                vsGraph.references = JSON.parse(vsGraph.references);
                vsGraph.paramIdToObjId = vsGraph.paramIdToObjId;
            });
            let returnProject = new FlowProject_1.FlowProject(project);
            returnProject._ObjectList = objects.map((val, index, arr) => new FlowObject_1.FlowObject(val));
            returnProject._VSGraphList = vsgraphs.map((val, index, arr) => new FlowVSGraph_1.FlowVSGraph(val));
            returnProject._BehaviourList = behaviours.map((Behaviour) => {
                let ret = {};
                ret.Id = Behaviour.Id;
                ret.TypeOfTrigger = Behaviour.TypeOfTrigger;
                ret.TriggerObjectId = Behaviour.TriggerObjectId;
                ret.TargetObjectId = Behaviour.TargetObjectId;
                ret.Action = Behaviour.Action;
                ret.NextBehaviour = JSON.parse(Behaviour.NextBehaviour);
                ret.ProjectId = Behaviour.ProjectId;
                return new FlowBehaviour_1.FlowBehaviour(ret);
            });
            return returnProject;
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
    static fetchProjects(Username) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield project_1.ProjectOperations.fetchProjects(Username));
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
            console.log("typeORM update");
            console.log(objectToUpdate);
            yield object_1.ObjectOperations.updateObject(objectToUpdate, projectId);
        });
    }
    static GetObject(ObjectId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new FlowObject_1.FlowObject(yield object_1.ObjectOperations.findObject(ObjectId, projectId));
        });
    }
    static CreateBehaviour(BehaviourToCreate) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = {};
            ret.Id = BehaviourToCreate.Id;
            ret.TypeOfTrigger = BehaviourToCreate.TypeOfTrigger;
            ret.TriggerObjectId = BehaviourToCreate.TriggerObjectId;
            ret.TargetObjectId = BehaviourToCreate.TargetObjectId;
            ret.Action = JSON.stringify(BehaviourToCreate.Action);
            ret.NextBehaviour = JSON.stringify(BehaviourToCreate.NextBehaviour);
            ret.ProjectId = BehaviourToCreate.ProjectId;
            console.log(BehaviourToCreate.Action);
            yield behaviour_1.BehaviourOperations.CreateBehaviour(ret);
        });
    }
    static DeleteBehaviour(BehaviourIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield behaviour_1.BehaviourOperations.deleteBehaviour(BehaviourIds);
        });
    }
    static LinkNewToOld(projectId, child, parents) {
        return __awaiter(this, void 0, void 0, function* () {
            yield behaviour_1.BehaviourOperations.LinkNewToOld(projectId, child, parents);
        });
    }
    static UpdateBehaviour(BehaviourToUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = {};
            ret.Id = BehaviourToUpdate.Id;
            ret.TypeOfTrigger = BehaviourToUpdate.TypeOfTrigger;
            ret.TriggerObjectId = BehaviourToUpdate.TriggerObjectId;
            ret.TargetObjectId = BehaviourToUpdate.TargetObjectId;
            ret.Action = JSON.stringify(BehaviourToUpdate.Action);
            ret.NextBehaviour = JSON.stringify(BehaviourToUpdate.NextBehaviour);
            ret.ProjectId = BehaviourToUpdate.ProjectId;
            yield behaviour_1.BehaviourOperations.updateBehaviour(ret);
        });
    }
    static getBehaviours(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            let Behaviours = yield behaviour_1.BehaviourOperations.getBehaviours(projectId);
            let flowBehaviours = Behaviours.map((Behaviour) => {
                let ret = {};
                ret.Id = Behaviour.Id;
                ret.TypeOfTrigger = Behaviour.TypeOfTrigger;
                ret.TriggerObjectId = Behaviour.TriggerObjectId;
                ret.TargetObjectId = Behaviour.TargetObjectId;
                ret.Action = Behaviour.Action;
                ret.NextBehaviour = JSON.parse(Behaviour.NextBehaviour);
                ret.ProjectId = Behaviour.ProjectId;
                return new FlowBehaviour_1.FlowBehaviour(ret);
            });
            return flowBehaviours;
        });
    }
    static CreateVSGraph(vsGraphToCreate, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield vsgraph_1.VSGraphOperations.createVSGraph(vsGraphToCreate, projectId);
        });
    }
    static DeleteVSGraph(graphId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield vsgraph_1.VSGraphOperations.deleteVSGraph(graphId, projectId);
        });
    }
    static UpdateVSGraph(vsGraphToUpdate, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("typeORM VSGRAPH update");
            console.log(vsGraphToUpdate);
            yield vsgraph_1.VSGraphOperations.updateVSGraph(vsGraphToUpdate, projectId);
        });
    }
    static GetVSGraph(VSGraphId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new FlowVSGraph_1.FlowVSGraph(yield vsgraph_1.VSGraphOperations.findVSGraph(VSGraphId, projectId));
        });
    }
}
exports.default = TypeORMDatabase;
exports.TypeORMDatabase = TypeORMDatabase;
//# sourceMappingURL=TypeORMDatabase.js.map