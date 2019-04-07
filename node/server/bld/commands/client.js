"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const client_1 = require("../models/client");
var objectId = mongoose.Types.ObjectId();
class ClientOperations {
    static createClient(clientInfo, userId) {
        var createdClient;
        console.log('Entering createClient...');
        console.log('ClientInfo Payload: ' + clientInfo);
        console.log('UserInfo Payload: ' + userId);
        var newClient = new client_1.Client({
            user: userId,
            deviceType: clientInfo.deviceType,
        });
        console.log('Client PreSave: ' + newClient);
        var promise = newClient.save(function (err, doc) {
            createdClient = doc;
            console.log('Saved Client: ' + createdClient._id);
        });
        return promise;
    }
    static deleteClient(clientInfoId) {
        client_1.Client.findByIdAndRemove(clientInfoId);
    }
}
exports.ClientOperations = ClientOperations;
