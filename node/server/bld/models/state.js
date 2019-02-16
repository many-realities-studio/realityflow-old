"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;
const stateSchema = new mongoose.Schema({
    _bid: { type: ObjectId, ref: "Bubble" },
    name: String,
    parentState: { type: ObjectId, ref: "State" },
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
    }
    else {
        next();
    }
});
exports.State = mongoose.model("State", stateSchema);
