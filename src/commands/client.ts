import { Commands } from "../common/commands";
import { User, IUserModel } from "../models/user";
import { Client, IClientModel } from "../models/client";
import { ServerEventDispatcher, isBound } from "../server";
import { Device, IDeviceModel } from "../models/device";
import { FlowTransformModel, IFlowTransformMod } from "../models/flowTransform";

let user_hash: string[];
let client_hash: string[];
let sockServ: ServerEventDispatcher;

function clientTypeToName(type: number): string {
    let name;
    switch (type) {
        case Commands.CLIENT_EDITOR:
            name = "editor";
            break;
        case Commands.CLIENT_WEB:
            name = "web";
            break;
        case Commands.CLIENT_HOLOLENS:
            name = "holo";
            break;
        case Commands.CLIENT_MAGICLEAP:
            name = "holo";
            break;
    }
    return name;
}
function registerClient(value: { data: any, type: number }, time: number, ws_id: number) {
    if (user_hash[ws_id] != null) {
        console.log("Receiving device ", value.data);
        // Cerate offset transform
        let deviceRet = function (err00: any, device_ret: any) {
            console.log("Creating a new client");
            if (err00 != null) {
                console.log("ERROR! 01");
                console.log(err00);
            }
            console.log(device_ret);
            let newClient = new Client({
                activeConnectionId: ws_id,
                description: "None yet",
                device: device_ret._id,
                state: Commands.STATE_CONNECTED,
                type: value.type,
                uid: user_hash[ws_id],
            });

            newClient.save(function (err1, result) {
                if (err1) {
                    console.error(err1);
                    return;
                }
                console.log("Broadcasting that we have a new client ", result);
                client_hash[ws_id] = result._id;
                ServerEventDispatcher.broadcast(Commands.client.NEW_CLIENT, { data: result }, time, result._id, result.uid);
                ServerEventDispatcher.send(Commands.client.REGISTER_CLIENT, { data: result }, time, ws_id);
            });
        };

        if (value.type !== Commands.CLIENT_WEB) {
            let cameraOffset = null;
            if (value.data.cameraOffset != null) {
                cameraOffset = new FlowTransformModel(
                    {
                        q_w: value.data.cameraOffset.q_w,
                        q_x: value.data.cameraOffset.q_x,
                        q_y: value.data.cameraOffset.q_y,
                        q_z: value.data.cameraOffset.q_z,
                        x: value.data.cameraOffset.x,
                        y: value.data.cameraOffset.y,
                        z: value.data.cameraOffset.z,
                    },
                );
                // Cerate rotation transform
                cameraOffset.save(function (err01: any, cameraOffsetRet: any) {
                    let cameraRotation = new FlowTransformModel(
                        {
                            q_w: value.data.cameraRotation.q_w,
                            q_x: value.data.cameraRotation.q_x,
                            q_y: value.data.cameraRotation.q_y,
                            q_z: value.data.cameraRotation.q_z,
                            x: value.data.cameraRotation.x,
                            y: value.data.cameraRotation.y,
                            z: value.data.cameraRotation.z,
                        });
                    cameraRotation.save(function (err02: any, cameraRotationRet: any) {
                        let device = new Device(
                            {
                                cameraOffset: cameraOffsetRet._id,
                                cameraRotation: cameraRotationRet._id,
                                description: value.data.description,
                                deviceModel: value.data.deviceModel,
                                deviceType: value.data.deviceType,
                                dpi: value.data.dpi,
                                resolutionX: value.data.resolutionX,
                                resolutionY: value.data.resolutionY,
                                uid: user_hash[ws_id],
                            },
                        );

                        device.save(deviceRet);
                    });
                });
            } else {
                let device = new Device(
                    {
                        cameraOffset: null,
                        cameraRotation: null,
                        description: value.data.description,
                        deviceModel: value.data.deviceModel,
                        deviceType: value.data.deviceType,
                        dpi: value.data.dpi,
                        resolutionX: value.data.resolutionX,
                        resolutionY: value.data.resolutionY,
                        uid: user_hash[ws_id],
                    },
                );
                device.save(deviceRet);
                }
            }
    } else {
        console.log(value);
            let device = new Device(
                {
                    description: value.data.description,
                    deviceModel: value.data.deviceModel,
                    deviceType: value.data.deviceType,
                    dpi: value.data.dpi,
                    resolutionX: value.data.resolutionX,
                    resolutionY: value.data.resolutionY,
                    uid: value.data.uid,
                },
            );
            console.log("Saving..");
            console.log(device);
            device.save(function (err00, device_ret) {
                console.log("Creating a new client");
                if (err00 != null) {
                    console.log("ERROR! 00");
                    console.log(err00);
                }
                console.log(device_ret);
                let newClient = new Client({
                    activeConnectionId: ws_id,
                    description: "None yet",
                    device: device_ret._id,
                    state: Commands.STATE_CONNECTED,
                    type: value.type,
                    uid: "3",
                });
                newClient.save(function (err1, result) {
                    if (err1) {
                        console.error(err1);
                        return;
                    }
                    console.log("Broadcasting that we have a new client ", result);
                    client_hash[ws_id] = result._id;
                    ServerEventDispatcher.broadcast(Commands.client.NEW_CLIENT, { data: result }, time, result._id, result.uid);
                    ServerEventDispatcher.send(Commands.client.REGISTER_CLIENT, { data: result }, time, ws_id);
                });
            });
        }

    }

    function clientDisconnect(value: { data: any }, time: number, ws_id: number) {
        console.log("Handling disconnect of client " + value.data);
        let clientNum = parseInt(value.data, 10);
        Client.findOne({ _id: client_hash[ws_id] }, function (err, result) {
            if (!err && result != null) {
                result.state = Commands.STATE_DISCONNECTED;
                result.activeConnectionId = -1;
                result.save(function (err2, client, numAffected) {
                    ServerEventDispatcher.broadcast(Commands.client.CLIENT_DISCONNECT, { data: client._id }, time, client._id, client.uid);
                });
            } else {
                console.log("Error -- client not found");
            }
        });
    }

    function deleteClient(value: { data: any }, time: number, connection_id: number) {
        Client.remove({ _id: value.data._id }, function (err3) {
            let clientNum;
            console.log("Removed client " + value + "status" + (err3 === null) ? "removed" : "error");
            console.log("Broadcasting the removal of client ", value.data);
            ServerEventDispatcher.broadcast(Commands.client.DELETE_CLIENT,
                { data: value }, null, value.data._id, value.data.uid);
        });
    }
    function connectionReestablished(value: { data: any }, time: number, ws_id: number) {
        console.log("Attempting to reconnect client " + value.data);
        console.log(value);
        Client.findOne({ _id: value.data }, function (err, result) {
            if (err || result == null) {
                console.log("No client found");
                ServerEventDispatcher.send(Commands.ERROR, { data: Commands.ERROR_NO_CLIENT_FOUND }, time, ws_id);
            } else {
                console.log("Client found");
                result.activeConnectionId = ws_id;
                client_hash[ws_id] = result._id;
                result.state = Commands.STATE_CONNECTED;
                result.save(function (err2, doc, numAffected) {
                    ServerEventDispatcher.send(Commands.client.CONNECTION_REESTABLISHED, { data: doc._id }, time, ws_id);
                    ServerEventDispatcher.broadcast(Commands.client.NEW_CLIENT, { data: doc }, time, doc._id, doc.uid);
                });
            }
        });
    }

    // Returns a set of clients owned by the user
    function getClients(value: { data: any }, time: number, connection_id: number) {
        Client.find({ "uid": user_hash[connection_id] })
            .exec(function (err, clients) {
                ServerEventDispatcher.send(Commands.client.GET_CLIENTS, { data: clients }, time, connection_id);
            });
    };

    function clientLogin(value: { data: any }, time: number, connection_id: number) {
        let found = false;
        console.log("LOGGED IN");
        console.log(value.data);
        ServerEventDispatcher.send(Commands.client.LOGIN, { data: value }, time, connection_id);
        /*
        User.findOne({ _id: value.data }, function (err, user) {
            if (err) {
                console.log("User not found");
                let newUser = new User({ _id: value });
                newUser.save(function (err2, result_user) {
                    if (err2) { return console.error(err2); }
                    user_hash[connection_id] = result_user._id;
                    ServerEventDispatcher.send(Commands.client.LOGIN, { data: value }, time, connection_id);
                });
            } else {
                user_hash[connection_id] = value.data;
                ServerEventDispatcher.send(Commands.client.LOGIN, { data: value }, time, connection_id);
                ServerEventDispatcher.send(Commands.client.LOGGING_IN, { data: value }, time, connection_id);
            }
        });*/
    }

    function onPing(value: { data: any }, time: number, connection_id: number) {
        ServerEventDispatcher.send(Commands.PONG, { data: value.data }, time, connection_id);
    }

    export default function (sockServer: ServerEventDispatcher, userHash: string[], clientHash: string[], cb: Function) {
        sockServ = sockServer;
        user_hash = userHash;
        client_hash = clientHash;
        function bind(cmd: number, func: (value: { data: any, from?: string, description?: string, name?: string },
            time: number, ws_id: number) => void) {
            if (!isBound[cmd]) {
                ServerEventDispatcher.bind(cmd, func);
                isBound[cmd] = true;
            }
        }

        bind(Commands.client.REGISTER_CLIENT, registerClient);
        bind(Commands.client.DELETE_CLIENT, deleteClient);
        bind(Commands.client.CLIENT_DISCONNECT, clientDisconnect);
        bind(Commands.client.CONNECTION_REESTABLISHED, connectionReestablished);
        bind(Commands.client.GET_CLIENTS, getClients);
        bind(Commands.client.LOGIN, clientLogin);
        bind(Commands.PING, onPing);

        return cb();
    };
