/// <reference types="jest" />

import { FlowProject } from "./FlowLibrary/FlowProject";
import { FlowUser } from "./FlowLibrary/FlowUser"
import { RoomManager } from "./RoomManager";
import { ConnectionManager } from "./ConnectionManager";
import { MongooseDatabase } from "./Database/MongooseDatabase"
import { ConfigurationSingleton } from "./ConfigurationSingleton";
import { Room } from "./Room";
import { Connection } from "mongoose";
import { StateTracker } from "./StateTracker";
import {Project, IProjectModel} from "../models/project";
import {User, IUserModel} from "../models/user";
import {Object, IObjectModel} from "../models/object";


import * as mongoose from "mongoose";

var database;
const dburl = "mongodb://127.0.0.1:27017/realityflowdb";

// var testUser = {
//     username: "Phil",
//     password: "test"
// };

// var testClient = {
//     deviceType: 1
// }

// var testInput = {
//     user: testUser,
//     client: testClient
// }

// var testProject1 = {
//     projectName: "TestProject1",
//     created: Date.now(),
//     lastEdit: Date.now(),
//     lastEditor: null
// }

// var testProject2 = {
//     projectName: "TestProject2",
//     created: Date.now(),
//     //lastEdit: Date.now(),
//     //lastEditor: null
// }

// var object1 = {
//     type:           "string",
//     name:           "object1",
//     triangles:      [1,2,3],
//     x:              3,
//     y:              1,
//     z:              1,
//     q_x:            1,
//     q_y:            1,
//     q_z:            1,
//     q_w:            1,
//     s_x:            1,
//     s_y:            1,
//     s_z:            1,
//     color:          {},
//     vertices:       [1,2],
//     uv:             [2,34],
//     texture:        [1,3],
//     textureHeight:  1,
//     textureWidth:   1,
//     textureFormat:  1,
//     mipmapCount:    1,
//     locked:         false,
// }

// var object2 = {
//     type:           "string",
//     name:           "object2",
//     triangles:      [1,2,3],
//     x:              3,
//     y:              2,
//     z:              3,
//     q_x:            4,
//     q_y:            5,
//     q_z:            6,
//     q_w:            7,
//     s_x:            8,
//     s_y:            9,
//     s_z:            20,
//     color:          {},
//     vertices:       [1,2],
//     uv:             [2,34],
//     texture:        [1,3],
//     textureHeight:  2,
//     textureWidth:   4,
//     textureFormat:  25,
//     mipmapCount:    23,
//     locked:         false,
// }





let project = FlowProject.constructor({Id: "123", Description: "Test", DateModified: "1/2/12", ProjectName: "TestProject"});
let user = FlowUser.constructor({Username: "Test", Password: "Test123"});

// Set up mongoose data calls here for tests


test('createProjectWorks', () => {

    StateTracker.CreateProject(project, user);
    // Assertion, the project was found in the database
    var query = Project.find({Description: 'test'}, null);
    var promise = query.exec();
    expect().toBe(true);

}, 1000);



// delete project test
test('deleteProjectWorks', () => {
    // call the delete project function
    StateTracker.DeleteProject(project);
    //Assertion - use mongoose calls to 
    expect(Project.find({Description: 'test'})).toBe();
})

// open project

// create user test

// delete user

