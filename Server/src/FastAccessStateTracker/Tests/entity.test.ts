import { createConnection, getConnection } from 'typeorm'

import { User } from '../../entity/user'
import { Project } from '../../entity/project'
import { DBObject } from '../../entity/object'
import { VSGraph } from '../../entity/vsgraph'
import { UserSubscriber } from "../../subscriber/UserSubscriber"
import * as bcrypt from 'bcrypt'
import { Behaviour } from '../../entity/behaviour'

beforeAll( async () => {
    await createConnection(    {
        "name": "test",
        "type": "sqlite",
        "database": "../database/test.db", 
        "synchronize": true,
        "logging": false,
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
})

// note: these aren't unit tests- I explicitly want to test that 
// stuff will do what I want it to with respect to the database

describe("connection", ()=>{
    it("works", async () =>{
        let conn = await getConnection("test")
        expect(conn).toBeTruthy()
    })
})

describe('User', () => {
    it('Can be created', async () => {
        // arrange
        let newUser = new User();
        newUser.Username = 'CanBeCreated'
        newUser.Password = 'Password'
        newUser.Projects = []
        // act
        let returnedUser = await getConnection("test").manager.save(newUser)

        // assert
        expect(returnedUser).toBeTruthy()
        expect(bcrypt.compareSync('Password', returnedUser.Password)).toEqual(true)
    })

    it('can be found', async () => {
        // arrange
        let conn = await getConnection("test")

        let newUser = new User();
        newUser.Username = 'CanBeFound'
        newUser.Password = 'Password'
        newUser.Projects = []

        let returnedUser = await conn.manager.save(newUser)
        expect(returnedUser).toBeTruthy()
        expect(bcrypt.compareSync('Password', returnedUser.Password)).toEqual(true)

        // act
        let check = await conn.createQueryBuilder().
            select("user").
            from(User, "user").
            where("user.Username = :username", {username: 'CanBeFound'}).
            getOne()
        
        // assert
        expect(check).toBeTruthy()
        expect(bcrypt.compareSync('Password', check.Password)).toEqual(true)
    })

    it('Can be deleted', async () => {
        // arrange
        let conn = await getConnection("test")

        let newUser = new User();
        newUser.Username = 'CanBeDeleted'
        newUser.Password = 'Password'
        newUser.Projects = []

        let returnedUser = await conn.manager.save(newUser)
        expect(returnedUser).toBeTruthy()
        expect(bcrypt.compareSync('Password', returnedUser.Password)).toEqual(true)
        
        // act
        await conn.manager.remove(returnedUser)
        
        // assert
        let check = await conn.createQueryBuilder().
            select("user").
            from(User, "user").
            where("user.Username = :username", {username: 'CanBeDeleted'}).
            getOne()
        expect(check).toBeFalsy()

    })

    

    it('can be updated', async () => {
        // arrange
        let conn = await getConnection("test");

        let newUser = new User();
        newUser.Username = 'CanBeUpdated';
        newUser.Password = 'Password';
        newUser.Projects = [];

        let returnedUser = await conn.manager.save(newUser);
        expect(returnedUser).toBeTruthy();
        expect(bcrypt.compareSync('Password', returnedUser.Password)).toEqual(true);
        
        // act
        await conn.createQueryBuilder().
            update(User).
            set({Password: "newPassword"}).
            where("Username = :Username", {Username: "CanBeUpdated"}).
            execute();

        // assert
        let check = await conn.createQueryBuilder().
            select("user").
            from(User, "user").
            where("user.Username = :username", {username: 'CanBeUpdated'}).
            getOne();

        expect(check).toBeTruthy();
        expect(bcrypt.compareSync('Password', check.Password)).toEqual(false)
        expect(bcrypt.compareSync('newPassword', check.Password)).toEqual(true)
    })

    it('can be authenticated', async () => {
        // This has basically already been checked
    })
})

describe('Project', () => {
    it("Can be created", async () => {
        // arrange
        let conn = getConnection("test");

        let createdProject = new Project();
        createdProject.Id = "createdProjectId";
        createdProject.ProjectName = "createdProjectName"
        createdProject.Description = "createdProjectDescription"
        createdProject.DateModified = Date.now()
        createdProject.ObjectList = []
        createdProject.VSGraphList = []
        // act
        let returnedProject = await conn.manager.save(createdProject)
        // assert
        expect(returnedProject.Id).toEqual("createdProjectId")
        expect(returnedProject.ProjectName).toEqual("createdProjectName")
    })

    it("can be found", async () => {
        // arrange
        let conn = getConnection("test");

        let foundProject = new Project();
        foundProject.Id = "foundProjectId";
        foundProject.ProjectName = "foundProjectName"
        foundProject.Description = "foundProjectDescription"
        foundProject.DateModified = Date.now()
        foundProject.ObjectList = []
        foundProject.VSGraphList = []

        let returnedProject = await conn.manager.save(foundProject)
        // act
        let check = await conn.createQueryBuilder().
            select("project").
            from(Project, "project").
            where("Id = :id", {id: "foundProjectId"}).
            getOne();
        // assert
        expect(check.Id).toEqual("foundProjectId")
        expect(check.ProjectName).toEqual("foundProjectName")
    })

    it("can be updated", async () =>{
        // arrange
        let conn = getConnection("test");

        let updateProject = new Project();
        updateProject.Id = "updateProjectId";
        updateProject.ProjectName = "updateProjectName"
        updateProject.Description = "updateProjectDescription"
        updateProject.DateModified = Date.now()
        updateProject.ObjectList = []
        updateProject.VSGraphList = []
        
        let returnedProject = await conn.manager.save(updateProject)
        
        // act 
        let check = await conn.createQueryBuilder().
            select("project").
            from(Project, "project").
            where("Id = :id", {id: "updateProjectId"}).
            getOne();
        
        // assert
        expect(check.Id).toEqual("updateProjectId")
        expect(check.ProjectName).toEqual("updateProjectName")

        // act
        await conn.createQueryBuilder().
            update(Project).
            set({ProjectName: "newName"}).
            where("Id = :id", {id: "updateProjectId"}).
            execute()
        
        // assert
        let check_new = await conn.createQueryBuilder().
            select("project").
            from(Project, "project").
            where("Id = :id", {id: "updateProjectId"}).
            getOne();

        expect(check_new.ProjectName).toEqual("newName")
        
    })

    it("can be deleted", async ()=>{
        // arrange
        let conn = getConnection("test");

        let deletedProject = new Project();
        deletedProject.Id = "deletedProjectId";
        deletedProject.ProjectName = "deletedProjectName"
        deletedProject.Description = "deletedProjectDescription"
        deletedProject.DateModified = Date.now()
        deletedProject.ObjectList = []
        deletedProject.VSGraphList = []

        let returnedProject = await conn.manager.save(deletedProject)
        
        // act
        let check = await conn.createQueryBuilder().
            select("project").
            from(Project, "project").
            where("Id = :id", {id: "deletedProjectId"}).
            getOne();
        
        // assert
        expect(check.Id).toEqual("deletedProjectId")
        expect(check.ProjectName).toEqual("deletedProjectName")
        
        // act
        await conn.manager.remove(returnedProject)
        let check_again = await conn.createQueryBuilder().
            select("project").
            from(Project, "project").
            where("Id = :id", {id: "deletedProjectId"}).
            getOne();
        
        // assert
        expect(check_again).toBeFalsy()
    })

    it("Can be owned by a user and is deleted when the user is deleted", async () => {
        
        // arrange
        let conn = getConnection("test")

        let newUser = new User();
        newUser.Username = 'CanBeOwner'
        newUser.Password = 'Password'
        newUser.Projects = []
        // act
        let returnedUser = await conn.manager.save(newUser);
        // assert
        expect(returnedUser).toBeTruthy()
        expect(bcrypt.compareSync('Password', returnedUser.Password)).toEqual(true)
        // arrange
        let createdProject = new Project();
        createdProject.Id = "ownedProjectId";
        createdProject.ProjectName = "ownedProjectName"
        createdProject.Description = "ownedProjectDescription"
        createdProject.DateModified = Date.now()
        createdProject.ObjectList = []
        createdProject.VSGraphList = []
        createdProject.Owner = newUser
        
        // act
        let returnedProject = await conn.manager.save(createdProject)
        
        // assert
        let check = await conn.createQueryBuilder().select("project").from(Project, "project").where("Id = :id", {id: "ownedProjectId"}).getRawOne()
        expect(check.project_ownerUsername).toEqual(newUser.Username)
        
        // act 
        await conn.createQueryBuilder().delete().from(User).where("Username = :id", {id: 'CanBeOwner'}).execute()
        
        // assert
        let checkUser = await conn.createQueryBuilder().select().from(User, "user").where("Username = :id", {id: 'CanBeOwner'}).getOne()
        expect(checkUser).toBeFalsy()
        let check_again = await conn.createQueryBuilder().select("project").from(Project, "project").where("Id = :id", {id: "ownedProjectId"}).getOne()
        expect(check_again).toBeFalsy()

    })


})

describe ('Object', () => {
    it("can be created", async () => {
        // Arrange
        let conn = getConnection("test")

        let newObject = new DBObject();
        newObject.Id = "newObjectId"
        newObject.Name = "newObjectName"
        newObject.X = 1;
        newObject.Y = 1;
        newObject.Z = 1;
        newObject.Q_w = 1;
        newObject.Q_x = 1;
        newObject.Q_y = 1;
        newObject.Q_z = 1;
        newObject.S_x = 1;
        newObject.S_y = 1;
        newObject.S_z = 1;
        newObject.R = 1;
        newObject.G = 1;
        newObject.B = 1;
        newObject.A = 1;
        newObject.Prefab = "prefab";
        // act
        let returnedObject = await conn.manager.save(newObject)
        // assert
        expect(returnedObject.Id).toEqual("newObjectId")
        expect(returnedObject.Name).toEqual("newObjectName")

    })

    it("can be found", async () => {
        // arrange/act
        let conn = getConnection("test")

        let foundObject = new DBObject();
        foundObject.Id = "foundObjectId"
        foundObject.Name = "foundObjectName"
        foundObject.X = 1;
        foundObject.Y = 1;
        foundObject.Z = 1;
        foundObject.Q_w = 1;
        foundObject.Q_x = 1;
        foundObject.Q_y = 1;
        foundObject.Q_z = 1;
        foundObject.S_x = 1;
        foundObject.S_y = 1;
        foundObject.S_z = 1;
        foundObject.R = 1;
        foundObject.G = 1;
        foundObject.B = 1;
        foundObject.A = 1;
        foundObject.Prefab = "prefab";
        let returnedObject = await conn.manager.save(foundObject)
        // assert 
        expect(returnedObject.Id).toEqual("foundObjectId")
        expect(returnedObject.Name).toEqual("foundObjectName")

        let check = await conn.createQueryBuilder().select("object").from(DBObject, "object").where("object.Id = :id", {id: "foundObjectId"}).getOne();
        expect(check.Name).toEqual("foundObjectName");
    })

    it("can be updated", async () => {
        // arrange
        let conn = getConnection("test")

        let updatedObject = new DBObject();
        updatedObject.Id = "updatedObjectId"
        updatedObject.Name = "updatedObjectName"
        updatedObject.X = 1;
        updatedObject.Y = 1;
        updatedObject.Z = 1;
        updatedObject.Q_w = 1;
        updatedObject.Q_x = 1;
        updatedObject.Q_y = 1;
        updatedObject.Q_z = 1;
        updatedObject.S_x = 1;
        updatedObject.S_y = 1;
        updatedObject.S_z = 1;
        updatedObject.R = 1;
        updatedObject.G = 1;
        updatedObject.B = 1;
        updatedObject.A = 1;
        updatedObject.Prefab = "prefab";
        
        let returnedObject = await conn.manager.save(updatedObject)

        expect(returnedObject.Id).toEqual("updatedObjectId")
        expect(returnedObject.Name).toEqual("updatedObjectName")

        let check = await conn.createQueryBuilder().select("object").from(DBObject, "object").where("object.Id = :id", {id: "updatedObjectId"}).getOne();
        expect(check.Name).toEqual("updatedObjectName");
        // act
        await conn.createQueryBuilder().update(DBObject).set({Name: "newName"}).where("Id = :id", {id: "updatedObjectId"}).execute()
        // assert
        let check_Updated = await conn.createQueryBuilder().select("object").from(DBObject, "object").where("object.Id = :id", {id: "updatedObjectId"}).getOne();
        expect(check_Updated.Name).toEqual("newName");

    })

    it("can be deleted", async () => {
        // arrange
        let conn = getConnection("test")

        let deletedObject = new DBObject();
        deletedObject.Id = "deletedObjectId"
        deletedObject.Name = "deletedObjectName"
        deletedObject.X = 1;
        deletedObject.Y = 1;
        deletedObject.Z = 1;
        deletedObject.Q_w = 1;
        deletedObject.Q_x = 1;
        deletedObject.Q_y = 1;
        deletedObject.Q_z = 1;
        deletedObject.S_x = 1;
        deletedObject.S_y = 1;
        deletedObject.S_z = 1;
        deletedObject.R = 1;
        deletedObject.G = 1;
        deletedObject.B = 1;
        deletedObject.A = 1;
        deletedObject.Prefab = "prefab";

        let returnedObject = await conn.manager.save(deletedObject)

        expect(returnedObject.Id).toEqual("deletedObjectId")
        expect(returnedObject.Name).toEqual("deletedObjectName")

        let check = await conn.createQueryBuilder().select("object").from(DBObject, "object").where("object.Id = :id", {id: "deletedObjectId"}).getOne();
        expect(check.Name).toEqual("deletedObjectName");
        // act
        let result = await conn
            .createQueryBuilder()
            .delete()
            .from(DBObject)
            .where("Id = :id", {id: "deletedObjectId"})
            .execute()

        // assert
        let check_deleted = await conn.createQueryBuilder().select("object").from(DBObject, "object").where("object.Id = :id", {id: "deletedObjectId"}).getOne();
        expect(check_deleted).toBeFalsy();

    })

    it("can be owned by a project", () => {
        // throw new Error("not yet implemented")
    })


})

describe ('VSGraph', () => {
    it("can be created", async () => {
        // Arrange
        let conn = getConnection("test")

        let newVSGraph = new VSGraph();
        newVSGraph.Id = "newVSGraphId"
        newVSGraph.Name = "newVSGraphName"
        newVSGraph.serializedNodes = "[]";
        newVSGraph.edges = "[]";
        newVSGraph.groups = "[]";
        newVSGraph.stackNodes = "[]";
        newVSGraph.pinnedElements = "[]";
        newVSGraph.exposedParameters = "[]";
        newVSGraph.stickyNotes = "[]";
        newVSGraph.position = "{\"x\":0,\"y\":0,\"z\":0}";
        newVSGraph.scale = "{\"x\":1,\"y\":1,\"z\":1}";
        newVSGraph.references = "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}";
        newVSGraph.paramIdToObjId = "{\"keys\":[],\"values\":[]}";

        // act
        let returnedVSGraph = await conn.manager.save(newVSGraph)
        // assert
        expect(returnedVSGraph.Id).toEqual("newVSGraphId")
        expect(returnedVSGraph.Name).toEqual("newVSGraphName")

    })

    it("can be found", async () => {
        // arrange/act
        let conn = getConnection("test")

        let foundVSGraph = new VSGraph();
        foundVSGraph.Id = "foundVSGraphId"
        foundVSGraph.Name = "foundVSGraphName"
        foundVSGraph.serializedNodes = "[]";
        foundVSGraph.edges = "[]";
        foundVSGraph.groups = "[]";
        foundVSGraph.stackNodes = "[]";
        foundVSGraph.pinnedElements = "[]";
        foundVSGraph.exposedParameters = "[]";
        foundVSGraph.stickyNotes = "[]";
        foundVSGraph.position = "{\"x\":0,\"y\":0,\"z\":0}";
        foundVSGraph.scale = "{\"x\":1,\"y\":1,\"z\":1}";
        foundVSGraph.references = "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}";
        foundVSGraph.paramIdToObjId = "{\"keys\":[],\"values\":[]}";
        
        let returnedVSGraph = await conn.manager.save(foundVSGraph)
        // assert 
        expect(returnedVSGraph.Id).toEqual("foundVSGraphId")
        expect(returnedVSGraph.Name).toEqual("foundVSGraphName")

        let check = await conn.createQueryBuilder().select("vsgraph").from(VSGraph, "vsgraph").where("vsgraph.Id = :id", {id: "foundVSGraphId"}).getOne();
        expect(check.Name).toEqual("foundVSGraphName");
    })

    it("can be updated", async () => {
        // arrange
        let conn = getConnection("test")

        let updatedVSGraph = new VSGraph();
        updatedVSGraph.Id = "updatedVSGraphId"
        updatedVSGraph.Name = "updatedVSGraphName"
        updatedVSGraph.serializedNodes = "[]";
        updatedVSGraph.edges = "[]";
        updatedVSGraph.groups = "[]";
        updatedVSGraph.stackNodes = "[]";
        updatedVSGraph.pinnedElements = "[]";
        updatedVSGraph.exposedParameters = "[]";
        updatedVSGraph.stickyNotes = "[]";
        updatedVSGraph.position = "{\"x\":0,\"y\":0,\"z\":0}";
        updatedVSGraph.scale = "{\"x\":1,\"y\":1,\"z\":1}";
        updatedVSGraph.references = "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}";
        updatedVSGraph.paramIdToObjId = "{\"keys\":[],\"values\":[]}";
        
        let returnedVSGraph = await conn.manager.save(updatedVSGraph)

        expect(returnedVSGraph.Id).toEqual("updatedVSGraphId")
        expect(returnedVSGraph.Name).toEqual("updatedVSGraphName")

        let check = await conn.createQueryBuilder().select("vsgraph").from(VSGraph, "vsgraph").where("vsgraph.Id = :id", {id: "updatedVSGraphId"}).getOne();
        expect(check.Name).toEqual("updatedVSGraphName");
        // act
        await conn.createQueryBuilder().update(VSGraph).set({Name: "newName"}).where("Id = :id", {id: "updatedVSGraphId"}).execute()
        // assert
        let check_Updated = await conn.createQueryBuilder().select("vsgraph").from(VSGraph, "vsgraph").where("vsgraph.Id = :id", {id: "updatedVSGraphId"}).getOne();
        expect(check_Updated.Name).toEqual("newName");

    })

    it("can be deleted", async () => {
        // arrange
        let conn = getConnection("test")

        let deletedVSGraph = new VSGraph();
        deletedVSGraph.Id = "deletedVSGraphId"
        deletedVSGraph.Name = "deletedVSGraphName"
        deletedVSGraph.serializedNodes = "[]";
        deletedVSGraph.edges = "[]";
        deletedVSGraph.groups = "[]";
        deletedVSGraph.stackNodes = "[]";
        deletedVSGraph.pinnedElements = "[]";
        deletedVSGraph.exposedParameters = "[]";
        deletedVSGraph.stickyNotes = "[]";
        deletedVSGraph.position = "{\"x\":0,\"y\":0,\"z\":0}";
        deletedVSGraph.scale = "{\"x\":1,\"y\":1,\"z\":1}";
        deletedVSGraph.references = "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}";
        deletedVSGraph.paramIdToObjId = "{\"keys\":[],\"values\":[]}";

        let returnedVSGraph = await conn.manager.save(deletedVSGraph)

        expect(returnedVSGraph.Id).toEqual("deletedVSGraphId")
        expect(returnedVSGraph.Name).toEqual("deletedVSGraphName")

        let check = await conn.createQueryBuilder().select("vsgraph").from(VSGraph, "vsgraph").where("vsgraph.Id = :id", {id: "deletedVSGraphId"}).getOne();
        expect(check.Name).toEqual("deletedVSGraphName");
        // act
        let result = await conn
            .createQueryBuilder()
            .delete()
            .from(VSGraph)
            .where("Id = :id", {id: "deletedVSGraphId"})
            .execute()

        // assert
        let check_deleted = await conn.createQueryBuilder().select("vsgraph").from(VSGraph, "vsgraph").where("vsgraph.Id = :id", {id: "deletedVSGraphId"}).getOne();
        expect(check_deleted).toBeFalsy();

    })
})

// TODO: has not been run yet
// describe ('Behaviour', () =>{
    
//     it("can be created", async () =>{
//         let conn = getConnection("test")

//         let behaviour = new Behaviour()
//         behaviour.Id = "BehaviourId"
//         behaviour.Name = "BehaviourName"
//         behaviour.Trigger = "Trigger"
//         behaviour.Target = "target"
//         behaviour.ChainOwner = "chainOwner"
//         behaviour.Index = 0

//         await conn.manager.save(Behaviour)

//         let check = await conn.manager.createQueryBuilder()
//             .select("Behaviour")
//             .from(Behaviour, "Behaviour")
//             .where("Id = :id", {id: Behaviour.Id})
//             .getOne();

//         expect(check.Id).toEqual(Behaviour.Id)
//     })

//     it("can be deleted", async () => {

//         let conn = getConnection("test")

//         let Behaviour = new Behaviour()
//         Behaviour.Id = "deleteBehaviourId"
//         Behaviour.Name = "BehaviourName"
//         Behaviour.Trigger = "Trigger"
//         Behaviour.Target = "target"
//         Behaviour.ChainOwner = "chainOwner"
//         Behaviour.Index = 0

//         await conn.manager.save(Behaviour)

//         let check = await conn.manager.createQueryBuilder()
//             .select("Behaviour")
//             .from(Behaviour, "Behaviour")
//             .where("Behaviour.Id = :id", {id: Behaviour.Id})
//             .getOne();

//         expect(check.Id).toEqual(Behaviour.Id)

//         await conn.manager.createQueryBuilder()
//             .delete()
//             .from(Behaviour)
//             .where("Id = :id", {id: Behaviour.Id})
//             .execute()
        
//         let deleteCheck = await conn.manager.createQueryBuilder()
//             .select("Behaviour")
//             .from(Behaviour, "Behaviour")
//             .where("Behaviour.Id = :id", {id: Behaviour.Id})
//             .getOne();

//         expect(deleteCheck).toBeFalsy()
//     })

//     it("can be chained", () => {
        
//     })
// })