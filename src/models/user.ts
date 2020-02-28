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
    Username: string;
    Password: string;
    Clients: [ObjectIdType];
    Projects: [ObjectIdType];
    compare: Function
    
}

//The usePushEach property is a workaround for a
//known Mongo issue that prohibits modifying
//arrays stored in the DB
const userSchema: mongoose.Schema = new mongoose.Schema({
    Username:  {type: String, required: true},
    Password: {type: String, required: true},
    Clients: [{type: ObjectId, ref: Client}],
    Projects: [{type: ObjectId, ref: Project}],
    
},{usePushEach: true});

userSchema.pre('save', async function(next){
    if(!this.isModified("Password"))
        return next();
    
    this.Password = await bcrypt.hash(this.Password, SALT_WORK_FACTOR);
    console.log(this.Password)
    next();
});


userSchema.methods.comparePassword = function (candidatePassword: any, callback: any) {

    callback(null, bcrypt.compareSync(candidatePassword, this.Password));
};


export const User = mongoose.model<IUserModel>("User", userSchema);
