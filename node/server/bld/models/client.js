"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;
const user_1 = require("./user");
const clientSchema = new mongoose.Schema({
    user: { type: ObjectId, ref: user_1.User },
    deviceType: Number
}, { usePushEach: true });
exports.Client = mongoose.model("Client", clientSchema);
