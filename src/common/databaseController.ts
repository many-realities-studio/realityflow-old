// DB API
import {UserOperations} from "../commands/user";
import {ClientOperations} from "../commands/client";
import {ProjectOperations} from "../commands/project";
//import {SceneOperations} from "../commands/scene";
import {ObjectOperations} from "../commands/object";
import e = require("express");

// note to self - fix things so that they have type declarations
// another note - add error handling
export class databaseController{ 
    
    public static async createObject(json: any ){
            var object = await ObjectOperations.createObject(json.obj);
            var project = await ProjectOperations.findProject(json.project);


            project.objs.push(object._id);
            await project.save();

            json.project = project;
            json.obj._id = object._id;
                
        return json;
    }

    public static async updateObject(json: any){
        await ObjectOperations.updateObject(json.obj);
    }

    public static async deleteObject(json: any){
        var project = await ProjectOperations.findProject(json.project);
        project.objs.splice(project.objs.indexOf(json.obj._id),1);
        await project.save();
        await ObjectOperations.deleteObject(json.obj);
    }

    //the return for this seems unnecessary but we're going to go with it for now.
    public static async createProject(json: any){
            var project = await ProjectOperations.createProject(json.project, json.client, json.user);
            project.clients.push(json.client._id);
            await project.save();

            json.project = project;

            var payloadString = JSON.stringify(json);
            return payloadString;
    }

    public static async fetchObjects(json: any){
        // console.log(json.project)
        var project = await ProjectOperations.findProject(json.project);
        console.log("hello hello hello \n\n" +project)
        
        
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

    public static async deleteProject(project: any){
        await ProjectOperations.deleteProject(project)
        return;
    }

    public static async logoutUser(json: any){
        var user = await UserOperations.findUser(json.user);

        var clientArray = user.clients;

        var filteredArray = clientArray.filter(function(value, index, array){

            return value!=json.client._id

        });

        user.clients = filteredArray;

        ClientOperations.deleteClient(json.client._id);
        
        return;
    }

    // authenticate user and then return projects
    // and add a client
    public static async loginUser(json: any){
        
        json.returnedUser = await UserOperations.loginUser(json.user);
        
        if (json.returnedUser == undefined)
            {return null;}

        json.user._id = json.returnedUser._id;
        
        json.projects = await ProjectOperations.fetchProjects(json.returnedUser);
        var newClientId = await ClientOperations.createClient(json.client, json.returnedUser._id);
        
        json.client._id = newClientId.id;
        
        json.currentUser = await UserOperations.findUser(json.returnedUser);
        
        return json;
    }

    public static async createUser(json: any){
        var newUserPayload = await UserOperations.createUser(json.user);
        var newClientId = await ClientOperations.createClient(json.client, newUserPayload._id);

        newUserPayload.clients.push(newClientId);
        newUserPayload.save();

        json.user._id = newUserPayload._id;
        json.client._id = newClientId;
        
        return json;
    }

    public static async deleteUser(json: any){
        var User = UserOperations.findUser(json.user);
        var clientArray = User.clients;

        for(var arr in clientArray){

            ClientOperations.deleteClient(arr);

        }

        UserOperations.deleteUser(json.user);
    }
}