import * as mongoose from "mongoose";
import Schema = mongoose.Schema;
import Types = Schema.Types;
import ObjectId = Types.ObjectId;
import ObjectIdType = mongoose.Types.ObjectId;
//import { Scene } from "./scene";

export declare interface IObjectModel extends mongoose.Document{

    Type:           string;
    Name:           string;
    Triangles:      Number[];
    X:              Number;
    Y:              Number;
    Z:              Number;
    Q_x:            Number;
    Q_y:            Number;
    Q_z:            Number;
    Q_w:            Number;
    S_x:            Number;
    S_y:            Number;
    S_z:            Number;
    Color:          Object;
    Vertices:       Number[];
    Uv:             Number[];
    Texture:        Number[];
    TextureHeight:  Number;
    TextureWidth:   Number;
    TextureFormat:  Number;
    MipmapCount:    Number;
    Locked:         Boolean;

}

//The usePushEach property is a workaround for a
//known Mongo issue that prohibits modifying
//arrays stored in the DB
const objectSchema = new mongoose.Schema({

    type:           String,
    name:           String,
    triangles:      [],
    x:              Number,
    y:              Number,
    z:              Number,
    q_x:            Number,
    q_y:            Number,
    q_z:            Number,
    q_w:            Number,
    s_x:            Number,
    s_y:            Number,
    s_z:            Number,
    color:          Types.Mixed,
    vertices:       [],
    uv:             [],
    texture:        [],
    textureHeight:  Number,
    textureWidth:   Number,
    textureFormat:  Number,
    mipmapCount:    Number,
    locked:         Boolean

},{usePushEach: true});

export const Object = mongoose.model<IObjectModel>("Object", objectSchema);
