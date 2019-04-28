"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const object_1 = require("../models/object");
var objectId = mongoose.Types.ObjectId();
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
            color: objectInfo.color,
            vertices: objectInfo.vertices,
            uv: objectInfo.uv,
            texture: objectInfo.texture,
            textureHeight: objectInfo.textureHeight,
            textureWidth: objectInfo.textureWidth,
            textureFormat: objectInfo.textureFormat,
            mipmapCount: objectInfo.mipmapCount,
            locked: objectInfo.locked
        });
        var promise = newObject.save();
        promise.then(function (doc) {
            object = doc;
            return object;
        });
        return promise;
    }
    static findObject(objectInfoId) {
        var object;
        var promise = object_1.Object.findById(objectInfoId).exec();
        promise.then(function (doc) {
            object = doc;
            return object;
        });
        return promise;
    }
    static updateObject(objectInfo) {
        var promise = object_1.Object.findOneAndUpdate({ _id: objectInfo._id }, {
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
            color: objectInfo.color
        }).exec();
        promise.then(function (doc) {
        });
        return promise;
    }
    static deleteObject(objectInfo) {
        object_1.Object.findByIdAndRemove(objectInfo._id).exec();
    }
}
exports.ObjectOperations = ObjectOperations;
