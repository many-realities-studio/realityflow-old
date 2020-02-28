import * as mongoose from "mongoose";
import { User, IUserModel } from "../models/user";
import { Project } from "../models/project";

var objectId = mongoose.Types.ObjectId();


export class UserOperations {

    public static async createUser(username: string, password: string){

        var newUser = new User({
            Username: username,
            Password: password,
            Projects: [],

        });
        

        await newUser.save();

        return newUser;
    }

    // Why are we lookin at users by their internal IDs?
    public static async findUser(Username: string){

        var returnedUser = null;

        const foundUser = await User.findOne({ Username: Username})

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
        }).exec(function(err){
            if(err){
                console.error(err);
            }
            else{
                console.log('User ' + userInfo.Username + ' updated successfully.');
            }

        });
    }

    public static async addProjectToUser(Username: string, projectId: string){
        let project = await Project.findOne({Id: projectId})
        
        await User.findOneAndUpdate({Username: Username}, {$push: {Projects: project._id}}).exec()
    }

    public static async deleteUser(Username: string){
        console.log("attempting to delete user " + Username)
        await User.findByIdAndRemove({Username: Username}).exec(function(err, doc){
            if(err){
                console.error(err);
            }
        });
    }

    public static async authenticateUser(Username: String, Password: String): Promise<Boolean>{
        let user = await User.findOne({Username: Username})
        let retval: Boolean = false;

        user.schema.methods.comparePassword.call(user, Password, function(error: any, match: any) {
            retval = match
        })

        return retval
        
    }
    
}