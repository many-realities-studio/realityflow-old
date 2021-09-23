"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBuilder = void 0;
class MessageBuilder {
    static CreateMessage(payload, clients) {
        let returnPayload = JSON.stringify(payload);
        return [returnPayload, clients];
    }
}
exports.MessageBuilder = MessageBuilder;
//# sourceMappingURL=MessageBuilder.js.map