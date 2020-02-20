import * as mongoose from "mongoose";
import {Object, IObjectModel} from "../models/object";

var objectId = mongoose.Types.ObjectId();

export class ObjectOperations {

    public static async createObject(objectInfo: any)
    {
        var object;

        var newObject = new Object({

            Type:           objectInfo.type,
            Name:           objectInfo.name,
            Triangles:      objectInfo.triangles,
            X:              objectInfo.x,
            Y:              objectInfo.y,
            Z:              objectInfo.z,
            Q_x:            objectInfo.q_x,
            Q_y:            objectInfo.q_y,
            Q_z:            objectInfo.q_z,
            Q_w:            objectInfo.q_w,
            S_x:            objectInfo.s_x,
            S_y:            objectInfo.s_y,
            S_z:            objectInfo.s_z,
            Color:          objectInfo.color,
            Vertices:       objectInfo.vertices,
            Uv:             objectInfo.uv,
            Texture:        objectInfo.texture,
            TextureHeight:  objectInfo.textureHeight,
            TextureWidth:   objectInfo.textureWidth,
            TextureFormat:  objectInfo.textureFormat,
            MipmapCount:    objectInfo.mipmapCount,
            Locked:         objectInfo.locked

        });

        var promise = await newObject.save();
        return promise;
    }

    public static async findObject(objectInfoId: any)
    {
        var object = await Object.findById(objectInfoId).exec();

        return object;
        
    }

    public static async updateObject(objectInfo: any) : Promise<void>
    {
        var promise = await Object.findOneAndUpdate({_id: objectInfo._id}, {

            x:          objectInfo.x,
            y:          objectInfo.y,
            z:          objectInfo.z,
            q_x:        objectInfo.q_x,
            q_y:        objectInfo.q_y,
            q_z:        objectInfo.q_z,
            q_w:        objectInfo.q_w,
            s_x:        objectInfo.s_x,
            s_y:        objectInfo.s_y,
            s_z:        objectInfo.s_z,
            color:      objectInfo.color

        }).exec(function(err){
            if(err){
                console.error(err)
            }
        });

    }

    public static async deleteObject(objectInfo: any)
    {
        await Object.findByIdAndRemove(objectInfo._id).exec();
    }
}