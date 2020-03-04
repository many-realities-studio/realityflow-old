import { User } from "../entity/user";
import { Project } from "../entity/project";

import { getConnection } from "typeorm";
  
import * as bcrypt from 'bcrypt';
const SALT_WORK_FACTOR = 10;



export class UserOperations {

    public static async createUser(username: string, password: string){

        var newUser = new User();

        newUser.Username = username,
        newUser.Password = password,

        await getConnection().manager.save(newUser);

        return newUser;
    }

    public static async findUser(Username: string){
        const foundUser = await User.findOne({ Username: Username})

        return foundUser;
    }


    public static async updateUser(userInfo: any){

        await getConnection().createQueryBuilder().update(User).set({
            Username: userInfo.Username,
        }
        ).where("Username = :oldUsername", {oldUsername: userInfo.Username})
    }

    public static async addProjectToUser(Username: string, projectId: string){
        let project = await Project.findOne({Id: projectId})
        let user = await User.findOne({Username: Username})
        
        await getConnection().createQueryBuilder()
            .relation(User, "Projects")
            .of(user)
            .add(project)
    }

    public static async deleteUser(Username: string){
        console.log("attempting to delete user " + Username)
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(User)
            .where("Username = :username", { username: Username })
            .execute();
    }

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