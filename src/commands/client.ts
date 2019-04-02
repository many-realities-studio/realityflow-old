import { Commands } from "../common/commands";
import * as mongoose from "mongoose";
import { User, IUserModel } from "../models/user";
import { Client, IClientModel } from "../models/client";
import ObjectIdType = mongoose.Types.ObjectId;

export class ClientOperations{

    public static createClient(clientInfo: any, userId: String, connection: any){

        var newClientId;

        var newClient = new Client({

            user:           userId,
            deviceType:     clientInfo.deviceType,

        });

        newClient.save(function(err, doc){

            if(!err){

                newClient = doc;

            }

        });

        console.log("finished creating client");
        return newClient;

    }

    public static deleteClient(clientInfo: any){

        Client.findByIdAndRemove(clientInfo._id);

    }

}
