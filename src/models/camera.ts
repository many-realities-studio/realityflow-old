import { IFlowTransform } from "../common/IFlowTransform";
import * as mongoose from "mongoose";
import { Document, Types, Model, model, Schema } from "mongoose";
import ObjectId = Schema.Types.ObjectId;
import ObjectIdType = Types.ObjectId;

export interface IFlowCameraMod extends Document {

}

const flowCameraSchema = new Schema({
  _fov: Number,
  _tid: { type: ObjectId, ref: "Project" },
});

export const FlowTransformModel: Model<IFlowCameraMod> = mongoose.model<IFlowCameraMod>("FlowCamera", flowCameraSchema);
