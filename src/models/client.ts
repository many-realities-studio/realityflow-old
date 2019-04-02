import * as mongoose from "mongoose";
import Schema = mongoose.Schema;
import Types = Schema.Types;
import ObjectId = Types.ObjectId;
import ObjectIdType = mongoose.Types.ObjectId;
import { User } from "./user";

export declare interface IClientModel extends mongoose.Document {
    user:           ObjectIdType;
    deviceType:     Number;
}

const clientSchema = new mongoose.Schema({
    user:           {type: ObjectId, ref: User},
    deviceType:     Number
});

export const Client = mongoose.model<IClientModel>("Client", clientSchema);
