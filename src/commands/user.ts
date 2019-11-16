import * as mongoose from "mongoose";
import { User, IUserModel } from "../models/user";
import { AssertionError } from "assert";

var objectId = mongoose.Types.ObjectId();
const bcrypt = require('bcrypt');
const saltRounds = 10;

export class UserOperations {

    public static createUser(userInfo: any){

        var newUser;

        var hashedUserInfo = this.hashUserInfo(userInfo.username, userInfo.password);

        var newUser = new User({

            username: userInfo.username,
            password: hashedUserInfo.password,
            clients: undefined,
            activeProject: undefined,
            projects: undefined,
            friends: undefined

        });

        var promise = newUser.save();

        promise.then(function(err, doc){

                newUser = doc;

            return newUser;    
        });

        return promise;

    }

    public static findUser(userInfo: any){

        var returnedUser = null;

        var promise = User.find({ username: userInfo.username}).exec();
        
        promise.catch(function(err) {
            console.log(err);
        });
        
        promise.then(function(doc){

            if(doc)
                returnedUser = doc;

            return returnedUser;
        });

        return promise;
    }

    public static loginUser(userInfo: any){

       var hashedUserInfo = this.hashUserInfo(userInfo.username, userInfo.password);

         var promise = User.findOne({username: userInfo.username}).exec();

         promise.then(function(doc){

            return doc;
            
        });

        return promise;
    }


    public static updateUser(userInfo: any){

        var hashedUserInfo = this.hashUserInfo(userInfo.username, userInfo.password);
        User.findOneAndUpdate({_id: userInfo._id}, {

            username: userInfo.username,
            password: hashedUserInfo.password,
            clients: userInfo.clients,
            activeProject: userInfo.activeProject,
            projects: userInfo.projects,
            friends: userInfo.friends

        }, function(err){

            if(err){

                console.log('ERROR: Failed to update user: ' + userInfo.username);

            }
            else{

                console.log('User ' + userInfo.username + ' updated successfully.');

            }

        });
    }

    public static deleteUser(userInfo: any){

        User.findByIdAndDelete(userInfo._id);
    }

    public static hashUserInfo(username: String, password: String){

        var hashedUserName = bcrypt.hashSync(username, saltRounds);
        var hashedPassword = bcrypt.hashSync(password, saltRounds);

        var hashedUserInfo = {

            username: hashedUserName,
            password: hashedPassword

        }

        return hashedUserInfo;

    }
}