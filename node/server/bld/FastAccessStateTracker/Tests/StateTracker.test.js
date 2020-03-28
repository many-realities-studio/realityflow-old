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
const StateTracker_1 = require("../StateTracker");
const TypeORMDatabase_1 = require("../Database/TypeORMDatabase");
const RoomManager_1 = require("../RoomManager");
const FlowProject_1 = require("../FlowLibrary/FlowProject");
const project_1 = require("../../entity/project");
const FlowObject_1 = require("../FlowLibrary/FlowObject");
const databaseUserCreationMock = jest.fn();
let roomManager;
jest.mock('../Database/TypeORMDatabase');
jest.mock('../RoomManager');
jest.mock('../../ORMCommands/project');
const fakeJoinRoom = jest.fn((roomCode, username, client) => __awaiter(void 0, void 0, void 0, function* () { }));
RoomManager_1.RoomManager.JoinRoom = fakeJoinRoom;
const fakeLeaveRoom = jest.fn((roomCode, username, client) => __awaiter(void 0, void 0, void 0, function* () { }));
RoomManager_1.RoomManager.LeaveRoom = fakeLeaveRoom;
const fakeDestroyRoom = jest.fn((roomCode) => new Map());
RoomManager_1.RoomManager.DestroyRoom = fakeDestroyRoom;
const fakeGetClients = jest.fn((roomCode) => {
    let x = new Map();
    x.set("testUser", ["testClient1", "testClient2"]);
    return x;
});
RoomManager_1.RoomManager.getClients = fakeGetClients;
const fakeAuthentication = jest.fn((username, password) => __awaiter(void 0, void 0, void 0, function* () { return true; }));
TypeORMDatabase_1.default.AuthenticateUser = fakeAuthentication;
const TypeORMProjectDeleteMock = jest.fn((projectToDelete) => __awaiter(void 0, void 0, void 0, function* () { }));
TypeORMDatabase_1.default.DeleteProject = TypeORMProjectDeleteMock;
const TypeORMUserDeleteMock = jest.fn((userToDelete) => __awaiter(void 0, void 0, void 0, function* () { }));
TypeORMDatabase_1.default.DeleteUser = TypeORMUserDeleteMock;
const TypeORMProjectCreateMock = jest.fn((projectToCreate) => __awaiter(void 0, void 0, void 0, function* () { return new project_1.Project(); }));
TypeORMDatabase_1.default.CreateProject = TypeORMProjectCreateMock;
const TypeORMObjectCreateMock = jest.fn((objectToCreate, projectId) => __awaiter(void 0, void 0, void 0, function* () { }));
TypeORMDatabase_1.default.CreateObject = TypeORMObjectCreateMock;
const TypeORMBehaviorCreateMock = jest.fn((BehaviorToCreate, objectId) => __awaiter(void 0, void 0, void 0, function* () { }));
TypeORMDatabase_1.default.CreateBehavior = TypeORMBehaviorCreateMock;
const TypeORMProjectGetMock = jest.fn((projectToGet) => __awaiter(void 0, void 0, void 0, function* () {
    return new FlowProject_1.FlowProject({
        Id: projectToGet,
        Description: "TestDescription",
        DateModified: Date.now(),
        ProjectName: "hello"
    });
}));
TypeORMDatabase_1.default.GetProject = TypeORMProjectGetMock;
TypeORMDatabase_1.default.fetchProjects = jest.fn(() => __awaiter(void 0, void 0, void 0, function* () { return []; }));
let checkoutManager = new Map();
describe("User", () => {
    it("can be created", () => __awaiter(void 0, void 0, void 0, function* () {
        const testUser = {
            Username: "YashStateTracker",
            Password: "StateTrackerYash",
            Client: "yashsClient"
        };
        const TypeORMUserCreateMock = jest.fn((userName, Password) => __awaiter(void 0, void 0, void 0, function* () { }));
        TypeORMDatabase_1.default.CreateUser = TypeORMUserCreateMock;
        yield StateTracker_1.StateTracker.CreateUser(testUser.Username, testUser.Password, testUser.Client);
        expect(TypeORMUserCreateMock).toHaveBeenCalledWith(testUser.Username, testUser.Password);
    }));
    it("can be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        const testUser = {
            Username: "YashStateTracker",
            Password: "StateTrackerYash"
        };
        yield StateTracker_1.StateTracker.DeleteUser(testUser.Username, testUser.Password);
        expect(TypeORMUserDeleteMock).toHaveBeenCalledWith(testUser.Username);
    }));
    it("can be logged in", () => __awaiter(void 0, void 0, void 0, function* () {
        const testUser = {
            Username: "yash",
            Password: "yashsPassword",
            Client: "yashsClient"
        };
        yield StateTracker_1.StateTracker.LoginUser(testUser.Username, testUser.Password, testUser.Client);
        expect(fakeAuthentication).toBeCalledWith(testUser.Username, testUser.Password);
        expect(fakeJoinRoom).lastCalledWith("noRoom", testUser.Username, testUser.Client);
        expect(StateTracker_1.StateTracker.currentUsers.get(testUser.Username)).toBeTruthy();
        expect(StateTracker_1.StateTracker.currentUsers.get(testUser.Username).get(testUser.Client)).toEqual("noRoom");
    }));
    it("can be logged out", () => __awaiter(void 0, void 0, void 0, function* () {
        const testUser = {
            Username: "yash",
            Password: "yashsPassword",
            Client: "yashsClient"
        };
        const testUser2 = {
            Username: "yash",
            Password: "yashsPassword2",
            Client: "yashsClient2"
        };
        yield StateTracker_1.StateTracker.LoginUser(testUser.Username, testUser.Password, testUser.Client);
        yield StateTracker_1.StateTracker.LoginUser(testUser2.Username, testUser2.Password, testUser2.Client);
        expect(fakeAuthentication).toBeCalledWith(testUser.Username, testUser.Password);
        expect(fakeJoinRoom).toBeCalledWith("noRoom", testUser.Username, testUser.Client);
        expect(StateTracker_1.StateTracker.currentUsers.get(testUser.Username)).toBeTruthy();
        expect(StateTracker_1.StateTracker.currentUsers.get(testUser.Username).get(testUser.Client)).toEqual("noRoom");
        yield StateTracker_1.StateTracker.LogoutUser(testUser.Username, testUser.Password, testUser.Client);
        expect(fakeAuthentication).toBeCalledWith(testUser.Username, testUser.Password);
        expect(fakeLeaveRoom).toBeCalledWith("noRoom", testUser.Username, testUser.Client);
        expect(StateTracker_1.StateTracker.currentUsers.get(testUser.Username)).toBeTruthy();
        expect(StateTracker_1.StateTracker.currentUsers.get(testUser.Username).get(testUser.Client)).toBeFalsy();
        yield StateTracker_1.StateTracker.LogoutUser(testUser2.Username, testUser2.Password, testUser2.Client);
        expect(fakeAuthentication).toBeCalledWith(testUser2.Username, testUser2.Password);
        expect(fakeLeaveRoom).toBeCalledWith("noRoom", testUser2.Username, testUser2.Client);
        expect(StateTracker_1.StateTracker.currentUsers.get(testUser2.Username)).toBeFalsy();
    }));
    it("can join a room", () => __awaiter(void 0, void 0, void 0, function* () {
        const testUser = {
            Username: "yash",
            Password: "yashsPassword",
            Client: "yashsClient"
        };
        const testUser2 = {
            Username: "yash",
            Password: "yashsPassword",
            Client: "yashsClient2"
        };
        yield StateTracker_1.StateTracker.LoginUser(testUser.Username, testUser.Password, testUser.Client);
        yield StateTracker_1.StateTracker.LoginUser(testUser2.Username, testUser2.Password, testUser2.Client);
        expect(fakeAuthentication).toBeCalledWith(testUser.Username, testUser.Password);
        expect(fakeJoinRoom).toBeCalledWith("noRoom", testUser.Username, testUser.Client);
        expect(StateTracker_1.StateTracker.currentUsers.get(testUser.Username)).toBeTruthy();
        expect(StateTracker_1.StateTracker.currentUsers.get(testUser.Username).get(testUser.Client)).toEqual("noRoom");
        yield StateTracker_1.StateTracker.JoinRoom("roomyRoom", testUser.Username, testUser.Client);
        expect(fakeLeaveRoom).toBeCalledWith("noRoom", testUser.Username, testUser.Client);
        expect(fakeJoinRoom).toBeCalledWith("roomyRoom", testUser.Username, testUser.Client);
        expect(StateTracker_1.StateTracker.currentUsers.get(testUser.Username).get(testUser.Client)).toEqual("roomyRoom");
    }));
});
describe("Project", () => {
    it("can be created", () => __awaiter(void 0, void 0, void 0, function* () {
        var testProject = {
            projectName: "TestProject1",
            Description: "this is a project",
            datemodified: Date.now(),
            Id: "testId"
        };
        const testUser = {
            Username: "YashStateTracker",
            Password: "StateTrackerYash",
            Client: "yashsClient"
        };
        var testFlowProject = new FlowProject_1.FlowProject(testProject);
        yield StateTracker_1.StateTracker.LoginUser(testUser.Username, testUser.Password, testUser.Client);
        yield StateTracker_1.StateTracker.CreateProject(testFlowProject, testUser.Username, testUser.Client);
        expect(TypeORMProjectCreateMock).toHaveBeenCalled();
    }));
    it("can be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        yield StateTracker_1.StateTracker.LoginUser("testUser", "password", "testClient");
        yield StateTracker_1.StateTracker.DeleteProject("testProject", "testUser", "testClient");
        expect(fakeDestroyRoom).toBeCalledWith("testProject");
        expect(TypeORMProjectDeleteMock).toBeCalledWith("testProject");
    }));
    it("can be opened", () => __awaiter(void 0, void 0, void 0, function* () {
        yield StateTracker_1.StateTracker.LoginUser("testUser", "password", "testClient");
        yield StateTracker_1.StateTracker.OpenProject("newProject", "testUser", "testClient");
        expect(TypeORMProjectGetMock).toBeCalledWith("newProject");
    }));
});
describe("Object", () => {
    it("Can be created", () => __awaiter(void 0, void 0, void 0, function* () {
        var createdObject = new FlowObject_1.FlowObject({
            Id: "createdObjectId",
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
            R: 1,
            G: 1,
            B: 1,
            A: 1,
        });
        yield StateTracker_1.StateTracker.CreateObject(createdObject, "projectId");
        expect(TypeORMObjectCreateMock).toHaveBeenCalled();
    }));
    it("Can be read", () => __awaiter(void 0, void 0, void 0, function* () {
        let fakeRead = jest.fn((projectId, userId) => new FlowObject_1.FlowObject({}));
        RoomManager_1.RoomManager.ReadObject = fakeRead;
        yield StateTracker_1.StateTracker.ReadObject("ObjectId", "projectId", "client");
        expect(fakeRead).toHaveBeenCalled();
    }));
    it("can be updated", () => __awaiter(void 0, void 0, void 0, function* () {
        let fakeUpdate = jest.fn(() => true);
        RoomManager_1.RoomManager.updateObject = fakeUpdate;
        var updatedObject = new FlowObject_1.FlowObject({
            Id: "updatedObjectId",
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
            R: 1,
            G: 1,
            B: 1,
            A: 1,
        });
        yield StateTracker_1.StateTracker.UpdateObject(updatedObject, "projectId", "client");
        expect(fakeUpdate).toHaveBeenCalled();
    }));
    it("can be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        let fakeDelete = jest.fn(() => true);
        RoomManager_1.RoomManager.DeleteObject = fakeDelete;
        yield StateTracker_1.StateTracker.DeleteObject("ObjectId", "projectId", "client");
        expect(fakeDelete).toHaveBeenCalled();
    }));
});
describe("checkout system", () => {
    it("allows an object to be checked out", () => __awaiter(void 0, void 0, void 0, function* () {
        let fakeCheckout = jest.fn(() => true);
        RoomManager_1.RoomManager.checkoutObject = fakeCheckout;
        yield StateTracker_1.StateTracker.CheckoutObject("projectId", "objectId", "client");
        expect(fakeCheckout).toHaveBeenCalled();
    }));
    it("allows an object to be checked in", () => __awaiter(void 0, void 0, void 0, function* () {
        let fakeCheckin = jest.fn(() => true);
        RoomManager_1.RoomManager.checkinObject = fakeCheckin;
        yield StateTracker_1.StateTracker.CheckinObject("projectId", "objectId", "client");
        expect(fakeCheckin).toHaveBeenCalled();
    }));
});
describe("Behavior", () => {
    it("Can be created", () => __awaiter(void 0, void 0, void 0, function* () {
        var createdBehavior = StateTracker_1.StateTracker.listifyBehavior({
            Name: "testBehavior",
            Id: "createdBehaviorId",
            Trigger: "triggerObjectId",
            Target: "targetObjectId",
            Index: "1234",
            ChainOwner: "Owner",
        });
        let projectId = "1234";
        RoomManager_1.RoomManager.CreateRoom(projectId);
        yield StateTracker_1.StateTracker.CreateBehavior(createdBehavior, "objectId", projectId);
        expect(TypeORMBehaviorCreateMock).toHaveBeenCalled();
    }));
    it("can be deleted", () => {
    });
});
//# sourceMappingURL=StateTracker.test.js.map