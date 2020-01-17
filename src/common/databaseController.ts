// DB API
import {UserOperations} from "../commands/user";
import {ClientOperations} from "../commands/client";
import {ProjectOperations} from "../commands/project";
import {FlowClient} from "../flow_classes/FlowClient";
import {FlowUser} from "../flow_classes/FlowUser";
import {FlowProject} from "../flow_classes/FlowProject";
import {FlowObject} from "../flow_classes/FlowObject";
import {ObjectOperations} from "../commands/object";
import e = require("express");

// note to self - fix things so that they have type declarations
// another note - add error handling
export class databaseController{ 
    
    public static async createObject(inputObj: FlowObject, inputProject: FlowProject){

            var object = await ObjectOperations.createObject(inputObj);
            var project = await ProjectOperations.findProject(inputProject);

            project.objs.push(object._id);
            await project.save();

        return {project, object};
    }

    public static async updateObject(inputObj: FlowObject){
        await ObjectOperations.updateObject(inputObj);
    }

    // weird type shit to beware of here. As far as I can tell it's realistically all just strings,
    // but there's some weird type specification on the mongo side that is definitely not coming from the client
    // so for now I'm going to say that obj._id is of any type. Yay type coercion!
    public static async deleteObject(inputProject:FlowProject, inputObj:FlowObject){
        var project = await ProjectOperations.findProject(project);
        
        project.objs.splice(project.objs.indexOf(inputObj._id),1);
        await project.save();
        await ObjectOperations.deleteObject(inputObj);
    }

    
    public static async createProject(inProj: FlowProject, inUser: FlowUser, inClient: FlowClient){
            var project = await ProjectOperations.createProject(inProj, inClient, inUser);
            project.clients.push(inClient._id);
            await project.save();

            return project
    }

    public static async fetchObjects(json: any){
        var project = await ProjectOperations.findProject(json.project);
        
        var objectIds = project.objs;
        var objects = [];

        if(objectIds.length>0){
            for(var i=0; i<objectIds.length; i++){

                var currentObject = await ObjectOperations.findObject(objectIds[i]);

                objects.push(currentObject);

            }

        }
        return objects;
    }

    public static async deleteProject(project: FlowProject){
        await ProjectOperations.deleteProject(project)
        return;
    }

    public static async logoutUser(inUser: FlowUser, inClient: FlowClient){
        var user = await UserOperations.findUser(inUser);

        var clientArray = user.clients;

        var filteredArray = clientArray.filter(function(value: any, index: any, array: any){

            return value!=inClient._id;

        });

        user.clients = filteredArray;

        ClientOperations.deleteClient(inClient._id);
        
        return;
    }

    // authenticate user and then return projects
    // and add a client
    public static async loginUser(inUser: FlowUser, inClient: FlowClient){
        
        let returnedUser = await UserOperations.loginUser(inUser);
        
        if (returnedUser == undefined)
            {return null;}

        let newUserId = returnedUser._id;
        
        let projects = await ProjectOperations.fetchProjects(returnedUser);
        var newClient = await ClientOperations.createClient(inClient, returnedUser._id);
        
        let newClientId = newClient._id;

        let currentUser = await UserOperations.findUser(returnedUser);
        currentUser.clients.push(newClientId);
        currentUser.save();
        
        return {projects, newClientId, newUserId};
    }

    public static async createUser(inClient: FlowClient, inUser: FlowUser){
        var newUserPayload = await UserOperations.createUser(inUser);
        var newClientId = await ClientOperations.createClient(inClient, newUserPayload._id);

        newUserPayload.clients.push(newClientId);
        newUserPayload.save();

        let newUserId = newUserPayload._id;
        
        return { newUserId , newClientId};
    }

    public static async deleteUser(inUser: FlowUser){
        
        var User = await UserOperations.findUser(inUser);
        var clientArray = User.clients;

        for(var arr in clientArray){

            await ClientOperations.deleteClient(arr);

        }

        await UserOperations.deleteUser(inUser);
    }
}