import {getConnection} from 'typeorm'

import { Project } from "../entity/project";
import { DBObject } from "../entity/object";
import { Behaviour } from "../entity/behaviour"

import { ObjectOperations } from "./object"
import { FlowBehaviour } from '../FastAccessStateTracker/FlowLibrary/FlowBehaviour';


export class BehaviourOperations 
{
    // TODO: created: yes tested: no
    /**
     * creates the Behaviour and associates it with certain objects
     * @param BehaviourInfo new Behaviour info
     * @param projectId project for association
     */
    public static async CreateBehaviour(BehaviourInfo: any)
    {
        // I hate ORMs
        return await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .insert()
            .into(Behaviour)
            .values(BehaviourInfo)
            .execute();
    }

    // TODO: created: yes tested: no
    public static async deleteBehaviour(BehaviourId: string){
        await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .delete()
            .from(Behaviour)
            .where("Id = :id", {id : BehaviourId})
            .execute()
    }

    public static async getBehaviours(projectId: string): Promise<Array<Behaviour>>{
        return await getConnection(process.env.NODE_ENV).createQueryBuilder()
            .select()
            .from(Behaviour, "Behaviour")
            .where("Project = :owner", {owner: projectId})
            .getMany()
    }

    public static async updateBehaviour(Behaviour: any){
        await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .update(Behaviour)
            .set(Behaviour)
            .where("Id = :id", {id: Behaviour.Id})
            .execute();
    }

    public static async LinkNewToOld(projectId: string, child: string, parents: string[]) {
        let list = await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .select()
            .from(Behaviour, "behavior")
            .orWhereInIds(parents)
            .getMany()

        //I hate myself for doing this
        list.map((x) => {
            return JSON.stringify(JSON.parse(x.NextBehaviour).push(child))
        })
        await getConnection(process.env.NODE_ENV).manager.save(list)
    }
}