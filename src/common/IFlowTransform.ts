import { Document } from "mongoose";

export declare interface IFlowTransform extends Document {
    _id: any;
    _pid: any;
    id: string;
    x: number;
    y: number;
    z: number;
    q_x: number;
    q_y: number;
    q_z: number;
    q_w: number;
}
