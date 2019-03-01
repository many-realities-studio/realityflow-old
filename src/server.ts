import * as fs from "fs";
import { Commands } from "./common/commands";
import * as path from "path";
import * as express from "express";
import * as http from "http";
import { Server } from "ws";
import { IFlowTransform } from "./common/IFlowTransform";

let heartbeat;
var mongoose = require('mongoose');
var database;
let user_hash: string[] = [];
let client_hash: string[] = [];
const dburl = "mongodb://127.0.0.1:27017/realityflowdb";
export const isBound: boolean[] = [];
const buffer = Buffer.alloc(1000);

/**
 * The main server dispatcher
 */
export class ServerEventDispatcher {
    public static connections: WebSocket[] = [];
    public static wss: Server;
    public static callbacks: Function[][];

    public static incoming(command: number, value: { data: any, timestamp: number }, client_id: number, transform?: IFlowTransform) {
        ServerEventDispatcher.dispatch(command, value, value.timestamp, client_id, transform);
    }

    public static send(event_name: number, event_data: { data: any, from?: string }, event_time: number, client_id: number,
        transform_data?: IFlowTransform) {
        let payload = null;
        if (ServerEventDispatcher.connections[client_id].readyState !== 3) {
            if (event_name === Commands.TRANSFORM_UPDATE ||
                event_name === Commands.modifier.UPDATE ||
                event_name === Commands.modifier.APPLY ||
                event_name === Commands.modifier.COMMIT ||
                event_name === Commands.transform.UPDATE
            ) {
                // console.log("Sending a transform update with ", transform_data);
                let payload_str = JSON.stringify({
                    cmd: event_name,
                    timestamp: event_time,
                    transform: transform_data,
                    value: event_data,
                });
                payload = Buffer.alloc(payload_str.length, payload_str);
                ServerEventDispatcher.connections[client_id].send(payload); // <= send JSON data to socket server
            } else {
                if (event_data !== undefined && event_data !== null && event_data.data !== undefined) {
                    let data: string = JSON.stringify({
                        cmd: event_name, timestamp: event_time, value: event_data,
                    });
                    // if (event_name !== Commands.PING && event_name !== Commands.PONG && event_name !== Commands.modifier.UPDATE) {
                    //    console.log("Sending..." + data);
                    // }
                    payload = Buffer.alloc(data.length, data);
                    ServerEventDispatcher.connections[client_id].send(payload); // <= send JSON data to socket server
                }
            }
        }
        return this;
    }

    public static bind(event_name: number, callback: (value: { data: any, from?: string, description?: string, name?: string }
        , time: number, ws_id: number) => void) {
        if (event_name === undefined) {
            console.error("Binding unknown event ", event_name);
        }
        ServerEventDispatcher.callbacks[event_name] = ServerEventDispatcher.callbacks[event_name] || [];
        ServerEventDispatcher.callbacks[event_name].push(callback);
        return this; // chainable
    }

    public static broadcast(event_name: number, event_data: { data: any, _from?: string }, event_time: number, client_id: string,
                            user_id: string, transform_data?: IFlowTransform) {
        event_data._from = client_id;
        ServerEventDispatcher.connections.forEach((connection, i) => {
            if (ServerEventDispatcher.connections[i].readyState === ServerEventDispatcher.connections[i].OPEN
               // && (user_hash[i] !== undefined && (user_hash[i] === user_id
               //     || user_hash[i] === "0"
                //    || user_id === "-1"))
               ) {
                console.log(client_hash[i]);
                // If the connection is admin or connection is same user.
                if (event_name !== Commands.transform.UPDATE) {
                    ServerEventDispatcher.send(event_name, event_data, event_time, i);
                } else {
//                    if (client_hash[i] !== event_data._from) {
                        ServerEventDispatcher.send(event_name, event_data, event_time, i, transform_data);
//                  }
                }
            }
        });
    }

    private static dispatch(event_name: number, event_payload: { data: any, from?: string }, event_time: number,
        connection_id: number, transform_data?: any) {
        const chain = ServerEventDispatcher.callbacks[event_name];
        if (typeof chain === "undefined") {
            console.log("Unknown type: ", event_name,
                "data", event_payload.data); return;
        } // no callbacks for this event
        for (let i = 0; i < chain.length; i++) {
            chain[i](event_payload, event_time, connection_id, transform_data);
        }
    }

