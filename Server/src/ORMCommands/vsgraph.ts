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
            newVSGraph.SerializedNodes =             vsGraphInfo.SerializedNodes;
            newVSGraph.Edges =                       vsGraphInfo.Edges;
            newVSGraph.Groups =                      vsGraphInfo.Groups;
            newVSGraph.StackNodes =                  vsGraphInfo.StackNodes;
            newVSGraph.PinnedElements =              vsGraphInfo.PinnedElements;
            newVSGraph.ExposedParameters =           vsGraphInfo.ExposedParameters;
            newVSGraph.StickyNotes =                 vsGraphInfo.StickyNotes;
            newVSGraph.Position =                    vsGraphInfo.Position;
            newVSGraph.Scale =                       vsGraphInfo.Scale;
            newVSGraph.References =                  vsGraphInfo.References;
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
                SerializedNodes:          vsGraphInfo.SerializedNodes,
                Edges:                    vsGraphInfo.Edges,
                Groups:                   vsGraphInfo.Groups,
                StackNodes:               vsGraphInfo.StackNodes,
                PinnedElements:           vsGraphInfo.PinnedElements,
                ExposedParameters:        vsGraphInfo.ExposedParameters,
                StickyNotes:              vsGraphInfo.StickyNotes,
                Position:                 vsGraphInfo.Position,
                Scale:                    vsGraphInfo.Scale,
                References:               vsGraphInfo.References
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