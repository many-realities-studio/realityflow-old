import { FlowObject } from "./FlowObject";
import { FlowProject } from "./FlowProject";
import { Action } from "./Action";

export class FlowBehaviour 
{
    public TypeOfTrigger: string;
    public Id: string;
    public TriggerObjectId: string;
    public TargetObjectId: string;
    public Action : string;
    public NextBehaviour: Array<string>;
    public ProjectId: string;

    constructor(Behaviour: any)
    {
        console.log(Behaviour)
        this.TypeOfTrigger = Behaviour.TypeOfTrigger;
        this.Id = Behaviour.Id;
        this.TriggerObjectId = Behaviour.TriggerObjectId;
        this.TargetObjectId = Behaviour.TargetObjectId;
        this.Action = JSON.stringify(Behaviour.Action);
        this.NextBehaviour = (typeof(Behaviour.NextBehaviour) == "string") ? JSON.parse(Behaviour.NextBehaviour): Behaviour.NextBehaviour;
        this.ProjectId = Behaviour.ProjectId
    }

    public UpdateProperties(newBehaviour: FlowBehaviour)
    {
        console.log(newBehaviour)
        this.TypeOfTrigger = newBehaviour.TypeOfTrigger;
        this.Id = newBehaviour.Id;
        this.TriggerObjectId = newBehaviour.TriggerObjectId;
        this.TargetObjectId = newBehaviour.TargetObjectId;
        this.Action = JSON.stringify(newBehaviour.Action);
        this.NextBehaviour = (typeof(newBehaviour.NextBehaviour) == "string") ? JSON.parse(newBehaviour.NextBehaviour): newBehaviour.NextBehaviour;
        this.ProjectId = newBehaviour.ProjectId
    }

}