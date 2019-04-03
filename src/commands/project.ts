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
            clients: [],
            objs: [],
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

    public static fetchProjects(userInfo: any){

        console.log('Entering Fetch Projects:');
        console.log('User Id: '+userInfo._id);
        var projects = [];

        var promise = Project.find({owner: userInfo._id}, '_id projectName').exec();
        
        promise.then(function(docs){

                projects.push(docs);

            console.log('Projects: '+projects);
            return projects;

        });

        return promise;
    }

    public static findProject(projectInfo: any){

        console.log('Entering findProject...');
        var project;

        console.log('Project ID: '+projectInfo._id);
        var promise = Project.findById(projectInfo._id).exec();


        promise.then(function(doc){

                console.log('DOC: '+doc);
                project = doc;
                return project;

        });
        
        console.log('Promise: '+promise);
        return promise;

    }

    public static deleteProject(projectInfo: any){

        Project.findByIdAndRemove(projectInfo._id);

    }
}