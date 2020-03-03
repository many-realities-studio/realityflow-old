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
        console.log(check.Password)
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

})

describe ('Object', () => {
    it("can be created", async () => {
        let conn = getConnection("test")
        let newObject = new DBObject();

    })

    it("can be found", async () => {

    })

    it("can be updated", async () => {

    })

    it("can be deleted", () => {

    })
})