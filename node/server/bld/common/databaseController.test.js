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
const databaseController_1 = require("./databaseController");
const user_1 = require("../commands/user");
const project_1 = require("../commands/project");
const object_1 = require("../commands/object");
const mongoose = require("mongoose");
const FlowClasses_1 = require("./FlowClasses");
describe("database_testing", () => {
    let connection;
    let database;
    const dburl = "mongodb://127.0.0.1:27017/rftest";
    var testUser = {
        username: "Yash",
        password: "test"
    };
    var testClient = {
        _id: "",
        user: "",
        deviceType: 1
    };
    var testInput = {
        user: testUser,
        client: testClient
    };
    var testProject = {
        _id: "",
        projectName: "TestProject1",
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
        path: "here"
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
        path: "there"
    };
    mongoose.connect(dburl);
    database = mongoose.connection;
    database.on('error', console.error.bind(console, 'connection error: '));
    database.once('open', function () {
        console.log('Database connection successful at ' + dburl);
    });
    var createdUserOutput;
    var createdProjectOutput;
    it('should insert a user into collection and then find that user', () => __awaiter(this, void 0, void 0, function* () {
        createdUserOutput = yield databaseController_1.databaseController.createUser(new FlowClasses_1.FlowClient(testClient), new FlowClasses_1.FlowUser(testUser));
        expect(createdUserOutput).toEqual(expect.anything());
        var findOut = yield user_1.UserOperations.findUser({ _id: createdUserOutput.newUserId });
        expect(findOut._id).toEqual(createdUserOutput.newUserId);
    }));
    it('should insert a project into a collection and then find that project', () => __awaiter(this, void 0, void 0, function* () {
        createdUserOutput.project = testProject;
        createdProjectOutput = yield databaseController_1.databaseController.createProject(new FlowClasses_1.FlowProject(testProject), new FlowClasses_1.FlowUser(testUser), new FlowClasses_1.FlowClient(createdUserOutput.newClientId));
        expect(createdProjectOutput).toEqual(expect.anything());
        var findProject = yield project_1.ProjectOperations.findProject(createdProjectOutput);
        expect(findProject).toEqual(expect.anything());
    }));
    it('should create an object', () => __awaiter(this, void 0, void 0, function* () {
        var createOut1 = yield databaseController_1.databaseController.createObject(new FlowClasses_1.FlowObject(object1), new FlowClasses_1.FlowProject(createdProjectOutput));
        expect(createOut1).toEqual(expect.anything());
    }));
    it('should modify an object', () => __awaiter(this, void 0, void 0, function* () {
        var createOut1 = yield databaseController_1.databaseController.createObject(new FlowClasses_1.FlowObject(object1), new FlowClasses_1.FlowProject(createdProjectOutput));
        expect(createOut1).toEqual(expect.anything());
        var modified = Object.assign({}, createOut1);
        modified.object.x = -1;
        console.log(modified.object);
        let updater = new FlowClasses_1.FlowObject(modified.object);
        updater._id = modified.object._id;
        yield databaseController_1.databaseController.updateObject(updater);
        console.log(createOut1);
        var foundObj = yield object_1.ObjectOperations.findObject(createOut1.object._id);
        expect(foundObj.x).toEqual(-1);
    }));
    it('should delete a user from a collection', () => __awaiter(this, void 0, void 0, function* () {
        var findPreDelete = yield user_1.UserOperations.findUser({ _id: createdUserOutput.newUserId });
        expect(findPreDelete._id).toEqual(createdUserOutput.newUserId);
        yield user_1.UserOperations.deleteUser({ _id: createdUserOutput.newUserId });
        var findPostDelete = yield user_1.UserOperations.findUser({ _id: createdUserOutput.newUserId });
        expect(findPostDelete).toEqual(null);
    }));
    it('should delete a project from a collection', () => __awaiter(this, void 0, void 0, function* () {
        var findProject = yield project_1.ProjectOperations.findProject(new FlowClasses_1.FlowProject(createdProjectOutput));
        expect(findProject).toEqual(expect.anything());
        yield databaseController_1.databaseController.deleteProject(new FlowClasses_1.FlowProject(createdProjectOutput));
        var findPostDelete = yield project_1.ProjectOperations.findProject(new FlowClasses_1.FlowProject(createdProjectOutput));
        expect(findPostDelete).toEqual(null);
    }));
});
//# sourceMappingURL=databaseController.test.js.map