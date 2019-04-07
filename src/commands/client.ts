import * as mongoose from "mongoose";
import { Client, IClientModel } from "../models/client";

var objectId = mongoose.Types.ObjectId();

export class ClientOperations{

    public static createClient(clientInfo: any, userId: String){

        var createdClient;

        console.log('Entering createClient...');
        console.log('ClientInfo Payload: '+clientInfo);
        console.log('UserInfo Payload: '+userId);

        var newClient = new Client({

            user:           userId,
            deviceType:     clientInfo.deviceType,

        });

        console.log('Client PreSave: '+newClient);

        var promise = newClient.save(function(err, doc){

            createdClient = doc;

            console.log('Saved Client: '+createdClient._id);
        
           // return createdClient._id;
        });

        return promise;

    }

    public static deleteClient(clientInfoId: any){

        Client.findByIdAndRemove(clientInfoId);

    }

}
