import * as mongoose from "mongoose";
import Schema = mongoose.Schema;
import Types = Schema.Types;
import ObjectId = Types.ObjectId;
import ObjectIdType = mongoose.Types.ObjectId;
import { User } from "./user";
import { Scene } from "./scene";
import { Client } from "./client";


export declare interface IProjectModel extends mongoose.Document{

    _id:            String;
    projectName:    String;
    owner:          ObjectIdType;
    clients:        [ObjectIdType];
    currentScene:   ObjectIdType;
    prevScene:      [ObjectIdType];
    nextScene:      [ObjectIdType];
    bookmarks:      [ObjectIdType];
    created:        Date;
    lastEdit:       Date;
    lastEditor:     ObjectIdType;

}


const projectSchema = new mongoose.Schema({

    _id:            String,
    projectName:    String,
    owner:          {type: ObjectId, ref: User},
    clients:        {type: ObjectId, ref: Client},
    currentScene:   {type: ObjectId, ref: Scene},
    prevScene:      [{type: ObjectId, ref: Scene}],
    nextScene:      [{type: ObjectId, ref: Scene}],
    bookmarks:      [{type: ObjectId, ref: Scene}],
    created:        Date,
    lastEdit:       Date,
    lastEditor:     {type: ObjectId, ref: User},

});


export const Project = mongoose.model<IProjectModel>("Project", projectSchema);