"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;
const user_1 = require("./user");
const scene_1 = require("./scene");
const client_1 = require("./client");
const projectSchema = new mongoose.Schema({
    _id: String,
    projectName: String,
    owner: { type: ObjectId, ref: user_1.User },
    clients: { type: ObjectId, ref: client_1.Client },
    currentScene: { type: ObjectId, ref: scene_1.Scene },
    prevScene: [{ type: ObjectId, ref: scene_1.Scene }],
    nextScene: [{ type: ObjectId, ref: scene_1.Scene }],
    bookmarks: [{ type: ObjectId, ref: scene_1.Scene }],
    created: Date,
    lastEdit: Date,
    lastEditor: { type: ObjectId, ref: user_1.User },
});
exports.Project = mongoose.model("Project", projectSchema);
