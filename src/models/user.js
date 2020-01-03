"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;
var project_1 = require("./project");
var client_1 = require("./client");
//The usePushEach property is a workaround for a
//known Mongo issue that prohibits modifying
//arrays stored in the DB
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    clients: [{ type: ObjectId, ref: client_1.Client }],
    activeProject: { type: ObjectId, ref: project_1.Project },
    projects: [{ type: ObjectId, ref: project_1.Project }],
    friends: [{ type: ObjectId, ref: 'User' }]
}, { usePushEach: true });
exports.User = mongoose.model("User", userSchema);
