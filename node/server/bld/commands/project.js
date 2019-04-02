"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require("bcrypt");
var mongoose = require("mongoose");
const project_1 = require("../models/project");
const user_1 = require("./user");
class ProjectOperations {
    static createProject(projectInfo, clientInfo, userInfo) {
        var newProjectId;
        var newProject = new project_1.Project({
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
        newProject.save(function (err, doc) {
            if (err) {
                console.log('ERROR: Failed to create project: ' + projectInfo.projectName);
            }
            else {
                console.log('Project ' + projectInfo.projectName + ' added successfully.');
                newProject = doc;
            }
        });
        userInfo.projects.push(newProjectId);
        user_1.UserOperations.updateUser(userInfo);
        return newProject;
    }
    static fetchProjects(userInfo) {
        var projects = [];
        project_1.Project.find({ owner: userInfo._id }, { lean: true }, function (err, docs) {
            if (!err) {
                projects = docs;
            }
        });
        return projects;
    }
    static findProject(projectInfo) {
        var project;
        project_1.Project.findById(projectInfo._id, { lean: true }, function (err, doc) {
            if (!err) {
                project = doc;
            }
        });
        return project;
    }
    static deleteProject(projectInfo) {
        project_1.Project.findByIdAndRemove(projectInfo._id);
    }
}
exports.ProjectOperations = ProjectOperations;
