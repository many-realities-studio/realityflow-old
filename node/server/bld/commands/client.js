"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const client_1 = require("../models/client");
var objectId = mongoose.Types.ObjectId();
class ClientOperations {
    static createClient(clientInfo, userId) {
        var createdClient;
        var newClient = new client_1.Client({
            user: userId,
            deviceType: clientInfo.deviceType,
        });
        var promise = newClient.save(function (err, doc) {
            createdClient = doc;
        });
        return promise;
    }
    static deleteClient(clientInfoId) {
        client_1.Client.findByIdAndRemove(clientInfoId);
    }
}
exports.ClientOperations = ClientOperations;
