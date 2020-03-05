/// <reference types="jest" />

import { ProjectOperations } from "../../ORMCommands/project";
import { ObjectOperations } from "../../ORMCommands/object";
import { UserOperations } from "../../ORMCommands/user"


import {FlowUser} from "../FlowLibrary/FlowUser";
import {FlowProject} from "../FlowLibrary/FlowProject";
import {FlowObject} from "../FlowLibrary/FlowObject";
import TypeORMDatabase from "./TypeORMDatabase";

import { Project } from "../../entity/project";
import { User } from "../../entity/user";

// this may seem like a pointless exercise. 
// It kind of is, but I want to make sure that every 
// level works the way that it's supposed to.
describe("UserOperations", () => {

    jest.mock("../../ORMCommands/user");
    
    it('Should be able to create a User', async () => {
        
        // arrange
        var testUser = {
            Username: "Yesh",
            Password: "test"
        };
        
        let mockCreateUser = jest.fn(async (username, pasword) => {})
        UserOperations.createUser = mockCreateUser

        // act
        await TypeORMDatabase.CreateUser(testUser.Username, testUser.Password)
        
        // assert
        expect(mockCreateUser).toBeCalledWith(testUser.Username, testUser.Password)
    });

    
    it("should find a user", async () => {
        
        // arrange
        var testUser = {
            username: "Yash",
            password: "test"
        };
        
        let mockFetchProjects = jest.fn(async (username) => {return [new Project()]})
        ProjectOperations.fetchProjects = mockFetchProjects

        // act
        await TypeORMDatabase.GetUser(testUser.username)
        // assert
        expect(mockFetchProjects).toBeCalledWith(testUser.username)
    })

    // not really worth implementing right now
    it("should update a user", async () => {

    })

    it('should delete a user from a collection', async () => {
        
        // arrange
        var testUser = {
            username: "Yash",
            password: "test"
        };
        
        let mockDeleteUser = jest.fn(async (username) => {})

        UserOperations.deleteUser = mockDeleteUser
        
        // act
        await UserOperations.deleteUser( testUser.username );
        
        // assert
        expect(mockDeleteUser).toBeCalledWith(testUser.username)
    });


})

describe("ObjectOperations", () => {

    it('should create an object', async() => {

        // arrange
        var testProject2 = {
            Id: "TestProject2",
            Description: "This is a project",
            ProjectName: "TestProject2",
            DateModified: Date.now(),
        };

        var object1 = new FlowObject({
            Id: "objectId",
            name:           "object1",
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
        })
        let mockCreateObject = jest.fn(async (objectInfo, projectId) => {})
        ObjectOperations.createObject = mockCreateObject


        // act
        await TypeORMDatabase.CreateObject(object1, testProject2.Id);
        
        // assert
        expect(mockCreateObject).toBeCalledWith(object1, testProject2.Id)
    
    });

    it('should modify an object', async() =>{
    
        // arrange
        var testProject2 = {
            Id: "TestProject2",
            Description: "This is a project",
            ProjectName: "TestProject2",
            DateModified: Date.now(),
        };

        var object1 = new FlowObject({
        
            type:           "string",
            name:           "object1",
            triangles:      [1,2,3],
            x:              3,
            y:              1,
            z:              1,
            q_x:            1,
            q_y:            1,
            q_z:            1,
            q_w:            1,
            s_x:            1,
            s_y:            1,
            s_z:            1,
            color:          {},
            vertices:       [1,2],
            uv:             [2,34],
            texture:        [1,3],
            textureHeight:  1,
            textureWidth:   1,
            textureFormat:  1,
            mipmapCount:    1,
            locked:         false,
            path:           "here"
        })

        let mockUpdateObject = jest.fn(async (objectInfo, projectId) => {})
        ObjectOperations.updateObject = mockUpdateObject

        // act
        await TypeORMDatabase.UpdateObject(object1, testProject2.Id);
        
        // assert
        expect(mockUpdateObject).toBeCalledWith(object1, testProject2.Id);

    });

})

describe("ProjectOperations", ()=>{

    it('should create a project', async () => {
        
        // arrange
        var testProject1 = new FlowProject({
            Id: "TestProjectId",
            Description: "This is a project",
            ProjectName: "TestProject1",
            DateModified: Date.now(),
        });

        var testUser = {
            Username: "Yash",
            Password: "test"
        };

        let mockCreateProject = jest.fn(async (project, username) => {})
        ProjectOperations.createProject = mockCreateProject
        // act
        await TypeORMDatabase.CreateProject(testProject1, testUser.Username);
        
        // assert
        expect(mockCreateProject).toBeCalledWith(testProject1, testUser.Username)
    
    })

    it('should find a project', async () => {
        // arrange
        var testProject1 = new FlowProject({
            Id: "TestProjectId",
            Description: "This is a project",
            ProjectName: "TestProject1",
            DateModified: Date.now(),
        });

        var testUser = {
            Username: "Yash",
            Password: "test"
        };

        let mockGetProject = jest.fn(async (project: string) => {
            let p = new Project()
            p.Id= project,
            p.Description= "This is a project"
            p.ProjectName= "TestProject1"
            p.DateModified= Date.now()
            return p
        });
            
        ProjectOperations.findProject = mockGetProject
        // act
        await TypeORMDatabase.GetProject(testProject1.Id);
        
        // assert
        expect(mockGetProject).toBeCalledWith(testProject1.Id)
    })

    it('should delete a project from a collection', async () => {

        // arrange
        var testProject1 = new FlowProject({
            Id: "TestProjectId",
            Description: "This is a project",
            ProjectName: "TestProject1",
            DateModified: Date.now(),
        });


        let mockDeleteProject = jest.fn(async (projectId) => {}) 
        ProjectOperations.deleteProject = mockDeleteProject
        
        // act
        await TypeORMDatabase.DeleteProject(testProject1.Id);
        
        // assert
        expect(mockDeleteProject).toBeCalledWith(testProject1.Id);
    })

})
    