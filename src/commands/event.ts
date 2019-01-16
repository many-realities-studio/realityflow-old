import { ServerEventDispatcher, isBound } from "../server";
import { IFlowTransform } from "../common/IFlowTransform";
import { Commands } from "../common/commands";
import { IMidiEvent } from "../common/events/midi";
import { Events } from "../common/events";
let sockServ: ServerEventDispatcher;
let user_hash: string[];
let client_hash: string[];

function midiEventOn(value: { data: any }, time: number, ws_id: number) {
    let newEvent: IMidiEvent = {
        _from: client_hash[ws_id],
        name: value.data.name,
        number: value.data.number,
        octave: value.data.octave,
        type: Events.midi.types.ON,
    };
    console.log("Received midi event: ", newEvent);
    ServerEventDispatcher.broadcast(Events.midi.types.ON,
                                    { data: newEvent },
                                    time,
                                    client_hash[ws_id],
                                    user_hash[ws_id]);
    // First remove all instances
}
function midiEventOff(value: { data: any }, time: number, ws_id: number) {
    let newEvent: IMidiEvent  = {
        _from: client_hash[ws_id],
        name: value.data.name,
        number: value.data.number,
        octave: value.data.octave,
        type: Events.midi.types.OFF,
    };
    console.log("Received midi event: ", newEvent);
    ServerEventDispatcher.broadcast(Events.midi.types.OFF,
                                    { data: newEvent },
                                    time,
        client_hash[ws_id], user_hash[ws_id]);
    // First remove all instances
}

export default function (sockServer: ServerEventDispatcher,
    userHash: string[], clientHash: string[],
    cb: Function) {
    sockServ = sockServer;
    user_hash = userHash;
    client_hash = clientHash;
    function bind(cmd: number, func: (value: { data: any, from?: string, description?: string, name?: string }
        , time: number, ws_id: number, transform?: IFlowTransform) => void) {
        if (!isBound[cmd]) {
            ServerEventDispatcher.bind(cmd, func);
            isBound[cmd] = true;
        }
    }
    bind(Events.midi.types.ON, midiEventOn);
    bind(Events.midi.types.OFF, midiEventOff);
    return cb();
}
