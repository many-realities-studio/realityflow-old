import { User } from "../entity/user";
import { Project } from "../entity/project";

import { getConnection } from "typeorm";
  
import * as bcrypt from 'bcrypt';
const SALT_WORK_FACTOR = 10;



export class UserOperations {

    /**
     * Create a username given a username and password. Password is automatically hashed by the database. 
     * @param username 
     * @param password 
     */
    public static async createUser(username: string, password: string){

        var newUser = new User();

        newUser.Username = username,
        newUser.Password = password,

        await getConnection().manager.save(newUser);
    }

    /**
     * Find a user given a username
     * @param Username 
     */
    public static async findUser(Username: string){
        const foundUser = await getConnection()
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.Username = :username", {username:Username})
            .getOne()

        return foundUser;
    }

    /**
     * Update a user given a username and new info 
     * @param userName
     * @param userInfo 
     */
    public static async updateUser(userName:string, userInfo: any){

        await getConnection()
            .createQueryBuilder()
            .update(User)
            .set({
                Username: userInfo.Username,
                Password: userInfo.Password
            })
            .where("Username = :oldUsername", {oldUsername: userName})
    }

    /**
     * Delete a user. This will also delete any project that a user owns,
     * as well as every object involved in any of those projects
     * @param Username 
     */
    public static async deleteUser(Username: string){
        console.log("attempting to delete user " + Username)

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(User)
            .where("Username = :username", { username: Username })
            .execute();
    }

    /**
     * Authenticate a user given a Username and Password
     * @param Username 
     * @param Password 
     */
    public static async authenticateUser(Username: String, Password: String): Promise<Boolean>{
        let passwordObject: any = await getConnection().
            createQueryBuilder().
            select("User.Password").
            from(User, "User").
            where("Username = :username", {username: Username}).
            execute()
            
        return await bcrypt.compare(Password, passwordObject.Password)        
    }
    
}