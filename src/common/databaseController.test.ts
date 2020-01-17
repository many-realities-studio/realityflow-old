/// <reference types="jest" />

import {databaseController} from "./databaseController"
import { UserOperations } from "../commands/user"
import { ProjectOperations } from "../commands/project";
import { ObjectOperations } from "../commands/object"
import * as mongoose from "mongoose";
import {FlowClient} from "../flow_classes/FlowClient";
import {FlowUser} from "../flow_classes/FlowUser";
import {FlowProject} from "../flow_classes/FlowProject";
import {FlowObject} from "../flow_classes/FlowObject";

describe("database_testing", () => {
    let connection: any;
    let database: any;
    const dburl = "mongodb://127.0.0.1:27017/rftest";

    var testUser = {
        username: "Yash",
        password: "test"
    };
    
    var testClient = {
        _id: "",
        user:"",
        deviceType: 1
    }
    
    var testInput = {
        user: testUser,
        client: testClient
    }

    var testProject = {
        _id: "",
        projectName: "TestProject1",
        created: Date.now(),

        lastEdit: Date.now(),
        lastEditor: null
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

    it('should insert a user into collection and then find that user', async () => {

        createdUserOutput = await databaseController.CreateUser(new FlowClient(testClient), new FlowUser(testUser))

        //as long as it's not null we can assume the insert happened
        expect(createdUserOutput).toEqual(expect.anything());
        
        var findOut = await UserOperations.findUser({_id: createdUserOutput.newUserId})

        expect(findOut._id).toEqual(createdUserOutput.newUserId);
        
    });

    

    it('should insert a project into a collection and then find that project', async () => {
        
        createdUserOutput.project = testProject;
        createdProjectOutput = await databaseController.CreateProject(new FlowProject(testProject), new FlowUser(testUser), new FlowClient(createdUserOutput.newClientId), );
        expect(createdProjectOutput).toEqual(expect.anything());
        
        var findProject = await ProjectOperations.findProject(createdProjectOutput);
        expect(findProject).toEqual(expect.anything())
    
    })

    

    it('should create an object', async() => {

        var createOut1 = await databaseController.CreateObject(new FlowObject(object1), new FlowProject(createdProjectOutput));
        expect(createOut1).toEqual(expect.anything())
    
    })

    it('should modify an object', async() =>{
    
        var createOut1 = await databaseController.CreateObject(new FlowObject(object1), new FlowProject(createdProjectOutput));
        expect(createOut1).toEqual(expect.anything());

        var modified = Object.assign({}, createOut1);
        modified.object.x = -1;

        console.log(modified.object)
        let updater = new FlowObject(modified.object)
        updater._id = modified.object._id
        await databaseController.UpdateObject(updater);
        
        console.log(createOut1)
        var foundObj = await ObjectOperations.findObject(createOut1.object._id)
        
        expect(foundObj.x).toEqual(-1);

    })

    it('should delete a user from a collection', async () => {
        
        var findPreDelete = await UserOperations.findUser({_id: createdUserOutput.newUserId})
        expect(findPreDelete._id).toEqual(createdUserOutput.newUserId);
        
        await UserOperations.deleteUser( {_id: createdUserOutput.newUserId} );
        
        var findPostDelete = await UserOperations.findUser({_id: createdUserOutput.newUserId});
        expect(findPostDelete).toEqual(null)

    });

    it('should delete a project from a collection', async () => {
        var findProject = await ProjectOperations.findProject(new FlowProject(createdProjectOutput));
        expect(findProject).toEqual(expect.anything())
        
        await databaseController.DeleteProject(new FlowProject(createdProjectOutput));

        var findPostDelete = await ProjectOperations.findProject(new FlowProject(createdProjectOutput));
        expect(findPostDelete).toEqual(null)
    })

});
    
