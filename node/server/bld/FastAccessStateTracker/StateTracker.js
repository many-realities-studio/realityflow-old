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
const FlowBehavior_1 = require("./FlowLibrary/FlowBehavior");
const RoomManager_1 = require("./RoomManager");
const TypeORMDatabase_1 = require("./Database/TypeORMDatabase");
class StateTracker {
    static CreateProject(projectToCreate, username, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let userLoggedIn = this.currentUsers.has(username);
            if (!userLoggedIn)
                return [null, [client]];
            let newProject = yield TypeORMDatabase_1.TypeORMDatabase.CreateProject(projectToCreate, username);
            return [newProject, [client]];
        });
    }
    static ReadProject(projectToReadId, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let project = RoomManager_1.RoomManager.FindRoom(projectToReadId).GetProject();
            let affectedClients = [];
            affectedClients.push(client);
            return [project, affectedClients];
        });
    }
    static DeleteProject(projectToDeleteId, user, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (RoomManager_1.RoomManager.FindRoom == undefined || !(yield TypeORMDatabase_1.TypeORMDatabase.GetProject(projectToDeleteId)))
                return [false, [client]];
            let clients = RoomManager_1.RoomManager.DestroyRoom(projectToDeleteId);
            yield TypeORMDatabase_1.TypeORMDatabase.DeleteProject(projectToDeleteId);
            return [true, [client]];
        });
    }
    static FetchProjects(username, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let projects = yield TypeORMDatabase_1.TypeORMDatabase.fetchProjects(username);
            return [projects, [client]];
        });
    }
    static OpenProject(projectToOpenID, username, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let userLoggedIn = this.currentUsers.has(username);
            if (!userLoggedIn)
                return [null, [client], null];
            let projectFound = yield TypeORMDatabase_1.TypeORMDatabase.GetProject(projectToOpenID);
            if (!projectFound)
                [null, [client], null];
            let affectedClients = [];
            affectedClients.push(client);
            let userJoinedRoom = yield this.JoinRoom(projectToOpenID, username, client);
            return [projectFound, affectedClients, userJoinedRoom];
        });
    }
    static LeaveProject(projectToLeaveID, username, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let userLoggedIn = this.currentUsers.has(username);
            if (!userLoggedIn)
                return [null, [client], null];
            let userLeftRoom = yield this.LeaveRoom(projectToLeaveID, username, client);
            let operationStatus = RoomManager_1.RoomManager.FindRoom(projectToLeaveID).hasClient(username, client);
            return [!operationStatus, [client], userLeftRoom];
        });
    }
    static CreateUser(username, password, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = false;
            yield TypeORMDatabase_1.TypeORMDatabase.CreateUser(username, password);
            return [!success, [client]];
        });
    }
    static ReadUser(username, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = TypeORMDatabase_1.TypeORMDatabase.GetUser(username);
            return [user, [client]];
        });
    }
    static DeleteUser(userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let clients = StateTracker.currentUsers.get(userName);
            let affectedClients = [];
            if (clients != undefined)
                clients.forEach((roomCode, clientId, map) => {
                    this.LogoutUser(userName, password, clientId);
                    affectedClients.push(clientId);
                });
            yield TypeORMDatabase_1.TypeORMDatabase.DeleteUser(userName);
            return [true, affectedClients];
        });
    }
    static LoginUser(userName, password, ClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            let affectedClients = [];
            affectedClients.push(ClientId);
            if (!(yield TypeORMDatabase_1.TypeORMDatabase.AuthenticateUser(userName, password)))
                return [false, affectedClients, null];
            let userLoggedIn = this.currentUsers.has(userName);
            if (!userLoggedIn)
                this.currentUsers.set(userName, new Map());
            this.currentUsers.get(userName).set(ClientId, "noRoom");
            RoomManager_1.RoomManager.JoinRoom("noRoom", userName, ClientId);
            let projects = yield TypeORMDatabase_1.TypeORMDatabase.fetchProjects(userName);
            return [true, affectedClients, projects];
        });
    }
    static LogoutUser(Username, password, ClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            let affectedClients = [];
            affectedClients.push(ClientId);
            if (!TypeORMDatabase_1.TypeORMDatabase.AuthenticateUser(Username, password))
                return ['Failure', affectedClients];
            let userLoggedIn = this.currentUsers.has(Username);
            let operationStatus = false;
            if (userLoggedIn) {
                let userRoomId = this.currentUsers.get(Username).get(ClientId);
                RoomManager_1.RoomManager.LeaveRoom(userRoomId, Username, ClientId);
                operationStatus = this.currentUsers.get(Username).delete(ClientId);
                if (this.currentUsers.get(Username).size == 0)
                    this.currentUsers.delete(Username);
            }
            return [operationStatus, affectedClients];
        });
    }
    static CreateRoom(projectID, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            let roomCode = RoomManager_1.RoomManager.CreateRoom(projectID);
            return [true, [clientId]];
        });
    }
    static JoinRoom(roomCode, user, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (RoomManager_1.RoomManager.FindRoom(roomCode) == undefined)
                RoomManager_1.RoomManager.CreateRoom(roomCode);
            let oldRoom = this.currentUsers.get(user).get(client);
            yield RoomManager_1.RoomManager.LeaveRoom(oldRoom, user, client);
            yield RoomManager_1.RoomManager.JoinRoom(roomCode, user, client);
            this.currentUsers.get(user).set(client, roomCode);
            let affectedClients = [];
            let clients = yield RoomManager_1.RoomManager.getClients(roomCode);
            clients.forEach((value, key) => {
                value.forEach((client) => {
                    affectedClients.push(client);
                });
            });
            let shortClientId = client.slice(0, 8);
            return [user + "-" + shortClientId + ' has joined the room', affectedClients];
        });
    }
    static PopulateRoom(roomCode, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (RoomManager_1.RoomManager.FindRoom(roomCode) == undefined)
                return [null, [client]];
            let affectedClients = [];
            let project = RoomManager_1.RoomManager.FindRoom(roomCode).GetProject();
            affectedClients.push(client);
            return [project, affectedClients];
        });
    }
    static LeaveRoom(roomCode, user, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (RoomManager_1.RoomManager.FindRoom(roomCode) == undefined)
                return [null, [client]];
            yield RoomManager_1.RoomManager.LeaveRoom(roomCode, user, client);
            yield RoomManager_1.RoomManager.JoinRoom("noRoom", user, client);
            this.currentUsers.get(user).set(client, "noRoom");
            let affectedClients = [];
            let clients = yield RoomManager_1.RoomManager.getClients(roomCode);
            clients.forEach((value, key) => {
                value.forEach((client) => {
                    affectedClients.push(client);
                });
            });
            let shortClientId = client.slice(0, 8);
            return [user + "-" + shortClientId + 'has left the room', affectedClients];
        });
    }
    static CreateObject(objectToCreate, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            let FAMSucccess = RoomManager_1.RoomManager.AddObject(objectToCreate, projectId);
            TypeORMDatabase_1.TypeORMDatabase.CreateObject(objectToCreate, projectId);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [objectToCreate, affectedClients];
        });
    }
    static CheckoutObject(projectId, objectId, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = RoomManager_1.RoomManager.checkoutObject(projectId, objectId, client);
            return [success, [client]];
        });
    }
    static CheckinObject(projectId, objectId, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = RoomManager_1.RoomManager.checkinObject(projectId, objectId, client);
            return [success, [client]];
        });
    }
    static DeleteObject(objectId, projectId, client) {
        return __awaiter(this, void 0, void 0, function* () {
            RoomManager_1.RoomManager.DeleteObject(projectId, objectId, client);
            TypeORMDatabase_1.TypeORMDatabase.DeleteObject(objectId, projectId);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [objectId, affectedClients];
        });
    }
    static UpdateObject(objectToUpdate, projectId, client, saveToDatabase = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let famSuccess = RoomManager_1.RoomManager.updateObject(objectToUpdate, projectId, client);
            if (!famSuccess)
                return ["could not update object", [client]];
            if (saveToDatabase)
                TypeORMDatabase_1.TypeORMDatabase.UpdateObject(objectToUpdate, projectId);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [objectToUpdate, affectedClients];
        });
    }
    static ReadObject(objectId, projectId, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let objectRead = RoomManager_1.RoomManager.ReadObject(projectId, objectId);
            return [objectRead, [client]];
        });
    }
    static listifyBehavior(behavior) {
        let counter = 0;
        let temp = behavior;
        let retArr = [];
        let owner = temp.TriggerObjectID;
        while (temp != null) {
            retArr.push(new FlowBehavior_1.FlowBehavior({
                Name: temp.Name,
                Id: temp.Id,
                Trigger: temp.TriggerObjectID,
                Target: temp.TargetObjectID,
                Index: counter,
                ChainOwner: owner
            }));
            counter++;
            temp = temp.FlowBehaviour;
        }
        return retArr;
    }
    static reconstitute(behaviors) {
        let retBehavior = {};
        let temp = retBehavior;
        behaviors.forEach((behavior, index, arr) => {
            temp.Name = behavior.Name;
            temp.TriggerObjectID = behavior.Trigger;
            temp.TargetObjectID = behavior.Target;
            if (index === arr.length - 1)
                temp.BehaviourChain = null;
            else
                temp.BehaviourChain = {};
            temp = temp.BehaviourChain;
        });
    }
    static CreateBehavior(behaviorToCreate, objectId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            RoomManager_1.RoomManager.FindRoom(projectId)
                .GetProject()
                .AddBehavior(objectId, behaviorToCreate);
            TypeORMDatabase_1.TypeORMDatabase.CreateBehavior(behaviorToCreate, objectId);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [behaviorToCreate, affectedClients];
        });
    }
    static DeleteBehavior(projectId, objectId, client) {
        return __awaiter(this, void 0, void 0, function* () {
            RoomManager_1.RoomManager.FindRoom(projectId)
                .GetProject()
                .DeleteBehavior(objectId);
            TypeORMDatabase_1.TypeORMDatabase.DeleteBehavior(objectId);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [projectId, affectedClients];
        });
    }
    static ReadBehavior(behaviorId, objectId, projectId, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let behaviorRead = null;
            let behaviorList = RoomManager_1.RoomManager.FindRoom(projectId).GetProject().GetBehavior(objectId);
            behaviorList.forEach(behavior => {
                if (behavior.Id == behaviorId)
                    behaviorRead = behavior;
            });
            return [behaviorRead, [client]];
        });
    }
    static TogglePlayMode(projectId, toggle) {
        return __awaiter(this, void 0, void 0, function* () {
            let affectedClients = [];
            let room = RoomManager_1.RoomManager.FindRoom(projectId);
            let success = false;
            if (toggle) {
                success = room.turnOnPlayMode();
            }
            else {
                success = room.turnOffPlayMode();
            }
            let roomClients = room.getClients();
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [success, affectedClients];
        });
    }
}
exports.StateTracker = StateTracker;
StateTracker.currentProjects = new RoomManager_1.RoomManager();
StateTracker.currentUsers = new Map();
//# sourceMappingURL=StateTracker.js.map