import * as mongoose from "mongoose";
import { User, IUserModel } from "../models/user";

var objectId = mongoose.Types.ObjectId();


export class UserOperations {

    public static createUser(userInfo: any){

        var newUser;

        var newUser = new User({

            username: userInfo.username,
            password: userInfo.password,
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
    // Why are we lookin at users by their internal IDs?
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

    // This just... returns the user based on their username??
    public static loginUser(userInfo: any){

        var promise = User.findOne({username: userInfo.username}).exec();

        promise.then(function(doc){

            return doc;
            
        });

        return promise;
    }


    public static updateUser(userInfo: any){

        User.findOneAndUpdate({_id: userInfo._id}, {

            username: userInfo.username,
            password: userInfo.password,
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
        console.log("attempting to delete user " + userInfo._id)
        User.findByIdAndRemove({_id: userInfo._id}, function(err, doc){
            if(err){
                console.log(err);
            }
        });
    }

    
}