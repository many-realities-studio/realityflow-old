"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;
const user_1 = require("./user");
const object_1 = require("./object");
const client_1 = require("./client");
const projectSchema = new mongoose.Schema({
    projectName: String,
    owner: { type: ObjectId, ref: user_1.User },
    clients: { type: ObjectId, ref: client_1.Client },
    objects: [{ type: ObjectId, ref: object_1.Object }],
    created: Date,
    lastEdit: Date,
    lastEditor: { type: ObjectId, ref: user_1.User },
});
exports.Project = mongoose.model("Project", projectSchema);
