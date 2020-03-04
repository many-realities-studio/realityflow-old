import { createConnection, getConnection } from 'typeorm'

import { User } from './user'
import { Project } from './project'
import { DBObject } from './object'
import { UserSubscriber } from "./UserSubscriber"
import * as bcrypt from 'bcrypt'

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
           Project
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
        let newUser = new User();
        newUser.Username = 'CanBeCreated'
        newUser.Password = 'Password'
        newUser.Projects = []

        let returnedUser = await getConnection("test").manager.save(newUser)

        expect(returnedUser).toBeTruthy()
        expect(bcrypt.compareSync('Password', returnedUser.Password)).toEqual(true)
    })

    it('can be found', async () => {
        let conn = await getConnection("test")

        let newUser = new User();
        newUser.Username = 'CanBeFound'
        newUser.Password = 'Password'
        newUser.Projects = []

        let returnedUser = await conn.manager.save(newUser)
        expect(returnedUser).toBeTruthy()
        expect(bcrypt.compareSync('Password', returnedUser.Password)).toEqual(true)

        let check = await conn.createQueryBuilder().
            select("user").
            from(User, "user").
            where("user.Username = :username", {username: 'CanBeFound'}).
            getOne()

        expect(check).toBeTruthy()
        expect(bcrypt.compareSync('Password', check.Password)).toEqual(true)
    })

    it('Can be deleted', async () => {

        
        let conn = await getConnection("test")

        let newUser = new User();
        newUser.Username = 'CanBeDeleted'
        newUser.Password = 'Password'
        newUser.Projects = []

        let returnedUser = await conn.manager.save(newUser)
        expect(returnedUser).toBeTruthy()
        expect(bcrypt.compareSync('Password', returnedUser.Password)).toEqual(true)

        await conn.manager.remove(returnedUser)
        let check = await conn.createQueryBuilder().
            select("user").
            from(User, "user").
            where("user.Username = :username", {username: 'CanBeDeleted'}).
            getOne()
        expect(check).toBeFalsy()

    })

    

    it('can be updated', async () => {
        let conn = await getConnection("test");

        let newUser = new User();
        newUser.Username = 'CanBeUpdated';
        newUser.Password = 'Password';
        newUser.Projects = [];

        let returnedUser = await conn.manager.save(newUser);
        expect(returnedUser).toBeTruthy();
        expect(bcrypt.compareSync('Password', returnedUser.Password)).toEqual(true);

        await conn.createQueryBuilder().
            update(User).
            set({Password: "newPassword"}).
            where("Username = :Username", {Username: "CanBeUpdated"}).
            execute();

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
        let conn = getConnection("test");

        let createdProject = new Project();
        createdProject.Id = "createdProjectId";
        createdProject.ProjectName = "createdProjectName"
        createdProject.Description = "createdProjectDescription"
        createdProject.DateModified = Date.now()
        createdProject.ObjectList = []

        let returnedProject = await conn.manager.save(createdProject)
        
        expect(returnedProject.Id).toEqual("createdProjectId")
        expect(returnedProject.ProjectName).toEqual("createdProjectName")
    })

    it("can be found", async () => {
        let conn = getConnection("test");

        let foundProject = new Project();
        foundProject.Id = "foundProjectId";
        foundProject.ProjectName = "foundProjectName"
        foundProject.Description = "foundProjectDescription"
        foundProject.DateModified = Date.now()
        foundProject.ObjectList = []

        let returnedProject = await conn.manager.save(foundProject)

        let check = await conn.createQueryBuilder().
            select("project").
            from(Project, "project").
            where("Id = :id", {id: "foundProjectId"}).
            getOne();

        expect(check.Id).toEqual("foundProjectId")
        expect(check.ProjectName).toEqual("foundProjectName")
    })

    it("can be updated", async () =>{

        let conn = getConnection("test");

        let updateProject = new Project();
        updateProject.Id = "updateProjectId";
        updateProject.ProjectName = "updateProjectName"
        updateProject.Description = "updateProjectDescription"
        updateProject.DateModified = Date.now()
        updateProject.ObjectList = []

        let returnedProject = await conn.manager.save(updateProject)

        let check = await conn.createQueryBuilder().
            select("project").
            from(Project, "project").
            where("Id = :id", {id: "updateProjectId"}).
            getOne();

        expect(check.Id).toEqual("updateProjectId")
        expect(check.ProjectName).toEqual("updateProjectName")

        await conn.createQueryBuilder().
            update(Project).
            set({ProjectName: "newName"}).
            where("Id = :id", {id: "updateProjectId"}).
            execute()

        let check_new = await conn.createQueryBuilder().
            select("project").
            from(Project, "project").
            where("Id = :id", {id: "updateProjectId"}).
            getOne();

        expect(check_new.ProjectName).toEqual("newName")
        
    })

    it("can be deleted", async ()=>{
        let conn = getConnection("test");

        let deletedProject = new Project();
        deletedProject.Id = "deletedProjectId";
        deletedProject.ProjectName = "deletedProjectName"
        deletedProject.Description = "deletedProjectDescription"
        deletedProject.DateModified = Date.now()
        deletedProject.ObjectList = []

        let returnedProject = await conn.manager.save(deletedProject)

        let check = await conn.createQueryBuilder().
            select("project").
            from(Project, "project").
            where("Id = :id", {id: "deletedProjectId"}).
            getOne();

        expect(check.Id).toEqual("deletedProjectId")
        expect(check.ProjectName).toEqual("deletedProjectName")

        await conn.manager.remove(returnedProject)
        let check_again = await conn.createQueryBuilder().
            select("project").
            from(Project, "project").
            where("Id = :id", {id: "deletedProjectId"}).
            getOne();

        expect(check_again).toBeFalsy()
    })

    it("Can be owned by a user", async () => {
        
        // arrange
        let conn = getConnection("test")

        let newUser = new User();
        newUser.Username = 'CanBeOwner'
        newUser.Password = 'Password'
        newUser.Projects = []

        let returnedUser = await conn.manager.save(newUser);

        expect(returnedUser).toBeTruthy()
        expect(bcrypt.compareSync('Password', returnedUser.Password)).toEqual(true)

        let createdProject = new Project();
        createdProject.Id = "ownedProjectId";
        createdProject.ProjectName = "ownedProjectName"
        createdProject.Description = "ownedProjectDescription"
        createdProject.DateModified = Date.now()
        createdProject.ObjectList = []
        createdProject.Owner = newUser

        let returnedProject = await conn.manager.save(createdProject)
        
        let check = await conn.createQueryBuilder().select("project").from(Project, "project").where("Id = :id", {id: "ownedProjectId"}).getOne()

        expect(returnedProject.Owner).toBeTruthy()
    })

})

