import * as mongoose from "mongoose";
import {Project, IProjectModel} from "../models/project";

var objectId = mongoose.Types.ObjectId();

export class ProjectOperations
{

    public static createProject(projectInfo: any, clientInfo: any, userInfo: any){

        console.log('Entering Create Project...');

        var newProjectDoc;

        var newProject = new Project({

            projectName: projectInfo.projectName,
            owner: userInfo._id,
            clients: [clientInfo._id],
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


            console.log('Project '+projectInfo.projectName+' added successfully.');
            newProjectDoc = doc;

            newProjectDoc.clients.push(clientInfo._id);

            return newProjectDoc;
        });

        return promise;

    }

    public static fetchProjects(userInfo: any){

        var projects = [];

        var promise = Project.find({owner: userInfo._id}).exec();
        
        promise.then(function(docs){

                projects = docs;

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