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
const RoomManager_1 = require("../RoomManager");
const FlowProject_1 = require("../FlowLibrary/FlowProject");
const TypeORMDatabase_1 = require("../Database/TypeORMDatabase");
const databaseUserCreationMock = jest.fn();
jest.mock('../Database/TypeORMDatabase');
describe("RoomManager,", () => {
    it("can create rooms", () => __awaiter(void 0, void 0, void 0, function* () {
        const projectID = "1234";
        const TypeORMGetProjectMock = jest.fn((projectID) => __awaiter(void 0, void 0, void 0, function* () { return new FlowProject_1.FlowProject({}); }));
        TypeORMDatabase_1.default.GetProject = TypeORMGetProjectMock;
        expect(RoomManager_1.RoomManager._RoomCount).toBe(0);
        RoomManager_1.RoomManager.CreateRoom(projectID);
        expect(TypeORMGetProjectMock).toHaveBeenCalledWith(projectID);
        expect(RoomManager_1.RoomManager._RoomCount).toBe(1);
    }));
    it("can find rooms", () => __awaiter(void 0, void 0, void 0, function* () {
        const projectID = "1234";
        const TypeORMGetProjectMock = jest.fn((projectID) => __awaiter(void 0, void 0, void 0, function* () { return new FlowProject_1.FlowProject({}); }));
        TypeORMDatabase_1.default.GetProject = TypeORMGetProjectMock;
        RoomManager_1.RoomManager.CreateRoom(projectID);
        let room = RoomManager_1.RoomManager.FindRoom(projectID);
        expect(room.GetRoomCode()).toBe("1234");
    }));
    it("can destroy rooms", () => __awaiter(void 0, void 0, void 0, function* () {
        const projectID = "1234";
        const TypeORMGetProjectMock = jest.fn((projectID) => __awaiter(void 0, void 0, void 0, function* () { return new FlowProject_1.FlowProject({}); }));
        TypeORMDatabase_1.default.GetProject = TypeORMGetProjectMock;
        RoomManager_1.RoomManager._RoomList = [];
        RoomManager_1.RoomManager._RoomCount = 0;
        RoomManager_1.RoomManager.CreateRoom(projectID);
        expect(RoomManager_1.RoomManager.FindRoom(projectID)).toBeTruthy();
        let count = RoomManager_1.RoomManager._RoomCount;
        RoomManager_1.RoomManager.DestroyRoom(projectID);
        expect(RoomManager_1.RoomManager._RoomCount).toBe((count - 1));
        expect(RoomManager_1.RoomManager.FindRoom(projectID)).toBeFalsy();
    }));
});
//# sourceMappingURL=RoomManager.test.js.map