import { IFlowTransform } from "../common/IFlowTransform";
import * as mongoose from "mongoose";
import { Document, Types, Model, model, Schema } from "mongoose";
import ObjectId = Schema.Types.ObjectId;
import ObjectIdType = Types.ObjectId;

export interface IFlowTransformMod extends IFlowTransform {
}

const flowTransformSchema = new Schema({
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

export const FlowTransformModel: Model<IFlowTransformMod> = mongoose.model<IFlowTransformMod>("FlowTransform", flowTransformSchema);
