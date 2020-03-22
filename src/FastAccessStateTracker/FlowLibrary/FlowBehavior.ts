import { FlowObject } from "./FlowObject";
import { FlowProject } from "./FlowProject";

export class FlowBehavior 
{
    public Name: string;
    public Id: string;
    public Trigger: string;
    public Target: string;
    public Index : number;
    public ChainOwner: string;
    constructor(behavior: any)
    {
        console.log(behavior)
        this.Name = behavior.Name;
        this.Id = behavior.Id;
        this.Trigger = behavior.Trigger;
        this.Target = behavior.Target;
        this.ChainOwner = behavior.ChainOwner;
        this.Index = behavior.Index;
    }

    public UpdateProperties(newBehavior: FlowBehavior)
    {
        this.Name = newBehavior.Name;
        this.Trigger = newBehavior.Trigger;
        this.Target = newBehavior.Target;
        this.Index = newBehavior.Index;
        this.ChainOwner = newBehavior.ChainOwner;
    }

}