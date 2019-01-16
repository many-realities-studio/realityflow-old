import { User } from "../models/user";

import { ServerEventDispatcher, isBound } from "../server";
let sockServ: ServerEventDispatcher;

import { Commands } from "../common/commands";
let user_hash: string[];
let client_hash: string[];

// Return a data structure of users and clients currently connected
function getUsers(value: {data: any}, time: number, connection_id: number) {
    User.find()
        .populate("clients")
        .exec(function (err, users) {
            ServerEventDispatcher.send(Commands.user.GET_USERS, { data: users }, time, connection_id);
        });
}


export default function (sockServer: ServerEventDispatcher, userHash: string[], clientHash: string[], cb: Function) {
    sockServ = sockServer;
    user_hash = userHash;
    client_hash = clientHash;
    function bind(cmd: number, func: (value: { data: any, from?: string, description?: string, name?: string }
        , time: number, ws_id: number) => void) {
        if (!isBound[cmd]) {
            ServerEventDispatcher.bind(cmd, func);
            isBound[cmd] = true;
        }
    }
    bind(Commands.user.GET_USERS, getUsers);
    cb();
}
