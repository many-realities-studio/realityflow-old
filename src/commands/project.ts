var bcrypt = require("bcrypt");
var mongoose = require("mongoose");

import {IUserModel, User} from "../models/user";
import {Project, IProjectModel} from "../models/project";
import { UserOperations } from "./user";

export class ProjectOperations
{

    public static createProject(projectInfo: any, clientInfo: any, userInfo: any){

        var newProjectId;

        var newProject = new Project({

            projectName: projectInfo.projectName,
            owner: userInfo._id,
            clients: [],
            currentScene: undefined,
            prevScene: undefined,
            nextScene: undefined,
            bookmarks: [],
            created: projectInfo.created,
            lastEdit: projectInfo.lastEdit,
            lastEditor: projectInfo.lastEditor

        });

        newProject.clients.push(clientInfo._id);

        newProject.save(function(err, doc){

            if(err){

                console.log('ERROR: Failed to create project: '+ projectInfo.projectName);

            }
            else{

                console.log('Project '+projectInfo.projectName+' added successfully.');
                newProject = doc;

            }

        });

        userInfo.projects.push(newProjectId);
        UserOperations.updateUser(userInfo);

        return newProject;

    }

    public static fetchProjects(userInfo: any){

        var projects = [];

        Project.find({owner: userInfo._id}, {lean: true}, function(err, docs){

            if(!err){

                projects = docs;

            }

        });

        return projects;
    }

    public static findProject(projectInfo: any){

        var project;

        Project.findById(projectInfo._id, {lean: true}, function(err, doc){

            if(!err){

                project = doc;

            }

        });

        return project;

    }

    public static deleteProject(projectInfo: any){

        Project.findByIdAndRemove(projectInfo._id);

    }
}