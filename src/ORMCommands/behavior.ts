import {getConnection} from 'typeorm'

import { Project } from "../entity/project";
import { DBObject } from "../entity/object";

import {ProjectOperations} from "./project"
import { FlowBehavior } from '../FastAccessStateTracker/FlowLibrary/FlowBehavior';

export class BehaviorOperations 
{
    /**
     * creates the behavior and associates it with a project
     * @param behaviorInfo new behavior info
     * @param projectId project for association
     */
    public static async createBehavior(behaviorInfo: any, projectId: string)
    {
        // let project = await getConnection(process.env.NODE_ENV)
        // .createQueryBuilder()
        // .select("Project")
        // .from(Project, "Project")
        // .where("Project.Id = :id", {id: projectId})
        // .getOne();

        // var newBehavior = new DBBehavior();
        // newBehavior.Id = behaviorInfo.Id;
        // newBehavior.Name = behaviorInfo.Name;
        // newBehavior.TriggerObjectID = behaviorInfo.TriggerObjectID;
        // newBehavior.TargetObjectID = behaviorInfo.TargetObjectID;
        // newBehavior.BehaviorChain =  behaviorInfo.BehaviorChain;

        // await getConnection(process.env.NODE_ENV).manager.save(newBehavior);
    }
}