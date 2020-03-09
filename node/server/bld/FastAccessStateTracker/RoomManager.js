"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = require("./Room");
class RoomManager {
    static CreateRoom(projectID) {
        let newRoom = new Room_1.Room(projectID);
        this._RoomList.push(newRoom);
        this._RoomCount++;
        return projectID;
    }
    static FindRoom(roomCode) {
        return this._RoomList.find(element => element.GetRoomCode() == roomCode);
    }
    static DestroyRoom(roomCode) {
        let clients = RoomManager.getClients(roomCode);
        clients.forEach((clientList, userName, map) => clientList.forEach((client, index, arr) => {
            this.LeaveRoom(roomCode, userName, client);
            this.JoinRoom("noRoom", userName, client);
        }));
        let roomIndex = this._RoomList.findIndex(element => element.GetRoomCode() == roomCode);
        if (roomIndex > -1) {
            this._RoomList.splice(roomIndex, 1);
            this._RoomCount--;
        }
        return clients;
    }
    static JoinRoom(roomCode, user, clientId) {
        let roomToLogin = this.FindRoom(roomCode);
        roomToLogin.JoinRoom(user, clientId);
    }
    static LeaveRoom(roomCode, user, clientId) {
        let roomToLogin = this.FindRoom(roomCode);
        roomToLogin.LeaveRoom(user, clientId);
    }
    static getClients(roomCode) {
        let room = this.FindRoom(roomCode);
        return room.getClients();
    }
}
exports.RoomManager = RoomManager;
RoomManager._RoomList = [];
RoomManager._RoomCount = 0;
//# sourceMappingURL=RoomManager.js.map