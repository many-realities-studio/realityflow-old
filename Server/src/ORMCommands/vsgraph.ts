import {getConnection} from 'typeorm'

import { Project } from "../entity/project";
import { DBObject } from "../entity/object";
import { VSGraph } from "../entity/vsgraph";

import {ProjectOperations} from "./project"
export class VSGraphOperations {

    /** create a graph, and associate it with a specific project
     *  @param vsGraphInfo new graph information (which also contains project Id)
     *  @param projectId project to associate it with
    */
    public static async createVSGraph(vsGraphInfo: any, projectId: string)
    {
        
        let project = await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .select("Project")
            .from(Project, "Project")
            .where("Project.Id = :id", {id: projectId})
            .getOne();


        var newVSGraph = new VSGraph();

            newVSGraph.Id =                          vsGraphInfo.Id;
            newVSGraph.Name =                        vsGraphInfo.Name;
            newVSGraph.serializedNodes =             JSON.stringify(vsGraphInfo.serializedNodes);
            newVSGraph.edges =                       JSON.stringify(vsGraphInfo.edges);
            newVSGraph.groups =                      JSON.stringify(vsGraphInfo.groups);
            newVSGraph.stackNodes =                  JSON.stringify(vsGraphInfo.stackNodes);
            newVSGraph.pinnedElements =              JSON.stringify(vsGraphInfo.pinnedElements);
            newVSGraph.exposedParameters =           JSON.stringify(vsGraphInfo.exposedParameters);
            newVSGraph.stickyNotes =                 JSON.stringify(vsGraphInfo.stickyNotes);
            newVSGraph.position =                    JSON.stringify(vsGraphInfo.position);
            newVSGraph.scale =                       JSON.stringify(vsGraphInfo.scale);
            newVSGraph.references =                  JSON.stringify(vsGraphInfo.references);
            newVSGraph.paramIdToObjId =              JSON.stringify(vsGraphInfo.paramIdToObjId);
            newVSGraph.Project =                     project;
            

        await getConnection(process.env.NODE_ENV).manager.save(newVSGraph);
    }

    /**
     * get a graph given its id and its containing project Id 
     * @param vsGraphInfoId 
     * @param projectId 
     */
    public static async findVSGraph(vsGraphInfoId: any, projectId: string)
    {
        var vsGraph = await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .select("VSGraph")
            .from(VSGraph, "VSGraph")
            .where({Id: vsGraphInfoId}).getOne()

        return vsGraph;
        
    }


    /**
     * update a graph given its new information (and Id) and the id of the project that it's in
     * @param vsGraphInfo 
     * @param projectId 
     */
    public static async updateVSGraph(vsGraphInfo: any, projectId: string) : Promise<void>
    {

        await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .update(VSGraph)
            .set({
                serializedNodes:          JSON.stringify(vsGraphInfo.serializedNodes),
                edges:                    JSON.stringify(vsGraphInfo.edges),
                groups:                   JSON.stringify(vsGraphInfo.groups),
                stackNodes:               JSON.stringify(vsGraphInfo.stackNodes),
                pinnedElements:           JSON.stringify(vsGraphInfo.pinnedElements),
                exposedParameters:        JSON.stringify(vsGraphInfo.exposedParameters),
                stickyNotes:              JSON.stringify(vsGraphInfo.stickyNotes),
                position:                 JSON.stringify(vsGraphInfo.position),
                scale:                    JSON.stringify(vsGraphInfo.scale),
                references:               JSON.stringify(vsGraphInfo.references),
                paramIdToObjId:           JSON.stringify(vsGraphInfo.paramIdToObjId)
            })
            .where("Id = :id", {id: vsGraphInfo.Id})
            .execute();

    }

    /**
     * delete an object given its object Id and its project Id
     * @param vsGraphId 
     * @param projectId 
     */
    public static async deleteVSGraph(vsGraphId: string, projectId: string)
    {
        await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .delete()
            .from(VSGraph)
            .where("Id = :id", { id: vsGraphId })
            .execute();
    }
}