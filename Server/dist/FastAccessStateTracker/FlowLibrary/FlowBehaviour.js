"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowBehaviour = void 0;
class FlowBehaviour {
    constructor(Behaviour) {
        console.log(Behaviour);
        this.TypeOfTrigger = Behaviour.TypeOfTrigger;
        this.Id = Behaviour.Id;
        this.TriggerObjectId = Behaviour.TriggerObjectId;
        this.TargetObjectId = Behaviour.TargetObjectId;
        this.Action = Behaviour.Action;
        this.NextBehaviour = Behaviour.NextBehaviour;
        this.ProjectId = Behaviour.ProjectId;
    }
    UpdateProperties(newBehaviour) {
        console.log(newBehaviour);
        this.TypeOfTrigger = newBehaviour.TypeOfTrigger;
        this.Id = newBehaviour.Id;
        this.TriggerObjectId = newBehaviour.TriggerObjectId;
        this.TargetObjectId = newBehaviour.TargetObjectId;
        this.Action = newBehaviour.Action;
        this.NextBehaviour = newBehaviour.NextBehaviour;
        this.ProjectId = newBehaviour.ProjectId;
    }
}
exports.FlowBehaviour = FlowBehaviour;
//# sourceMappingURL=FlowBehaviour.js.map