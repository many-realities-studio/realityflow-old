"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
var ObjectId = mongoose_1.Schema.Types.ObjectId;
const flowTransformSchema = new mongoose_1.Schema({
    _pid: { type: ObjectId, ref: "Project" },
    id: { type: ObjectId, ref: "Modifier" },
    q_w: Number,
    q_x: Number,
    q_y: Number,
    q_z: Number,
    x: Number,
    y: Number,
    z: Number,
});
exports.FlowTransformModel = mongoose.model("FlowTransform", flowTransformSchema);
