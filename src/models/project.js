"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;
var user_1 = require("./user");
var object_1 = require("./object");
var client_1 = require("./client");
//The usePushEach property is a workaround for a
//known Mongo issue that prohibits modifying
//arrays stored in the DB
var projectSchema = new mongoose.Schema({
    projectName: String,
    owner: { type: ObjectId, ref: user_1.User },
    clients: [{ type: ObjectId, ref: client_1.Client }],
    objs: [{ type: ObjectId, ref: object_1.Object }],
    /* currentScene:   {type: ObjectId, ref: Scene},
     prevScene:      [{type: ObjectId, ref: Scene}],
     nextScene:      [{type: ObjectId, ref: Scene}],
     bookmarks:      [{type: ObjectId, ref: Scene}], */
    created: Date,
    lastEdit: Date,
    lastEditor: { type: ObjectId, ref: user_1.User }
}, { usePushEach: true });
exports.Project = mongoose.model("Project", projectSchema);
