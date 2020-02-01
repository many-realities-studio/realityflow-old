import * as mongoose from "mongoose";
import Schema = mongoose.Schema;
import Types = Schema.Types;
import ObjectId = Types.ObjectId;
import ObjectIdType = mongoose.Types.ObjectId;
import { Project } from "./project"
import { Client } from "./client"
import bcrypt = require("bcrypt");
let SALT_WORK_FACTOR = 10

export declare interface IUserModel extends mongoose.Document {
    username: String;
    password: String;
    clients: [ObjectIdType];
    activeProject: ObjectIdType;
    projects: [ObjectIdType];
    friends:  [ObjectIdType];
}

//The usePushEach property is a workaround for a
//known Mongo issue that prohibits modifying
//arrays stored in the DB
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    clients: [{type: ObjectId, ref: Client}],
    activeProject: {type: ObjectId, ref: Project},
    projects: [{type: ObjectId, ref: Project}],
    friends: [{type: ObjectId, ref: 'User'}]
},{usePushEach: true});

userSchema.pre('save', function(next){
    if(!this.isModified("password"))
        return next();
    
    this.password = bcrypt.hashSync(this.password, SALT_WORK_FACTOR);
    next();
});

userSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, bcrypt.compareSync(plaintext, this.password));
};

export const User = mongoose.model<IUserModel>("User", userSchema);