    constructor(server: http.Server) {

        mongoose.connect(dburl);
        database = mongoose.connection;

        database.on('error', console.error.bind(console, 'connection error: '));
        database.once('open', function(){

            console.log('Database connection successful at ' + dburl);

        });

        console.log("Setting up server");
        ServerEventDispatcher.wss = new Server({ server }, function (err: any) {
            console.log("Connections set up " + err);
        });
        ServerEventDispatcher.wss.on("error", (err) => {
            console.log("error");
        });
        console.log("Receiving connections on port 8889", ServerEventDispatcher.wss);
        ServerEventDispatcher.callbacks = [];
        ServerEventDispatcher.wss.on("connection", this.connection);



    }

    private connection(ws: any, arg?: any): void {
        console.log(ws);
        ServerEventDispatcher.connections.push(ws);
        const client_id: number = ServerEventDispatcher.connections.indexOf(ws);
        console.log("Just added connection " + client_id);

        function onMessageEvent(evt: MessageEvent) {
            const json = JSON.parse(evt.data);
            ServerEventDispatcher.incoming(json.cmd, json.value, client_id, json.transform);
        }

        function onCloseEvent(evt: CloseEvent): any {
            console.log("Closed connection", client_id);
            delete ServerEventDispatcher.connections[client_id];
            ServerEventDispatcher.dispatch(Commands.client.CLIENT_DISCONNECT, { data: client_id.toString() }, 0, client_id);
        }

        function onErrorEvent(evt: ErrorEvent) {
            console.log("Error: Closed connection");
            ServerEventDispatcher.dispatch(Commands.client.CLIENT_DISCONNECT, { data: client_id.toString() }, 0, client_id);
        }

        ws.onmessage = onMessageEvent;
        ws.onclose = onCloseEvent;
        ws.onerror = onErrorEvent;
    }

};

// Models
import { Client } from "./models/client";
import { User } from "./models/user";

// Connection URL. This is where your mongodb server is running.


// Use connect method to connect to the Server
const apiFuncGroup = [ "state",
    "client", "user", "event", "transform"];

// db.on("error", console.error.bind(console, "connection error"));
// db.on("open", main);

function main() {
    console.log("New code");
    const app = express();
    // Test 3
    app.use(express.static("./static"));
    const server = http.createServer(app);
    const sockServ = new ServerEventDispatcher(server);
    function setup() {
        console.log("Setting all connections to disconnected");
        Client.find({}, function (err, res) {
            for (let client = 0; client < res.length; client++) {
                res[client].state = Commands.STATE_DISCONNECTED;
                res[client].save();
            }
            User.find({}, function (err2, user) {
                for (let i = 0; i < res.length; i++) {
                    // res[i].populate();
                }
            });
        });
/*        process.on("message", function (msg: string) {
            let cmd: {
                cmd: number, value: { data: any },
            } = JSON.parse(msg);
            console.log("Receiving: " + msg);
            if (cmd.cmd === Commands.UPDATE_API) {
                console.log("Updating API!");
                loadApiFunctions();
                ServerEventDispatcher.broadcast(Commands.UPDATE_API, { data: "0" }, Date.now(), null, "0");

            }
            ServerEventDispatcher.broadcast(cmd.cmd, cmd.value, 0, "0", "-1");
        });*/
        function loadApiFunctions() {
            for (let i = 0; i < apiFuncGroup.length; i++) {
                delete require.cache[require.resolve("./commands/" + apiFuncGroup[i] + ".js")];
                let initCommands = require("./commands/" + apiFuncGroup[i]).default;
                initCommands(sockServ, user_hash, client_hash, function () { console.log("Loaded" + apiFuncGroup[i]); });
            }
        }
        loadApiFunctions();
    }
    // Setup
    setup();
    server.listen(process.env.PORT || 8999, () => {
        console.log(`Server started on port ${server.address().port} :)`);
    });
}

    // Registers a unique client ID for the client.
    /*
        ServerEventDispatcher.bind(Commands.UPDATE_EXTENSIONS, function (value, time, ws_id) {
            console.log("Updating extensions!");
            ServerEventDispatcher.broadcast(Commands.UPDATE_EXTENSIONS, value, time, null, user_hash[ws_id]);
        });
        ServerEventDispatcher.bind(Commands.UPDATE_MODULES, function (value, time, ws_id) {
            console.log("Updating extensions!");
            ServerEventDispatcher.broadcast(Commands.UPDATE_MODULES, value, time, null, user_hash[ws_id]);
        });
        ServerEventDispatcher.bind(Commands.TRANSFORM_UPDATE, function (value, time, ws_id) {
            ServerEventDispatcher.broadcast(Commands.TRANSFORM_UPDATE, value, time, client_hash[ws_id], user_hash[ws_id]);
        });*/

main();
