import * as mongoose from "mongoose";
import Schema = mongoose.Schema;
import Types = Schema.Types;
import ObjectId = Types.ObjectId;
import ObjectIdType = mongoose.Types.ObjectId;

export declare interface IUserModel extends mongoose.Document {
    _id: string;
    username: String;
    password: String;
    /*active_project: ObjectIdType;
    active_bubble: ObjectIdType;
    active_state: ObjectIdType;
    clients: ObjectIdType[];*/
}

const userSchema = new mongoose.Schema({
    _id: String,
    /*active_bubble: {type: ObjectId, ref: "Bubble"},
    active_project: {type: ObjectId, ref: "Project"},
    active_state: {type: ObjectId, ref: "State"},
    clients: [{type: ObjectId, ref: "Client"}],*/
    username: String,
    password: String
});

export const User = mongoose.model<IUserModel>("User", userSchema);
