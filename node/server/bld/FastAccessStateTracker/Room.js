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
const TypeORMDatabase_1 = require("./Database/TypeORMDatabase");
class Room {
    constructor(projectID) {
        this._UsersCurrentlyInTheRoom = [];
        this._CurrentProjectId = projectID;
        TypeORMDatabase_1.TypeORMDatabase.GetProject(this._CurrentProjectId).then((project) => {
            this._CurrentProject = project;
        });
    }
    JoinRoom(userJoiningTheRoom, clientJoiningTheRoom) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = this._UsersCurrentlyInTheRoom.find(element => element.Username == userJoiningTheRoom);
            if (user == undefined) {
                user = yield TypeORMDatabase_1.TypeORMDatabase.GetUser(userJoiningTheRoom);
                this._UsersCurrentlyInTheRoom.push(user);
            }
            user.ActiveClients.push(clientJoiningTheRoom);
        });
    }
    LeaveRoom(UserName, ClientId) {
        let userIndex = this._UsersCurrentlyInTheRoom.findIndex(element => element.Username == UserName);
        if (userIndex == -1) {
            return;
        }
        else {
            let clientIndex = this._UsersCurrentlyInTheRoom[userIndex].ActiveClients.findIndex(element => element == ClientId);
            this._UsersCurrentlyInTheRoom[userIndex].ActiveClients.splice(clientIndex, 1);
            if (this._UsersCurrentlyInTheRoom[userIndex].ActiveClients.length == 0)
                this._UsersCurrentlyInTheRoom.splice(userIndex, 1);
        }
    }
    hasUser(username) {
        let retval = (this._UsersCurrentlyInTheRoom.find(element => element.Username == username) != undefined);
        return retval;
    }
    hasClient(username, ClientId) {
        let user = this._UsersCurrentlyInTheRoom.find(element => element.Username == username);
        return (this.hasUser(username) && user.ActiveClients.find(element => element == ClientId) != undefined);
    }
    GetRoomCode() {
        return this._CurrentProjectId;
    }
    GetProject() {
        return this._CurrentProject;
    }
    getClients() {
        let clients = new Map();
        this._UsersCurrentlyInTheRoom.forEach((user, index, arr) => clients.set(user.Username, user.ActiveClients));
        return clients;
    }
}
exports.Room = Room;
//# sourceMappingURL=Room.js.map