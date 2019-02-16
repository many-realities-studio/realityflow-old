"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
var ObjectId = mongoose_1.Schema.Types.ObjectId;
const flowCameraSchema = new mongoose_1.Schema({
    _fov: Number,
    _tid: { type: ObjectId, ref: "Project" },
});
exports.FlowTransformModel = mongoose.model("FlowCamera", flowCameraSchema);
