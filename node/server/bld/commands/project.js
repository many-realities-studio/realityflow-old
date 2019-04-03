"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const project_1 = require("../models/project");
var objectId = mongoose.Types.ObjectId();
class ProjectOperations {
    static createProject(projectInfo, clientInfo, userInfo) {
        console.log('Entering Create Project...');
        var newProjectDoc;
        var newProject = new project_1.Project({
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
        promise.then(function (doc) {
            console.log('Project ' + projectInfo.projectName + ' added successfully.');
            newProjectDoc = doc;
            return newProjectDoc;
        });
        return promise;
    }
    static saveProject(project) {
        var promise = project.save();
        promise.then(function (doc) {
            return doc;
        });
        return promise;
    }
    static fetchProjects(userInfo) {
        console.log('Entering Fetch Projects:');
        console.log('User Id: ' + userInfo._id);
        var projects = [];
        var promise = project_1.Project.find({ owner: userInfo._id }, '_id projectName').exec();
        promise.then(function (docs) {
            projects.push(docs);
            console.log('Projects: ' + projects);
            return projects;
        });
        return promise;
    }
    static findProject(projectInfo) {
        console.log('Entering findProject...');
        var project;
        console.log('Project ID: ' + projectInfo._id);
        var promise = project_1.Project.findById(projectInfo._id).exec();
        promise.then(function (doc) {
            console.log('DOC: ' + doc);
            project = doc;
            return project;
        });
        console.log('Promise: ' + promise);
        return promise;
    }
    static deleteProject(projectInfo) {
        project_1.Project.findByIdAndRemove(projectInfo._id);
    }
}
exports.ProjectOperations = ProjectOperations;
