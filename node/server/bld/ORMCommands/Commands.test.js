"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_1 = require("../entity/user");
const project_1 = require("../entity/project");
const object_1 = require("../entity/object");
const UserSubscriber_1 = require("../entity/UserSubscriber");
const user_2 = require("./user");
const project_2 = require("./project");
const object_2 = require("./object");
const bcrypt = require("bcrypt");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield typeorm_1.createConnection({
        "name": "test",
        "type": "sqlite",
        "database": "../database/test.db",
        "synchronize": true,
        "logging": false,
        "dropSchema": true,
        "entities": [
            object_1.DBObject,
            user_1.User,
            project_1.Project
        ],
        subscribers: [
            UserSubscriber_1.UserSubscriber
        ]
    });
    process.env.NODE_ENV = "test";
}));
describe("User", () => {
    it("can be created", () => __awaiter(void 0, void 0, void 0, function* () {
        let testUser = {
            Username: "createdUser",
            Password: "TestPassword"
        };
        yield user_2.UserOperations.createUser(testUser.Username, testUser.Password);
        let check = yield typeorm_1.getConnection(process.env.NODE_ENV)
            .createQueryBuilder().
            select("user").
            from(user_1.User, "user").
            where("user.Username = :username", { username: testUser.Username }).
            getOne();
        expect(check).toBeTruthy();
        expect(bcrypt.compareSync(testUser.Password, check.Password)).toBeTruthy();
    }));
    it("can be read", () => __awaiter(void 0, void 0, void 0, function* () {
        let newUser = new user_1.User();
        newUser.Username = 'CanBeFound';
        newUser.Password = 'Password';
        newUser.Projects = [];
        let returnedUser = yield typeorm_1.getConnection(process.env.NODE_ENV).manager.save(newUser);
        let foundUser = yield user_2.UserOperations.findUser(newUser.Username);
        expect(foundUser.Username).toEqual(newUser.Username);
    }));
    it("can be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection(process.env.NODE_ENV);
        let newUser = new user_1.User();
        newUser.Username = 'UserCanBeDeleted';
        newUser.Password = 'Password';
        newUser.Projects = [];
        let returnedUser = yield conn.manager.save(newUser);
        user_2.UserOperations.deleteUser(newUser.Username);
        let check = yield typeorm_1.getConnection(process.env.NODE_ENV).createQueryBuilder().
            select("user").
            from(user_1.User, "user").
            where("user.Username = :username", { username: newUser.Username }).
            getOne();
        expect(check).toBeFalsy();
    }));
});
describe("Project", () => {
    it("can be created", () => __awaiter(void 0, void 0, void 0, function* () {
        var testProject1 = {
            Id: "createdProjecttest",
            Description: "This is a project",
            ProjectName: "TestProject1",
            DateModified: Date.now(),
        };
        var testUser = {
            Username: "YashProject1",
            Password: "test"
        };
        yield user_2.UserOperations.createUser(testUser.Username, testUser.Password);
        yield project_2.ProjectOperations.createProject(testProject1, testUser.Username);
        let check = typeorm_1.getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .select()
            .from(project_1.Project, "project")
            .where("Id = :id", { id: testProject1.Id })
            .getOne();
        expect(check).toBeTruthy();
    }));
    it("can be read", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection(process.env.NODE_ENV);
        let foundProject = new project_1.Project();
        foundProject.Id = "foundProjectId";
        foundProject.ProjectName = "foundProjectName";
        foundProject.Description = "foundProjectDescription";
        foundProject.DateModified = Date.now();
        foundProject.ObjectList = [];
        let returnedProject = yield conn.manager.save(foundProject);
        let check = yield project_2.ProjectOperations.findProject(foundProject.Id);
        expect(check).toBeTruthy();
    }));
    it("can be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection(process.env.NODE_ENV);
        let deletedProject = new project_1.Project();
        deletedProject.Id = "deletedProjectId";
        deletedProject.ProjectName = "deletedProjectName";
        deletedProject.Description = "deletedProjectDescription";
        deletedProject.DateModified = Date.now();
        deletedProject.ObjectList = [];
        let returnedProject = yield conn.manager.save(deletedProject);
        let check = yield project_2.ProjectOperations.findProject(deletedProject.Id);
        console.log(check);
        expect(check).toBeTruthy();
        yield project_2.ProjectOperations.deleteProject(deletedProject.Id);
        check = yield project_2.ProjectOperations.findProject(deletedProject.Id);
        expect(check).toBeFalsy();
    }));
});
describe("Object", () => {
    it("can be created", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection(process.env.NODE_ENV);
        let createdProject = new project_1.Project();
        createdProject.Id = "createObjectProjectId";
        createdProject.ProjectName = "createdProjectName";
        createdProject.Description = "createdProjectDescription";
        createdProject.DateModified = Date.now();
        createdProject.ObjectList = [];
        let returnedProject = yield conn.manager.save(createdProject);
        var object1 = {
            Id: "createdObjectId",
            name: "object1",
            X: 3,
            Y: 1,
            Z: 1,
            Q_x: 1,
            Q_y: 1,
            Q_z: 1,
            Q_w: 1,
            S_x: 1,
            S_y: 1,
            S_z: 1,
            R: 1,
            G: 1,
            B: 1,
            A: 1,
        };
        yield object_2.ObjectOperations.createObject(object1, returnedProject.Id);
    }));
    it("can be read", () => __awaiter(void 0, void 0, void 0, function* () {
        let createdProject = new project_1.Project();
        createdProject.Id = "foundObjectProjectId";
        createdProject.ProjectName = "createdProjectName";
        createdProject.Description = "createdProjectDescription";
        createdProject.DateModified = Date.now();
        createdProject.ObjectList = [];
        let returnedProject = yield typeorm_1.getConnection(process.env.NODE_ENV).manager.save(createdProject);
        let foundObject = new object_1.DBObject();
        foundObject.Id = "foundObjectId";
        foundObject.Name = "foundObjectName";
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
        let returnedObject = yield typeorm_1.getConnection(process.env.NODE_ENV).manager.save(foundObject);
        expect(returnedObject.Id).toEqual("foundObjectId");
        expect(returnedObject.Name).toEqual("foundObjectName");
        let check = yield object_2.ObjectOperations.findObject(returnedObject.Id, createdProject.Id);
        expect(check.Name).toEqual("foundObjectName");
    }));
    it("can be updated", () => __awaiter(void 0, void 0, void 0, function* () {
        let createdProject = new project_1.Project();
        createdProject.Id = "updatedObjectProjectId";
        createdProject.ProjectName = "createdProjectName";
        createdProject.Description = "createdProjectDescription";
        createdProject.DateModified = Date.now();
        createdProject.ObjectList = [];
        let returnedProject = yield typeorm_1.getConnection(process.env.NODE_ENV).manager.save(createdProject);
        let foundObject = new object_1.DBObject();
        foundObject.Id = "updatedObjectId";
        foundObject.Name = "foundObjectName";
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
        let returnedObject = yield typeorm_1.getConnection(process.env.NODE_ENV).manager.save(foundObject);
        let updatedObject = new object_1.DBObject();
        updatedObject.Id = "updatedObjectId";
        updatedObject.Name = "updatedObjectName";
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
        yield object_2.ObjectOperations.updateObject(updatedObject, createdProject.Id);
        let check = yield typeorm_1.getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .select("object")
            .from(object_1.DBObject, "object")
            .where("object.Id = :id", { id: foundObject.Id })
            .getOne();
        expect(check.X).toEqual(2);
    }));
    it("can be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        let createdProject = new project_1.Project();
        createdProject.Id = "updatedObjectProjectId";
        createdProject.ProjectName = "createdProjectName";
        createdProject.Description = "createdProjectDescription";
        createdProject.DateModified = Date.now();
        createdProject.ObjectList = [];
        let returnedProject = yield typeorm_1.getConnection(process.env.NODE_ENV).manager.save(createdProject);
        let foundObject = new object_1.DBObject();
        foundObject.Id = "deletedObjectId";
        foundObject.Name = "foundObjectName";
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
        let returnedObject = yield typeorm_1.getConnection(process.env.NODE_ENV).manager.save(foundObject);
        yield object_2.ObjectOperations.deleteObject(foundObject.Id, createdProject.Id);
        let check = yield typeorm_1.getConnection(process.env.NODE_ENV)
            .createQueryBuilder()
            .select("object")
            .from(object_1.DBObject, "object")
            .where("object.Id = :id", { id: foundObject.Id })
            .getOne();
        expect(check).toBeFalsy();
    }));
});
//# sourceMappingURL=Commands.test.js.map