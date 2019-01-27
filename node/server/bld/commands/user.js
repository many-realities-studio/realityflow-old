"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const server_1 = require("../server");
let sockServ;
const commands_1 = require("../common/commands");
let user_hash;
let client_hash;
function getUsers(value, time, connection_id) {
    user_1.User.find()
        .populate("clients")
        .exec(function (err, users) {
        server_1.ServerEventDispatcher.send(commands_1.Commands.user.GET_USERS, { data: users }, time, connection_id);
    });
}
function default_1(sockServer, userHash, clientHash, cb) {
    sockServ = sockServer;
    user_hash = userHash;
    client_hash = clientHash;
    function bind(cmd, func) {
        if (!server_1.isBound[cmd]) {
            server_1.ServerEventDispatcher.bind(cmd, func);
            server_1.isBound[cmd] = true;
        }
    }
    bind(commands_1.Commands.user.GET_USERS, getUsers);
    cb();
}
exports.default = default_1;
