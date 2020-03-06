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
const Room_1 = require("../Room");
const FlowProject_1 = require("../FlowLibrary/FlowProject");
const TypeORMDatabase_1 = require("../Database/TypeORMDatabase");
const FlowUser_1 = require("../FlowLibrary/FlowUser");
jest.mock('../Database/TypeORMDatabase');
const returnProject = jest.fn((projectId) => __awaiter(void 0, void 0, void 0, function* () {
    return new FlowProject_1.FlowProject({
        Id: projectId,
        Description: "This is a test Project",
        DateModified: Date.now(),
        ProjectName: "testProject",
    });
}));
const returnUser = jest.fn((userName) => __awaiter(void 0, void 0, void 0, function* () {
    return new FlowUser_1.FlowUser(userName);
}));
TypeORMDatabase_1.default.GetProject = returnProject;
TypeORMDatabase_1.default.GetUser = returnUser;
describe("Rooms", () => {
    it("Can be created", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        expect(returnProject).toHaveBeenCalledWith("testProjectId");
    }));
    it("Can return its containing project", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        let project = room.GetProject();
        expect(project.Id).toEqual("testProjectId");
        expect(project.Description).toEqual("This is a test Project");
        expect(project.ProjectName).toEqual("testProject");
    }));
    it("Can allow a user to join the room", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        let userName = "Yash";
        let clientId = "YashClient";
        yield room.JoinRoom(userName, clientId);
        expect(returnUser).toHaveBeenCalled();
        expect(room.hasUser(userName)).toBeTruthy();
        expect(room.hasClient(userName, clientId)).toBeTruthy();
    }));
    it("can tell when a user is not in the room", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        let userName = "Yash";
        expect(room.hasUser(userName)).toBeFalsy();
    }));
    it("can tell when a user is not in the room", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        let userName = "Yash";
        let clientId = "testClient";
        expect(room.hasClient(userName, clientId)).toBeFalsy();
    }));
    it("can allow multiple clients to join the room under the same username", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        let userName = "Yash";
        let clientId1 = "YashClient";
        let clientId2 = "YashClient2";
        yield room.JoinRoom(userName, clientId1);
        yield room.JoinRoom(userName, clientId2);
        expect(returnUser).toHaveBeenCalled();
        expect(room.hasClient(userName, clientId1)).toBeTruthy();
        expect(room.hasClient(userName, clientId2)).toBeTruthy();
    }));
    it("Can allow client(s) to leave the room and stops keeping track of user if all its clients have left", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        let userName = "Yash";
        let clientId1 = "YashClient";
        let clientId2 = "YashClient2";
        yield room.JoinRoom(userName, clientId1);
        yield room.JoinRoom(userName, clientId2);
        expect(room.hasClient(userName, clientId1)).toBeTruthy();
        expect(room.hasClient(userName, clientId2)).toBeTruthy();
        expect(room.hasUser(userName)).toBeTruthy();
        yield room.LeaveRoom(userName, clientId1);
        expect(room.hasClient(userName, clientId1)).toBeFalsy();
        yield room.LeaveRoom(userName, clientId2);
        expect(room.hasClient(userName, clientId2)).toBeFalsy();
        expect(room.hasUser(userName)).toBeFalsy();
    }));
    it("Can return its room code", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        expect(room.GetRoomCode()).toEqual("testProjectId");
    }));
    it("Can return all of the clients that are inside it", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = new Room_1.Room("testProjectId");
        yield room.JoinRoom("Yash", "client1");
        yield room.JoinRoom("Yash", "client2");
        yield room.JoinRoom("Nyasha", "client1");
        let clients = room.getClients();
        expect(clients.get("Yash").find(element => element == "client1")).toBeTruthy();
        expect(clients.get("Yash").find(element => element == "client2")).toBeTruthy();
        expect(clients.get("Nyasha").find(element => element == "client1")).toBeTruthy();
    }));
});
//# sourceMappingURL=Room.test.js.map