var mongoose = require("mongoose");

import {Object, IObjectModel} from "../models/object";

export class ObjectOperations {

    public static createObject(objectInfo: any)
    {
        var object;

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

        newObject.save(function(err, doc){

            if(err){

                console.log('ERROR: Failed to create object: ' + doc.name);

            }
            else{

                console.log('Object ' + doc.name + ' added successfully.');
                object = doc;

            }
        });

        return object;
    }

    public static findObject(objectInfo: any)
    {
        var object;

        Object.findById(objectInfo._id, function(err, doc){

            if(!err){

                object = doc;

            }

        });

        return object;
    }

    public static updateObject(objectInfo: any)
    {
        Object.findOneAndUpdate({_id: objectInfo._id}, {

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

        }, function(err){

            if(err){

                console.log('ERROR: Failed to update object: ' + objectInfo.name);

            }
            else{

                console.log('Object ' + objectInfo.name + ' updated successfully.');

            }

        });
    }

    public static deleteObject(objectInfo: any)
    {
        Object.findByIdAndRemove(objectInfo._id);
    }
}
