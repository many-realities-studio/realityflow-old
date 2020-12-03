import {getConnection} from 'typeorm'

import { Project } from "../entity/project";
import { DBObject } from "../entity/object";

import {ProjectOperations} from "./project"
export class ObjectOperations {

    /** create an object, and associate it with a specific project
     *  @param objectInfo new object information (which also contains project Id)
     *  @param projectId project to associate it with
    */
    public static async createObject(objectInfo: any, projectId: string)
    {
        
        let project = await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .select("Project")
            .from(Project, "Project")
            .where("Project.Id = :id", {id: projectId})
            .getOne();


        var newObject = new DBObject();
            
            newObject.Id =             objectInfo.Id;
            newObject.Name =           objectInfo.Name;
            newObject.X =              objectInfo.X;
            newObject.Y =              objectInfo.Y;
            newObject.Z =              objectInfo.Z;
            newObject.Q_x =            objectInfo.Q_x;
            newObject.Q_y =            objectInfo.Q_y;
            newObject.Q_z =            objectInfo.Q_z;
            newObject.Q_w =            objectInfo.Q_w;
            newObject.S_x =            objectInfo.S_x;
            newObject.S_y =            objectInfo.S_y;
            newObject.S_z =            objectInfo.S_z;
            newObject.R =              objectInfo.R;
            newObject.G =              objectInfo.G;
            newObject.B =              objectInfo.B;
            newObject.A =              objectInfo.A;
            newObject.Prefab =         objectInfo.Prefab;
            newObject.Project =        project;
            

        await getConnection(process.env.NODE_ENV).manager.save(newObject);
    }

    /**
     * get an object given its id and its containing project Id 
     * @param objectInfoId 
     * @param projectId 
     */
    public static async findObject(objectInfoId: any, projectId: string)
    {
        var object = await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .select("DBObject")
            .from(DBObject, "DBObject")
            .where({Id: objectInfoId}).getOne()

        return object;
        
    }


    /**
     * update a project given its new information (and Id) and the id of the project that it's in
     * @param objectInfo 
     * @param projectId 
     */
    public static async updateObject(objectInfo: any, projectId: string) : Promise<void>
    {

        await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .update(DBObject)
            .set({
                X:          objectInfo.X,
                Y:          objectInfo.Y,
                Z:          objectInfo.Z,
                Q_x:        objectInfo.Q_x,
                Q_y:        objectInfo.Q_y,
                Q_z:        objectInfo.Q_z,
                Q_w:        objectInfo.Q_w,
                S_x:        objectInfo.S_x,
                S_y:        objectInfo.S_y,
                S_z:        objectInfo.S_z,
                R:          objectInfo.R,
                G:          objectInfo.G,
                B:          objectInfo.B,
                A:          objectInfo.A,
                Prefab:     objectInfo.Prefab
            })
            .where("Id = :id", {id: objectInfo.Id})
            .execute();

    }

    /**
     * delete an object given its object Id and its project Id
     * @param objectId 
     * @param projectId 
     */
    public static async deleteObject(objectId: string, projectId: string)
    {
        await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .delete()
            .from(DBObject)
            .where("Id = :id", { id: objectId })
            .execute();
    }
}