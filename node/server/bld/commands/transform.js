"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
let sockServ;
const commands_1 = require("../common/commands");
let user_hash;
let client_hash;
function updateTransform(value, time, ws_id, transform) {
    console.log("Updating transform");
    server_1.ServerEventDispatcher.broadcast(commands_1.Commands.transform.UPDATE, value, time, client_hash[ws_id], user_hash[ws_id], transform);
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
    bind(commands_1.Commands.transform.UPDATE, updateTransform);
    return cb();
}
exports.default = default_1;
