import { Project } from '../../entity/project'
import { DBObject } from '../../entity/object'
import { VSGraph } from '../../entity/vsgraph'
import { ProjectOperations } from '../../ORMCommands/project'
import { ObjectOperations } from '../../ORMCommands/object'
import { VSGraphOperations } from '../../ORMCommands/vsgraph'
import { Behaviour } from '../../entity/behaviour'
import { User } from '../../entity/user'
import { UserSubscriber } from '../../subscriber/UserSubscriber'
import { createConnection, getConnection } from 'typeorm'
import { FlowBehaviour } from '../FlowLibrary/FlowBehaviour'
import { BehaviourOperations } from '../../ORMCommands/behaviour'
import { ObjectId } from 'mongodb'

beforeAll( async () => {
    await createConnection({
        "name": "test",
        "type": "sqlite",
        "database": "../database/test.db", 
        "synchronize": true,
        "logging": true,
        "dropSchema": true,
        "entities": [
           DBObject,
           User,
           Project,
           Behaviour,
           VSGraph
        ],
        subscribers: [
            UserSubscriber
        ]
    });
    process.env.NODE_ENV = "test"
})

// this is not a unit test - I am explicitly making sure that the ORM is doing what I want it to do -
// therefore I'm not going to bother with trying to disentangle the different tests

describe("entity", () => {

  

    it("can be created", async () => {

        let conn = getConnection(process.env.NODE_ENV);
    let createdProject = new Project();
    createdProject.Id = "createObjectProjectId";
    createdProject.ProjectName = "createdProjectName"
    createdProject.Description = "createdProjectDescription"
    createdProject.DateModified = Date.now()
    createdProject.ObjectList = []
    createdProject.VSGraphList = []

    let returnedProject = await conn.manager.save(createdProject)

    var object1 = {
        Id:             "trigger",
        Name:           "object1",
        X:              3,
        Y:              1,
        Z:              1,
        Q_x:            1,
        Q_y:            1,
        Q_z:            1,
        Q_w:            1,
        S_x:            1,
        S_y:            1,
        S_z:            1,
        R:              1,
        G:              1,
        B:              1,
        A:              1,
        Prefab:         "prefab1"
    }

    var object2 = {
        Id:             "Target",
        Name:           "object1",
        X:              3,
        Y:              1,
        Z:              1,
        Q_x:            1,
        Q_y:            1,
        Q_z:            1,
        Q_w:            1,
        S_x:            1,
        S_y:            1,
        S_z:            1,
        R:              1,
        G:              1,
        B:              1,
        A:              1,
        Prefab:         "prefab2"
    }

    let x =  await ObjectOperations.createObject(object1, returnedProject.Id)
    let y =  await ObjectOperations.createObject(object2, returnedProject.Id)

    let nextBehaviour1 = new Array<string>()
    let nextBehaviour2 = new Array<string>()

    nextBehaviour1.push("Behaviour")
    nextBehaviour2.push("Behaviour2")

        // Was unable to finish fixing this outdated test from last team, TODO:
        // bring up to date with current behaviour system.
        let Behaviour1 = new FlowBehaviour({
            Id: "TestBehaviourId",
            TriggerObjectId: "Trigger",
            TargetObjectId: "Target",
            TypeOfTrigger: "Type",
            Action: "Action",
            NextBehaviour: nextBehaviour1,
            ProjectId: "ProjectId"
        })

        let Behaviour2 = new FlowBehaviour({
            Id: "TestBehaviourId2",
            TriggerObjectId: "Target",
            TargetObjectId: "Trigger",
            TypeOfTrigger: "Type",
            Action: "Action",
            NextBehaviour: nextBehaviour2,
            ProjectId: "ProjectId"
        })
        
        let check = await BehaviourOperations.CreateBehaviour([Behaviour1, Behaviour2])
        expect(check).toBeTruthy()
        
        let find = await getConnection(process.env.NODE_ENV).createQueryBuilder()
            .select("Behaviour")
            .from(Behaviour, "Behaviour")
            .where("ChainOwner = :owner", {owner: "Trigger"})
            .orderBy("Behaviour.Index", "ASC")
            .execute()

        expect(find).toBeTruthy()
        console.log(find)
    })

    it("can be referenced by its owning object", async () =>{
        let check = await BehaviourOperations.getBehaviours("Trigger");
        expect(check).toBeTruthy()
        expect(check[0].Id).toEqual("TestBehaviourId2")
    })

    it("can be deleted", async () => {
        await BehaviourOperations.deleteBehaviour(["Trigger"])
        let check = await BehaviourOperations.getBehaviours("createObjectProjectId");
        expect(check).toBeTruthy()
        expect(check.length).toEqual(0)

    })
  
})