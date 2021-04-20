import { createConnection, getConnection } from 'typeorm'

import { User } from '../entity/user'
import { Project } from '../entity/project'
import { DBObject } from '../entity/object'
import { VSGraph } from '../entity/vsgraph'
import { UserSubscriber } from "../subscriber/UserSubscriber"

import { UserOperations } from './user'
import { ProjectOperations } from './project'
import { ObjectOperations } from './object'
import { VSGraphOperations } from './vsgraph'
import * as bcrypt from 'bcrypt'
import { FlowProject } from '../FastAccessStateTracker/FlowLibrary/FlowProject'

beforeAll( async () => {
    await createConnection({
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
           VSGraph
        ],
        subscribers: [
            UserSubscriber
        ]
     });

     process.env.NODE_ENV = "test"
})

describe("User", () => {

    it("can be created", async () => {
        //act
        let testUser = {
            Username: "createdUser",
            Password: "TestPassword"
        }

        await UserOperations.createUser(testUser.Username, testUser.Password)
        let check = await getConnection(process.env.NODE_ENV)
            .createQueryBuilder().
            select("user").
            from(User, "user").
            where("user.Username = :username", {username: testUser.Username}).
            getOne()
        
        //assert
        expect(check).toBeTruthy()
        expect(bcrypt.compareSync(testUser.Password, check.Password)).toBeTruthy()
    })

    it("can be read", async () => {
        // arrange

        let newUser = new User();
        newUser.Username = 'CanBeFound'
        newUser.Password = 'Password'
        newUser.Projects = []

        let returnedUser = await getConnection(process.env.NODE_ENV).manager.save(newUser)

        // act
        let foundUser = await UserOperations.findUser(newUser.Username)
        // assert
        expect(foundUser.Username).toEqual(newUser.Username)
    })


    it("can be deleted", async () => {

        // arrange
        let conn = getConnection(process.env.NODE_ENV)

        let newUser = new User();
        newUser.Username = 'UserCanBeDeleted'
        newUser.Password = 'Password'
        newUser.Projects = []

        let returnedUser = await conn.manager.save(newUser)

        // act
        UserOperations.deleteUser(newUser.Username)
        let check = await getConnection(process.env.NODE_ENV).createQueryBuilder().
            select("user").
            from(User, "user").
            where("user.Username = :username", {username: newUser.Username}).
            getOne();

        // assert
        expect(check).toBeFalsy()

    })  
})

describe("Project", () =>{
    it("can be created", async () => {
        // arrange
        var testProject1 = new FlowProject({
            Id: "createdProjecttest",
            Description: "This is a project",
            ProjectName: "TestProject1",
            DateModified: Date.now(),
        });

        var testUser = {
            Username: "YashProject1",
            Password: "test"
        };

        await UserOperations.createUser(testUser.Username, testUser.Password)
        await ProjectOperations.createProject(testProject1, testUser.Username)

        let check = getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .select()
            .from(Project, "project")
            .where("Id = :id", {id: testProject1.Id})
            .getOne()

        expect(check).toBeTruthy()
    })

    it("can be read", async () => {
        let conn = getConnection(process.env.NODE_ENV);

        let foundProject = new Project();
        foundProject.Id = "foundProjectId";
        foundProject.ProjectName = "foundProjectName"
        foundProject.Description = "foundProjectDescription"
        foundProject.DateModified = Date.now()
        foundProject.ObjectList = []
        foundProject.VSGraphList = []

        let returnedProject = await conn.manager.save(foundProject)

        let check = await ProjectOperations.findProject(foundProject.Id)

        expect(check).toBeTruthy()
    })

    it("can be deleted", async () => {
        // arrange
        let conn = getConnection(process.env.NODE_ENV);

        let deletedProject = new Project();
        deletedProject.Id = "deletedProjectId";
        deletedProject.ProjectName = "deletedProjectName"
        deletedProject.Description = "deletedProjectDescription"
        deletedProject.DateModified = Date.now()
        deletedProject.ObjectList = []
        deletedProject.VSGraphList = []

        let returnedProject = await conn.manager.save(deletedProject)

        let check = await ProjectOperations.findProject(deletedProject.Id)
        console.log(check)
        expect(check).toBeTruthy()

        // act
        await ProjectOperations.deleteProject(deletedProject.Id)

        check = await ProjectOperations.findProject(deletedProject.Id)
        
        // assert
        expect(check).toBeFalsy()
    })
})

