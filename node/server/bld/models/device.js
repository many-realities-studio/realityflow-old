"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;
const clientSchema = new mongoose.Schema({
    cameraOffset: { type: ObjectId, ref: "FlowTransform" },
    cameraRotation: { type: ObjectId, ref: "FlowTransform" },
    description: String,
    deviceModel: String,
    deviceType: Number,
    dpi: Number,
    resolutionX: Number,
    resolutionY: Number,
});
exports.Device = mongoose.model("Device", clientSchema);
