import { ServerEventDispatcher, isBound } from "../server";
import { User, IUserModel } from "../models/user";
import { State, IStateModel } from "../models/state";
import { FlowTransformModel } from "../models/flowTransform";
import { IFlowTransform } from "../common/IFlowTransform";
let sockServ: ServerEventDispatcher;

import { Commands } from "../common/commands";
let user_hash: string[];
let client_hash: string[];


function updateTransform(value: { data: any }, time: number, ws_id: number, transform: IFlowTransform) {
    ServerEventDispatcher.broadcast(Commands.transform.UPDATE, value, time, client_hash[ws_id], user_hash[ws_id], transform);
}

export default function (sockServer: ServerEventDispatcher, userHash: string[], clientHash: string[], cb: Function) {
    sockServ = sockServer;
    user_hash = userHash;
    client_hash = clientHash;
    function bind(cmd: number, func: (value: { data: any, from?: string, description?: string, name?: string },
        time: number, ws_id: number, transform?: IFlowTransform) => void) {
        if (!isBound[cmd]) {
            ServerEventDispatcher.bind(cmd, func);
            isBound[cmd] = true;
        }
    }
    bind(Commands.transform.UPDATE, updateTransform);
    return cb();
}
