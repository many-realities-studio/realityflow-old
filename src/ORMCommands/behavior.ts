import {getConnection} from 'typeorm'

import { Project } from "../entity/project";
import { DBObject } from "../entity/object";
import { Behavior } from "../entity/behavior"

import { ObjectOperations } from "../ORMCommands/object"
import { FlowBehavior } from '../FastAccessStateTracker/FlowLibrary/FlowBehavior';


export class BehaviorOperations 
{
    public static async LinkNewToOld(projectId: string, child: string, parents: string[]) {
        let list = await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .select()
            .from(Behavior, "behavior")
            .orWhereInIds(parents)
            .getMany()

        //I hate myself for doing this
        list.map((x) => {
            return JSON.stringify(JSON.parse(x.NextBehavior).push(child))
        })
        await getConnection(process.env.NODE_ENV).manager.save(list)
    }
    // TODO: created: yes tested: no
    /**
     * creates the behavior and associates it with certain objects
     * @param behaviorInfo new behavior info
     * @param projectId project for association
     */
    public static async CreateBehavior(behaviorInfo: any)
    {
        // I hate ORMs
        return await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .insert()
            .into(Behavior)
            .values(behaviorInfo)
            .execute();
    }

    // TODO: created: yes tested: no
    public static async deleteBehavior(behaviorId: string){
        await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .delete()
            .from(Behavior)
            .where("Id = :id", {id : behaviorId})
            .execute()
    }

    public static async getBehaviors(projectId: string): Promise<Array<Behavior>>{
        return await getConnection(process.env.NODE_ENV).createQueryBuilder()
            .select()
            .from(Behavior, "behavior")
            .where("Project = :owner", {owner: projectId})
            .getMany()
    }

    public static async updateBehavior(behavior: any){
        await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .update(Behavior)
            .set(behavior)
            .where("Id = :id", {id: behavior.Id})
            .execute();
    }
}