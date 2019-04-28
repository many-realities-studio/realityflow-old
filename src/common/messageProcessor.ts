import { ServerEventDispatcher } from "../server";
import { Commands } from "./commands";

const bcrypt = require('bcrypt');
const saltRounds = 10;

// DB API
import {UserOperations} from "../commands/user";
import {ClientOperations} from "../commands/client";
import {ProjectOperations} from "../commands/project";
//import {SceneOperations} from "../commands/scene";
import {ObjectOperations} from "../commands/object";

export class MessageProcessor{

public static async serverMessageProcessor(json: any, connection: any){

   var command: Number = json.command;

   if(command>=Commands.object.CREATE&&command<=Commands.object.DELETE){

        switch(command){

            // Creates object, adds object ID to project object array, and
            // sends out payload with updated project and object info
            case Commands.object.CREATE:{

                var object = await ObjectOperations.createObject(json.obj);
                var project = await ProjectOperations.findProject(json.project);

                //var sceneId = project.currentScene;
                //var scene = SceneOperations.findScene(sceneId);

                //scene.objects.push(object._id);

                //ServerEventDispatcher.send(payloadString, connection);

                project.objs.push(object._id);
                await project.save();

                json.project = project;
                json.obj._id = object._id;

                ServerEventDispatcher.broadcast(json, true);

                break;
            }

            //Updates the object info in the DB and broadcasts the
            //change to all other involved clients
            case Commands.object.UPDATE:{

                ServerEventDispatcher.broadcast(json, false);
               await ObjectOperations.updateObject(json.obj);

                break;
            }

            //Deletes the object from DB and broadcasts delete to
            //all involved clients
            case Commands.object.DELETE:{

                ServerEventDispatcher.broadcast(json, true);
                var project = await ProjectOperations.findProject(json.project);
                project.objs.splice(project.objs.indexOf(json.obj._id),1);
                await project.save();
                await ObjectOperations.deleteObject(json.obj);

                break;
            }

        }

   }
   else if(command>=Commands.project.CREATE&&command<=Commands.project.DELETE){

        switch(command){

            //Creates project in DB and sends project ID back to creator
            case Commands.project.CREATE:{

                var project = await ProjectOperations.createProject(json.project, json.client, json.user);
                project.clients.push(json.client._id);
                await project.save();

                json.project = project;

                var payloadString = JSON.stringify(json);
                ServerEventDispatcher.send(payloadString, connection);

                break;
            }

            case Commands.project.UPDATE:{


                break;
            }

            case Commands.project.FETCH:{


                break;
            }

            //Fetches project from DB, adds current client ID to
            //project client IDs list, fetches all objects in the
            //project, and broadcasts the complete payload to the requestor
            case Commands.project.OPEN:{

                var project = await ProjectOperations.findProject(json.project);

                var projectClientsArray = String(project.clients);
                var existsFlag = false;

                for(var i=0; i<projectClientsArray.length; i++){

                    if(projectClientsArray[i]==json.client._id){

                        existsFlag=true;

                    }
                    
                }

                if(!existsFlag){

                    project.clients.push(json.client._id);
                    await project.save();

                }

                //promise = await ProjectOperations.saveProject(project);

                //var scene = SceneOperations.findScene(project.currentScene);
                var objectIds = project.objs;
                var objects = [];

                if(objectIds.length>0){
                    for(var i=0; i<objectIds.length; i++){

                        var currentObject = await ObjectOperations.findObject(objectIds[i]);

                        objects.push(currentObject);

                   }

                }

                json.objs = objects;
                var payloadString = JSON.stringify(json);
                ServerEventDispatcher.send(payloadString, connection);

                break;
            }

            case Commands.project.DELETE:{


                break;
            }

        }

   }
   else if(command>=Commands.scene.CREATE&&command<=Commands.scene.DELETE){

        switch(command){

            case Commands.scene.CREATE:{


                break;
            }

            case Commands.scene.UPDATE:{


                break;
            }

            case Commands.scene.DELETE:{


                break;
            }

        }

   }

   else if(command>=Commands.user.CREATE&&command<=Commands.user.DELETE){

        switch(command){

            //Creates new user in DB, creates new client in DB, adds
            //client ID and connection to server connection array, and
            //sends the new user ID and client ID back to the creator
            case Commands.user.CREATE: {

                var newUserPayload = await UserOperations.createUser(json.user);
                var newClientId = await ClientOperations.createClient(json.client, newUserPayload._id);
                newClientId = newClientId._id;

                var connectionTracker = {

                    clientId:   newClientId,
                    connection: connection

               };

               ServerEventDispatcher.connections.push(connectionTracker);

                newUserPayload.clients.push(newClientId);
                newUserPayload.save();

                json.user._id = newUserPayload._id;
                json.client._id = newClientId;

                var payloadString = JSON.stringify(json);

                ServerEventDispatcher.send(payloadString, connection);

                break;
            }


            //Searches for user, verifies user login info is correct,
            //creates new client ID, adds client ID and connection to server
            //connection array, fetches any projects that the user owns, and
            //returns the client ID and project ID(s) to the logged in user
            case Commands.user.LOGIN: {

                var returnedUser = await UserOperations.loginUser(json.user);
                
                if(returnedUser!=undefined){

                if(bcrypt.compareSync(json.user.password, returnedUser.password)){
                   
                    json.user._id = returnedUser._id;
                   var projects = await ProjectOperations.fetchProjects(returnedUser);
                   var newClientId = await ClientOperations.createClient(json.client, returnedUser._id);
                   newClientId = newClientId._id;
                   json.client._id = newClientId;
                   var currentUser = await UserOperations.findUser(returnedUser);

                   var connectionTracker = {

                        clientId:   newClientId,
                        connection: connection

                   };

                   ServerEventDispatcher.connections.push(connectionTracker);

                   for(var x in ServerEventDispatcher.connections){

                   }

                   currentUser.clients.push(newClientId);
                   currentUser.save();
                   
                   json.projects = projects;
                   
                   var payloadString = JSON.stringify(json);

                   ServerEventDispatcher.send(payloadString, connection);

                }

                else{

                    var payloadString = JSON.stringify(json);

                    ServerEventDispatcher.send(payloadString, connection);

                }

            }
            else{

                var payloadString = JSON.stringify(json);

                ServerEventDispatcher.send(payloadString, connection);

            }

                break;
            }

            //Removes client ID from user in DB, deletes
            //client ID and connection from server connection array
            case Commands.user.LOGOUT: {

                var user = await UserOperations.findUser(json.user);

                var clientArray = user.clients;

                var filteredArray = clientArray.filter(function(value, index, array){

                    return value!=json.client._id

                });

                user.clients = filteredArray;

                ClientOperations.deleteClient(json.client._id);

                var payloadString = JSON.stringify(json);

                //ServerEventDispatcher.send(payloadString, connection);

                var connectionIndex = ServerEventDispatcher.connections.findIndex(x => x.clientId === json.client._id);
                delete ServerEventDispatcher.connections[connectionIndex];

                break;
            }

            case Commands.user.FIND: {

                

                break;
            }

            //Delets user from DB
            case Commands.user.DELETE: {

                var User = UserOperations.findUser(json.user);
                var clientArray = User.clients;

                for(var arr in clientArray){

                    ClientOperations.deleteClient(arr);

                }

                UserOperations.deleteUser(json.user);

                var payloadString = JSON.stringify(json);

                break;
            }

        }

   }
   else{


   }

}

}