import { ServerEventDispatcher } from "../server";
import { Commands } from "./commands";
import {databaseController} from "./databaseController"

// DB API
import {ProjectOperations} from "../commands/project";
import {FlowClient, FlowObject, FlowProject, FlowUser} from "./FlowClasses";

export class MessageProcessor{

public static async serverMessageProcessor(json: any, connection: any){

    var command: number = json.command;
    
    var request = command / 1000;
    var action = command % 100;

    if(request == Commands.request.object){

        switch(action){

            // Creates object, adds object ID to project object array, and
            // sends out payload with updated project and object info
            case Commands.action.CREATE:{

                var obj = new FlowObject(json.obj);
                var proj = new FlowProject(json.project)
                
                var ret = await databaseController.createObject(obj, proj)

                json.project = ret.project;
                json.obj._id = ret.object._id

                ServerEventDispatcher.broadcast(ret, true);
                
            }

            //Broadcasts the change to all other involved clients
            case Commands.action.UPDATE:{
                ServerEventDispatcher.broadcast(json, false);
                break;
            }
            

            //Deletes the object from DB and broadcasts delete to
            //all involved clients
            case Commands.action.DELETE:{

                ServerEventDispatcher.broadcast(json, true);
                await databaseController.deleteObject(new FlowProject(json.project), new FlowObject(json.obj) )

                break;
            }

        }

   }
   else if(request == Commands.request.project){

        switch(action){

            // Creates project in DB and sends project ID back to creator
            // as of 
            case Commands.action.CREATE:{

                let inProj = new FlowProject(json.project);
                let inClient = new FlowClient(json.client);
                let inUser = new FlowUser(json.user);

                var newProject = await databaseController.createProject(inProj, inUser, inClient);
                
                json.project = newProject;
                ServerEventDispatcher.send(json, connection);

                break;
            }

            case Commands.action.UPDATE:{
                // there's nothing in here????

                break;
            }

            // TODO : This just adds anyone who asks for a project onto the list of 
            // project owners. This is not what we want!

            // Fetches project from DB, adds current client ID to
            // project client IDs list, fetches all objects in the
            // project, and broadcasts the complete payload to the requestor
            case Commands.action.FETCH:{
            
                //I think that this client stuff isn't that necessary?
                var project = await ProjectOperations.findProject(json.project);

                var projectClientsArray = String(project.clients);
                var clientInProject = false;

                // fix
                for(var i=0; i<projectClientsArray.length; i++){

                    if(projectClientsArray[i]==json.client._id){

                        clientInProject=true;

                    }

                }
                // fix
                if(!clientInProject){

                    project.clients.push(json.client._id);
                    await project.save();

                }

                var objects = await databaseController.fetchObjects(json)

                json.objs = objects;
                var payloadString = JSON.stringify(json);
                ServerEventDispatcher.send(payloadString, connection);

                break;
            }

            case Commands.action.DELETE:{
                await databaseController.deleteProject(new FlowProject(json.project));
                break;
            }

        }
   }
   // this is completely empty
   else if(request == Commands.request.scene){

        switch(command){

            case Commands.action.CREATE:{


                break;
            }

            case Commands.action.UPDATE:{


                break;
            }

            case Commands.action.DELETE:{


                break;
            }

        }

   }

   else if(request == Commands.request.user){

        switch(action){

            //Creates new user in DB, creates new client in DB, adds
            //client ID and connection to server connection array, and
            //sends the new user ID and client ID back to the creator
            case Commands.action.CREATE: {
                

                let ids = await databaseController.createUser(new FlowClient(json.client), new FlowUser(json.user))
               
                var connectionTracker = {

                    clientId:   ids.newClientId,
                    connection: connection

                };

                json.client._id = ids.newClientId;
                json.user._id = ids.newUserId;

                ServerEventDispatcher.connections.push(connectionTracker);

                var payloadString = JSON.stringify(json);

                ServerEventDispatcher.send(payloadString, connection);

                break;
            }


            //Searches for user, verifies user login info is correct,
            //creates new client ID, adds client ID and connection to server
            //connection array, fetches any projects that the user owns, and
            //returns the client ID and project ID(s) to the logged in user
            case Commands.action.LOGIN: {

                var loginData = await databaseController.loginUser(new FlowUser(json.user), new FlowClient(json.client));
                
                
                if(loginData != null){
                
                    var connectionTracker = {

                        clientId:   loginData.newClientId,
                        connection: connection

                    };

                    // None of this code in itself should be in --messageprocessor.ts--

                    ServerEventDispatcher.connections.push(connectionTracker);

                    for(var x in ServerEventDispatcher.connections){}

                    json.client._id = loginData.newClientId;
                    json.user._id = loginData.newUserId;
                    json.projects = loginData.projects;
                    
                    var payloadString = JSON.stringify(json);

                    ServerEventDispatcher.send(payloadString, connection);

                }

                else{

                    var payloadString = JSON.stringify(json);

                    ServerEventDispatcher.send(payloadString, connection);

                }


                break;
            }

            //Removes client ID from user in DB, deletes
            //client ID and connection from server connection array
            case Commands.action.LOGOUT: {

                await databaseController.logoutUser(new FlowUser(json.user), new FlowClient(json.client));

                // This is a big no-no! This should be happening in the ServerEventDispatcher code 
                var connectionIndex = ServerEventDispatcher.connections.findIndex(x => x.clientId === json.client._id);
                delete ServerEventDispatcher.connections[connectionIndex];

                break;
            }
            
            // empty
            case Commands.action.FETCH: {
                break;
            }

            //Deletes user from DB
            case Commands.action.DELETE: {

                await databaseController.deleteUser(json)

                var payloadString = JSON.stringify(json);

                break;
            }

        }

   }
   else{


   }

}

}