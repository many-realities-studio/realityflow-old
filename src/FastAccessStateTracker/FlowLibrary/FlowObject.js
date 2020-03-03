"use strict";
exports.__esModule = true;
var uuidv4 = require('uuid/v4');
var FlowObject = /** @class */ (function () {
    function FlowObject(json) {
        this.Id = uuidv4;
        this.Type = json.Type;
        this.Name = json.Name;
        this.Triangles = json.Triangles;
        this.X = json.X;
        this.Y = json.Y;
        this.Z = json.Z;
        this.Q_x = json.Q_x;
        this.Q_y = json.Q_y;
        this.Q_z = json.Q_z;
        this.Q_w = json.Q_w;
        this.S_x = json.S_x;
        this.S_y = json.S_y;
        this.S_z = json.S_z;
        this.Uv = json.Uv;
        this.Texture = json.Texture;
        this.TextureHeight = json.TextureHeight;
        this.TextureWidth = json.TextureWidth;
        this.TextureFormat = json.TextureFormat;
        this.MipmapCount = json.MipmapCount;
    }
    /**
     * Converts this instance of a FlowObject into a string.
     */
    FlowObject.prototype.ToString = function () {
        throw new Error("Method not implemented.");
    };
    /**
     * Updates the properties of this object with that of the passed in flowObject
     * @param newObject the object with the properties that should be copied
     */
    FlowObject.prototype.UpdateProperties = function (newObject) {
        this.Type = newObject.Type;
        this.Name = newObject.Name;
        this.Triangles = newObject.Triangles;
        this.X = newObject.X;
        this.Y = newObject.Y;
        this.Z = newObject.Z;
        this.Q_x = newObject.Q_x;
        this.Q_y = newObject.Q_y;
        this.Q_z = newObject.Q_z;
        this.Q_w = newObject.Q_w;
        this.S_x = newObject.S_x;
        this.S_y = newObject.S_y;
        this.S_z = newObject.S_z;
        this.Uv = newObject.Uv;
        this.Texture = newObject.Texture;
        this.TextureHeight = newObject.TextureHeight;
        this.TextureWidth = newObject.TextureWidth;
        this.TextureFormat = newObject.TextureFormat;
        this.MipmapCount = newObject.MipmapCount;
        this.Locked = newObject.Locked;
    };
    return FlowObject;
}());
exports.FlowObject = FlowObject;
