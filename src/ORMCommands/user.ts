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

        await getConnection(process.env.NODE_ENV).manager.save(newUser);
    }

    /**
     * Find a user given a username
     * @param Username 
     */
    public static async findUser(Username: string){
        const foundUser = await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.Username = :username", {username:Username})
            .getOne()

        return foundUser;
    }

    /**
     * Delete a user. This will also delete any project that a user owns,
     * as well as every object involved in any of those projects
     * @param Username 
     */
    public static async deleteUser(Username: string){
        console.log("attempting to delete user " + Username)

        await getConnection(process.env.NODE_ENV)
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
        let passwordObject: any = await getConnection(process.env.NODE_ENV).
            createQueryBuilder().
            select("User.Password").
            from(User, "User").
            where("Username = :username", {username: Username}).
            execute()

        if(!passwordObject[0])
            return false;
            
        return await bcrypt.compare(Password, passwordObject[0].User_Password);
    }
    
}