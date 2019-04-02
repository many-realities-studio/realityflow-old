"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
const object_1 = require("../models/object");
class ObjectOperations {
    static createObject(objectInfo) {
        var object;
        var newObject = new object_1.Object({
            type: objectInfo.type,
            name: objectInfo.name,
            triangles: objectInfo.triangles,
            x: objectInfo.x,
            y: objectInfo.y,
            z: objectInfo.z,
            q_x: objectInfo.q_x,
            q_y: objectInfo.q_y,
            q_z: objectInfo.q_z,
            q_w: objectInfo.q_w,
            s_x: objectInfo.s_x,
            s_y: objectInfo.s_y,
            s_z: objectInfo.s_z,
            vertices: objectInfo.vertices,
            uv: objectInfo.uv,
            locked: objectInfo.locked
        });
        newObject.save(function (err, doc) {
            if (err) {
                console.log('ERROR: Failed to create object: ' + doc.name);
            }
            else {
                console.log('Object ' + doc.name + ' added successfully.');
                object = doc;
            }
        });
        return object;
    }
    static findObject(objectInfo) {
        var object;
        object_1.Object.findById(objectInfo._id, function (err, doc) {
            if (!err) {
                object = doc;
            }
        });
        return object;
    }
    static updateObject(objectInfo) {
        object_1.Object.findOneAndUpdate({ _id: objectInfo._id }, {
            type: objectInfo.type,
            name: objectInfo.name,
            triangles: objectInfo.triangles,
            x: objectInfo.x,
            y: objectInfo.y,
            z: objectInfo.z,
            q_x: objectInfo.q_x,
            q_y: objectInfo.q_y,
            q_z: objectInfo.q_z,
            q_w: objectInfo.q_w,
            s_x: objectInfo.s_x,
            s_y: objectInfo.s_y,
            s_z: objectInfo.s_z,
            vertices: objectInfo.vertices,
            uv: objectInfo.uv,
            locked: objectInfo.locked
        }, function (err) {
            if (err) {
                console.log('ERROR: Failed to update object: ' + objectInfo.name);
            }
            else {
                console.log('Object ' + objectInfo.name + ' updated successfully.');
            }
        });
    }
    static deleteObject(objectInfo) {
        object_1.Object.findByIdAndRemove(objectInfo._id);
    }
}
exports.ObjectOperations = ObjectOperations;
