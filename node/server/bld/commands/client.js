"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../models/client");
class ClientOperations {
    static createClient(clientInfo, userId, connection) {
        var newClientId;
        var newClient = new client_1.Client({
            user: userId,
            deviceType: clientInfo.deviceType,
        });
        newClient.save(function (err, doc) {
            if (!err) {
                newClient = doc;
            }
        });
        console.log("finished creating client");
        return newClient;
    }
    static deleteClient(clientInfo) {
        client_1.Client.findByIdAndRemove(clientInfo._id);
    }
}
exports.ClientOperations = ClientOperations;
