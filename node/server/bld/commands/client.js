"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const client_1 = require("../models/client");
const user_1 = require("./user");
var objectId = mongoose.Types.ObjectId();
class ClientOperations {
    static createClient(clientInfo, username) {
        return __awaiter(this, void 0, void 0, function* () {
            var foundUser = yield user_1.UserOperations.findUser(username);
            var newClient = new client_1.Client({
                User: foundUser._id,
                Id: clientInfo.Id,
                DeviceType: clientInfo.DeviceType,
            });
            return yield newClient.save();
        });
    }
    static findClient(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client_1.Client.findOne({ Id: clientId });
        });
    }
    static deleteClient(clientInfoId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield client_1.Client.findByIdAndRemove({ Id: clientInfoId });
        });
    }
}
exports.ClientOperations = ClientOperations;
//# sourceMappingURL=client.js.map