"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FlowBehavior {
    constructor(behavior) {
        console.log(behavior);
        this.Name = behavior.Name;
        this.Id = behavior.Id;
        this.Trigger = behavior.Trigger;
        this.Target = behavior.Target;
        this.ChainOwner = behavior.ChainOwner;
        this.Index = behavior.Index;
    }
    UpdateProperties(newBehavior) {
        this.Name = newBehavior.Name;
        this.Trigger = newBehavior.Trigger;
        this.Target = newBehavior.Target;
        this.Index = newBehavior.Index;
        this.ChainOwner = newBehavior.ChainOwner;
    }
}
exports.FlowBehavior = FlowBehavior;
//# sourceMappingURL=FlowBehavior.js.map