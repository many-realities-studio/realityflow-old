import * as mongoose from "mongoose";
import Schema = mongoose.Schema;
import Types = Schema.Types;
import ObjectId = Types.ObjectId;
import ObjectIdType = mongoose.Types.ObjectId;
import { User } from "./user";
import { Object } from "./object";
import { Client } from "./client";


export declare interface IProjectModel extends mongoose.Document{
    [x: string]: any;

    Id: String;
    Description: String;
    DateModified: Number;
    ProjectName: Number;
    ObjectList: [ObjectIdType];


}

//The usePushEach property is a workaround for a
//known Mongo issue that prohibits modifying
//arrays stored in the DB
const projectSchema = new mongoose.Schema({

    Id: String,
    Description: String,
    DateModified: Number,
    ProjectName: Number,
    ObjectList: [{type: ObjectId, ref: Object}]

},{usePushEach: true});




export const Project = mongoose.model<IProjectModel>("Project", projectSchema);