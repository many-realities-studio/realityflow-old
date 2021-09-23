"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowAvatar = void 0;
class FlowAvatar {
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
    }
    UpdateProperties(newAvatar) {
        this.Name = newAvatar.Name;
        this.X = newAvatar.X;
        this.Y = newAvatar.Y;
        this.Z = newAvatar.Z;
        this.Q_x = newAvatar.Q_x;
        this.Q_y = newAvatar.Q_y;
        this.Q_z = newAvatar.Q_z;
        this.Q_w = newAvatar.Q_w;
        this.S_x = newAvatar.S_x;
        this.S_y = newAvatar.S_y;
        this.S_z = newAvatar.S_z;
    }
}
exports.FlowAvatar = FlowAvatar;
//# sourceMappingURL=FlowAvatar.js.map