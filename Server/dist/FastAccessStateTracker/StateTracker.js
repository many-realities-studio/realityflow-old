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
exports.StateTracker = void 0;
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
            let projectFoundId;
            if (projectFound)
                projectFoundId = projectFound.Id;
            let userJoinedRoom = yield this.JoinRoom(projectFoundId, username, client);
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
            affectedClients.push();
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
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [objectToCreate, affectedClients];
        });
    }
    static CheckoutObject(projectId, objectId, client, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = RoomManager_1.RoomManager.checkoutObject(projectId, objectId, user);
            return [success, [client]];
        });
    }
    static CheckinObject(projectId, objectId, client, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = RoomManager_1.RoomManager.checkinObject(projectId, objectId, user);
            return [success, [client]];
        });
    }
    static DeleteObject(objectId, projectId, client) {
        return __awaiter(this, void 0, void 0, function* () {
            RoomManager_1.RoomManager.DeleteObject(projectId, objectId, client);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [objectId, affectedClients];
        });
    }
    static UpdateObject(objectToUpdate, projectId, client, saveToDatabase, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let famSuccess = RoomManager_1.RoomManager.updateObject(objectToUpdate, projectId, user);
            console.log(RoomManager_1.RoomManager.ReadObject(projectId, objectToUpdate.Id));
            if (!famSuccess)
                return [null, [client]];
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
    static CreateAvatar(AvatarToCreate, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            let FAMSucccess = RoomManager_1.RoomManager.AddAvatar(AvatarToCreate, projectId);
            let AvatarList = RoomManager_1.RoomManager.GetAvatarList(projectId);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [AvatarToCreate, affectedClients, AvatarList];
        });
    }
    static DeleteAvatar(AvatarId, projectId, client) {
        return __awaiter(this, void 0, void 0, function* () {
            RoomManager_1.RoomManager.DeleteAvatar(projectId, AvatarId, client);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [AvatarId, affectedClients];
        });
    }
    static UpdateAvatar(AvatarToUpdate, projectId, client, saveToDatabase, user = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let famSuccess = RoomManager_1.RoomManager.updateAvatar(AvatarToUpdate, projectId, client);
            if (!famSuccess)
                return [null, [client]];
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [AvatarToUpdate, affectedClients];
        });
    }
    static CreateBehaviour(BehaviourToCreate, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(projectId);
            RoomManager_1.RoomManager.FindRoom(projectId)
                .GetProject()
                .AddBehaviour(BehaviourToCreate);
            TypeORMDatabase_1.TypeORMDatabase.CreateBehaviour(BehaviourToCreate);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            BehaviourToCreate.Action = JSON.stringify(BehaviourToCreate.Action);
            return [BehaviourToCreate, affectedClients];
        });
    }
    static DeleteBehaviour(projectId, BehaviourIds, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = RoomManager_1.RoomManager.FindRoom(projectId)
                .GetProject()
                .DeleteBehaviour(BehaviourIds);
            TypeORMDatabase_1.TypeORMDatabase.DeleteBehaviour(BehaviourIds);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            if (success)
                return [BehaviourIds, affectedClients];
            else
                return [null, affectedClients];
        });
    }
    static LinkNewBehaviorToExistingBehaviors(projectId, child, parents) {
        return __awaiter(this, void 0, void 0, function* () {
            let behaviorsToModify = RoomManager_1.RoomManager.FindRoom(projectId)
                .GetProject()
                ._BehaviourList
                .filter((x) => parents !== undefined && parents.indexOf(x.Id) !== -1);
            behaviorsToModify.map((x) => {
                x.NextBehaviour.push(child);
                return x;
            });
            yield TypeORMDatabase_1.TypeORMDatabase.LinkNewToOld(projectId, child, parents);
        });
    }
    static ReadBehaviour(BehaviourId, projectId, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let BehaviourRead = RoomManager_1.RoomManager.FindRoom(projectId).GetProject().GetBehaviour(BehaviourId);
            return [BehaviourRead, [client]];
        });
    }
    static UpdateBehaviour(BehaviourToUpdate, projectId, client, saveToDatabase = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let famSuccess = RoomManager_1.RoomManager.updateBehaviour(BehaviourToUpdate, projectId, client);
            if (!famSuccess)
                return [null, [client]];
            if (saveToDatabase)
                TypeORMDatabase_1.TypeORMDatabase.UpdateBehaviour(BehaviourToUpdate);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [BehaviourToUpdate, affectedClients];
        });
    }
    static CreateVSGraph(vsGraphToCreate, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            let FAMSucccess = RoomManager_1.RoomManager.AddVSGraph(vsGraphToCreate, projectId);
            TypeORMDatabase_1.TypeORMDatabase.CreateVSGraph(vsGraphToCreate, projectId);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [vsGraphToCreate, affectedClients];
        });
    }
    static CheckoutNodeView(projectId, flowNodeView, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = RoomManager_1.RoomManager.checkoutNodeView(projectId, flowNodeView, client);
            return [success, [client]];
        });
    }
    static CheckinNodeView(projectId, nodeGUID, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let success = RoomManager_1.RoomManager.checkinNodeView(projectId, nodeGUID, client);
            return [success, [client]];
        });
    }
    static DeleteVSGraph(vsGraphId, projectId, client) {
        return __awaiter(this, void 0, void 0, function* () {
            RoomManager_1.RoomManager.DeleteVSGraph(projectId, vsGraphId, client);
            TypeORMDatabase_1.TypeORMDatabase.DeleteVSGraph(vsGraphId, projectId);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [vsGraphId, affectedClients];
        });
    }
    static UpdateVSGraph(vsGraphToUpdate, projectId, client, saveToDatabase, user = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let famSuccess = RoomManager_1.RoomManager.updateVSGraph(vsGraphToUpdate, projectId, client);
            console.log(RoomManager_1.RoomManager.ReadVSGraph(projectId, vsGraphToUpdate.Id));
            if (!famSuccess)
                return [null, [client]];
            if (saveToDatabase)
                TypeORMDatabase_1.TypeORMDatabase.UpdateVSGraph(vsGraphToUpdate, projectId);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [vsGraphToUpdate, affectedClients];
        });
    }
    static ReadVSGraph(vsGraphId, projectId, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let vsGraphRead = RoomManager_1.RoomManager.ReadVSGraph(projectId, vsGraphId);
            return [vsGraphRead, [client]];
        });
    }
    static ReadNodeView(nodeGUID, projectId, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let nodeViewRead = RoomManager_1.RoomManager.ReadNodeView(projectId, nodeGUID);
            return [nodeViewRead, [client]];
        });
    }
    static UpdateNodeView(nodeViewToUpdate, projectId, client, user = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let famSuccess = RoomManager_1.RoomManager.updateNodeView(nodeViewToUpdate, projectId, client);
            console.log(RoomManager_1.RoomManager.ReadNodeView(projectId, nodeViewToUpdate.NodeGUID));
            if (!famSuccess)
                return [null, [client]];
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [nodeViewToUpdate, affectedClients];
        });
    }
    static RunVSGraph(vsGraphIdToRun, projectId, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients = affectedClients.concat(clients);
            });
            return [vsGraphIdToRun, affectedClients];
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