import {getConnection} from 'typeorm'

import { Project } from "../entity/project";
import { User } from "../entity/user"
import { DBObject } from "../entity/object"
import { getCiphers } from 'crypto';

export class ProjectOperations
{

    public static async createProject(projectInfo: any, Username: string){
        let user = await getConnection().createQueryBuilder().
            select("User").
            from(User, "User").
            where("User.Username = :username", {username: Username}).getOne()

        var newProject = new Project();

        newProject.Id = projectInfo.Id,
        newProject.Description = projectInfo.Description,
        newProject.DateModified = projectInfo.DateModified,
        newProject.ProjectName = projectInfo.ProjectName,
        newProject.Owner = user

        return await getConnection().manager.save(newProject);
    }

    //Fetch all of the projects for a given user
    public static async fetchProjects(usernameToFetch: string) : Promise<Array<Project>>{
        
        // TODO: Make sure this works
        let projects = await getConnection().createQueryBuilder()
            .select("project")
            .from(Project, "project")
            .where("project.ownerUsername = :username", {username: usernameToFetch})
            .getMany()

        return projects;
    }

    // this hasn't been tested but it's in the entity.test.ts file
    public static async findProject(projectId: string){

        let project = await getConnection().createQueryBuilder().
            select("project").
            from(Project, "project").
            where("Id = :id", {id: projectId}).
            getOne();

        return project;

    }

    public static async deleteProject(projectId: string){
        await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Project)
                .where("Id = :id", { id: projectId })
                .execute();

    }
}