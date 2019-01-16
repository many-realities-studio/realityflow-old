import * as mongoose from "mongoose";
import Schema = mongoose.Schema;
import Types = Schema.Types;
import ObjectId = Types.ObjectId;
import ObjectIdType = mongoose.Types.ObjectId;

export declare interface IClientModel extends mongoose.Document {
    activeConnectionId: number;
    device: ObjectIdType;
    type: number;
    state: number;
    uid: string;
}

const clientSchema = new mongoose.Schema({
    activeConnectionId: Number,
    device: { type: String, ref: "Device"},
    state: Number,
    type: Number,
    uid: { type: String, ref: "User", required: true },
});

export let Client = mongoose.model<IClientModel>("Client", clientSchema);
