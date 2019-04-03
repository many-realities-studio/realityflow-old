"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const objectSchema = new mongoose.Schema({
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
    vertices: [],
    uv: [],
    locked: Boolean,
}, { usePushEach: true });
exports.Object = mongoose.model("Object", objectSchema);
