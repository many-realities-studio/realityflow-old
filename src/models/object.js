"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Types = Schema.Types;
//The usePushEach property is a workaround for a
//known Mongo issue that prohibits modifying
//arrays stored in the DB
var objectSchema = new mongoose.Schema({
    type: String,
    name: String,
    triangles: [],
    x: Number,
    y: Number,
    z: Number,
    q_x: Number,
    q_y: Number,
    q_z: Number,
    q_w: Number,
    s_x: Number,
    s_y: Number,
    s_z: Number,
    color: Types.Mixed,
    vertices: [],
    uv: [],
    texture: [],
    textureHeight: Number,
    textureWidth: Number,
    textureFormat: Number,
    mipmapCount: Number,
    locked: Boolean
}, { usePushEach: true });
exports.Object = mongoose.model("Object", objectSchema);
