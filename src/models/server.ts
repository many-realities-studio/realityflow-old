import * as express from "express";
import * as http from "http";
import { Server } from "ws";
import * as mongoose from "mongoose";
(<any>mongoose).Promise = Promise;
import {MessageProcessor} from "./common/messageProcessor";

// DB API
import {ClientOperations} from "./commands/client";
import {ProjectOperations} from "./commands/project";

var database;
const dburl = "mongodb://127.0.0.1:27017/realityflowdb";

//The main Server class
export class ServerEventDispatcher {
    //This array contains objects that have the client ID and corresponding 
    //connection object, so something like [{clientId:whatever, connection: connectionObject }]
    public static connections: any[] = [];
    public static wss: Server;
    public static callbacks: Function[][];

//Broadcasts to all clients and may or may not include original sender
    public static async broadcast(json: any, newFlag: boolean){

        var payloadString = JSON.stringify(json);

        var project = await ProjectOperations.findProject(json.project);

        var uniqueConnectionClients: any[] = [];
        var uniqueConnections: any[] = [];

        //This ensures uniqueness of the connections, as there was an issue with
        //connections being added to the array multiple times
        for(var i=0; i<this.connections.length; i++){

            if(uniqueConnectionClients.indexOf(this.connections[i].clientId)==-1){

                uniqueConnectionClients.push(this.connections[i].clientId);
                uniqueConnections.push(this.connections[i]);

            }

        }

        var clientArray = String(project.clients);
        var filteredConnections = [];

        if(!newFlag){

             for(var i=0; i<uniqueConnections.length; i++){

                //This checks what clients from the client array are from the project in question
                //as well as making sure it is not the client ID of the original sender
                if(clientArray.includes(String(uniqueConnections[i].clientId))&&String(uniqueConnections[i].clientId)!=String(json.client._id)){

                    filteredConnections.push(uniqueConnections[i].connection);

                }

             }
    
        }
        else{

            for(var i=0; i<uniqueConnections.length; i++){

                //This checks what clients from the client array are from the project in question
                if(clientArray.includes(String(uniqueConnections[i].clientId))){

                    filteredConnections.push(uniqueConnections[i].connection);

                }

             }
        }

        //Send the payload to each client that is part of the project,
        //possibly including the original sender
        for(var i=0; i<filteredConnections.length; i++){

            this.send(payloadString, filteredConnections[i]);

        }

    }

    //This function simply takes in whatever JSON payload and sends it to the connection
    public static send(payloadString: any, connection: any){

        // let payload = Buffer.alloc(payloadString.length, payloadString);

         connection.send(payloadString, function ack(err){
 
             if(err){
                  console.log(err);
              }
          });
    }

    constructor(server: http.Server) {

        //Setting up the connection to the DB. Currently the address is the
        //default Mongo address
        mongoose.connect(dburl);
        database = mongoose.connection;

        database.on('error', console.error.bind(console, 'connection error: '));
        database.once('open', function(){

            console.log('Database connection successful at ' + dburl);

        });

        ServerEventDispatcher.wss = new Server({ server }, function (err: any) {

        });
        ServerEventDispatcher.wss.on("error", (err) => {

        });

        ServerEventDispatcher.callbacks = [];
        ServerEventDispatcher.wss.on("connection", this.connection);



    }

    private connection(ws: any, arg?: any): void {
        var connection = ws;

        function onMessageEvent(evt: MessageEvent) {
            const json = JSON.parse(evt.data);
            // Swap out for new message processor
            // Change connection to clients
            MessageProcessor.serverMessageProcessor(json, connection);
        }

        function onCloseEvent(evt: CloseEvent): any {

           var clientId;
           
        }

        function onErrorEvent(evt: ErrorEvent) {
        }

        ws.onmessage = onMessageEvent;
        ws.onclose = onCloseEvent;
        ws.onerror = onErrorEvent;
    }

};


    const app = express();
    app.use(express.static("./static"));
    const server = http.createServer(app);
    const sockServ = new ServerEventDispatcher(server);
    server.listen(process.env.PORT || 8999, () => {
    });