describe("Object", () => { 
    it("can be created", async () => {
        // arrange
        
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
            Id:             "createdObjectId",
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
            Prefab:         "prefab"
        }

        let x =  await ObjectOperations.createObject(object1, returnedProject.Id)
        
    })

    it("can be read", async () => {

        let createdProject = new Project();
        createdProject.Id = "foundObjectProjectId";
        createdProject.ProjectName = "createdProjectName"
        createdProject.Description = "createdProjectDescription"
        createdProject.DateModified = Date.now()
        createdProject.ObjectList = []
        createdProject.VSGraphList = []

        let returnedProject = await getConnection(process.env.NODE_ENV).manager.save(createdProject)

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

        let returnedObject = await getConnection(process.env.NODE_ENV).manager.save(foundObject)
        
        // assert 
        expect(returnedObject.Id).toEqual("foundObjectId")
        expect(returnedObject.Name).toEqual("foundObjectName")

        let check = await ObjectOperations.findObject(returnedObject.Id, createdProject.Id)
        expect(check.Name).toEqual("foundObjectName");
        
    })

    it("can be updated", async () =>{

        let createdProject = new Project();
        createdProject.Id = "updatedObjectProjectId";
        createdProject.ProjectName = "createdProjectName"
        createdProject.Description = "createdProjectDescription"
        createdProject.DateModified = Date.now()
        createdProject.ObjectList = []
        createdProject.VSGraphList = []

        let returnedProject = await getConnection(process.env.NODE_ENV).manager.save(createdProject)


        let foundObject = new DBObject();
        foundObject.Id = "updatedObjectId"
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
        foundObject.Prefab = "prefab"

        let returnedObject = await getConnection(process.env.NODE_ENV).manager.save(foundObject)

        let updatedObject = new DBObject();
        updatedObject.Id = "updatedObjectId"
        updatedObject.Name = "updatedObjectName"
        updatedObject.X = 2;
        updatedObject.Y = 2;
        updatedObject.Z = 2;
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
        updatedObject.Prefab = "prefab"

        await ObjectOperations.updateObject(updatedObject, createdProject.Id)

        let check = await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .select("object")
            .from(DBObject, "object")
            .where("object.Id = :id", {id: foundObject.Id})
            .getOne();

        expect(check.X).toEqual(2);

    })

    it("can be deleted", async () => {

        let createdProject = new Project();
        createdProject.Id = "updatedObjectProjectId";
        createdProject.ProjectName = "createdProjectName"
        createdProject.Description = "createdProjectDescription"
        createdProject.DateModified = Date.now()
        createdProject.ObjectList = []
        createdProject.VSGraphList = []

        let returnedProject = await getConnection(process.env.NODE_ENV).manager.save(createdProject)


        let foundObject = new DBObject();
        foundObject.Id = "deletedObjectId"
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
        foundObject.Prefab = "prefab"

        let returnedObject = await getConnection(process.env.NODE_ENV).manager.save(foundObject)

        await ObjectOperations.deleteObject(foundObject.Id, createdProject.Id)

        let check = await getConnection(process.env.NODE_ENV)
        .createQueryBuilder()
        .select("object")
        .from(DBObject, "object")
        .where("object.Id = :id", {id: foundObject.Id})
        .getOne();

        expect(check).toBeFalsy()
    })
})

