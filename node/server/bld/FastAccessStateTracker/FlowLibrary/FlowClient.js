"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FlowClient {
    constructor(clientJson) {
        this.Id = clientJson.Id;
        this.UserId = clientJson.user.Id;
        this.DeviceType = clientJson.DeviceType;
    }
}
exports.FlowClient = FlowClient;
//# sourceMappingURL=FlowClient.js.map