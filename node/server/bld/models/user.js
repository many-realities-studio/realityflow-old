"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;
const project_1 = require("./project");
const client_1 = require("./client");
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    clients: [{ type: ObjectId, ref: client_1.Client }],
    activeProject: { type: ObjectId, ref: project_1.Project },
    projects: [{ type: ObjectId, ref: project_1.Project }],
    friends: [{ type: ObjectId, ref: 'User' }]
});
exports.User = mongoose.model("User", userSchema);
