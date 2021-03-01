// import {getConnection} from 'typeorm'

// import { Project } from "../entity/project";
// import { DBObject } from "../entity/object";
// import { VSGraph } from "../entity/vsgraph";

// import {ProjectOperations} from "./project"
// export class VSGraphOperations {

//     /** create a graph, and associate it with a specific project
//      *  @param vsGraphInfo new graph information (which also contains project Id)
//      *  @param projectId project to associate it with
//     */
//     public static async createVSGraph(vsGraphInfo: any, projectId: string)
//     {
        
//         let project = await getConnection(process.env.NODE_ENV)
//             .createQueryBuilder()
//             .select("Project")
//             .from(Project, "Project")
//             .where("Project.Id = :id", {id: projectId})
//             .getOne();


//         var newVSGraph = new VSGraph();
            
//             // TODO: Determine all graph properties to replace the below ones, currently copied from object.ts

//             // newVSGraph.Id =             vsGraphInfo.Id;
//             // newVSGraph.Name =           vsGraphInfo.Name;
//             // newVSGraph.X =              vsGraphInfo.X;
//             // newVSGraph.Y =              vsGraphInfo.Y;
//             // newVSGraph.Z =              vsGraphInfo.Z;
//             // newVSGraph.Q_x =            vsGraphInfo.Q_x;
//             // newVSGraph.Q_y =            vsGraphInfo.Q_y;
//             // newVSGraph.Q_z =            vsGraphInfo.Q_z;
//             // newVSGraph.Q_w =            vsGraphInfo.Q_w;
//             // newVSGraph.S_x =            vsGraphInfo.S_x;
//             // newVSGraph.S_y =            vsGraphInfo.S_y;
//             // newVSGraph.S_z =            vsGraphInfo.S_z;
//             // newVSGraph.R =              vsGraphInfo.R;
//             // newVSGraph.G =              vsGraphInfo.G;
//             // newVSGraph.B =              vsGraphInfo.B;
//             // newVSGraph.A =              vsGraphInfo.A;
//             // newVSGraph.Prefab =         vsGraphInfo.Prefab;
//             // newVSGraph.Project =        project;
            

//         await getConnection(process.env.NODE_ENV).manager.save(newVSGraph);
//     }

//     /**
//      * get a graph given its id and its containing project Id 
//      * @param vsGraphInfoId 
//      * @param projectId 
//      */
//     public static async findObject(vsGraphInfoId: any, projectId: string)
//     {
//         var vsGraph = await getConnection(process.env.NODE_ENV)
//             .createQueryBuilder()
//             .select("VSGraph")
//             .from(VSGraph, "VSGraph")
//             .where({Id: vsGraphInfoId}).getOne()

//         return vsGraph;
        
//     }


//     /**
//      * update a project given its new information (and Id) and the id of the project that it's in
//      * @param vsGraphInfo 
//      * @param projectId 
//      */
//     public static async updateVSGraph(vsGraphInfo: any, projectId: string) : Promise<void>
//     {

//         await getConnection(process.env.NODE_ENV)
//             .createQueryBuilder()
//             .update(VSGraph)
//             .set({
//                 // TODO: Set below properties for graphs

//                 // X:          vsGraphInfo.X,
//                 // Y:          vsGraphInfo.Y,
//                 // Z:          vsGraphInfo.Z,
//                 // Q_x:        vsGraphInfo.Q_x,
//                 // Q_y:        vsGraphInfo.Q_y,
//                 // Q_z:        vsGraphInfo.Q_z,
//                 // Q_w:        vsGraphInfo.Q_w,
//                 // S_x:        vsGraphInfo.S_x,
//                 // S_y:        vsGraphInfo.S_y,
//                 // S_z:        vsGraphInfo.S_z,
//                 // R:          vsGraphInfo.R,
//                 // G:          vsGraphInfo.G,
//                 // B:          vsGraphInfo.B,
//                 // A:          vsGraphInfo.A,
//                 // Prefab:     vsGraphInfo.Prefab
//             })
//             .where("Id = :id", {id: vsGraphInfo.Id})
//             .execute();

//     }

//     /**
//      * delete an object given its object Id and its project Id
//      * @param vsGraphId 
//      * @param projectId 
//      */
//     public static async deleteVSGraph(vsGraphId: string, projectId: string)
//     {
//         await getConnection(process.env.NODE_ENV)
//             .createQueryBuilder()
//             .delete()
//             .from(VSGraph)
//             .where("Id = :id", { id: vsGraphId })
//             .execute();
//     }
// }