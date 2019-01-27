"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
let sockServ;
let user_hash;
let client_hash;
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
    cb();
}
exports.default = default_1;
