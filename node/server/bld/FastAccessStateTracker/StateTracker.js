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
const RoomManager_1 = require("./RoomManager");
const TypeORMDatabase_1 = require("./Database/TypeORMDatabase");
const project_1 = require("../ORMCommands/project");
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
    static DeleteProject(projectToDeleteId, user, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!projectToDeleteId)
                return;
            let clients = RoomManager_1.RoomManager.DestroyRoom(projectToDeleteId);
            yield TypeORMDatabase_1.TypeORMDatabase.DeleteProject(projectToDeleteId);
            let clientIds = [];
            clientIds.push(client);
            clients.forEach((userClients, user, map) => {
                clientIds.concat(userClients);
                userClients.forEach((client, index, arr) => {
                    this.currentUsers.get(user).set(client, "noRoom");
                });
            });
            return ['Success', clientIds];
        });
    }
    static OpenProject(projectToOpenID, username, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let userLoggedIn = this.currentUsers.has(username);
            if (!userLoggedIn)
                return [null, [client], null];
            let projectFound = yield TypeORMDatabase_1.TypeORMDatabase.GetProject(projectToOpenID);
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
            console.log("Username is " + username + " password is " + password);
            yield TypeORMDatabase_1.TypeORMDatabase.CreateUser(username, password);
            return [!success, [client]];
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
            return ['Deleted', affectedClients];
        });
    }
    static LoginUser(userName, password, ClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            let affectedClients = [];
            affectedClients.push(ClientId);
            if (!TypeORMDatabase_1.TypeORMDatabase.AuthenticateUser(userName, password))
                return ['Failure', affectedClients];
            let userLoggedIn = this.currentUsers.has(userName);
            if (!userLoggedIn)
                this.currentUsers.set(userName, new Map());
            console.log("\n\n\is the user logged in after logging in");
            console.log(this.currentUsers.has(userName));
            this.currentUsers.get(userName).set(ClientId, "noRoom");
            RoomManager_1.RoomManager.JoinRoom("noRoom", userName, ClientId);
            let returnMessage = { username: userName, projects: yield project_1.ProjectOperations.fetchProjects(userName) };
            console.log(returnMessage.projects);
            console.log(affectedClients);
            return [returnMessage, affectedClients];
        });
    }
    static LogoutUser(Username, password, ClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            let affectedClients = [];
            affectedClients.push(ClientId);
            if (!TypeORMDatabase_1.TypeORMDatabase.AuthenticateUser(Username, password))
                return ['Failure', affectedClients];
            let userLoggedIn = this.currentUsers.has(Username);
            if (userLoggedIn) {
                let userRoomId = this.currentUsers.get(Username).get(ClientId);
                RoomManager_1.RoomManager.LeaveRoom(userRoomId, Username, ClientId);
                this.currentUsers.get(Username).delete(ClientId);
                if (this.currentUsers.get(Username).size == 0)
                    this.currentUsers.delete(Username);
            }
            else {
                return ['Failure', affectedClients];
                ;
            }
            return ['Success', affectedClients];
        });
    }
    static CreateRoom(projectID, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            let roomCode = RoomManager_1.RoomManager.CreateRoom(projectID);
            return ['Success', [clientId]];
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
            return [user + ' has joined the room', affectedClients];
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
            return [user + ' has left the room', affectedClients];
        });
    }
    static CreateObject(objectToCreate, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            RoomManager_1.RoomManager.FindRoom(projectId)
                .GetProject()
                .AddObject(objectToCreate);
            TypeORMDatabase_1.TypeORMDatabase.CreateObject(objectToCreate, projectId);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients.concat(clients);
            });
            return [objectToCreate, affectedClients];
        });
    }
    static DeleteObject(objectToDelete, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            RoomManager_1.RoomManager.FindRoom(projectId)
                .GetProject()
                .DeleteObject(objectToDelete);
            TypeORMDatabase_1.TypeORMDatabase.DeleteObject(objectToDelete.Id, projectId);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients.concat(clients);
            });
            return ["deleted " + objectToDelete.Id, affectedClients];
        });
    }
    static UpdateObject(objectToUpdate, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            RoomManager_1.RoomManager.FindRoom(projectId)
                .GetProject()
                .UpdateFAMObject(objectToUpdate);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients.concat(clients);
            });
            return [objectToUpdate, affectedClients];
        });
    }
    static FinalizedUpdateObject(objectToUpdate, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            RoomManager_1.RoomManager.FindRoom(projectId)
                .GetProject()
                .UpdateFAMObject(objectToUpdate);
            let affectedClients = [];
            let roomClients = yield RoomManager_1.RoomManager.getClients(projectId);
            roomClients.forEach((clients, username, map) => {
                affectedClients.concat(clients);
            });
            return [objectToUpdate, affectedClients];
        });
    }
}
exports.StateTracker = StateTracker;
StateTracker.currentProjects = new RoomManager_1.RoomManager();
StateTracker.currentUsers = new Map();
//# sourceMappingURL=StateTracker.js.map