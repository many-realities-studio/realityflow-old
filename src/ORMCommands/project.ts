import {getConnection} from 'typeorm'

import { Project } from "../ORMModels/project";
import { User } from "../ORMModels/user"
import { DBObject } from "../ORMModels/object"

import { FlowProject } from "../FastAccessStateTracker/FlowLibrary/FlowProject";


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

        return await newProject.save();
    }

    public static async saveProject(project: Project){

        var promise = await project.save();

        return promise;

    }

    // TODO: test this

    //Fetch all of the projects for a given user
    public static async fetchProjects(usernameToFetch: string) : Promise<Array<string>>{
        
        // get a user
        let projects = await getConnection().createQueryBuilder().
            relation(User, "projects").
            of({Username: usernameToFetch}).
            loadMany()

        return projects;
    }

    public static async findProject(projectId: string){

        var project = await Project.findOne({Id: projectId});

        return project;

    }

    public static async deleteProject(projectId: string){
        console.log("deleting project " + projectId)

        await Project.delete({Id: projectId})

    }

    // written this way for laziness' sake
    public static async deleteObject(projectId: string, objectId: string){
        let project = await this.findProject(projectId) 
        await DBObject.delete({Id: objectId, Project: project})
    }
}