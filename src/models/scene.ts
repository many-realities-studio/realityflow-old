/*import * as mongoose from "mongoose";
import Schema = mongoose.Schema;
import Types = Schema.Types;
import ObjectId = Types.ObjectId;
import ObjectIdType = mongoose.Types.ObjectId;
import { Project } from "./project";
import { Object } from "./object"

export declare interface ISceneModel extends mongoose.Document{

    _id:                String;
    _parentProject:     ObjectIdType;
    created:            Date;
    objects:            [];

}

const sceneSchema = new mongoose.Schema({

    _id:                String,
    _parentProject:     {type: ObjectId, ref: Project},
    created:            Date,
    objects:            [{type: ObjectId, ref: Object}]

});

export const Scene = mongoose.model<ISceneModel>("Scene", sceneSchema);*/