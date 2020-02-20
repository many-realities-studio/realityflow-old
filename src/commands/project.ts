import * as mongoose from "mongoose";
import {Project, IProjectModel} from "../models/project";

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

    public static saveProject(project: any){

        var promise = project.save();

        promise.then(function(doc){

            return doc;

        });

        return promise;

    }

    //Project fetch for when a user logs in
    public static async fetchProjects(userInfo: any){
        
        var projects = await Project.find({owner: userInfo._id}, '_id projectName').exec();

        return projects;
    }

    public static async findProject(projectInfo: any){

        var project = await Project.findById(projectInfo._id).exec();

        return project;

    }

    public static async deleteProject(projectInfo: any){
        console.log("deleting project " + projectInfo._id)
        await Project.findByIdAndRemove({_id: projectInfo._id}, function(err, doc){
            if(err)
                console.log(err)
        });

    }
}