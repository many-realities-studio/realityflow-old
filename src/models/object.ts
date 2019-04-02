import * as mongoose from "mongoose";
import Schema = mongoose.Schema;
import Types = Schema.Types;
import ObjectId = Types.ObjectId;
import ObjectIdType = mongoose.Types.ObjectId;
import { Scene } from "./scene";

export declare interface IObjectModel extends mongoose.Document{

    type:       string;
    name:       string;
    triangles:  Number[];
    x:          Number;
    y:          Number;
    z:          Number;
    q_x:        Number;
    q_y:        Number;
    q_z:        Number;
    q_w:        Number;
    s_x:        Number;
    s_y:        Number;
    s_z:        Number;
    vertices:   Number[][];
    uv:         Number[][];
    locked:     Boolean;

}


const objectSchema = new mongoose.Schema({

    type:       String,
    name:       String,
    triangles:  [],
    x:          Number,
    y:          Number,
    z:          Number,
    q_x:        Number,
    q_y:        Number,
    q_z:        Number,
    q_w:        Number,
    s_x:        Number,
    s_y:        Number,
    s_z:        Number,
    vertices:   [Array],
    uv:         [Array],
    locked:     Boolean,

});

export const Object = mongoose.model<IObjectModel>("Object", objectSchema);
