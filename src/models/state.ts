import * as mongoose from "mongoose";
import Schema = mongoose.Schema;
import Types = Schema.Types;
import ObjectId = Types.ObjectId;

export interface IStateModel extends mongoose.Document {
    _bid: ObjectId;
    _instances: ObjectId[];
    name: string;
    parentState: ObjectId;
}

const stateSchema = new mongoose.Schema({
  _bid: {type: ObjectId, ref: "Bubble"},
  //  _instances: [{type: ObjectId, ref: "DropletInstance"}],
  name: String,
  parentState: {type: ObjectId, ref: "State"},
}, {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    });


stateSchema.virtual("_instances", {
    foreignField: "_sid",
    localField: "_id",
    ref: "DropletInstance",
});

stateSchema.pre("save", function (next) {
    let Bubble = require("./bubble").Bubble;
    this.dateModified = Date.now();
    this._wasNew = this.isNew;
    if (this._wasNew) {
        next();
    } else {
        next();
    }
});

export const State = mongoose.model<IStateModel>("State", stateSchema);
