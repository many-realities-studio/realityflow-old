import * as mongoose from "mongoose";
import { Project } from "../models/project";
import { User } from "../models/user"
import { Object, IObjectModel } from "../models/object"
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
    public static async fetchProjects(Username: string) : Promise<Array<string>>{
        // get a user
        var user = await User.findOne({Username: Username}, {})
        
        //get user's projects as FlowProjects
        var projectsRaw = user.Projects
        let projects : Array<string> = [];

        projectsRaw.forEach(async (element, index, arr)  => {
            projects.push( (await Project.findById(element)).Id )
        });

        return projects;
    }

    public static async findProject(projectId: string){

        var project = await Project.findOne({Id: projectId}).exec();

        return project;

    }

    public static async deleteProject(projectId: string){
        console.log("deleting project " + projectId)

        await Project.findOneAndRemove({Id: projectId}, function(err, doc){
            if(err)
                console.log(err)
        }).exec();

    }

    public static async deleteObject(projectId: string, objectId: string){
        let obj : IObjectModel = await Object.findOne({Id: objectId}).exec()

        await Project.updateOne({Id: projectId},
            { $pull: { ObjectList : obj._id } })
        
        Object.deleteOne({Id: objectId}).exec()
    }
}