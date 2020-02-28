import * as mongoose from "mongoose";
import Schema = mongoose.Schema;
import Types = Schema.Types;
import ObjectId = Types.ObjectId;
import ObjectIdType = mongoose.Types.ObjectId;
import { User } from "./user";

export declare interface IClientModel extends mongoose.Document {
    Id:             string;
    User:           ObjectIdType;
    DeviceType:     Number;
}

//The usePushEach property is a workaround for a
//known Mongo issue that prohibits modifying
//arrays stored in the DB
const clientSchema = new mongoose.Schema({
    Id:             {type: String},
    User:           {type: ObjectId, ref: User},
    DeviceType:     Number
},{usePushEach: true} );

export const Client = mongoose.model<IClientModel>("Client", clientSchema);
