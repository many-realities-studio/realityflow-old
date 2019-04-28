import * as mongoose from "mongoose";
import { Client, IClientModel } from "../models/client";

var objectId = mongoose.Types.ObjectId();

export class ClientOperations{

    public static createClient(clientInfo: any, userId: String){

        var createdClient;

        var newClient = new Client({

            user:           userId,
            deviceType:     clientInfo.deviceType,

        });

        var promise = newClient.save(function(err, doc){

            createdClient = doc;
        
           // return createdClient._id;
        });

        return promise;

    }

    public static deleteClient(clientInfoId: any){

        Client.findByIdAndRemove(clientInfoId);

    }

}
