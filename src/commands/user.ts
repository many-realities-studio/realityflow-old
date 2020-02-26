import * as mongoose from "mongoose";
import { User, IUserModel } from "../models/user";

var objectId = mongoose.Types.ObjectId();


export class UserOperations {

    public static async createUser(userInfo: any){

        

        var newUser = new User({
            Username: userInfo.Username,
            Password: userInfo.Password,
            Clients: undefined,
            Projects: undefined,

        });
        

        await newUser.save();

        return newUser;
    }

    // Why are we lookin at users by their internal IDs?
    public static async findUser(userInfo: any){

        var returnedUser = null;

        const foundUser = await User.findOne({ Username: userInfo.Username})

        return foundUser;
    }

    // This just... returns the user based on their Username??
    public static async loginUser(userInfo: any){

        var foundUser = await User.findOne({Username: userInfo.Username}).exec(function(err){
            if (err)
                console.error(err);
        });

        

        return foundUser;
    }


    public static async updateUser(userInfo: any){

        await User.findOneAndUpdate({Username: userInfo.Username}, {
            
            Username: userInfo.Username,
            Password: userInfo.Password,
            Clients: undefined,
            Projects: undefined,

        }).exec(function(err){

            if(err){

                console.error(err);

            }
            else{

                console.log('User ' + userInfo.Username + ' updated successfully.');

            }

        });
    }

    public static async deleteUser(userInfo: any){
        console.log("attempting to delete user " + userInfo.Username)
        await User.findByIdAndRemove({Username: userInfo.Username}).exec(function(err, doc){
            if(err){
                console.error(err);
            }
        });
    }

    public static async authenticateUser(Username: String, Password: String){
        let user = await User.findOne({Username: Username}, function(err, user){
            user.schema.methods.comparePassword.call(user, Password, function(err: any, isMatch: boolean) {
                if (err) throw err;
                return isMatch
            });
        })

        return user
        
    }
    
}