import { ServerEventDispatcher } from "../server";
import { Commands } from "./commands";
import {databaseController} from "./databaseController"


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

                var ret = await databaseController.createObject(json)

                ServerEventDispatcher.broadcast(ret, true);
                
            }

            //Broadcasts the change to all other involved clients
            case Commands.object.UPDATE:{
                ServerEventDispatcher.broadcast(json, false);
                break;
            }
            
            // Update the object info in the DB
            // I know this is silly, but it's a little messy
            // to have control going both ways - esp. when changes 
            // aren't just going to the database anymore
            case Commands.object.UPDATELONGTERM:{
                await databaseController.updateObject(json)
                break;
            }

            //Deletes the object from DB and broadcasts delete to
            //all involved clients
            case Commands.object.DELETE:{

                ServerEventDispatcher.broadcast(json, true);
                await databaseController.deleteObject(json)

                break;
            }

        }

   }
   else if(command>=Commands.project.CREATE&&command<=Commands.project.DELETE){

        switch(command){

            // Creates project in DB and sends project ID back to creator
            // as of 
            case Commands.project.CREATE:{

                var payload: String = await databaseController.createProject(json)
                ServerEventDispatcher.send(payload, connection);

                break;
            }

            case Commands.project.UPDATE:{
                // there's nothing in here????

                break;
            }

            case Commands.project.FETCH:{
                // there's also nothing in here???

                break;
            }

            // TODO : This just adds anyone who asks for a project onto the list of 
            // project owners. This is not what we want!

            // Fetches project from DB, adds current client ID to
            // project client IDs list, fetches all objects in the
            // project, and broadcasts the complete payload to the requestor
            case Commands.project.OPEN:{
            
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

            case Commands.project.DELETE:{
                await databaseController.deleteProject(json);
                break;
            }

        }
   }
   // this is completely empty
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

                // None of this should be being done in the message processor
                newClientId = newClientId._id;

                var connectionTracker = {

                    clientId:   newClientId,
                    connection: connection

                };

                json = await databaseController.createUser(json)
               
                ServerEventDispatcher.connections.push(connectionTracker);

                var payloadString = JSON.stringify(json);

                ServerEventDispatcher.send(payloadString, connection);

                break;
            }


            //Searches for user, verifies user login info is correct,
            //creates new client ID, adds client ID and connection to server
            //connection array, fetches any projects that the user owns, and
            //returns the client ID and project ID(s) to the logged in user
            case Commands.user.LOGIN: {

                var loginData = await databaseController.loginUser(json);
                var newClientId = loginData.newClientId;
                
                // Mongoose has structures for password comparisons!
                if(loginData != null){
                
                    var connectionTracker = {

                        clientId:   newClientId,
                        connection: connection

                    };

                    // None of this code in itself should be in --messageprocessor.ts--

                    ServerEventDispatcher.connections.push(connectionTracker);

                    for(var x in ServerEventDispatcher.connections){}

                    loginData.currentUser.clients.push(newClientId);
                    loginData.currentUser.save();
                    
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
            case Commands.user.LOGOUT: {

                await databaseController.logoutUser(json)

                // This is a big no-no! This should be happening in the ServerEventDispatcher code 
                var connectionIndex = ServerEventDispatcher.connections.findIndex(x => x.clientId === json.client._id);
                delete ServerEventDispatcher.connections[connectionIndex];

                break;
            }

            case Commands.user.FIND: {

                

                break;
            }

            //Delets user from DB
            case Commands.user.DELETE: {

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