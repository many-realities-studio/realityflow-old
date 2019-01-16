"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const events_1 = require("../common/events");
let sockServ;
let user_hash;
let client_hash;
function midiEventOn(value, time, ws_id) {
    let newEvent = {
        _from: client_hash[ws_id],
        name: value.data.name,
        number: value.data.number,
        octave: value.data.octave,
        type: events_1.Events.midi.types.ON,
    };
    console.log("Received midi event: ", newEvent);
    server_1.ServerEventDispatcher.broadcast(events_1.Events.midi.types.ON, { data: newEvent }, time, client_hash[ws_id], user_hash[ws_id]);
}
function midiEventOff(value, time, ws_id) {
    let newEvent = {
        _from: client_hash[ws_id],
        name: value.data.name,
        number: value.data.number,
        octave: value.data.octave,
        type: events_1.Events.midi.types.OFF,
    };
    console.log("Received midi event: ", newEvent);
    server_1.ServerEventDispatcher.broadcast(events_1.Events.midi.types.OFF, { data: newEvent }, time, client_hash[ws_id], user_hash[ws_id]);
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
    bind(events_1.Events.midi.types.ON, midiEventOn);
    bind(events_1.Events.midi.types.OFF, midiEventOff);
    return cb();
}
exports.default = default_1;
