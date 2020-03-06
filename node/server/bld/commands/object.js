"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const object_1 = require("../models/object");
var objectId = mongoose.Types.ObjectId();
class ObjectOperations {
    static createObject(objectInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            var object;
            var newObject = new object_1.Object({
                Type: objectInfo.type,
                Name: objectInfo.name,
                Triangles: objectInfo.triangles,
                X: objectInfo.x,
                Y: objectInfo.y,
                Z: objectInfo.z,
                Q_x: objectInfo.q_x,
                Q_y: objectInfo.q_y,
                Q_z: objectInfo.q_z,
                Q_w: objectInfo.q_w,
                S_x: objectInfo.s_x,
                S_y: objectInfo.s_y,
                S_z: objectInfo.s_z,
                Color: objectInfo.color,
                Vertices: objectInfo.vertices,
                Uv: objectInfo.uv,
                Texture: objectInfo.texture,
                TextureHeight: objectInfo.textureHeight,
                TextureWidth: objectInfo.textureWidth,
                TextureFormat: objectInfo.textureFormat,
                MipmapCount: objectInfo.mipmapCount,
                Locked: objectInfo.locked
            });
            var promise = yield newObject.save();
            return promise;
        });
    }
    static findObject(objectInfoId) {
        return __awaiter(this, void 0, void 0, function* () {
            var object = yield object_1.Object.findById(objectInfoId).exec();
            return object;
        });
    }
    static updateObject(objectInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            var promise = yield object_1.Object.findOneAndUpdate({ _id: objectInfo._id }, {
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
            }).exec(function (err) {
                if (err) {
                    console.error(err);
                }
            });
        });
    }
    static deleteObject(objectInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield object_1.Object.findByIdAndRemove(objectInfo._id).exec();
        });
    }
}
exports.ObjectOperations = ObjectOperations;
//# sourceMappingURL=object.js.map