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
    public static async deleteBehaviour(BehaviourId: Array<string>){
        let query =  getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .delete()
            .from(Behaviour)
            .where("Id IN (:...id)", {id : BehaviourId})
        console.log(query.getQueryAndParameters()) 
            await query.execute()
    }

    public static async getBehaviours(projectId: string): Promise<Array<Behaviour>>{
        console.log("PROJECTID")
        console.log(projectId)
        let query =  getConnection(process.env.NODE_ENV).createQueryBuilder()
            .select("Behaviour")
            .from(Behaviour, "Behaviour")
            .where("Behaviour.ProjectId = :ProjectId", {ProjectId: projectId})
        console.log(query.getSql())
        return await    query.getMany()
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
            .select("Behaviour")
            .from(Behaviour, "Behaviour")
            .where("Behaviour.Id IN (:...parentList)", {parentList: parents})
            .getMany()
        console.log(list)
        //I hate myself for doing this
        list.map((x, index, arr) => {
            let NextBehaviour: Array<string> = JSON.parse(x.NextBehaviour)
            NextBehaviour.push(child)
            x.NextBehaviour = JSON.stringify(NextBehaviour)
            console.log("HELLO! link behaviour")
            console.log(x)
            return x;
        })
        await getConnection(process.env.NODE_ENV).manager.save(list)
    }
}