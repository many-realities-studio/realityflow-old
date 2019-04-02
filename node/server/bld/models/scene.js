"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;
const project_1 = require("./project");
const object_1 = require("./object");
const sceneSchema = new mongoose.Schema({
    _id: String,
    _parentProject: { type: ObjectId, ref: project_1.Project },
    created: Date,
    objects: [{ type: ObjectId, ref: object_1.Object }]
});
exports.Scene = mongoose.model("Scene", sceneSchema);
