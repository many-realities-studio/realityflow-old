"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
class Action {
    constructor(data) {
        if (!data)
            return null;
        this.ActionId = data.ActionId;
        this.ActionType = data.ActionType;
        this.ActionParameters = data.ActionParameters ? data.ActionParameters : {};
    }
}
exports.Action = Action;
//# sourceMappingURL=Action.js.map