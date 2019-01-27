"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("../common/commands");
const client_1 = require("../models/client");
const server_1 = require("../server");
const device_1 = require("../models/device");
const flowTransform_1 = require("../models/flowTransform");
let user_hash;
let client_hash;
let sockServ;
function clientTypeToName(type) {
    let name;
    switch (type) {
        case commands_1.Commands.CLIENT_EDITOR:
            name = "editor";
            break;
        case commands_1.Commands.CLIENT_WEB:
            name = "web";
            break;
        case commands_1.Commands.CLIENT_HOLOLENS:
            name = "holo";
            break;
        case commands_1.Commands.CLIENT_MAGICLEAP:
            name = "holo";
            break;
    }
    return name;
}
function registerClient(value, time, ws_id) {
    if (user_hash[ws_id] != null) {
        console.log("Receiving device ", value.data);
        let deviceRet = function (err00, device_ret) {
            console.log("Creating a new client");
            if (err00 != null) {
                console.log("ERROR! 01");
                console.log(err00);
            }
            console.log(device_ret);
            let newClient = new client_1.Client({
                activeConnectionId: ws_id,
                description: "None yet",
                device: device_ret._id,
                state: commands_1.Commands.STATE_CONNECTED,
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
                server_1.ServerEventDispatcher.broadcast(commands_1.Commands.client.NEW_CLIENT, { data: result }, time, result._id, result.uid);
                server_1.ServerEventDispatcher.send(commands_1.Commands.client.REGISTER_CLIENT, { data: result }, time, ws_id);
            });
        };
        if (value.type !== commands_1.Commands.CLIENT_WEB) {
            let cameraOffset = null;
            if (value.data.cameraOffset != null) {
                cameraOffset = new flowTransform_1.FlowTransformModel({
                    q_w: value.data.cameraOffset.q_w,
                    q_x: value.data.cameraOffset.q_x,
                    q_y: value.data.cameraOffset.q_y,
                    q_z: value.data.cameraOffset.q_z,
                    x: value.data.cameraOffset.x,
                    y: value.data.cameraOffset.y,
                    z: value.data.cameraOffset.z,
                });
                cameraOffset.save(function (err01, cameraOffsetRet) {
                    let cameraRotation = new flowTransform_1.FlowTransformModel({
                        q_w: value.data.cameraRotation.q_w,
                        q_x: value.data.cameraRotation.q_x,
                        q_y: value.data.cameraRotation.q_y,
                        q_z: value.data.cameraRotation.q_z,
                        x: value.data.cameraRotation.x,
                        y: value.data.cameraRotation.y,
                        z: value.data.cameraRotation.z,
                    });
                    cameraRotation.save(function (err02, cameraRotationRet) {
                        let device = new device_1.Device({
                            cameraOffset: cameraOffsetRet._id,
                            cameraRotation: cameraRotationRet._id,
                            description: value.data.description,
                            deviceModel: value.data.deviceModel,
                            deviceType: value.data.deviceType,
                            dpi: value.data.dpi,
                            resolutionX: value.data.resolutionX,
                            resolutionY: value.data.resolutionY,
                            uid: user_hash[ws_id],
                        });
                        device.save(deviceRet);
                    });
                });
            }
            else {
                let device = new device_1.Device({
                    cameraOffset: null,
                    cameraRotation: null,
                    description: value.data.description,
                    deviceModel: value.data.deviceModel,
                    deviceType: value.data.deviceType,
                    dpi: value.data.dpi,
                    resolutionX: value.data.resolutionX,
                    resolutionY: value.data.resolutionY,
                    uid: user_hash[ws_id],
                });
                device.save(deviceRet);
            }
        }
    }
    else {
        console.log(value);
        let device = new device_1.Device({
            description: value.data.description,
            deviceModel: value.data.deviceModel,
            deviceType: value.data.deviceType,
            dpi: value.data.dpi,
            resolutionX: value.data.resolutionX,
            resolutionY: value.data.resolutionY,
            uid: value.data.uid,
        });
        console.log("Saving..");
        console.log(device);
        device.save(function (err00, device_ret) {
            console.log("Creating a new client");
            if (err00 != null) {
                console.log("ERROR! 00");
                console.log(err00);
            }
            console.log(device_ret);
            let newClient = new client_1.Client({
                activeConnectionId: ws_id,
                description: "None yet",
                device: device_ret._id,
                state: commands_1.Commands.STATE_CONNECTED,
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
                server_1.ServerEventDispatcher.broadcast(commands_1.Commands.client.NEW_CLIENT, { data: result }, time, result._id, result.uid);
                server_1.ServerEventDispatcher.send(commands_1.Commands.client.REGISTER_CLIENT, { data: result }, time, ws_id);
            });
        });
    }
}
function clientDisconnect(value, time, ws_id) {
    console.log("Handling disconnect of client " + value.data);
    let clientNum = parseInt(value.data, 10);
    client_1.Client.findOne({ _id: client_hash[ws_id] }, function (err, result) {
        if (!err && result != null) {
            result.state = commands_1.Commands.STATE_DISCONNECTED;
            result.activeConnectionId = -1;
            result.save(function (err2, client, numAffected) {
                server_1.ServerEventDispatcher.broadcast(commands_1.Commands.client.CLIENT_DISCONNECT, { data: client._id }, time, client._id, client.uid);
            });
        }
        else {
            console.log("Error -- client not found");
        }
    });
}
function deleteClient(value, time, connection_id) {
    client_1.Client.remove({ _id: value.data._id }, function (err3) {
        let clientNum;
        console.log("Removed client " + value + "status" + (err3 === null) ? "removed" : "error");
        console.log("Broadcasting the removal of client ", value.data);
        server_1.ServerEventDispatcher.broadcast(commands_1.Commands.client.DELETE_CLIENT, { data: value }, null, value.data._id, value.data.uid);
    });
}
function connectionReestablished(value, time, ws_id) {
    console.log("Attempting to reconnect client " + value.data);
    console.log(value);
    client_1.Client.findOne({ _id: value.data }, function (err, result) {
        if (err || result == null) {
            console.log("No client found");
            server_1.ServerEventDispatcher.send(commands_1.Commands.ERROR, { data: commands_1.Commands.ERROR_NO_CLIENT_FOUND }, time, ws_id);
        }
        else {
            console.log("Client found");
            result.activeConnectionId = ws_id;
            client_hash[ws_id] = result._id;
            result.state = commands_1.Commands.STATE_CONNECTED;
            result.save(function (err2, doc, numAffected) {
                server_1.ServerEventDispatcher.send(commands_1.Commands.client.CONNECTION_REESTABLISHED, { data: doc._id }, time, ws_id);
                server_1.ServerEventDispatcher.broadcast(commands_1.Commands.client.NEW_CLIENT, { data: doc }, time, doc._id, doc.uid);
            });
        }
    });
}
function getClients(value, time, connection_id) {
    client_1.Client.find({ "uid": user_hash[connection_id] })
        .exec(function (err, clients) {
        server_1.ServerEventDispatcher.send(commands_1.Commands.client.GET_CLIENTS, { data: clients }, time, connection_id);
    });
}
;
function clientLogin(value, time, connection_id) {
    let found = false;
    console.log("LOGGED IN");
    console.log(value.data);
    server_1.ServerEventDispatcher.send(commands_1.Commands.client.LOGIN, { data: value }, time, connection_id);
}
function onPing(value, time, connection_id) {
    server_1.ServerEventDispatcher.send(commands_1.Commands.PONG, { data: value.data }, time, connection_id);
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
    bind(commands_1.Commands.client.REGISTER_CLIENT, registerClient);
    bind(commands_1.Commands.client.DELETE_CLIENT, deleteClient);
    bind(commands_1.Commands.client.CLIENT_DISCONNECT, clientDisconnect);
    bind(commands_1.Commands.client.CONNECTION_REESTABLISHED, connectionReestablished);
    bind(commands_1.Commands.client.GET_CLIENTS, getClients);
    bind(commands_1.Commands.client.LOGIN, clientLogin);
    bind(commands_1.Commands.PING, onPing);
    return cb();
}
exports.default = default_1;
;
