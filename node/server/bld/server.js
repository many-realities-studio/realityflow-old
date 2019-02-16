"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("./common/commands");
const express = require("express");
const http = require("http");
const ws_1 = require("ws");
let heartbeat;
let user_hash = [];
let client_hash = [];
exports.isBound = [];
const buffer = Buffer.alloc(1000);
class ServerEventDispatcher {
    constructor(server) {
        console.log("Setting up server");
        ServerEventDispatcher.wss = new ws_1.Server({ server }, function (err) {
            console.log("Connections set up " + err);
        });
        ServerEventDispatcher.wss.on("error", (err) => {
            console.log("error");
        });
        console.log("Receiving connections on port 8889", ServerEventDispatcher.wss);
        ServerEventDispatcher.callbacks = [];
        ServerEventDispatcher.wss.on("connection", this.connection);
    }
    static incoming(command, value, client_id, transform) {
        ServerEventDispatcher.dispatch(command, value, value.timestamp, client_id, transform);
    }
    static send(event_name, event_data, event_time, client_id, transform_data) {
        let payload = null;
        if (ServerEventDispatcher.connections[client_id].readyState !== 3) {
            if (event_name === commands_1.Commands.TRANSFORM_UPDATE ||
                event_name === commands_1.Commands.modifier.UPDATE ||
                event_name === commands_1.Commands.modifier.APPLY ||
                event_name === commands_1.Commands.modifier.COMMIT ||
                event_name === commands_1.Commands.transform.UPDATE) {
                let payload_str = JSON.stringify({
                    cmd: event_name,
                    timestamp: event_time,
                    transform: transform_data,
                    value: event_data,
                });
                payload = Buffer.alloc(payload_str.length, payload_str);
                ServerEventDispatcher.connections[client_id].send(payload);
            }
            else {
                if (event_data !== undefined && event_data !== null && event_data.data !== undefined) {
                    let data = JSON.stringify({
                        cmd: event_name, timestamp: event_time, value: event_data,
                    });
                    payload = Buffer.alloc(data.length, data);
                    ServerEventDispatcher.connections[client_id].send(payload);
                }
            }
        }
        return this;
    }
    static bind(event_name, callback) {
        if (event_name === undefined) {
            console.error("Binding unknown event ", event_name);
        }
        ServerEventDispatcher.callbacks[event_name] = ServerEventDispatcher.callbacks[event_name] || [];
        ServerEventDispatcher.callbacks[event_name].push(callback);
        return this;
    }
    static broadcast(event_name, event_data, event_time, client_id, user_id, transform_data) {
        event_data._from = client_id;
        ServerEventDispatcher.connections.forEach((connection, i) => {
            if (ServerEventDispatcher.connections[i].readyState === ServerEventDispatcher.connections[i].OPEN) {
                console.log(client_hash[i]);
                if (event_name !== commands_1.Commands.transform.UPDATE) {
                    ServerEventDispatcher.send(event_name, event_data, event_time, i);
                }
                else {
                    ServerEventDispatcher.send(event_name, event_data, event_time, i, transform_data);
                }
            }
        });
    }
    static dispatch(event_name, event_payload, event_time, connection_id, transform_data) {
        const chain = ServerEventDispatcher.callbacks[event_name];
        if (typeof chain === "undefined") {
            console.log("Unknown type: ", event_name, "data", event_payload.data);
            return;
        }
        for (let i = 0; i < chain.length; i++) {
            chain[i](event_payload, event_time, connection_id, transform_data);
        }
    }
    connection(ws, arg) {
        console.log(ws);
        ServerEventDispatcher.connections.push(ws);
        const client_id = ServerEventDispatcher.connections.indexOf(ws);
        console.log("Just added connection " + client_id);
        function onMessageEvent(evt) {
            const json = JSON.parse(evt.data);
            ServerEventDispatcher.incoming(json.cmd, json.value, client_id, json.transform);
        }
        function onCloseEvent(evt) {
            console.log("Closed connection", client_id);
            delete ServerEventDispatcher.connections[client_id];
            ServerEventDispatcher.dispatch(commands_1.Commands.client.CLIENT_DISCONNECT, { data: client_id.toString() }, 0, client_id);
        }
        function onErrorEvent(evt) {
            console.log("Error: Closed connection");
            ServerEventDispatcher.dispatch(commands_1.Commands.client.CLIENT_DISCONNECT, { data: client_id.toString() }, 0, client_id);
        }
        ws.onmessage = onMessageEvent;
        ws.onclose = onCloseEvent;
        ws.onerror = onErrorEvent;
    }
}
ServerEventDispatcher.connections = [];
exports.ServerEventDispatcher = ServerEventDispatcher;
;
const client_1 = require("./models/client");
const user_1 = require("./models/user");
const url = "mongodb://mongo:27017/flow";
const apiFuncGroup = ["state",
    "client", "user", "event", "transform"];
function main() {
    console.log("New code");
    const app = express();
    app.use(express.static("./static"));
    const server = http.createServer(app);
    const sockServ = new ServerEventDispatcher(server);
    function setup() {
        console.log("Connection established to", url);
        console.log("Setting all connections to disconnected");
        client_1.Client.find({}, function (err, res) {
            for (let client = 0; client < res.length; client++) {
                res[client].state = commands_1.Commands.STATE_DISCONNECTED;
                res[client].save();
            }
            user_1.User.find({}, function (err2, user) {
                for (let i = 0; i < res.length; i++) {
                }
            });
        });
        function loadApiFunctions() {
            for (let i = 0; i < apiFuncGroup.length; i++) {
                delete require.cache[require.resolve("./commands/" + apiFuncGroup[i] + ".js")];
                let initCommands = require("./commands/" + apiFuncGroup[i]).default;
                initCommands(sockServ, user_hash, client_hash, function () { console.log("Loaded" + apiFuncGroup[i]); });
            }
        }
        loadApiFunctions();
    }
    setup();
    server.listen(process.env.PORT || 8999, () => {
        console.log(`Server started on port ${server.address().port} :)`);
    });
}
main();
