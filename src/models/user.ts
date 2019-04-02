import * as mongoose from "mongoose";
import Schema = mongoose.Schema;
import Types = Schema.Types;
import ObjectId = Types.ObjectId;
import ObjectIdType = mongoose.Types.ObjectId;
import { Project } from "./project"
import { Client } from "./client"

export declare interface IUserModel extends mongoose.Document {
    username: String;
    password: String;
    clients: [ObjectIdType];
    activeProject: ObjectIdType;
    projects: [ObjectIdType];
    friends:  [ObjectIdType];
}

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    clients: [{type: ObjectId, ref: Client}],
    activeProject: {type: ObjectId, ref: Project},
    projects: [{type: ObjectId, ref: Project}],
    friends: [{type: ObjectId, ref: 'User'}]
});

export const User = mongoose.model<IUserModel>("User", userSchema);
