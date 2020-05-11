import { Project } from '../../entity/project'
import { DBObject } from '../../entity/object'
import { ProjectOperations } from '../../ORMCommands/project'
import { ObjectOperations } from '../../ORMCommands/object'
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
           Behaviour
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
    }

    let x =  await ObjectOperations.createObject(object1, returnedProject.Id)
    let y =  await ObjectOperations.createObject(object2, returnedProject.Id)

        let Behaviour1 = new FlowBehaviour({
            Id: "TestBehaviourId",
            Name: 'Name',
            Trigger: "Trigger",
            Target: "Target",
            Index: 1,
            ChainOwner: "Trigger"
        })

        let Behaviour2 = new FlowBehaviour({
            Id: "TestBehaviourId2",
            Name: 'Name',
            Trigger: "Target",
            Target: "Trigger",
            Index: 0,
            ChainOwner: "Trigger"
        })
        
        let check = await BehaviourOperations.CreateBehaviour([Behaviour1, Behaviour2], "Trigger")
        expect(check).toBeTruthy()
        
        let find = await getConnection(process.env.NODE_ENV).createQueryBuilder()
            .select()
            .from(Behaviour, "Behaviour")
            .where("ChainOwner = :owner", {owner: "Trigger"})
            .orderBy("Behaviour.Index", "ASC")
            .execute()

        expect(find).toBeTruthy()
        console.log(find)
    })

    it("can be referenced by its owning object", async () =>{
        let check = await BehaviourOperations.getBehaviour("Trigger");
        expect(check).toBeTruthy()
        expect(check[0].Name).toEqual("Name")
    })

    it("can be deleted", async () => {
        await BehaviourOperations.deleteBehaviour("Trigger")
        let check = await BehaviourOperations.getBehaviour("Trigger");
        expect(check).toBeTruthy()
        expect(check.length).toEqual(0)

    })
  
})