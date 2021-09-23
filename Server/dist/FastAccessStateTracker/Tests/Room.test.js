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
const FlowObject_1 = require("../FlowLibrary/FlowObject");
const FlowVSGraph_1 = require("../FlowLibrary/FlowVSGraph");
const FlowNodeView_1 = require("../FlowLibrary/FlowNodeView");
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
describe("Object in a room", () => {
    it("can be created", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
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
        room.AddObject(createdObject);
        let check = room.GetProject()._ObjectList.find(object => object.Id = createdObject.Id);
        expect(check).toBeTruthy();
    }));
    it("can be read", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var readObject = new FlowObject_1.FlowObject({
            Id: "readObjectId",
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
        room.AddObject(readObject);
        let check = room.ReadObject(readObject.Id);
        expect(check.Id).toEqual(readObject.Id);
    }));
    it("can be checked out", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var oldObject = new FlowObject_1.FlowObject({
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
        room.AddObject(oldObject);
        room.checkoutObject(oldObject.Id, "client");
        let check = room.ReadObject(oldObject.Id);
        expect(check.CurrentCheckout).toEqual("client");
    }));
    it("can be checked in", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var oldObject = new FlowObject_1.FlowObject({
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
        room.AddObject(oldObject);
        room.checkoutObject(oldObject.Id, "client");
        room.checkinObject(oldObject.Id, "client");
        let check = room.ReadObject(oldObject.Id);
        expect(check.CurrentCheckout).toBeFalsy();
    }));
    it("can only be checked in by the right person", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var oldObject = new FlowObject_1.FlowObject({
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
        room.AddObject(oldObject);
        room.checkoutObject(oldObject.Id, "client1");
        room.checkinObject(oldObject.Id, "client2");
        let check = room.ReadObject(oldObject.Id);
        expect(check.CurrentCheckout).toEqual("client1");
    }));
    it("cannot be checked out while it is checked out by someone else.", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var oldObject = new FlowObject_1.FlowObject({
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
        room.AddObject(oldObject);
        room.checkoutObject(oldObject.Id, "client1");
        room.checkoutObject(oldObject.Id, "client2");
        let check = room.ReadObject(oldObject.Id);
        expect(check.CurrentCheckout).toEqual("client1");
    }));
    it("can be updated", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var oldObject = new FlowObject_1.FlowObject({
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
        room.AddObject(oldObject);
        var newObject = new FlowObject_1.FlowObject({
            Id: "updatedObjectId",
            name: "object1",
            X: 666,
            Y: 666,
            Z: 666,
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
        room.checkoutObject(newObject.Id, "client");
        room.updateObject(newObject, "client");
        let check = room.GetProject()._ObjectList.find(object => object.Id = oldObject.Id);
        expect(check.X).toEqual(newObject.X);
    }));
    it("can be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var oldObject = new FlowObject_1.FlowObject({
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
        room.AddObject(oldObject);
        room.checkoutObject(oldObject.Id, "client");
        room.DeleteObject(oldObject.Id, "client");
        let check = room.ReadObject(oldObject.Id);
        expect(check).toBeFalsy();
    }));
});
describe("VSGraph in a room", () => {
    it("can be created", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var createdVSGraph = new FlowVSGraph_1.FlowVSGraph({
            Id: "createdVSGraphId",
            Name: "createdVSGraphName",
            serializedNodes: "[]",
            edges: "[]",
            groups: "[]",
            stackNodes: "[]",
            pinnedElements: "[]",
            exposedParameters: "[]",
            stickyNotes: "[]",
            position: "{\"x\":0,\"y\":0,\"z\":0}",
            scale: "{\"x\":1,\"y\":1,\"z\":1}",
            references: "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}",
            paramIdToObjId: "{\"keys\":[],\"values\":[]}"
        });
        room.AddVSGraph(createdVSGraph);
        let check = room.GetProject()._VSGraphList.find(vsgraph => vsgraph.Id = createdVSGraph.Id);
        expect(check).toBeTruthy();
    }));
    it("can be read", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var readVSGraph = new FlowVSGraph_1.FlowVSGraph({
            Id: "readVSGraphId",
            Name: "readVSGraphName",
            serializedNodes: "[]",
            edges: "[]",
            groups: "[]",
            stackNodes: "[]",
            pinnedElements: "[]",
            exposedParameters: "[]",
            stickyNotes: "[]",
            position: "{\"x\":0,\"y\":0,\"z\":0}",
            scale: "{\"x\":1,\"y\":1,\"z\":1}",
            references: "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}",
            paramIdToObjId: "{\"keys\":[],\"values\":[]}"
        });
        room.AddVSGraph(readVSGraph);
        let check = room.ReadVSGraph(readVSGraph.Id);
        expect(check.Id).toEqual(readVSGraph.Id);
    }));
    it("can be updated", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var oldVSGraph = new FlowVSGraph_1.FlowVSGraph({
            Id: "updatedVSGraphId",
            Name: "updatedVSGraphName",
            serializedNodes: "[]",
            edges: "[]",
            groups: "[]",
            stackNodes: "[]",
            pinnedElements: "[]",
            exposedParameters: "[]",
            stickyNotes: "[]",
            position: "{\"x\":0,\"y\":0,\"z\":0}",
            scale: "{\"x\":1,\"y\":1,\"z\":1}",
            references: "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}",
            paramIdToObjId: "{\"keys\":[],\"values\":[]}"
        });
        room.AddVSGraph(oldVSGraph);
        var newVSGraph = new FlowVSGraph_1.FlowVSGraph({
            Id: "updatedVSGraphId",
            Name: "updatedVSGraphName",
            serializedNodes: "[]",
            edges: "[]",
            groups: "[]",
            stackNodes: "[]",
            pinnedElements: "[]",
            exposedParameters: "[]",
            stickyNotes: "[]",
            position: "{\"x\":0,\"y\":0,\"z\":0}",
            scale: "{\"x\":1,\"y\":1,\"z\":1}",
            references: "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}",
            paramIdToObjId: "{\"keys\":[newParamId],\"values\":[newFlowObjectId]}"
        });
        room.updateVSGraph(newVSGraph, "client");
        let check = room.GetProject()._VSGraphList.find(vsgraph => vsgraph.Id = oldVSGraph.Id);
        expect(check.paramIdToObjId).toEqual(newVSGraph.paramIdToObjId);
    }));
    it("can be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var oldVSGraph = new FlowVSGraph_1.FlowVSGraph({
            Id: "deletedVSGraphId",
            Name: "deletedVSGraphName",
            serializedNodes: "[]",
            edges: "[]",
            groups: "[]",
            stackNodes: "[]",
            pinnedElements: "[]",
            exposedParameters: "[]",
            stickyNotes: "[]",
            position: "{\"x\":0,\"y\":0,\"z\":0}",
            scale: "{\"x\":1,\"y\":1,\"z\":1}",
            references: "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}",
            paramIdToObjId: "{\"keys\":[],\"values\":[]}"
        });
        room.AddVSGraph(oldVSGraph);
        room.DeleteVSGraph(oldVSGraph.Id, "client");
        let check = room.ReadVSGraph(oldVSGraph.Id);
        expect(check).toBeFalsy();
    }));
});
describe("NodeView in a room", () => {
    it("can be read", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var readNodeView = new FlowNodeView_1.FlowNodeView({
            LocalPos: "{\"x\":0,\"y\":0,\"z\":0}",
            NodeGUID: "readNodeViewId",
        });
        room.checkoutNodeView(readNodeView, "client");
        let check = room.ReadNodeView(readNodeView.NodeGUID);
        expect(check.NodeGUID).toEqual(readNodeView.NodeGUID);
    }));
    it("can be checked out", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var oldNodeView = new FlowNodeView_1.FlowNodeView({
            LocalPos: "{\"x\":0,\"y\":0,\"z\":0}",
            NodeGUID: "updatedNodeViewId",
        });
        room.checkoutNodeView(oldNodeView, "client");
        let check = room.ReadNodeView(oldNodeView.NodeGUID);
        expect(check.CurrentCheckout).toEqual("client");
    }));
    it("can be checked in", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var oldNodeView = new FlowNodeView_1.FlowNodeView({
            LocalPos: "{\"x\":0,\"y\":0,\"z\":0}",
            NodeGUID: "updatedNodeViewId",
        });
        room.checkoutNodeView(oldNodeView, "client");
        room.checkinNodeView(oldNodeView.NodeGUID, "client");
        let check = room.ReadNodeView(oldNodeView.NodeGUID);
        expect(check != null).toBeFalsy();
    }));
    it("can only be checked in by the right person", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var oldNodeView = new FlowNodeView_1.FlowNodeView({
            LocalPos: "{\"x\":0,\"y\":0,\"z\":0}",
            NodeGUID: "updatedNodeViewId",
        });
        room.checkoutNodeView(oldNodeView, "client1");
        room.checkinNodeView(oldNodeView.NodeGUID, "client2");
        let check = room.ReadNodeView(oldNodeView.NodeGUID);
        expect(check.CurrentCheckout).toEqual("client1");
    }));
    it("cannot be checked out while it is checked out by someone else.", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var oldNodeView = new FlowNodeView_1.FlowNodeView({
            LocalPos: "{\"x\":0,\"y\":0,\"z\":0}",
            NodeGUID: "updatedNodeViewId",
        });
        room.checkoutNodeView(oldNodeView, "client1");
        room.checkoutNodeView(oldNodeView, "client2");
        let check = room.ReadNodeView(oldNodeView.NodeGUID);
        expect(check.CurrentCheckout).toEqual("client1");
    }));
    it("can be updated", () => __awaiter(void 0, void 0, void 0, function* () {
        let room = yield new Room_1.Room("testProjectId");
        var oldNodeView = new FlowNodeView_1.FlowNodeView({
            LocalPos: "{\"x\":0,\"y\":0,\"z\":0}",
            NodeGUID: "updatedNodeViewId",
        });
        room.checkoutNodeView(oldNodeView, "client");
        var newNodeView = new FlowNodeView_1.FlowNodeView({
            LocalPos: "{\"x\":24,\"y\":24,\"z\":24}",
            NodeGUID: "updatedNodeViewId",
        });
        room.updateNodeView(newNodeView, "client");
        let check = room.GetProject()._NodeViewList.find(nodeview => nodeview.NodeGUID = oldNodeView.NodeGUID);
        expect(check.LocalPos).toEqual(newNodeView.LocalPos);
    }));
});
//# sourceMappingURL=Room.test.js.map