"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const user_1 = require("../commands/user");
const databaseController_1 = require("./databaseController");
const project_1 = require("../commands/project");
var database;
const dburl = "mongodb://127.0.0.1:27017/realityflowdb";
var testUser = {
    username: "Yash",
    password: "test"
};
var testClient = {
    deviceType: 1
};
var testInput = {
    user: testUser,
    client: testClient
};
var testProject1 = {
    projectName: "TestProject1",
    created: Date.now(),
    lastEdit: Date.now(),
    lastEditor: null
};
var testProject2 = {
    projectName: "TestProject2",
    created: Date.now(),
    lastEdit: Date.now(),
    lastEditor: null
};
var object1 = {
    type: "string",
    name: "object1",
    triangles: [1, 2, 3],
    x: 3,
    y: 1,
    z: 1,
    q_x: 1,
    q_y: 1,
    q_z: 1,
    q_w: 1,
    s_x: 1,
    s_y: 1,
    s_z: 1,
    color: {},
    vertices: [1, 2],
    uv: [2, 34],
    texture: [1, 3],
    textureHeight: 1,
    textureWidth: 1,
    textureFormat: 1,
    mipmapCount: 1,
    locked: false,
};
var object2 = {
    type: "string",
    name: "object2",
    triangles: [1, 2, 3],
    x: 3,
    y: 2,
    z: 3,
    q_x: 4,
    q_y: 5,
    q_z: 6,
    q_w: 7,
    s_x: 8,
    s_y: 9,
    s_z: 20,
    color: {},
    vertices: [1, 2],
    uv: [2, 34],
    texture: [1, 3],
    textureHeight: 2,
    textureWidth: 4,
    textureFormat: 25,
    mipmapCount: 23,
    locked: false,
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        mongoose.connect(dburl);
        database = mongoose.connection;
        database.on('error', console.error.bind(console, 'connection error: '));
        database.once('open', function () {
            console.log('Database connection successful at ' + dburl);
        });
        var userData = yield testUserCreateAndDelete(false);
        testProject1.lastEditor = userData.user._id;
        testProject2.lastEditor = userData.user._id;
        var projectData1 = yield testProjectCreateAndDelete(testProject1, userData, false);
        var projectData2 = yield testProjectCreateAndDelete(testProject2, userData, false);
        var loginData = yield databaseController_1.databaseController.loginUser(testInput);
        console.log(JSON.stringify(loginData));
        console.log("-------object-----\n");
        yield testObjectMethods(object1, object2, projectData1);
    });
}
function testObjectMethods(objectData1, objectData2, projectData) {
    return __awaiter(this, void 0, void 0, function* () {
        var testIn1 = { obj: objectData1, project: JSON.parse(projectData).project };
        var testIn1obj2 = { obj: objectData2, project: JSON.parse(projectData).project };
        var objOut1 = yield databaseController_1.databaseController.createObject(testIn1);
        var obj2Out1 = yield databaseController_1.databaseController.createObject(testIn1obj2);
        console.log(objOut1);
        console.log(obj2Out1);
        var testIn2 = objOut1;
        testIn2.obj.x = -1;
        yield databaseController_1.databaseController.updateObject(testIn2);
        console.log('----fetch output----');
        var fetchOut = yield databaseController_1.databaseController.fetchObjects(testIn1);
        console.log(fetchOut);
    });
}
function testUserCreateAndDelete(delTestUser = false) {
    return __awaiter(this, void 0, void 0, function* () {
        var verbose = false;
        var createdUserOutput = yield databaseController_1.databaseController.createUser(testInput);
        if (verbose) {
            console.log(createdUserOutput);
            console.log("---Pre Delete---");
        }
        var findOut = yield user_1.UserOperations.findUser(createdUserOutput.user);
        if (verbose)
            console.log(findOut);
        if (delTestUser) {
            yield user_1.UserOperations.deleteUser(createdUserOutput.user);
            console.log("---Post Delete---");
            var findOut = yield user_1.UserOperations.findUser(createdUserOutput.user);
            console.log("hello");
            console.log(findOut);
            return null;
        }
        return createdUserOutput;
    });
}
function testProjectCreateAndDelete(testProject, userData, delTestProject) {
    return __awaiter(this, void 0, void 0, function* () {
        userData.project = testProject;
        var projectData = yield databaseController_1.databaseController.createProject(userData);
        if (delTestProject) {
            yield databaseController_1.databaseController.deleteProject(JSON.parse(projectData).project);
            var notDeleted = yield project_1.ProjectOperations.findProject(JSON.parse(projectData).project);
            console.log("hello" + notDeleted);
            if (notDeleted) {
                console.log("Oops! the project wasn't deleted!");
            }
        }
        return projectData;
    });
}
main();
