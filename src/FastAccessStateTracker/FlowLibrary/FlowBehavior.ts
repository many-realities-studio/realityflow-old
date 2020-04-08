import { FlowObject } from "./FlowObject";
import { FlowProject } from "./FlowProject";
import { Action } from "./Action";

export class FlowBehavior 
{
    public TypeOfTrigger: string;
    public Id: string;
    public TriggerObjectId: string;
    public TargetObjectId: string;
    public Action : Action;
    public NextBehavior: Array<string>;
    public ProjectId: string;

    constructor(behavior: any)
    {
        console.log(behavior)
        this.TypeOfTrigger = behavior.TypeOfTrigger;
        this.Id = behavior.Id;
        this.TriggerObjectId = behavior.TriggerObjectId;
        this.TargetObjectId = behavior.TargetObjectId;
        this.Action = new Action(behavior.Action);
        this.NextBehavior = behavior.NextBehavior;
        this.ProjectId = behavior.ProjectId
    }

    public UpdateProperties(newBehavior: FlowBehavior)
    {
        console.log(newBehavior)
        this.TypeOfTrigger = newBehavior.TypeOfTrigger;
        this.Id = newBehavior.Id;
        this.TriggerObjectId = newBehavior.TriggerObjectId;
        this.TargetObjectId = newBehavior.TargetObjectId;
        this.Action = new Action(newBehavior.Action);
        this.NextBehavior = newBehavior.NextBehavior;
        this.ProjectId = newBehavior.ProjectId
    }

}