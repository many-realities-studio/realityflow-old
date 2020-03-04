import {getConnection} from 'typeorm'

import { Project } from "../entity/project";
import { DBObject } from "../entity/object";

import {ProjectOperations} from "./project"
export class ObjectOperations {

    public static async createObject(objectInfo: any, projectId: string)
    {
        
        let project = await getConnection()
            .createQueryBuilder()
            .select("Project")
            .from(Project, "Project")
            .where("Project.Id = :id", {id: projectId})
            .getOne()


        var newObject = new DBObject();

            newObject.Id =             objectInfo.Id
            newObject.Name =           objectInfo.name;
            newObject.X =              objectInfo.x;
            newObject.Y =              objectInfo.y;
            newObject.Z =              objectInfo.z;
            newObject.Q_x =            objectInfo.q_x;
            newObject.Q_y =            objectInfo.q_y;
            newObject.Q_z =            objectInfo.q_z;
            newObject.Q_w =            objectInfo.q_w;
            newObject.S_x =            objectInfo.s_x;
            newObject.S_y =            objectInfo.s_y;
            newObject.S_z =            objectInfo.s_z;
            newObject.Project =        project;
            

        let promise = await newObject.save();
        return promise;
    }

    public static async findObject(objectInfoId: any, projectId: string)
    {
        var project = ProjectOperations.findProject(projectId)

        var object = await getConnection()
            .createQueryBuilder()
            .select("DBObject")
            .from(DBObject, "DBObject")
            .where({Id: objectInfoId, Project: project}).getOne()

        return object;
        
    }

    public static async updateObject(objectInfo: any) : Promise<void>
    {
        await getConnection()
            .createQueryBuilder()
            .update(DBObject)
            .set({
                X:          objectInfo.x,
                Y:          objectInfo.y,
                Z:          objectInfo.z,
                Q_x:        objectInfo.q_x,
                Q_y:        objectInfo.q_y,
                Q_z:        objectInfo.q_z,
                Q_w:        objectInfo.q_w,
                S_x:        objectInfo.s_x,
                S_y:        objectInfo.s_y,
                S_z:        objectInfo.s_z,
                R:          objectInfo.R,
                G:          objectInfo.G,
                B:          objectInfo.B,
                A:          objectInfo.A
            })
            .where("Id = :id", {id: objectInfo.id})
            .execute();

    }

    public static async deleteObject(objectId: string, projectId: string)
    {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(DBObject)
            .where("Id = :id", { id: objectId })
            .andWhere("projectId = :pId", {pId: projectId})
            .execute();
    }
}