describe ('Object', () => {
    it("can be created", async () => {
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

        let returnedObject = await conn.manager.save(newObject)

        expect(returnedObject.Id).toEqual("newObjectId")
        expect(returnedObject.Name).toEqual("newObjectName")

    })

    it("can be found", async () => {
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

        let returnedObject = await conn.manager.save(foundObject)

        expect(returnedObject.Id).toEqual("foundObjectId")
        expect(returnedObject.Name).toEqual("foundObjectName")

        let check = await conn.createQueryBuilder().select("object").from(DBObject, "object").where("object.Id = :id", {id: "foundObjectId"}).getOne();
        expect(check.Name).toEqual("foundObjectName");
    })

    it("can be updated", async () => {

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

        let returnedObject = await conn.manager.save(updatedObject)

        expect(returnedObject.Id).toEqual("updatedObjectId")
        expect(returnedObject.Name).toEqual("updatedObjectName")

        let check = await conn.createQueryBuilder().select("object").from(DBObject, "object").where("object.Id = :id", {id: "updatedObjectId"}).getOne();
        expect(check.Name).toEqual("updatedObjectName");

        await conn.createQueryBuilder().update(DBObject).set({Name: "newName"}).where("Id = :id", {id: "updatedObjectId"}).execute()

        let check_Updated = await conn.createQueryBuilder().select("object").from(DBObject, "object").where("object.Id = :id", {id: "updatedObjectId"}).getOne();
        expect(check_Updated.Name).toEqual("newName");

    })

    it("can be deleted", async () => {
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

        let returnedObject = await conn.manager.save(deletedObject)

        expect(returnedObject.Id).toEqual("deletedObjectId")
        expect(returnedObject.Name).toEqual("deletedObjectName")

        let check = await conn.createQueryBuilder().select("object").from(DBObject, "object").where("object.Id = :id", {id: "deletedObjectId"}).getOne();
        expect(check.Name).toEqual("deletedObjectName");

        let result = await conn
            .createQueryBuilder()
            .delete()
            .from(DBObject)
            .where("Id = :id", {id: "deletedObjectId"})
            .execute()

        console.log(result)

        let check_deleted = await conn.createQueryBuilder().select("object").from(DBObject, "object").where("object.Id = :id", {id: "deletedObjectId"}).getOne();
        expect(check_deleted).toBeFalsy();

    })

    it("can be owned by a project", () => {
        // throw new Error("not yet implemented")
    })


})