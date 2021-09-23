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
const project_1 = require("../../ORMCommands/project");
const object_1 = require("../../ORMCommands/object");
const user_1 = require("../../ORMCommands/user");
const FlowProject_1 = require("../FlowLibrary/FlowProject");
const FlowObject_1 = require("../FlowLibrary/FlowObject");
const TypeORMDatabase_1 = require("./TypeORMDatabase");
const project_2 = require("../../entity/project");
const behaviour_1 = require("../../ORMCommands/behaviour");
describe("UserOperations", () => {
    jest.mock("../../ORMCommands/user");
    it('Should be able to create a User', () => __awaiter(void 0, void 0, void 0, function* () {
        var testUser = {
            Username: "Yesh",
            Password: "test"
        };
        let mockCreateUser = jest.fn((username, pasword) => __awaiter(void 0, void 0, void 0, function* () { }));
        user_1.UserOperations.createUser = mockCreateUser;
        yield TypeORMDatabase_1.default.CreateUser(testUser.Username, testUser.Password);
        expect(mockCreateUser).toBeCalledWith(testUser.Username, testUser.Password);
    }));
    it("should find a user", () => __awaiter(void 0, void 0, void 0, function* () {
        var testUser = {
            username: "Yash",
            password: "test"
        };
        let mockFetchProjects = jest.fn((username) => __awaiter(void 0, void 0, void 0, function* () { return [new project_2.Project()]; }));
        project_1.ProjectOperations.fetchProjects = mockFetchProjects;
        yield TypeORMDatabase_1.default.GetUser(testUser.username);
        expect(mockFetchProjects).toBeCalledWith(testUser.username);
    }));
    it("should update a user", () => __awaiter(void 0, void 0, void 0, function* () {
    }));
    it('should delete a user from a collection', () => __awaiter(void 0, void 0, void 0, function* () {
        var testUser = {
            username: "Yash",
            password: "test"
        };
        let mockDeleteUser = jest.fn((username) => __awaiter(void 0, void 0, void 0, function* () { }));
        user_1.UserOperations.deleteUser = mockDeleteUser;
        yield user_1.UserOperations.deleteUser(testUser.username);
        expect(mockDeleteUser).toBeCalledWith(testUser.username);
    }));
});
describe("ObjectOperations", () => {
    it('should create an object', () => __awaiter(void 0, void 0, void 0, function* () {
        var testProject2 = {
            Id: "TestProject2",
            Description: "This is a project",
            ProjectName: "TestProject2",
            DateModified: Date.now(),
        };
        var object1 = new FlowObject_1.FlowObject({
            Id: "objectId",
            name: "object1",
            X: 3,
            Y: 1,
            Z: 1,
            Q_x: 1,
            Q_y: 1,
            Q_z: 1,
            Q_w: 1,
            S_x: 1,
            S_y: 1,
            S_z: 1,
        });
        let mockCreateObject = jest.fn((objectInfo, projectId) => __awaiter(void 0, void 0, void 0, function* () { }));
        object_1.ObjectOperations.createObject = mockCreateObject;
        yield TypeORMDatabase_1.default.CreateObject(object1, testProject2.Id);
        expect(mockCreateObject).toBeCalledWith(object1, testProject2.Id);
    }));
    it('should modify an object', () => __awaiter(void 0, void 0, void 0, function* () {
        var testProject2 = {
            Id: "TestProject2",
            Description: "This is a project",
            ProjectName: "TestProject2",
            DateModified: Date.now(),
        };
        var object1 = new FlowObject_1.FlowObject({
            type: "string",
            name: "object1",
            triangles: [1, 2, 3],
            x: 3,
            y: 1,
            z: 1,
            q_x: 1,
            q_y: 1,
            q_z: 1,
            q_w: 1,
            s_x: 1,
            s_y: 1,
            s_z: 1,
            color: {},
            vertices: [1, 2],
            uv: [2, 34],
            texture: [1, 3],
            textureHeight: 1,
            textureWidth: 1,
            textureFormat: 1,
            mipmapCount: 1,
            locked: false,
            path: "here"
        });
        let mockUpdateObject = jest.fn((objectInfo, projectId) => __awaiter(void 0, void 0, void 0, function* () { }));
        object_1.ObjectOperations.updateObject = mockUpdateObject;
        yield TypeORMDatabase_1.default.UpdateObject(object1, testProject2.Id);
        expect(mockUpdateObject).toBeCalledWith(object1, testProject2.Id);
    }));
    it("should delete an object", () => __awaiter(void 0, void 0, void 0, function* () {
        let mockDeleteObject = jest.fn((objectInfo, projectId) => __awaiter(void 0, void 0, void 0, function* () { }));
        object_1.ObjectOperations.deleteObject = mockDeleteObject;
        yield TypeORMDatabase_1.default.DeleteObject("object1", "testProject2.Id");
        expect(mockDeleteObject).toBeCalledWith("object1", "testProject2.Id");
    }));
});
describe("ProjectOperations", () => {
    it('should create a project', () => __awaiter(void 0, void 0, void 0, function* () {
        var testProject1 = new FlowProject_1.FlowProject({
            Id: "TestProjectId",
            Description: "This is a project",
            ProjectName: "TestProject1",
            DateModified: Date.now(),
        });
        var testUser = {
            Username: "Yash",
            Password: "test"
        };
        jest.mock("../../ORMCommands/project");
        let fakeFindProject = jest.fn((projectId) => __awaiter(void 0, void 0, void 0, function* () { return new project_2.Project(); }));
        project_1.ProjectOperations.findProject = fakeFindProject;
        let mockCreateProject = jest.fn((project, username) => __awaiter(void 0, void 0, void 0, function* () {
            let p = new project_2.Project();
            p.Id = "testProject1Id",
                p.Description = "This is a project";
            p.ProjectName = "TestProject1";
            p.DateModified = Date.now();
            return p.Id;
        }));
        project_1.ProjectOperations.createProject = mockCreateProject;
        yield TypeORMDatabase_1.default.CreateProject(testProject1, testUser.Username);
        expect(mockCreateProject).toBeCalledWith(testProject1, testUser.Username);
    }));
    it('should find a project', () => __awaiter(void 0, void 0, void 0, function* () {
        var testProject1 = new FlowProject_1.FlowProject({
            Id: "TestProjectId",
            Description: "This is a project",
            ProjectName: "TestProject1",
            DateModified: Date.now(),
        });
        var testUser = {
            Username: "Yash",
            Password: "test"
        };
        jest.mock("../../ORMCommands/project");
        let fakeFindProject = jest.fn((projectId) => __awaiter(void 0, void 0, void 0, function* () { return new project_2.Project(); }));
        project_1.ProjectOperations.findProject = fakeFindProject;
        let fakeGetObjects = jest.fn((projectId) => __awaiter(void 0, void 0, void 0, function* () { return []; }));
        project_1.ProjectOperations.getObjects = fakeGetObjects;
        let fakeGetVSGraphs = jest.fn((projectId) => __awaiter(void 0, void 0, void 0, function* () { return []; }));
        project_1.ProjectOperations.getVSGraphs = fakeGetVSGraphs;
        let fakeGetBehaviours = jest.fn((projectId) => __awaiter(void 0, void 0, void 0, function* () { return []; }));
        behaviour_1.BehaviourOperations.getBehaviours = fakeGetBehaviours;
        yield TypeORMDatabase_1.default.GetProject(testProject1.Id);
        expect(fakeFindProject).toBeCalledWith(testProject1.Id);
    }));
    it('should delete a project from a collection', () => __awaiter(void 0, void 0, void 0, function* () {
        var testProject1 = new FlowProject_1.FlowProject({
            Id: "TestProjectId",
            Description: "This is a project",
            ProjectName: "TestProject1",
            DateModified: Date.now(),
        });
        let mockDeleteProject = jest.fn((projectId) => __awaiter(void 0, void 0, void 0, function* () { }));
        project_1.ProjectOperations.deleteProject = mockDeleteProject;
        yield TypeORMDatabase_1.default.DeleteProject(testProject1.Id);
        expect(mockDeleteProject).toBeCalledWith(testProject1.Id);
    }));
});
//# sourceMappingURL=TypeORMDatabase.test.js.map