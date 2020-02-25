/// <reference types="jest" />

// import * as mongoose from "mongoose";

import  MongooseDatabase  from "./MongooseDatabase"
import * as mongoose from 'mongoose';
import { User } from "../../models/user"
import { ProjectOperations } from "../../commands/project";
import { ObjectOperations } from "../../commands/object";
import { ClientOperations } from "../../commands/client";

import {FlowClient} from "../FlowLibrary/FlowClient";
import {FlowUser} from "../FlowLibrary/FlowUser";
import {FlowProject} from "../FlowLibrary/FlowProject";
import {FlowObject} from "../FlowLibrary/FlowObject";



describe("database_testing", () => {
    let connection: any;
    let database: any;
    const dburl = "mongodb://127.0.0.1:27017/rftest";

    var testUser = {
        username: "Yash",
        password: "test"
    };
    
    var testClient = {
        Id: "",
        user:"",
        deviceType: 1
    }
    
    var testInput = {
        user: testUser,
        client: testClient
    }

    var testProject = {
        projectName: "TestProject1",
        created: Date.now(),

        lastEdit: Date.now(),
        lastEditor: ""
    }

    var object1 = {
        
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
    }

    var object2 = {
        type:           "string",
        name:           "object2",
        triangles:      [1,2,3],
        x:              3,
        y:              2,
        z:              3,
        q_x:            4,
        q_y:            5,
        q_z:            6,
        q_w:            7,
        s_x:            8,
        s_y:            9,
        s_z:            20,
        color:          {},
        vertices:       [1,2],
        uv:             [2,34],
        texture:        [1,3],
        textureHeight:  2,
        textureWidth:   4,
        textureFormat:  25,
        mipmapCount:    23,
        locked:         false,
        path:           "there"
    }
    

    mongoose.connect(dburl);
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'connection error: '));
    database.once('open', function(){
    console.log('Database connection successful at ' + dburl);
    });

    var createdUserOutput;
    var createdProjectOutput;

    //testing the MongooseDatabase functions.
    it('should insert a user into collection and then find that user', async () => {

        // arrange
        var testUser = {
            Username: "Yash",
            Password: "test"
        };
        
        var testClient = {
            _id: "",
            user:"",
            deviceType: 1
        }

        // act
        createdUserOutput = await MongooseDatabase.CreateUser(new FlowUser(testUser))
        
        //assert
        var findOut = await User.findOne({Username: testUser.Username})
        expect(findOut).toEqual(expect.anything());
        
    });

    

    // it('should insert a project into a collection and then find that project', async () => {
        
    //     // arrange
    //     var testProject = new FlowProject({
    //         _id: "",
    //         projectName: "TestProject1",
    //         created: Date.now(),
    
    //         lastEdit: Date.now(),
    //         lastEditor: null
    //     });

    //     var testUser = new FlowUser({
    //         username: "Yash",
    //         password: "test"
    //     });

    //     var mongoUser = await UserOperations.createUser(testUser)
    //     testUser._id = mongoUser._id

    //     var testClient = new FlowClient({
    //         user: testUser._id,
    //         deviceType: 1
    //     })

    //     // act
    //     createdUserOutput.project = testProject;
    //     createdProjectOutput = await MongooseDatabase.CreateProject(testProject, testUser, testClient);
        
    //     // assert
    //     expect(createdProjectOutput).toEqual(expect.anything());
    //     var findProject = await ProjectOperations.findProject(createdProjectOutput);
    //     expect(findProject).toEqual(expect.anything())
    
    // })

    

    // it('should create an object', async() => {

    //     // arrange
    //     var testUser = new FlowUser({
    //         username: "Yash",
    //         password: "test"
    //     });

    //     var mongoUser = await UserOperations.createUser(testUser)
    //     testUser._id = mongoUser._id

    //     var testClient = await ClientOperations.createClient({
    //         user: testUser._id,
    //         deviceType: 1
    //     }, testUser._id)

       
    //     var testProject = await ProjectOperations.createProject( {
    //         projectName: "TestProject1",
    //         created: Date.now(),
    
    //         lastEdit: Date.now(),
    //         lastEditor: null
    //     }, testClient, testUser);

    //     var object1 = {
        
    //         type:           "string",
    //         name:           "object1",
    //         triangles:      [1,2,3],
    //         x:              3,
    //         y:              1,
    //         z:              1,
    //         q_x:            1,
    //         q_y:            1,
    //         q_z:            1,
    //         q_w:            1,
    //         s_x:            1,
    //         s_y:            1,
    //         s_z:            1,
    //         color:          {},
    //         vertices:       [1,2],
    //         uv:             [2,34],
    //         texture:        [1,3],
    //         textureHeight:  1,
    //         textureWidth:   1,
    //         textureFormat:  1,
    //         mipmapCount:    1,
    //         locked:         false,
    //         path:           "here"
    //     }
    //     // act
    //     var createOut1 = await MongooseDatabase.CreateObject(new FlowObject(object1), new FlowProject(testProject));
        
    //     // assert
    //     expect(createOut1).toEqual(expect.anything())
    
    // })

    // it('should modify an object', async() =>{
    
    //     // arrange
    //     var testUser = new FlowUser({
    //         username: "Yash",
    //         password: "test"
    //     });

    //     var mongoUser = await UserOperations.createUser(testUser)
    //     testUser._id = mongoUser._id

    //     var testClient = await ClientOperations.createClient({
    //         user: testUser._id,
    //         deviceType: 1
    //     }, testUser._id)

       
    //     var testProject = await ProjectOperations.createProject( {
    //         projectName: "TestProject1",
    //         created: Date.now(),
    
    //         lastEdit: Date.now(),
    //         lastEditor: null
    //     }, testClient, testUser);

    //     var object1 = {
        
    //         type:           "string",
    //         name:           "object1",
    //         triangles:      [1,2,3],
    //         x:              3,
    //         y:              1,
    //         z:              1,
    //         q_x:            1,
    //         q_y:            1,
    //         q_z:            1,
    //         q_w:            1,
    //         s_x:            1,
    //         s_y:            1,
    //         s_z:            1,
    //         color:          {},
    //         vertices:       [1,2],
    //         uv:             [2,34],
    //         texture:        [1,3],
    //         textureHeight:  1,
    //         textureWidth:   1,
    //         textureFormat:  1,
    //         mipmapCount:    1,
    //         locked:         false,
    //         path:           "here"
    //     }

    //     var createOut1 = await MongooseDatabase.CreateObject(new FlowObject(object1), new FlowProject(createdProjectOutput));
    //     expect(createOut1).toEqual(expect.anything());

    //     // act
    //     var modified = Object.assign({}, createOut1);
    //     modified.object.x = -1;

    //     console.log(modified.object)
    //     let updater = new FlowObject(modified.object)
    //     updater._id = modified.object._id
    //     await MongooseDatabase.UpdateObject(updater);
        
    //     console.log(createOut1)
    //     var foundObj = await ObjectOperations.findObject(createOut1.object._id)
        
    //     // assert
    //     expect(foundObj.x).toEqual(-1);

    // })

    // it('should delete a user from a collection', async () => {
        
    //     // arrange
    //     var testUser = {
    //         username: "Yash",
    //         password: "test"
    //     };
        
    //     var testClient = {
    //         _id: "",
    //         user:"",
    //         deviceType: 1
    //     }

        
    //     createdUserOutput = await MongooseDatabase.CreateUser(new FlowClient(testClient), new FlowUser(testUser))
        
    //     // act
    //     await UserOperations.deleteUser( {_id: createdUserOutput.newUserId} );
        
    //     // assert
    //     var findPostDelete = await UserOperations.findUser({_id: createdUserOutput.newUserId});
    //     expect(findPostDelete).toEqual(null)
    // });

    // it('should delete a project from a collection', async () => {

    //     // arrange
    //     var testProject = new FlowProject({
    //         _id: "",
    //         projectName: "TestProject1",
    //         created: Date.now(),
    
    //         lastEdit: Date.now(),
    //         lastEditor: null
    //     });

    //     var testUser = new FlowUser({
    //         username: "Yash",
    //         password: "test"
    //     });

    //     var mongoUser = await UserOperations.createUser(testUser)
    //     testUser._id = mongoUser._id

    //     var testClient = new FlowClient({
    //         user: testUser._id,
    //         deviceType: 1
    //     })

    //     createdUserOutput.project = testProject;
    //     createdProjectOutput = await MongooseDatabase.CreateProject(testProject, testUser, testClient);

    //     var findProject = await ProjectOperations.findProject(new FlowProject(createdProjectOutput));
    //     expect(findProject).toEqual(expect.anything())
        
    //     // act
    //     await MongooseDatabase.DeleteProject(new FlowProject(createdProjectOutput));
        
    //     // assert
    //     var findPostDelete = await ProjectOperations.findProject(new FlowProject(createdProjectOutput));
    //     expect(findPostDelete).toEqual(null)
    // })

});
    