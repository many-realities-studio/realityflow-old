import * as mongoose from "mongoose";
import {Object, IObjectModel} from "../models/object";

var objectId = mongoose.Types.ObjectId();

export class ObjectOperations {

    public static createObject(objectInfo: any)
    {
        var object;

        console.log('Entering createObject...');
        console.log('ObjectInfo type: '+objectInfo.type);
        console.log('ObjectInfo name: '+objectInfo.name);

        var newObject = new Object({

            type:       objectInfo.type,
            name:       objectInfo.name,
            triangles:  objectInfo.triangles,
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
            vertices:   objectInfo.vertices,
            uv:         objectInfo.uv,
            locked:     objectInfo.locked

        });

        var promise = newObject.save();

        promise.then(function(doc){

                console.log('Object ' + doc.name + ' added successfully.');
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

        }).exec();

        promise.then(function(doc){

                console.log('Object ' + doc.name + ' updated successfully.');

        });

        return promise;
    }

    public static deleteObject(objectInfo: any)
    {
        Object.findByIdAndRemove(objectInfo._id);
    }
}
