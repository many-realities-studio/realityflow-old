import { FlowObject } from "./FlowObject";
import { FlowProject } from "./FlowProject";

export class FlowBehavior 
{
    public Name: string;
    public Id: string;
    public TriggerObjectID: string;
    public TargetObjectID: string;
    public BehaviorChain: FlowBehavior;

    constructor(behavior: any)
    {
        this.Name = behavior.Name;
        this.Id = behavior.Id;
        this.TriggerObjectID = behavior.TriggerObjectID;
        this.TargetObjectID = behavior.TargetObjectID;
        this.BehaviorChain = new FlowBehavior(behavior.BehaviorChain);
    }

    public UpdateProperties(newBehavior: FlowBehavior)
    {
        this.Name = newBehavior.Name;
        this.TriggerObjectID = newBehavior.TriggerObjectID;
        this.TargetObjectID = newBehavior.TargetObjectID;
        this.BehaviorChain = newBehavior.BehaviorChain;
    }

}