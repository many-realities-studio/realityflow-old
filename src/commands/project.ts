import * as mongoose from "mongoose";
import {Project, IProjectModel} from "../models/project";

var objectId = mongoose.Types.ObjectId();

export class ProjectOperations
{

    public static createProject(projectInfo: any, clientInfo: any, userInfo: any){

        var newProjectDoc;

        var newProject = new Project({

            projectName: projectInfo.projectName,
            owner: userInfo._id,
            clients: [clientInfo._id],
            objs: undefined,
            currentScene: undefined,
            prevScene: undefined,
            nextScene: undefined,
            bookmarks: undefined,
            created: projectInfo.created,
            lastEdit: projectInfo.lastEdit,
            lastEditor: projectInfo.lastEditor

        });

        var promise = newProject.save();

        promise.then(function(doc){
            newProjectDoc = doc;

            return newProjectDoc;
        });

        return promise;

    }

    public static saveProject(project: any){

        var promise = project.save();

        promise.then(function(doc){

            return doc;

        });

        return promise;

    }

    //Project fetch for when a user logs in
    public static fetchProjects(userInfo: any){

        var projects = [];

        var promise = Project.find({owner: userInfo._id}, '_id projectName').exec();
        
        promise.then(function(docs){

                projects.push(docs);

            return projects;

        });

        return promise;
    }

    public static findProject(projectInfo: any){

        var project;
        var promise = Project.findById(projectInfo._id).exec();


        promise.then(function(doc){

                project = doc;
                return project;

        });
        
        return promise;

    }

    public static deleteProject(projectInfo: any){

        Project.findByIdAndRemove(projectInfo._id);

    }
}