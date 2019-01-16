import { State } from "../models/state";
import { ServerEventDispatcher, isBound } from "../server";
let sockServ: ServerEventDispatcher;

import { Commands } from "../common/commands";
let user_hash: string[];
let client_hash: string[];

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
    cb();
}
