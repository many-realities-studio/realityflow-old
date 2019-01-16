import * as mongoose from "mongoose";
import Schema = mongoose.Schema;
import Types = Schema.Types;
import ObjectId = Types.ObjectId;
import ObjectIdType = mongoose.Types.ObjectId;
import { IFlowTransformMod, FlowTransformModel } from "../models/flowTransform";

export declare interface IDeviceModel extends mongoose.Document {
    cameraOffset: ObjectIdType;
    cameraRotation: ObjectIdType;
    description: string;
    deviceModel: string;
    deviceType: number;
    dpi: number;
    resolutionX: number;
    resolutionY: number;
}

const clientSchema = new mongoose.Schema({
    cameraOffset: { type: ObjectId, ref: "FlowTransform" },
    cameraRotation: { type: ObjectId, ref: "FlowTransform" },
    description: String,
    deviceModel: String,
    deviceType: Number,
    dpi: Number,
    resolutionX: Number,
    resolutionY: Number,
});

export let Device = mongoose.model<IDeviceModel>("Device", clientSchema);
