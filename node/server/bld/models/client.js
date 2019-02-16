"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const clientSchema = new mongoose.Schema({
    activeConnectionId: Number,
    device: { type: String, ref: "Device" },
    state: Number,
    type: Number,
    uid: { type: String, ref: "User", required: true },
});
exports.Client = mongoose.model("Client", clientSchema);
