"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;
var user_1 = require("./user");
//The usePushEach property is a workaround for a
//known Mongo issue that prohibits modifying
//arrays stored in the DB
var clientSchema = new mongoose.Schema({
    Id: String,
    User: { type: ObjectId, ref: user_1.User },
    DeviceType: Number
}, { usePushEach: true });
exports.Client = mongoose.model("Client", clientSchema);
