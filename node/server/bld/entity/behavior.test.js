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
const project_1 = require("./project");
const object_1 = require("./object");
const object_2 = require("../ORMCommands/object");
const behavior_1 = require("./behavior");
const user_1 = require("./user");
const UserSubscriber_1 = require("./UserSubscriber");
const typeorm_1 = require("typeorm");
const FlowBehavior_1 = require("../FastAccessStateTracker/FlowLibrary/FlowBehavior");
const behavior_2 = require("../ORMCommands/behavior");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield typeorm_1.createConnection({
        "name": "test",
        "type": "sqlite",
        "database": "../database/test.db",
        "synchronize": true,
        "logging": true,
        "dropSchema": true,
        "entities": [
            object_1.DBObject,
            user_1.User,
            project_1.Project,
            behavior_1.Behavior
        ],
        subscribers: [
            UserSubscriber_1.UserSubscriber
        ]
    });
    process.env.NODE_ENV = "test";
}));
describe("entity", () => {
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
            Id: "trigger",
            Name: "object1",
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
        var object2 = {
            Id: "Target",
            Name: "object1",
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
        let x = yield object_2.ObjectOperations.createObject(object1, returnedProject.Id);
        let y = yield object_2.ObjectOperations.createObject(object2, returnedProject.Id);
        let behavior1 = new FlowBehavior_1.FlowBehavior({
            Id: "TestBehaviorId",
            Name: 'Name',
            Trigger: "Trigger",
            Target: "Target",
            Index: 1,
            ChainOwner: "Trigger"
        });
        let behavior2 = new FlowBehavior_1.FlowBehavior({
            Id: "TestBehaviorId2",
            Name: 'Name',
            Trigger: "Target",
            Target: "Trigger",
            Index: 0,
            ChainOwner: "Trigger"
        });
        let check = yield behavior_2.BehaviorOperations.CreateBehavior([behavior1, behavior2], "Trigger");
        expect(check).toBeTruthy();
        let find = yield typeorm_1.getConnection(process.env.NODE_ENV).createQueryBuilder()
            .select()
            .from(behavior_1.Behavior, "behavior")
            .where("ChainOwner = :owner", { owner: "Trigger" })
            .orderBy("behavior.Index", "ASC")
            .execute();
        expect(find).toBeTruthy();
        console.log(find);
    }));
    it("can be referenced by its owning object", () => __awaiter(void 0, void 0, void 0, function* () {
        let check = yield behavior_2.BehaviorOperations.getBehavior("Trigger");
        expect(check).toBeTruthy();
        expect(check[0].Name).toEqual("Name");
    }));
    it("can be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        yield behavior_2.BehaviorOperations.deleteBehavior("Trigger");
        let check = yield behavior_2.BehaviorOperations.getBehavior("Trigger");
        expect(check).toBeTruthy();
        expect(check.length).toEqual(0);
    }));
});
//# sourceMappingURL=behavior.test.js.map