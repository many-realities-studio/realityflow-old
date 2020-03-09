"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandContext_1 = require("./CommandContext");
class NewMessageProcessor {
    static ParseMessage(socketId, json) {
        let response = this._CommandContext.ExecuteCommand(json.MessageType, json, socketId);
        return response;
    }
}
exports.NewMessageProcessor = NewMessageProcessor;
NewMessageProcessor._CommandContext = new CommandContext_1.CommandContext();
//# sourceMappingURL=NewMessageProcessor.js.map