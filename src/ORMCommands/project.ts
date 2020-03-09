import {getConnection} from 'typeorm'

import { Project } from "../entity/project";
import { User } from "../entity/user"
import { DBObject } from "../entity/object"
import { FlowProject } from '../FastAccessStateTracker/FlowLibrary/FlowProject';

export class ProjectOperations
{
    /**
     * Given a project and a user, create a project and give the user ownership
     * @param projectInfo Data for the new project
     * @param Username Username of the owner of the project
     */
    public static async createProject(projectInfo: any, Username: string){
        let user = await getConnection(process.env.NODE_ENV).createQueryBuilder().
            select("User").
            from(User, "User").
            where("User.Username = :username", {username: Username}).getOne()

        var newProject = new Project();

        newProject.Id = projectInfo.Id,
        newProject.Description = projectInfo.Description,
        newProject.DateModified = projectInfo.DateModified,
        newProject.ProjectName = projectInfo.ProjectName,
        newProject.Owner = user

        await getConnection(process.env.NODE_ENV).manager.save(newProject);
        return newProject.Id;
    }

    /**
     * Fetch all of the projects for a given user
     * @param usernameToFetch Username whose projects we want to fetch
     */
    public static async fetchProjects(usernameToFetch: string) : Promise<Array<Project>>{
        
        // TODO: Make sure this works
        let projects = await getConnection(process.env.NODE_ENV).createQueryBuilder()
            .select("project")
            .from(Project, "project")
            .where("project.ownerUsername = :username", {username: usernameToFetch})
            .getMany()

        // console.log(projects)

        return projects;
    }

    /**
     * Find a specfic project as a flowproject given its ID
     * @param projectId
     */
    public static async findProject(projectId: string){
        let project = await getConnection(process.env.NODE_ENV).createQueryBuilder().
            select("project").
            from(Project, "project").
            where("Id = :id", {id: projectId})
            .getOne();

        return project;

    }

    /**
     * Delete a project given its ID.
     * This will also auto-delete the objects associated with the project
     * @param projectId projectId to delete
     */
    public static async deleteProject(projectId: string){
        await getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .delete()
                .from(Project)
                .where("Id = :id", { id: projectId })
                .execute();

    }
}