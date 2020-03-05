"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;
const project_1 = require("./project");
const client_1 = require("./client");
const bcrypt = require("bcrypt");
let SALT_WORK_FACTOR = 10;
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    clients: [{ type: ObjectId, ref: client_1.Client }],
    activeProject: { type: ObjectId, ref: project_1.Project },
    projects: [{ type: ObjectId, ref: project_1.Project }],
    friends: [{ type: ObjectId, ref: 'User' }]
}, { usePushEach: true });
userSchema.pre('save', function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = bcrypt.hashSync(this.password, SALT_WORK_FACTOR);
    next();
});
userSchema.methods.comparePassword = function (plaintext, callback) {
    return callback(null, bcrypt.compareSync(plaintext, this.password));
};
exports.User = mongoose.model("User", userSchema);
//# sourceMappingURL=user.js.map