describe("VSGraph", () => { 
    it("can be created", async () => {
        // arrange
        
        let conn = getConnection(process.env.NODE_ENV);
        let createdProject = new Project();
        createdProject.Id = "createVSGraphProjectId";
        createdProject.ProjectName = "createdProjectName"
        createdProject.Description = "createdProjectDescription"
        createdProject.DateModified = Date.now()
        createdProject.ObjectList = []
        createdProject.VSGraphList = []

        let returnedProject = await conn.manager.save(createdProject)

        var vsgraph1 = {
            Id:                 "updatedVSGraphId",
            Name:               "updatedVSGraphName",
            serializedNodes:    "[]",
            edges:              "[]",
            groups:             "[]",
            stackNodes:         "[]",
            pinnedElements:     "[]",
            exposedParameters:  "[]",
            stickyNotes:        "[]",
            position:           "{\"x\":0,\"y\":0,\"z\":0}",
            scale:              "{\"x\":1,\"y\":1,\"z\":1}",
            references:         "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}",
            paramIdToObjId:     "{\"keys\":[],\"values\":[]}"
        }

        let x =  await VSGraphOperations.createVSGraph(vsgraph1, returnedProject.Id)
        
    })

    it("can be read", async () => {

        let createdProject = new Project();
        createdProject.Id = "foundVSGraphProjectId";
        createdProject.ProjectName = "createdProjectName"
        createdProject.Description = "createdProjectDescription"
        createdProject.DateModified = Date.now()
        createdProject.ObjectList = []
        createdProject.VSGraphList = []

        let returnedProject = await getConnection(process.env.NODE_ENV).manager.save(createdProject)

        let foundVSGraph = new VSGraph();
        foundVSGraph.Id = "foundVSGraphId"
        foundVSGraph.Name = "foundVSGraphName"
        foundVSGraph.serializedNodes = "[]"
        foundVSGraph.edges = "[]"
        foundVSGraph.groups = "[]"
        foundVSGraph.stackNodes = "[]"
        foundVSGraph.pinnedElements = "[]"
        foundVSGraph.exposedParameters = "[]"
        foundVSGraph.stickyNotes = "[]"
        foundVSGraph.position = "{\"x\":0,\"y\":0,\"z\":0}"
        foundVSGraph.scale = "{\"x\":1,\"y\":1,\"z\":1}"
        foundVSGraph.references = "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}"
        foundVSGraph.paramIdToObjId = "{\"keys\":[],\"values\":[]}"

        let returnedVSGraph = await getConnection(process.env.NODE_ENV).manager.save(foundVSGraph)
        
        // assert 
        expect(returnedVSGraph.Id).toEqual("foundVSGraphId")
        expect(returnedVSGraph.Name).toEqual("foundVSGraphName")

        let check = await VSGraphOperations.findVSGraph(returnedVSGraph.Id, createdProject.Id)
        expect(check.Name).toEqual("foundVSGraphName");
        
    })

    it("can be updated", async () =>{

        let createdProject = new Project();
        createdProject.Id = "updatedVSGraphProjectId";
        createdProject.ProjectName = "createdProjectName"
        createdProject.Description = "createdProjectDescription"
        createdProject.DateModified = Date.now()
        createdProject.ObjectList = []
        createdProject.VSGraphList = []

        let returnedProject = await getConnection(process.env.NODE_ENV).manager.save(createdProject)


        let foundVSGraph = new VSGraph();
        foundVSGraph.Id = "updatedVSGraphId"
        foundVSGraph.Name = "foundVSGraphName"
        foundVSGraph.serializedNodes = "[]"
        foundVSGraph.edges = "[]"
        foundVSGraph.groups = "[]"
        foundVSGraph.stackNodes = "[]"
        foundVSGraph.pinnedElements = "[]"
        foundVSGraph.exposedParameters = "[]"
        foundVSGraph.stickyNotes = "[]"
        foundVSGraph.position = "{\"x\":0,\"y\":0,\"z\":0}"
        foundVSGraph.scale = "{\"x\":1,\"y\":1,\"z\":1}"
        foundVSGraph.references = "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}"
        foundVSGraph.paramIdToObjId = "{\"keys\":[],\"values\":[]}"

        let returnedVSGraph = await getConnection(process.env.NODE_ENV).manager.save(foundVSGraph)

        let updatedVSGraph = new VSGraph();
        updatedVSGraph.Id = "updatedVSGraphId"
        updatedVSGraph.Name = "updatedVSGraphName"
        updatedVSGraph.serializedNodes = "[]"
        updatedVSGraph.edges = "[]"
        updatedVSGraph.groups = "[]"
        updatedVSGraph.stackNodes = "[]"
        updatedVSGraph.pinnedElements = "[]"
        updatedVSGraph.exposedParameters = "[]"
        updatedVSGraph.stickyNotes = "[]"
        updatedVSGraph.position = "{\"x\":0,\"y\":0,\"z\":0}"
        updatedVSGraph.scale = "{\"x\":1,\"y\":1,\"z\":1}"
        updatedVSGraph.references = "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}"
        updatedVSGraph.paramIdToObjId = "{\"keys\":[\"newParamId\"],\"values\":[\"newFlowObjectId\"]}"

        await VSGraphOperations.updateVSGraph(updatedVSGraph, createdProject.Id)

        let check = await getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .select("vsgraph")
            .from(VSGraph, "vsgraph")
            .where("vsgraph.Id = :id", {id: foundVSGraph.Id})
            .getOne();

        expect(JSON.parse(check.paramIdToObjId)).toEqual("{\"keys\":[\"newParamId\"],\"values\":[\"newFlowObjectId\"]}");

    })

    it("can be deleted", async () => {

        let createdProject = new Project();
        createdProject.Id = "deletedVSGraphProjectId";
        createdProject.ProjectName = "createdProjectName"
        createdProject.Description = "createdProjectDescription"
        createdProject.DateModified = Date.now()
        createdProject.ObjectList = []
        createdProject.VSGraphList = []

        let returnedProject = await getConnection(process.env.NODE_ENV).manager.save(createdProject)


        let foundVSGraph = new VSGraph();
        foundVSGraph.Id = "foundVSGraphId"
        foundVSGraph.Name = "foundVSGraphName"
        foundVSGraph.serializedNodes = "[]"
        foundVSGraph.edges = "[]"
        foundVSGraph.groups = "[]"
        foundVSGraph.stackNodes = "[]"
        foundVSGraph.pinnedElements = "[]"
        foundVSGraph.exposedParameters = "[]"
        foundVSGraph.stickyNotes = "[]"
        foundVSGraph.position = "{\"x\":0,\"y\":0,\"z\":0}"
        foundVSGraph.scale = "{\"x\":1,\"y\":1,\"z\":1}"
        foundVSGraph.references = "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}"
        foundVSGraph.paramIdToObjId = "{\"keys\":[],\"values\":[]}"

        let returnedVSGraph = await getConnection(process.env.NODE_ENV).manager.save(foundVSGraph)

        await VSGraphOperations.deleteVSGraph(foundVSGraph.Id, createdProject.Id)

        let check = await getConnection(process.env.NODE_ENV)
        .createQueryBuilder()
        .select("vsgraph")
        .from(VSGraph, "vsgraph")
        .where("vsgraph.Id = :id", {id: foundVSGraph.Id})
        .getOne();

        expect(check).toBeFalsy()
    })
})