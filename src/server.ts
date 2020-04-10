import "reflect-metadata"
import * as express from "express";
import * as http from "http";
const WebSocket = require("ws")

import { v4 as uuidv4 } from 'uuid';

import {NewMessageProcessor} from "./FastAccessStateTracker/Messages/NewMessageProcessor";
import {createConnection} from 'typeorm';

// DB API
import {ProjectOperations} from "./ORMCommands/project";

import { RoomManager } from "./FastAccessStateTracker/RoomManager";
import { UserOperations } from "./ORMCommands/user";
import { FlowProject } from "./FastAccessStateTracker/FlowLibrary/FlowProject";

var database;
console.log("Server starting...")


//The main Server class
export class ServerEventDispatcher {
    //This array contains objects that have the client ID and corresponding
    //connection object, so something like [{clientId:whatever, connection: connectionObject }]
    public static connections: any[] = [];
    public static wss;
    public static callbacks: Function[][];

    public static SocketConnections = new Map<String, any>();

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

        ServerEventDispatcher.wss = new WebSocket.Server({ 
            noServer: true,
        });
        ServerEventDispatcher.wss.on("error", (err) => {
            console.log()
        });

        ServerEventDispatcher.callbacks = [];
        ServerEventDispatcher.wss.on('connection', this.connection)
          
        server.on("upgrade", async (request, socket, head) => {
           
                let rawAuth: string = Buffer.from(request.headers.authorization.replace('Basic ', ''), 'base64').toString()
                let splitIndex = rawAuth.indexOf(":")
                let user = rawAuth.slice(0, splitIndex)
                let pass = rawAuth.slice(splitIndex+1)
                let ID = uuidv4();

                let message = {
                    "__type": "Login_SendToServer:#Packages.realityflow_package.Runtime.scripts.Messages.UserMessages",
                    "Message": null,
                    "MessageType": "LoginUser",
                    "FlowUser": {
                    "Password": pass,
                    "Username": user
                    }
                }
                let res = await NewMessageProcessor.ParseMessage(ID, message)
                console.log(res)
                let payload = JSON.parse(res[0])
                console.log(payload)

                if(payload["WasSuccessful"])
                    ServerEventDispatcher.wss.handleUpgrade(request, socket, head, function done (ws){
                        ServerEventDispatcher.wss.emit('connection', ws, request);
                        ws.ID = ID;
                        ws.username = user;
                        ws.send(res[0])

                        // Assign this connection an ID and store it
                        ServerEventDispatcher.SocketConnections.set(ID, ws);
                    
                    })
                else    
                    socket.destroy()
                
                    
        })
        
    }

    private connection(ws, req): void {
        
        function onMessageEvent(evt: any) {
        
            console.log(evt)
            try {

                const json = JSON.parse(evt);     

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
                            ServerEventDispatcher.SocketConnections.get(key).send(res[0]);
                        }
                    }
                });
                
            } catch (error) {
                ServerEventDispatcher.SocketConnections.get(ws.ID).send("Error:\n" + error);   
            }
        }


        function onCloseEvent(): any {
           NewMessageProcessor.ParseMessage(ws.ID,
            {
                "FlowUser": {
                  "Username": ws.username,
                  "Password": "pass"
                },
                "MessageType": "LogoutUser"
              }
               
           )
           ServerEventDispatcher.SocketConnections.delete(ws.ID);
        }

        function onErrorEvent(evt: any) {
        }

        ws.on('message', onMessageEvent);
        ws.on('close', () => {
            let logoutMessage = JSON.stringify({
                "FlowUser": {
                  "Username": ws.username,
                  "Password": "pass"
                },
                "MessageType": "LogoutUser"
            })
            ws.emit('message', logoutMessage)
        });

    }

};


(async () => {
    try {
    await createConnection("prod").then(async (res)=>{
        // await res.synchronize();
        process.env.NODE_ENV = "prod" 
        console.log("Is connected", res.isConnected)
        try {
            await UserOperations.createUser("God", "Jesus")

            await ProjectOperations.createProject(new FlowProject({
                Id: "noRoom",
                Description: "this is not a room",
                DateModified: Date.now(),
                ProjectName: "noRoom"
            }), "God")
        } catch(err) {
            console.log(err)
        }
        RoomManager.CreateRoom("noRoom");
        })
        .catch((err) => {
            console.log(err)
        })
    } catch (err) {
        console.log(err)
    }
     console.log(process.env.NODE_ENV)
})()

// const app = express();

// app.use(express.static("./static"));

const server = http.createServer();
const sockServ = new ServerEventDispatcher(server);

try {
server.listen(process.env.PORT || 8999, () => {
    console.log("SYSTEM READY");
})
} catch (err) {
  console.log(err)
}