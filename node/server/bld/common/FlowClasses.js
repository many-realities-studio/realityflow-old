"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FlowClient {
    constructor(clientJson) {
        this.user = clientJson.user._id;
        this.deviceType = clientJson.deviceType;
    }
}
exports.FlowClient = FlowClient;
class FlowObject {
    constructor(json) {
        this.type = json.type;
        this.name = json.name;
        this.triangles = json.triangles;
        this.x = json.x;
        this.y = json.y;
        this.z = json.z;
        this.q_x = json.q_z;
        this.q_y = json.q_y;
        this.q_z = json.q_z;
        this.q_w = json.q_w;
        this.s_x = json.s_x;
        this.s_y = json.s_y;
        this.s_z = json.s_z;
        this.color = json.color;
        this.vertices = json.vertices;
        this.uv = json.uv;
        this.texture = json.texture;
        this.textureHeight = json.textureHeight;
        this.textureWidth = json.textureWidth;
        this.textureFormat = json.textureFormat;
        this.mipmapCount = json.mipmapCount;
    }
}
exports.FlowObject = FlowObject;
class FlowProject {
    constructor(json) {
        this._id = json._id;
        this.description = json.description;
        this.created = json.description;
        this.projectName = json.projectName;
    }
}
exports.FlowProject = FlowProject;
class FlowUser {
    constructor(json) {
        this.username = json.username;
        this.password = json.password;
    }
}
exports.FlowUser = FlowUser;
//# sourceMappingURL=FlowClasses.js.map