import * as mongoose from "mongoose";
import { User, IUserModel } from "../models/user";
import { AssertionError } from "assert";

var objectId = mongoose.Types.ObjectId();

export class UserOperations {

    public static createUser(userInfo: any){

        var newUser;

        console.log('Entering CreateUser...');
        console.log('UserInfo Username: '+userInfo.username);
        console.log('UserInfo Password: '+userInfo.password);

        var hashedUserInfo = this.hashUserInfo(userInfo.username, userInfo.password);

        var newUser = new User({

            username: userInfo.username,
            password: userInfo.password,
            clients: undefined,
            activeProject: undefined,
            projects: undefined,
            friends: undefined

        });

        console.log('User Presave: '+newUser);


        var promise = newUser.save();

            console.log('Save User: '+newUser);

        promise.then(function(err, doc){

                console.log('User ' + userInfo.username + ' added successfully.');
                newUser = doc;

            return newUser;    
        });

        return promise;

    }

    public static findUser(userInfo: any){

        var returnedUser;

        var promise = User.findById({_id: userInfo._id}).exec();
        
        promise.then(function(err, doc){

            returnedUser = doc;

            return returnedUser;
        
        });

        return promise;

    }

    public static loginUser(userInfo: any){

       var returnedUser = {

            isLoggedIn: false,
            _id:        ''
       }

       var hashedUserInfo = this.hashUserInfo(userInfo.username, userInfo.password);

       console.log("looking for user: " + userInfo.username + " with password: " + userInfo.password);
         var promise = User.findOne({username:"test", password:"test"}).exec();

         promise.then(function(doc){

            if(doc==undefined){

                returnedUser.isLoggedIn = false;
                console.log('No doc found');
            }
            else{

                returnedUser.isLoggedIn = true;
                returnedUser._id = doc._id;

            }

            console.log('Returned User payload Doc: '+doc);
            console.log('Returned User isLoggedIn: '+returnedUser.isLoggedIn);

            return returnedUser;
            
        });

        return promise;

    }


    public static updateUser(userInfo: any){

        var hashedUserInfo = this.hashUserInfo(userInfo.username, userInfo.password);
        User.findOneAndUpdate({_id: userInfo._id}, {

            username: hashedUserInfo.username,
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

        const bcrypt = require('bcrypt');
        const saltRounds = 10;

        var hashedUserName = bcrypt.hash(username, saltRounds);
        var hashedPassword = bcrypt.hash(password, saltRounds);

        var hashedUserInfo = {

            username: hashedUserName,
            password: hashedPassword

        }

        return hashedUserInfo;

    }
}