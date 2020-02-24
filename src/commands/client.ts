import * as mongoose from "mongoose";
import { Client, IClientModel } from "../models/client";
import { UserOperations } from "./user"
import { User, IUserModel } from "../models/user";


var objectId = mongoose.Types.ObjectId();

export class ClientOperations{

    public static async createClient(clientInfo: any, username: String) : Promise<IClientModel>{

        var foundUser = await UserOperations.findUser(username);
        var newClient = new Client({

            User:           foundUser._id,
            Id:             clientInfo.Id,
            DeviceType:     clientInfo.DeviceType,

        });

        return await newClient.save()

    }

    public static async findClient(clientId: String) : Promise<IClientModel>{
        return await Client.findOne({Id: clientId})
    }

    public static async deleteClient(clientInfoId: String) : Promise<void>{

        await Client.findByIdAndRemove({Id: clientInfoId});

    }

}
