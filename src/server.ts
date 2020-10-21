import "reflect-metadata"
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
import {isNullOrUndefined} from "util";

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


         connection.send(payloadString, function ack(err: any){

             if(err){
                  console.log(err);
              }
          });
    }

    public static async authenticate(auth_header: string): Promise<[boolean, string, string, string]>{
	    if(isNullOrUndefined(auth_header) || auth_header == ""){
            console.log("authentication header not sent")
            return [false, "", "", ""]
        }
        
        let rawAuth: string = Buffer.from(auth_header.replace('Basic ', ''), 'base64').toString()
        let splitIndex = rawAuth.indexOf(":")
        let user = rawAuth.slice(0, splitIndex)
        let pass = rawAuth.slice(splitIndex+1)
        let message = {
            "__type": "Login_SendToServer:#Packages.realityflow_package.Runtime.scripts.Messages.UserMessages",
            "Message": null,
            "MessageType": "LoginUser",
            "FlowUser": {
            "Password": pass,
            "Username": user
            }
        }
        
        let id = uuidv4();
        let res = await NewMessageProcessor.ParseMessage(id, message)
        console.log(res)
        let payload = JSON.parse(res[0])
        console.log(payload)

        return [payload["WasSuccessful"], id, user, payload] 
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
                let auth_header = request.headers.authorization 
                let [authenticated, id, user, payload] = await ServerEventDispatcher.authenticate(auth_header)

                if(authenticated)
                    ServerEventDispatcher.wss.handleUpgrade(request, socket, head, function done (ws){
                        ServerEventDispatcher.wss.emit('connection', ws, request);
                        ws.ID = id;
                        ws.username = user;
                        ws.send(payload)
                    
                        // Assign this connection an ID and store it
                        ServerEventDispatcher.SocketConnections.set(id, ws);
                    
                    })
                else    
                    socket.destroy()
                
                    
        })
        
    }

    private connection(ws, req): void {
       	console.log("tried connect") 
        function onMessageEvent(evt: any) {
        
            console.log(evt)
            try {

                const json = JSON.parse(evt);
                json.user = ws.username     

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


const server = http.createServer();
const sockServ = new ServerEventDispatcher(server);

try {
server.listen({"port": process.env.PORT || 8999, "host": "localhost"}, () => {
    console.log("SYSTEM READY");

})
} catch (err) {
  console.log(err)
}
