"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FlowObject {
    constructor(json) {
        this.Id = json.Id;
        this.Name = json.Name;
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
        this.R = json.R;
        this.G = json.G;
        this.B = json.B;
        this.A = json.A;
        this.CurrentCheckout = null;
    }
    UpdateProperties(newObject) {
        this.Name = newObject.Name;
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
    }
}
exports.FlowObject = FlowObject;
//# sourceMappingURL=FlowObject.js.map