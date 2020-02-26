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
    /* TODO: ask why there's two redundant-seeming fields 
    * in the FlowUser class
    */

    ID: String;
    RoomCode: Number;
    ClientList: [ObjectIdType];

    Username: String;
    Password: String;
    Clients: [ObjectIdType];
    Projects: [ObjectIdType];
    
}

//The usePushEach property is a workaround for a
//known Mongo issue that prohibits modifying
//arrays stored in the DB
const userSchema: mongoose.Schema = new mongoose.Schema({
    ID: String,
    RoomCode: Number,
    ClientList: [{type: ObjectId, ref: Client}],

    Username: String,
    Password: String,
    Clients: [{type: ObjectId, ref: Client}],
    Projects: [{type: ObjectId, ref: Project}],
    
},{usePushEach: true});

userSchema.pre('save', function(next){
    if(!this.isModified("Password"))
        return next();
    
    this.password = bcrypt.hashSync(this.Password, SALT_WORK_FACTOR);
    next();
});

userSchema.methods.comparePassword = function(plaintext: any, callback: any) {
    return callback(null, bcrypt.compareSync(plaintext, this.password));
};

export const User = mongoose.model<IUserModel>("User", userSchema);
