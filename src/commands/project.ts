import * as mongoose from "mongoose";
import { Project } from "../models/project";
import { User } from "../models/user"
import { FlowProject } from "../FastAccessStateTracker/FlowLibrary/FlowProject";

var objectId = mongoose.Types.ObjectId();

export class ProjectOperations
{

    public static async createProject(projectInfo: any){

        var newProject = new Project({

            Id : projectInfo.Id,
            Description : projectInfo.Description,
            DateModified : projectInfo.DateModified,
            ProjectName : projectInfo.ProjectName,

        });

        return await newProject.save();
    }

    public static async saveProject(project: any){

        var promise = await project.save();

        return promise;

    }

    // TODO: test this

    //Fetch all of the projects for a given user
    public static async fetchProjects(Username: String) : Promise<Array<FlowProject>>{
        // get a user
        var user = await User.findOne({Username: Username})
        
        //get user's projects as FlowProjects
        var projectsRaw = user.Projects
        let projects: Array<FlowProject> = []

        projectsRaw.forEach(async (element : mongoose.Types.ObjectId)  => {
            projects.push(new FlowProject(await Project.findById(element)))
        });

        return projects;
    }

    public static async findProject(projectId: String){

        var project = await Project.findOne({Id: projectId}).exec();

        return project;

    }

    public static async deleteProject(projectId: String){
        console.log("deleting project " + projectId)

        await Project.findOneAndRemove({Id: projectId}, function(err, doc){
            if(err)
                console.log(err)
        });

    }
}