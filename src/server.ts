import "reflect-metadata"
import * as express from "express";
import * as http from "http";
import { Server } from "ws";
import { v4 as uuidv4 } from 'uuid';
import {NewMessageProcessor} from "./FastAccessStateTracker/Messages/NewMessageProcessor";
import {createConnection} from 'typeorm'

// DB API
import {ProjectOperations} from "./ORMCommands/project";
import { DBObject } from "./entity/object";
import { User } from "./entity/user";
import { Project } from "./entity/project";
import { UserSubscriber } from "./entity/UserSubscriber";

import { RoomManager } from "./FastAccessStateTracker/RoomManager";
import { UserOperations } from "./ORMCommands/user";
var database;


//The main Server class
export class ServerEventDispatcher {
    //This array contains objects that have the client ID and corresponding
    //connection object, so something like [{clientId:whatever, connection: connectionObject }]
    public static connections: any[] = [];
    public static wss: Server;
    public static callbacks: Function[][];

    public static SocketConnections = new Map<String, any>();

//Broadcasts to all clients and may or may not include original sender
    // public static async broadcast(json: any, newFlag: boolean){

    //     var payloadString = JSON.stringify(json);

    //     // var project = await ProjectOperations.findProject(json.project);

    //     var uniqueConnectionClients: any[] = [];
    //     var uniqueConnections: any[] = [];

    //     //This ensures uniqueness of the connections, as there was an issue with
    //     //connections being added to the array multiple times
    //     for(var i=0; i<this.connections.length; i++){

    //         if(uniqueConnectionClients.indexOf(this.connections[i].clientId)==-1){

    //             uniqueConnectionClients.push(this.connections[i].clientId);
    //             uniqueConnections.push(this.connections[i]);

    //         }

    //     }
    //     // var clientArray = String(project.clients);
    //     var filteredConnections = [];

    //     if(!newFlag){

    //          for(var i=0; i<uniqueConnections.length; i++){

    //             //This checks what clients from the client array are from the project in question
    //             //as well as making sure it is not the client ID of the original sender
    //             if(clientArray.includes(String(uniqueConnections[i].clientId))&&String(uniqueConnections[i].clientId)!=String(json.client._id)){

    //                 filteredConnections.push(uniqueConnections[i].connection);

    //             }

    //          }

    //     }
    //     else{

    //         for(var i=0; i<uniqueConnections.length; i++){

    //             //This checks what clients from the client array are from the project in question
    //             if(clientArray.includes(String(uniqueConnections[i].clientId))){

    //                 filteredConnections.push(uniqueConnections[i].connection);

    //             }

    //          }
    //     }

    //     //Send the payload to each client that is part of the project,
    //     //possibly including the original sender
    //     for(var i=0; i<filteredConnections.length; i++){

    //         this.send(payloadString, filteredConnections[i]);

    //     }

    // }

    //This function simply takes in whatever JSON payload and sends it to the connection
    public static send(payloadString: any, connection: any){

        // let payload = Buffer.alloc(payloadString.length, payloadString);

         connection.send(payloadString, function ack(err: any){

             if(err){
                  console.log(err);
              }
          });
    }


    constructor(server: http.Server) {

        
        
        ServerEventDispatcher.wss = new Server({ server }, function (err: any) {

        });
        ServerEventDispatcher.wss.on("error", (err) => {
            console.log("Server running");
        });

        ServerEventDispatcher.callbacks = [];
        ServerEventDispatcher.wss.on("connection", this.connection);



    }


    private connection(ws: any, arg?: any): void {

        // Assign this connection an ID and store it
        ws.ID = uuidv4();

        ServerEventDispatcher.SocketConnections.set(ws.ID, ws);


        function onMessageEvent(evt: any) {

            const json = JSON.parse(evt.data);            

            console.log(evt.data);


            NewMessageProcessor.ParseMessage(ws.ID, json).then((res: any) => {

                let clients = res[1];

                if(!clients)
                {
                    console.log("Didn't receive a clients array ");
                }
                else
                {
                    for(var i = 0; i < clients.length; i++)
                    {
                        let key = clients[i];
    
                        //let json = JSON.stringify(res[0];
                        ServerEventDispatcher.SocketConnections.get(key).send(res[0]);
                    }
                }
                
            
            });

          /*  let clients = response.affectedClients;

            for(var i = 0; i < clients.length; i++)
            {
                let key = clients[i];
                ServerEventDispatcher.SocketConnections.get(key).send(response.payload);
            }
            */
        }


        function onCloseEvent(evt: any): any {

           ServerEventDispatcher.SocketConnections.delete(ws.ID);
        }

        function onErrorEvent(evt: any) {

        }

        ws.onmessage = onMessageEvent;
        ws.onclose = onCloseEvent;
        ws.onerror = onErrorEvent;
    }

};


(async () => {
    console.log("hello! I a")
    await createConnection({
        "name": "prod",
        "type": "sqlite",
        "database": "./database/prod.db", 
        "logging": true,
        "synchronize": true,
        "entities": [
           DBObject,
           User,
           Project
        ],
        subscribers: [
            UserSubscriber
        ]
     }).then(async (res)=>{
        process.env.NODE_ENV = "prod" 
        console.log(res.isConnected)
        
        await UserOperations.createUser("God", "Jesus")

        await ProjectOperations.createProject({
            Id: "noRoom",
            Description: "this is not a room",
            DateModified: Date.now(),
            ProjectName: "noRoom"

        }, "God")

        RoomManager.CreateRoom("noRoom");
        })

     
     console.log(process.env.NODE_ENV)
})()




const app = express();




// Use Passport with express
// app.use(passport.initialize());
// app.use(passport.session());


// const initializePassport = require('./passport-config')
// initializePassport(
//   passport,
//   username => User.find(user => user.Username === username),
//   password => User.find(user => user.Password === password)
// );



// passport.serializeUser(User.serializeUser());
// Responsible for reading the session, taking data from the session and unencoding it
// passport.deserializeUser(User.deserializeUser());




app.use(express.static("./static"));

const server = http.createServer(app);
const sockServ = new ServerEventDispatcher(server);

server.listen(process.env.PORT || 8999, () => {
});

