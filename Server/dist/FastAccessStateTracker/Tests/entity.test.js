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
const user_1 = require("../../entity/user");
const project_1 = require("../../entity/project");
const object_1 = require("../../entity/object");
const vsgraph_1 = require("../../entity/vsgraph");
const UserSubscriber_1 = require("../../subscriber/UserSubscriber");
const bcrypt = require("bcrypt");
const behaviour_1 = require("../../entity/behaviour");
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
            project_1.Project,
            behaviour_1.Behaviour,
            vsgraph_1.VSGraph
        ],
        subscribers: [
            UserSubscriber_1.UserSubscriber
        ]
    });
}));
describe("connection", () => {
    it("works", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = yield typeorm_1.getConnection("test");
        expect(conn).toBeTruthy();
    }));
});
describe('User', () => {
    it('Can be created', () => __awaiter(void 0, void 0, void 0, function* () {
        let newUser = new user_1.User();
        newUser.Username = 'CanBeCreated';
        newUser.Password = 'Password';
        newUser.Projects = [];
        let returnedUser = yield typeorm_1.getConnection("test").manager.save(newUser);
        expect(returnedUser).toBeTruthy();
        expect(bcrypt.compareSync('Password', returnedUser.Password)).toEqual(true);
    }));
    it('can be found', () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = yield typeorm_1.getConnection("test");
        let newUser = new user_1.User();
        newUser.Username = 'CanBeFound';
        newUser.Password = 'Password';
        newUser.Projects = [];
        let returnedUser = yield conn.manager.save(newUser);
        expect(returnedUser).toBeTruthy();
        expect(bcrypt.compareSync('Password', returnedUser.Password)).toEqual(true);
        let check = yield conn.createQueryBuilder().
            select("user").
            from(user_1.User, "user").
            where("user.Username = :username", { username: 'CanBeFound' }).
            getOne();
        expect(check).toBeTruthy();
        expect(bcrypt.compareSync('Password', check.Password)).toEqual(true);
    }));
    it('Can be deleted', () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = yield typeorm_1.getConnection("test");
        let newUser = new user_1.User();
        newUser.Username = 'CanBeDeleted';
        newUser.Password = 'Password';
        newUser.Projects = [];
        let returnedUser = yield conn.manager.save(newUser);
        expect(returnedUser).toBeTruthy();
        expect(bcrypt.compareSync('Password', returnedUser.Password)).toEqual(true);
        yield conn.manager.remove(returnedUser);
        let check = yield conn.createQueryBuilder().
            select("user").
            from(user_1.User, "user").
            where("user.Username = :username", { username: 'CanBeDeleted' }).
            getOne();
        expect(check).toBeFalsy();
    }));
    it('can be updated', () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = yield typeorm_1.getConnection("test");
        let newUser = new user_1.User();
        newUser.Username = 'CanBeUpdated';
        newUser.Password = 'Password';
        newUser.Projects = [];
        let returnedUser = yield conn.manager.save(newUser);
        expect(returnedUser).toBeTruthy();
        expect(bcrypt.compareSync('Password', returnedUser.Password)).toEqual(true);
        yield conn.createQueryBuilder().
            update(user_1.User).
            set({ Password: "newPassword" }).
            where("Username = :Username", { Username: "CanBeUpdated" }).
            execute();
        let check = yield conn.createQueryBuilder().
            select("user").
            from(user_1.User, "user").
            where("user.Username = :username", { username: 'CanBeUpdated' }).
            getOne();
        expect(check).toBeTruthy();
        expect(bcrypt.compareSync('Password', check.Password)).toEqual(false);
        expect(bcrypt.compareSync('newPassword', check.Password)).toEqual(true);
    }));
    it('can be authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
    }));
});
describe('Project', () => {
    it("Can be created", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection("test");
        let createdProject = new project_1.Project();
        createdProject.Id = "createdProjectId";
        createdProject.ProjectName = "createdProjectName";
        createdProject.Description = "createdProjectDescription";
        createdProject.DateModified = Date.now();
        createdProject.ObjectList = [];
        createdProject.VSGraphList = [];
        let returnedProject = yield conn.manager.save(createdProject);
        expect(returnedProject.Id).toEqual("createdProjectId");
        expect(returnedProject.ProjectName).toEqual("createdProjectName");
    }));
    it("can be found", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection("test");
        let foundProject = new project_1.Project();
        foundProject.Id = "foundProjectId";
        foundProject.ProjectName = "foundProjectName";
        foundProject.Description = "foundProjectDescription";
        foundProject.DateModified = Date.now();
        foundProject.ObjectList = [];
        foundProject.VSGraphList = [];
        let returnedProject = yield conn.manager.save(foundProject);
        let check = yield conn.createQueryBuilder().
            select("project").
            from(project_1.Project, "project").
            where("Id = :id", { id: "foundProjectId" }).
            getOne();
        expect(check.Id).toEqual("foundProjectId");
        expect(check.ProjectName).toEqual("foundProjectName");
    }));
    it("can be updated", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection("test");
        let updateProject = new project_1.Project();
        updateProject.Id = "updateProjectId";
        updateProject.ProjectName = "updateProjectName";
        updateProject.Description = "updateProjectDescription";
        updateProject.DateModified = Date.now();
        updateProject.ObjectList = [];
        updateProject.VSGraphList = [];
        let returnedProject = yield conn.manager.save(updateProject);
        let check = yield conn.createQueryBuilder().
            select("project").
            from(project_1.Project, "project").
            where("Id = :id", { id: "updateProjectId" }).
            getOne();
        expect(check.Id).toEqual("updateProjectId");
        expect(check.ProjectName).toEqual("updateProjectName");
        yield conn.createQueryBuilder().
            update(project_1.Project).
            set({ ProjectName: "newName" }).
            where("Id = :id", { id: "updateProjectId" }).
            execute();
        let check_new = yield conn.createQueryBuilder().
            select("project").
            from(project_1.Project, "project").
            where("Id = :id", { id: "updateProjectId" }).
            getOne();
        expect(check_new.ProjectName).toEqual("newName");
    }));
    it("can be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection("test");
        let deletedProject = new project_1.Project();
        deletedProject.Id = "deletedProjectId";
        deletedProject.ProjectName = "deletedProjectName";
        deletedProject.Description = "deletedProjectDescription";
        deletedProject.DateModified = Date.now();
        deletedProject.ObjectList = [];
        deletedProject.VSGraphList = [];
        let returnedProject = yield conn.manager.save(deletedProject);
        let check = yield conn.createQueryBuilder().
            select("project").
            from(project_1.Project, "project").
            where("Id = :id", { id: "deletedProjectId" }).
            getOne();
        expect(check.Id).toEqual("deletedProjectId");
        expect(check.ProjectName).toEqual("deletedProjectName");
        yield conn.manager.remove(returnedProject);
        let check_again = yield conn.createQueryBuilder().
            select("project").
            from(project_1.Project, "project").
            where("Id = :id", { id: "deletedProjectId" }).
            getOne();
        expect(check_again).toBeFalsy();
    }));
    it("Can be owned by a user and is deleted when the user is deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection("test");
        let newUser = new user_1.User();
        newUser.Username = 'CanBeOwner';
        newUser.Password = 'Password';
        newUser.Projects = [];
        let returnedUser = yield conn.manager.save(newUser);
        expect(returnedUser).toBeTruthy();
        expect(bcrypt.compareSync('Password', returnedUser.Password)).toEqual(true);
        let createdProject = new project_1.Project();
        createdProject.Id = "ownedProjectId";
        createdProject.ProjectName = "ownedProjectName";
        createdProject.Description = "ownedProjectDescription";
        createdProject.DateModified = Date.now();
        createdProject.ObjectList = [];
        createdProject.VSGraphList = [];
        createdProject.Owner = newUser;
        let returnedProject = yield conn.manager.save(createdProject);
        let check = yield conn.createQueryBuilder().select("project").from(project_1.Project, "project").where("Id = :id", { id: "ownedProjectId" }).getRawOne();
        expect(check.project_ownerUsername).toEqual(newUser.Username);
        yield conn.createQueryBuilder().delete().from(user_1.User).where("Username = :id", { id: 'CanBeOwner' }).execute();
        let checkUser = yield conn.createQueryBuilder().select().from(user_1.User, "user").where("Username = :id", { id: 'CanBeOwner' }).getOne();
        expect(checkUser).toBeFalsy();
        let check_again = yield conn.createQueryBuilder().select("project").from(project_1.Project, "project").where("Id = :id", { id: "ownedProjectId" }).getOne();
        expect(check_again).toBeFalsy();
    }));
});
describe('Object', () => {
    it("can be created", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection("test");
        let newObject = new object_1.DBObject();
        newObject.Id = "newObjectId";
        newObject.Name = "newObjectName";
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
        newObject.Prefab = "prefab";
        let returnedObject = yield conn.manager.save(newObject);
        expect(returnedObject.Id).toEqual("newObjectId");
        expect(returnedObject.Name).toEqual("newObjectName");
    }));
    it("can be found", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection("test");
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
        foundObject.Prefab = "prefab";
        let returnedObject = yield conn.manager.save(foundObject);
        expect(returnedObject.Id).toEqual("foundObjectId");
        expect(returnedObject.Name).toEqual("foundObjectName");
        let check = yield conn.createQueryBuilder().select("object").from(object_1.DBObject, "object").where("object.Id = :id", { id: "foundObjectId" }).getOne();
        expect(check.Name).toEqual("foundObjectName");
    }));
    it("can be updated", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection("test");
        let updatedObject = new object_1.DBObject();
        updatedObject.Id = "updatedObjectId";
        updatedObject.Name = "updatedObjectName";
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
        updatedObject.Prefab = "prefab";
        let returnedObject = yield conn.manager.save(updatedObject);
        expect(returnedObject.Id).toEqual("updatedObjectId");
        expect(returnedObject.Name).toEqual("updatedObjectName");
        let check = yield conn.createQueryBuilder().select("object").from(object_1.DBObject, "object").where("object.Id = :id", { id: "updatedObjectId" }).getOne();
        expect(check.Name).toEqual("updatedObjectName");
        yield conn.createQueryBuilder().update(object_1.DBObject).set({ Name: "newName" }).where("Id = :id", { id: "updatedObjectId" }).execute();
        let check_Updated = yield conn.createQueryBuilder().select("object").from(object_1.DBObject, "object").where("object.Id = :id", { id: "updatedObjectId" }).getOne();
        expect(check_Updated.Name).toEqual("newName");
    }));
    it("can be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection("test");
        let deletedObject = new object_1.DBObject();
        deletedObject.Id = "deletedObjectId";
        deletedObject.Name = "deletedObjectName";
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
        deletedObject.Prefab = "prefab";
        let returnedObject = yield conn.manager.save(deletedObject);
        expect(returnedObject.Id).toEqual("deletedObjectId");
        expect(returnedObject.Name).toEqual("deletedObjectName");
        let check = yield conn.createQueryBuilder().select("object").from(object_1.DBObject, "object").where("object.Id = :id", { id: "deletedObjectId" }).getOne();
        expect(check.Name).toEqual("deletedObjectName");
        let result = yield conn
            .createQueryBuilder()
            .delete()
            .from(object_1.DBObject)
            .where("Id = :id", { id: "deletedObjectId" })
            .execute();
        let check_deleted = yield conn.createQueryBuilder().select("object").from(object_1.DBObject, "object").where("object.Id = :id", { id: "deletedObjectId" }).getOne();
        expect(check_deleted).toBeFalsy();
    }));
    it("can be owned by a project", () => {
    });
});
describe('VSGraph', () => {
    it("can be created", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection("test");
        let newVSGraph = new vsgraph_1.VSGraph();
        newVSGraph.Id = "newVSGraphId";
        newVSGraph.Name = "newVSGraphName";
        newVSGraph.serializedNodes = "[]";
        newVSGraph.edges = "[]";
        newVSGraph.groups = "[]";
        newVSGraph.stackNodes = "[]";
        newVSGraph.pinnedElements = "[]";
        newVSGraph.exposedParameters = "[]";
        newVSGraph.stickyNotes = "[]";
        newVSGraph.position = "{\"x\":0,\"y\":0,\"z\":0}";
        newVSGraph.scale = "{\"x\":1,\"y\":1,\"z\":1}";
        newVSGraph.references = "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}";
        newVSGraph.paramIdToObjId = "{\"keys\":[],\"values\":[]}";
        let returnedVSGraph = yield conn.manager.save(newVSGraph);
        expect(returnedVSGraph.Id).toEqual("newVSGraphId");
        expect(returnedVSGraph.Name).toEqual("newVSGraphName");
    }));
    it("can be found", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection("test");
        let foundVSGraph = new vsgraph_1.VSGraph();
        foundVSGraph.Id = "foundVSGraphId";
        foundVSGraph.Name = "foundVSGraphName";
        foundVSGraph.serializedNodes = "[]";
        foundVSGraph.edges = "[]";
        foundVSGraph.groups = "[]";
        foundVSGraph.stackNodes = "[]";
        foundVSGraph.pinnedElements = "[]";
        foundVSGraph.exposedParameters = "[]";
        foundVSGraph.stickyNotes = "[]";
        foundVSGraph.position = "{\"x\":0,\"y\":0,\"z\":0}";
        foundVSGraph.scale = "{\"x\":1,\"y\":1,\"z\":1}";
        foundVSGraph.references = "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}";
        foundVSGraph.paramIdToObjId = "{\"keys\":[],\"values\":[]}";
        let returnedVSGraph = yield conn.manager.save(foundVSGraph);
        expect(returnedVSGraph.Id).toEqual("foundVSGraphId");
        expect(returnedVSGraph.Name).toEqual("foundVSGraphName");
        let check = yield conn.createQueryBuilder().select("vsgraph").from(vsgraph_1.VSGraph, "vsgraph").where("vsgraph.Id = :id", { id: "foundVSGraphId" }).getOne();
        expect(check.Name).toEqual("foundVSGraphName");
    }));
    it("can be updated", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection("test");
        let updatedVSGraph = new vsgraph_1.VSGraph();
        updatedVSGraph.Id = "updatedVSGraphId";
        updatedVSGraph.Name = "updatedVSGraphName";
        updatedVSGraph.serializedNodes = "[]";
        updatedVSGraph.edges = "[]";
        updatedVSGraph.groups = "[]";
        updatedVSGraph.stackNodes = "[]";
        updatedVSGraph.pinnedElements = "[]";
        updatedVSGraph.exposedParameters = "[]";
        updatedVSGraph.stickyNotes = "[]";
        updatedVSGraph.position = "{\"x\":0,\"y\":0,\"z\":0}";
        updatedVSGraph.scale = "{\"x\":1,\"y\":1,\"z\":1}";
        updatedVSGraph.references = "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}";
        updatedVSGraph.paramIdToObjId = "{\"keys\":[],\"values\":[]}";
        let returnedVSGraph = yield conn.manager.save(updatedVSGraph);
        expect(returnedVSGraph.Id).toEqual("updatedVSGraphId");
        expect(returnedVSGraph.Name).toEqual("updatedVSGraphName");
        let check = yield conn.createQueryBuilder().select("vsgraph").from(vsgraph_1.VSGraph, "vsgraph").where("vsgraph.Id = :id", { id: "updatedVSGraphId" }).getOne();
        expect(check.Name).toEqual("updatedVSGraphName");
        yield conn.createQueryBuilder().update(vsgraph_1.VSGraph).set({ Name: "newName" }).where("Id = :id", { id: "updatedVSGraphId" }).execute();
        let check_Updated = yield conn.createQueryBuilder().select("vsgraph").from(vsgraph_1.VSGraph, "vsgraph").where("vsgraph.Id = :id", { id: "updatedVSGraphId" }).getOne();
        expect(check_Updated.Name).toEqual("newName");
    }));
    it("can be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        let conn = typeorm_1.getConnection("test");
        let deletedVSGraph = new vsgraph_1.VSGraph();
        deletedVSGraph.Id = "deletedVSGraphId";
        deletedVSGraph.Name = "deletedVSGraphName";
        deletedVSGraph.serializedNodes = "[]";
        deletedVSGraph.edges = "[]";
        deletedVSGraph.groups = "[]";
        deletedVSGraph.stackNodes = "[]";
        deletedVSGraph.pinnedElements = "[]";
        deletedVSGraph.exposedParameters = "[]";
        deletedVSGraph.stickyNotes = "[]";
        deletedVSGraph.position = "{\"x\":0,\"y\":0,\"z\":0}";
        deletedVSGraph.scale = "{\"x\":1,\"y\":1,\"z\":1}";
        deletedVSGraph.references = "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}";
        deletedVSGraph.paramIdToObjId = "{\"keys\":[],\"values\":[]}";
        let returnedVSGraph = yield conn.manager.save(deletedVSGraph);
        expect(returnedVSGraph.Id).toEqual("deletedVSGraphId");
        expect(returnedVSGraph.Name).toEqual("deletedVSGraphName");
        let check = yield conn.createQueryBuilder().select("vsgraph").from(vsgraph_1.VSGraph, "vsgraph").where("vsgraph.Id = :id", { id: "deletedVSGraphId" }).getOne();
        expect(check.Name).toEqual("deletedVSGraphName");
        let result = yield conn
            .createQueryBuilder()
            .delete()
            .from(vsgraph_1.VSGraph)
            .where("Id = :id", { id: "deletedVSGraphId" })
            .execute();
        let check_deleted = yield conn.createQueryBuilder().select("vsgraph").from(vsgraph_1.VSGraph, "vsgraph").where("vsgraph.Id = :id", { id: "deletedVSGraphId" }).getOne();
        expect(check_deleted).toBeFalsy();
    }));
});
//# sourceMappingURL=entity.test.js.map