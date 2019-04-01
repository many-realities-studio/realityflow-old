import { User, IUserModel } from "../models/user";
import { ServerEventDispatcher, isBound } from "../server";
import { Commands } from "../common/commands";
import { userInfo } from "os";

let sockServ: ServerEventDispatcher;
let user_hash: string[];
let client_hash: string[];

export class UserOperations {

    public static createUser(userInfo: any){

        var newUser;

        var hashedUserInfo = this.hashUserInfo(userInfo.username, userInfo.password);

        var newUser = new User({

            username: hashedUserInfo.username,
            password: hashedUserInfo.password,
            clients: undefined,
            activeProject: undefined,
            projects: undefined,
            friends: undefined

        });

        newUser.save(function(err, doc){

            if(err){

                console.log('ERROR: Failed to create user: ' + userInfo.username);

            }
            else{

                console.log('User ' + userInfo.username + ' added successfully.');
                newUser = doc;

            }
        });

        return newUser;
    }

    public static findUser(userInfo: any){

        var returnedUser;

        User.findById({_id: userInfo._id}, function(err, doc){

            returnedUser = doc;

        });

        return returnedUser;

    }

    public static loginUser(userInfo: any){

       var returnedUser = {

            isLoggedIn: false,
            _id:        ''
       }

       var hashedUserInfo = this.hashUserInfo(userInfo.username, userInfo.password);

        User.find({username: hashedUserInfo.username, password: hashedUserInfo.password}, {lean: true}, function(err, doc){

            if(err){

                console.log('Error');
                returnedUser.isLoggedIn = false;
            }
            else if(!doc){

                returnedUser.isLoggedIn = false;

            }
            else{

                returnedUser.isLoggedIn = true;
                returnedUser._id = doc._id;

            }

        });

        return returnedUser;

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