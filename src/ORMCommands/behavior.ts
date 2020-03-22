import {getConnection} from 'typeorm'

import { Project } from "../entity/project";
import { DBObject } from "../entity/object";
import { Behavior } from "../entity/behavior"

import { ObjectOperations } from "../ORMCommands/object"
import { FlowBehavior } from '../FastAccessStateTracker/FlowLibrary/FlowBehavior';


export class BehaviorOperations 
{
    // TODO: created: yes tested: no
    /**
     * creates the behavior and associates it with certain objects
     * @param behaviorInfo new behavior info
     * @param projectId project for association
     */
    public static async CreateBehavior(behaviorInfo: Array<FlowBehavior>, ChainOwner:string)
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
    public static async deleteBehavior(objectId: string){
        await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .delete()
            .from(Behavior)
            .where("ChainOwner = :id", {id : objectId})
            .execute()
    }

    public static async getBehavior(objectId: string): Promise<Array<Behavior>>{
        return  await getConnection(process.env.NODE_ENV).createQueryBuilder()
            .select()
            .from(Behavior, "behavior")
            .where("ChainOwner = :owner", {owner: "Trigger"})
            .orderBy("behavior.Index", "ASC")
            .execute()

    }


}