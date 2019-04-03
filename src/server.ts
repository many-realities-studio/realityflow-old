import * as fs from "fs";
import { Commands } from "./common/commands";
import * as path from "path";
import * as express from "express";
import * as http from "http";
import { Server } from "ws";
import * as mongoose from "mongoose";

// Models
import {Project, IProjectModel} from "./models/project";

// DB API
import {UserOperations} from "./commands/user";
import {ClientOperations} from "./commands/client";
import {ProjectOperations} from "./commands/project";
import {SceneOperations} from "./commands/scene";
import {ObjectOperations} from "./commands/object";

var database;
const dburl = "mongodb://127.0.0.1:27017/realityflowdb";

/**
 * The main server dispatcher
 */
export class ServerEventDispatcher {
    public static connections: any[] = [];
    public static wss: Server;
    public static callbacks: Function[][];

    public static async serverMessageProcessor(json: any, connection: any){

        console.log("Entering Message Processor");

       var command: Number = json.command;

       if(command>=Commands.object.CREATE&&command<=Commands.object.DELETE){

            switch(command){

                case Commands.object.CREATE:{

                    console.log('Object: '+json.obj);
                    var object = await ObjectOperations.createObject(json.obj);
                    var project = await ProjectOperations.findProject(json.project);

                    //var sceneId = project.currentScene;
                    //var scene = SceneOperations.findScene(sceneId);

                    //scene.objects.push(object._id);

                    /*var payloadString = JSON.stringify({

                        object: object
                        
                    });

                    this.send(payloadString, connection);
                    */

                    console.log('Project: '+project);

                    project.objs.push(object._id);
                    await project.save();

                    json.project = project;
                    json.obj._id = object._id;

                    this.broadcast(json, true);

                    break;
                }

                case Commands.object.UPDATE:{

                    this.broadcast(json, false);
                   await ObjectOperations.updateObject(json.objs);

                    break;
                }

                case Commands.object.DELETE:{

                    this.broadcast(json, true);
                    ObjectOperations.deleteObject(json.objs);

                    break;
                }

            }

       }
       else if(command>=Commands.project.CREATE&&command<=Commands.project.DELETE){

            switch(command){

                case Commands.project.CREATE:{

                    var project = await ProjectOperations.createProject(json.project, json.client, json.user);
                    project.clients.push(json.client._id);
                    await project.save();

                   /* var payloadString = JSON.stringify({

                        project: project,
                        scene: scene

                    }); */

                    console.log('Project Created. Project ID: '+project);

                    json.project = project;

                    var payloadString = JSON.stringify(json);


                   /* var clientIndex = this.connections.findIndex(function(value){

                        return value.clientId==json.client._id;

                    });

                    console.log("Client ID: "+json.client._id);
                    console.log("Client Index: "+clientIndex);

                    this.send(payloadString, this.connections[clientIndex].connection);*/

                    this.send(payloadString, connection);

                    break;
                }

                case Commands.project.UPDATE:{


                    break;
                }

                case Commands.project.FETCH:{


                    break;
                }

                case Commands.project.OPEN:{

                    var project = await ProjectOperations.findProject(json.project);
                    console.log("Project Clients: "+project.clients);
                    project.clients.push(json.client._id);
                    await project.save();
                    //promise = await ProjectOperations.saveProject(project);

                    //var scene = SceneOperations.findScene(project.currentScene);
                    console.log('Project: '+project);
                    var objectIds = project.objs;
                    var objects = [];

                    console.log('Object IDs Length: '+objectIds.length);

                    console.log("Object IDs: "+objectIds);
                    if(objectIds.length>0){
                        console.log('CHECK');
                        for(var i=0; i<objectIds.length; i++){

                            console.log('X: '+objectIds[i]);
                            var currentObject = await ObjectOperations.findObject(objectIds[i]);

                            objects.push(currentObject);

                       }

                    console.log("Objects: "+objects);

                    }

                    /*var payloadString = JSON.stringify({

                        scene: scene,
                        object: objects

                    });*/

                    json.objs = objects;

                    var payloadString = JSON.stringify(json);

                    this.send(payloadString, connection);

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

                case Commands.user.CREATE: {

                    var newUserPayload = await UserOperations.createUser(json.user);
                    var newClientId = ClientOperations.createClient(json.client, newUserPayload._id);
                    

                    var connectionTracker = {

                        clientId:   newClientId,
                        connection: connection

                   };

                   this.connections.push(connectionTracker);

                    newUserPayload.clients.push(newClientId);
                    newUserPayload.save();

                  /*  var payloadString = JSON.stringify({

                        response:   'User Creation Successful',
                        user:       {_id: newUser._id},
                        client:     {_id: newClientId}

                    }); */

                    json.user._id = newUserPayload._id;
                    json.client._id = newClientId;

                    var payloadString = JSON.stringify(json);

                    this.send(payloadString, connection);

                    break;
                }


                case Commands.user.LOGIN: {

                    var returnedUser = await UserOperations.loginUser(json.user);
                    if(returnedUser._id!=''&&returnedUser._id!=undefined){
                       json.user._id = returnedUser._id;
                       var projects = await ProjectOperations.fetchProjects(returnedUser);
                       var newClientId = ClientOperations.createClient(json.client, returnedUser._id);
                       json.client._id = newClientId;
                       var currentUser = await UserOperations.findUser(returnedUser);
                       console.log('Current User: '+currentUser);

                       var connectionTracker = {

                            clientId:   newClientId,
                            connection: connection

                       };

                       this.connections.push(connectionTracker);

                       console.log('Connections: '+this.connections.length);
                       for(var x in this.connections){
    
                        console.log('Connection Client IDs: '+this.connections[x].clientId);
    
                       }

                       currentUser.clients.push(newClientId);
                       currentUser.save();

                       console.log('Current User 2: '+currentUser);

                       /*var payloadString = JSON.stringify({

                            response: 'Login Successful',
                            projects:  projects,
                            user:      {_id: returnedUser._id},
                            client:    {_id: newClientId}

                       });*/

                       
                       json.projects = projects;
                       
                       var payloadString = JSON.stringify(json);

                       this.send(payloadString, connection);

                    }

                    else{

                        /*var payloadString = JSON.stringify({

                            response: 'Login Unsuccessful'

                        });*/

                        var payloadString = JSON.stringify(json);

                        this.send(payloadString, connection);

                    }

                    break;
                }

                case Commands.user.LOGOUT: {

                    var user = UserOperations.findUser(json.user._id);

                    var clientArray = user.clients;

                    var filteredArray = clientArray.filter(function(value, index, array){

                        return value!=json.client._id

                    });

                    user.clients = filteredArray;

                    ClientOperations.deleteClient(json.client._id);

                    /*var payloadString = JSON.stringify({

                        response: 'Logout Successful'

                    })*/

                    var payloadString = JSON.stringify(json);

                    this.send(payloadString, connection);

                    var connectionIndex = this.connections.findIndex(x => x.clientId === json.client._id);
                    delete this.connections[connectionIndex];

                    break;
                }

                case Commands.user.FIND: {

                    

                    break;
                }

                case Commands.user.DELETE: {

                    var User = UserOperations.findUser(json.user);
                    var clientArray = User.clients;

                    for(var arr in clientArray){

                        ClientOperations.deleteClient(arr);

                    }

                    UserOperations.deleteUser(json.user);

                    /*var payloadString = JSON.stringify({

                        response: 'User deleted successfully'

                    });*/

                    var payloadString = JSON.stringify(json);

                    break;
                }

            }

       }
       else{

        console.log('ERROR: Invalid Command');

       }

    }

    public static async broadcast(json: any, newFlag: boolean){

        var payloadString = JSON.stringify(json);

        var project = await ProjectOperations.findProject(json.project);
        var clientArray = String(project.clients);
        var filteredClientArray = [];
        var filteredConnections = [];

       /* for(x in this.connections){

            console.log("this.connection: "+this.connections[x].clientId);

        }
        */
        //console.log("Project clients: "+clientArray);

        if(!newFlag){

             for(x in this.connections){

                if(clientArray.includes(String(this.connections[x].clientId))&&String(this.connections[x].clientId!=String(json.client_id))){

                    filteredConnections.push(this.connections[x].connection);

                }

             }

           // console.log("Filtered Client Array: "+filteredClientArray);
    
        }
        else{

            for(x in this.connections){

                if(clientArray.includes(String(this.connections[x].clientId))){

                    filteredConnections.push(this.connections[x].connection);

                }

             }

             //filteredClientArray.push(clientArray);
             //console.log("Filtered Client Array: "+filteredClientArray);
        }

        /*var index;
        

        console.log("filteredClientArrayLength: "+filteredClientArray.length);

        for(var x in filteredClientArray){

          console.log("filteredClientArray[x]: "+filteredClientArray[x]);
          index = this.connections.findIndex(function(value){

            console.log("Value client ID: "+value.clientId);
            return value.clientId===filteredClientArray[x];

          });
          console.log("Index: "+index);
          filteredConnections.push(this.connections[index].connection);

        }

        console.log('Filtered Connections: '+filteredConnections);*/

        for(var x in filteredConnections){

            this.send(payloadString, filteredConnections[x]);

        }

    }

    public static send(payloadString: any, connection: any){

        let payload = Buffer.alloc(payloadString.length, payloadString);

        connection.send(payload, function ack(err){

            if(err==undefined){

                console.log('Payload sent successfully!');

            }

        });

    }

   /* public static send(event_name: number, event_data: { data: any, from?: string }, event_time: number, client_id: number,
        transform_data?: IFlowTransform) {
        let payload = null;
        if (ServerEventDispatcher.connections[client_id].readyState !== 3) {
            if (event_name === Commands.TRANSFORM_UPDATE
            ) {
                // console.log("Sending a transform update with ", transform_data);
                let payload_str = JSON.stringify({
                    cmd: event_name,
                    timestamp: event_time,
                    transform: transform_data,
                    value: event_data,
                });
                payload = Buffer.alloc(payload_str.length, payload_str);
                ServerEventDispatcher.connections[client_id].send(payload); // <= send JSON data to socket server
            } else {
                if (event_data !== undefined && event_data !== null && event_data.data !== undefined) {
                    let data: string = JSON.stringify({
                        cmd: event_name, timestamp: event_time, value: event_data,
                    });
                    // if (event_name !== Commands.PING && event_name !== Commands.PONG && event_name !== Commands.modifier.UPDATE) {
                    //    console.log("Sending..." + data);
                    // }
                    payload = Buffer.alloc(data.length, data);
                    ServerEventDispatcher.connections[client_id].send(payload); // <= send JSON data to socket server
                }
            }
        }
        return this;
    }*/

/*    public static bind(event_name: number, callback: (value: { data: any, from?: string, description?: string, name?: string }
        , time: number, ws_id: number) => void) {
        if (event_name === undefined) {
            console.error("Binding unknown event ", event_name);
        }
        ServerEventDispatcher.callbacks[event_name] = ServerEventDispatcher.callbacks[event_name] || [];
        ServerEventDispatcher.callbacks[event_name].push(callback);
        return this; // chainable
    }
*/
 /*   public static broadcast(event_name: number, event_data: { data: any, _from?: string }, event_time: number, client_id: string,
                            user_id: string, transform_data?: IFlowTransform) {
        event_data._from = client_id;
        ServerEventDispatcher.connections.forEach((connection, i) => {
            if (ServerEventDispatcher.connections[i].readyState === ServerEventDispatcher.connections[i].OPEN
               // && (user_hash[i] !== undefined && (user_hash[i] === user_id
               //     || user_hash[i] === "0"
                //    || user_id === "-1"))
               ) {
                //console.log(client_hash[i]);
                // If the connection is admin or connection is same user.
                if (event_name !== Commands.transform.UPDATE) {
                    ServerEventDispatcher.send(event_name, event_data, event_time, i);
                } else {
//                    if (client_hash[i] !== event_data._from) {
                        ServerEventDispatcher.send(event_name, event_data, event_time, i, transform_data);
//                  }
                }
            }
        });
    }
*/
 /*   private static dispatch(event_name: number, event_payload: { data: any, from?: string }, event_time: number,
        connection_id: number, transform_data?: any) {
        const chain = ServerEventDispatcher.callbacks[event_name];
        if (typeof chain === "undefined") {
         //   console.log("Unknown type: ", event_name,
         //       "data", event_payload.data); return;
        } // no callbacks for this event
        for (let i = 0; i < chain.length; i++) {
            chain[i](event_payload, event_time, connection_id, transform_data);
        }
    }
*/
    constructor(server: http.Server) {

        mongoose.connect(dburl);
        database = mongoose.connection;

        database.on('error', console.error.bind(console, 'connection error: '));
        database.once('open', function(){

            console.log('Database connection successful at ' + dburl);

        });

        console.log("Setting up server");
        ServerEventDispatcher.wss = new Server({ server }, function (err: any) {
            console.log("Connections set up " + err);
        });
        ServerEventDispatcher.wss.on("error", (err) => {
            console.log("error");
        });
       // console.log("Receiving connections on port 8889", ServerEventDispatcher.wss);
        ServerEventDispatcher.callbacks = [];
        ServerEventDispatcher.wss.on("connection", this.connection);



    }

    private connection(ws: any, arg?: any): void {
        //console.log(ws);
        //ServerEventDispatcher.connections.push(ws);
        var connection = ws;
       // ws.send("Connected!");

        function onMessageEvent(evt: MessageEvent) {
            const json = JSON.parse(evt.data);
            ServerEventDispatcher.serverMessageProcessor(json, connection);
        }

        function onCloseEvent(evt: CloseEvent): any {
           // ServerEventDispatcher.dispatch(Commands.client.CLIENT_DISCONNECT, { data: client_id.toString() }, 0, client_id);
        }

        function onErrorEvent(evt: ErrorEvent) {
           // console.log("Error: Closed connection");
           // ServerEventDispatcher.dispatch(Commands.client.CLIENT_DISCONNECT, { data: client_id.toString() }, 0, client_id);
        }

        ws.onmessage = onMessageEvent;
        ws.onclose = onCloseEvent;
        ws.onerror = onErrorEvent;
    }

};


// Use connect method to connect to the Server
const apiFuncGroup = [ "state",
    "client", "user", "event", "transform"];

// db.on("error", console.error.bind(console, "connection error"));
// db.on("open", main);

function main() {
    console.log("Test");
    const app = express();
    // Test 3
    app.use(express.static("./static"));
    const server = http.createServer(app);
    const sockServ = new ServerEventDispatcher(server);
    /*function setup() {
        //console.log("Setting all connections to disconnected");
        Client.find({}, function (err, res) {
            for (let client = 0; client < res.length; client++) {
                res[client].state = Commands.STATE_DISCONNECTED;
                res[client].save();
            }
            User.find({}, function (err2, user) {
                for (let i = 0; i < res.length; i++) {
                    // res[i].populate();
                }
            }); 
        });*/
/*        process.on("message", function (msg: string) {
            let cmd: {
                cmd: number, value: { data: any },
            } = JSON.parse(msg);
            console.log("Receiving: " + msg);
            if (cmd.cmd === Commands.UPDATE_API) {
                console.log("Updating API!");
                loadApiFunctions();
                ServerEventDispatcher.broadcast(Commands.UPDATE_API, { data: "0" }, Date.now(), null, "0");

            }
            ServerEventDispatcher.broadcast(cmd.cmd, cmd.value, 0, "0", "-1");
        });*/
        function loadApiFunctions() {
            for (let i = 0; i < apiFuncGroup.length; i++) {
                delete require.cache[require.resolve("./commands/" + apiFuncGroup[i] + ".js")];
            //    let initCommands = require("./commands/" + apiFuncGroup[i]).default;
            //    initCommands(sockServ, user_hash, client_hash, function () { /*console.log("Loaded" + apiFuncGroup[i]);*/ });
            }
        }
       // loadApiFunctions();
    
    // Setup
    //setup();
    server.listen(process.env.PORT || 8999, () => {
        //console.log(`Server started on port ${server.address().port} :)`);
    });
}

    // Registers a unique client ID for the client.
    /*
        ServerEventDispatcher.bind(Commands.UPDATE_EXTENSIONS, function (value, time, ws_id) {
            console.log("Updating extensions!");
            ServerEventDispatcher.broadcast(Commands.UPDATE_EXTENSIONS, value, time, null, user_hash[ws_id]);
        });
        ServerEventDispatcher.bind(Commands.UPDATE_MODULES, function (value, time, ws_id) {
            console.log("Updating extensions!");
            ServerEventDispatcher.broadcast(Commands.UPDATE_MODULES, value, time, null, user_hash[ws_id]);
        });
        ServerEventDispatcher.bind(Commands.TRANSFORM_UPDATE, function (value, time, ws_id) {
            ServerEventDispatcher.broadcast(Commands.TRANSFORM_UPDATE, value, time, client_hash[ws_id], user_hash[ws_id]);
        });*/

main();
