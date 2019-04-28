import * as mongoose from "mongoose";
import {Object, IObjectModel} from "../models/object";

var objectId = mongoose.Types.ObjectId();

export class ObjectOperations {

    public static createObject(objectInfo: any)
    {
        var object;

        var newObject = new Object({

            type:           objectInfo.type,
            name:           objectInfo.name,
            triangles:      objectInfo.triangles,
            x:              objectInfo.x,
            y:              objectInfo.y,
            z:              objectInfo.z,
            q_x:            objectInfo.q_x,
            q_y:            objectInfo.q_y,
            q_z:            objectInfo.q_z,
            q_w:            objectInfo.q_w,
            s_x:            objectInfo.s_x,
            s_y:            objectInfo.s_y,
            s_z:            objectInfo.s_z,
            color:          objectInfo.color,
            vertices:       objectInfo.vertices,
            uv:             objectInfo.uv,
            texture:        objectInfo.texture,
            textureHeight:  objectInfo.textureHeight,
            textureWidth:   objectInfo.textureWidth,
            textureFormat:  objectInfo.textureFormat,
            mipmapCount:    objectInfo.mipmapCount,
            locked:         objectInfo.locked

        });

        var promise = newObject.save();

        promise.then(function(doc){

                object = doc;

                return object;

        });

        return promise;
    }

    public static findObject(objectInfoId: any)
    {
        var object;

        var promise = Object.findById(objectInfoId).exec();

        promise.then(function(doc){

                object = doc;
                return object;

        });

        return promise;
        
    }

    public static updateObject(objectInfo: any)
    {
        var promise = Object.findOneAndUpdate({_id: objectInfo._id}, {

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

        }).exec();

        promise.then(function(doc){

        });

        return promise;
    }

    public static deleteObject(objectInfo: any)
    {
        Object.findByIdAndRemove(objectInfo._id).exec();
    }
}