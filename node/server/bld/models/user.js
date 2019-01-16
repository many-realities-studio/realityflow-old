"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;
const userSchema = new mongoose.Schema({
    _id: String,
    active_bubble: { type: ObjectId, ref: "Bubble" },
    active_project: { type: ObjectId, ref: "Project" },
    active_state: { type: ObjectId, ref: "State" },
    clients: [{ type: ObjectId, ref: "Client" }],
    username: String,
});
exports.User = mongoose.model("User", userSchema);
