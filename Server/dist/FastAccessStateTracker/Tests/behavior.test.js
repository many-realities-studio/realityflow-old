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
const project_1 = require("../../entity/project");
const object_1 = require("../../entity/object");
const vsgraph_1 = require("../../entity/vsgraph");
const object_2 = require("../../ORMCommands/object");
const behaviour_1 = require("../../entity/behaviour");
const user_1 = require("../../entity/user");
const UserSubscriber_1 = require("../../subscriber/UserSubscriber");
const typeorm_1 = require("typeorm");
const FlowBehaviour_1 = require("../FlowLibrary/FlowBehaviour");
const behaviour_2 = require("../../ORMCommands/behaviour");
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
            behaviour_1.Behaviour,
            vsgraph_1.VSGraph
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
        createdProject.VSGraphList = [];
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
            Prefab: "prefab1"
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
            Prefab: "prefab2"
        };
        let x = yield object_2.ObjectOperations.createObject(object1, returnedProject.Id);
        let y = yield object_2.ObjectOperations.createObject(object2, returnedProject.Id);
        let nextBehaviour1 = new Array();
        let nextBehaviour2 = new Array();
        nextBehaviour1.push("Behaviour");
        nextBehaviour2.push("Behaviour2");
        let Behaviour1 = new FlowBehaviour_1.FlowBehaviour({
            Id: "TestBehaviourId",
            TriggerObjectId: "Trigger",
            TargetObjectId: "Target",
            TypeOfTrigger: "Type",
            Action: "Action",
            NextBehaviour: nextBehaviour1,
            ProjectId: "ProjectId"
        });
        let Behaviour2 = new FlowBehaviour_1.FlowBehaviour({
            Id: "TestBehaviourId2",
            TriggerObjectId: "Target",
            TargetObjectId: "Trigger",
            TypeOfTrigger: "Type",
            Action: "Action",
            NextBehaviour: nextBehaviour2,
            ProjectId: "ProjectId"
        });
        let check = yield behaviour_2.BehaviourOperations.CreateBehaviour([Behaviour1, Behaviour2]);
        expect(check).toBeTruthy();
        let find = yield typeorm_1.getConnection(process.env.NODE_ENV).createQueryBuilder()
            .select("Behaviour")
            .from(behaviour_1.Behaviour, "Behaviour")
            .where("ChainOwner = :owner", { owner: "Trigger" })
            .orderBy("Behaviour.Index", "ASC")
            .execute();
        expect(find).toBeTruthy();
        console.log(find);
    }));
    it("can be referenced by its owning object", () => __awaiter(void 0, void 0, void 0, function* () {
        let check = yield behaviour_2.BehaviourOperations.getBehaviours("Trigger");
        expect(check).toBeTruthy();
        expect(check[0].Id).toEqual("TestBehaviourId2");
    }));
    it("can be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        yield behaviour_2.BehaviourOperations.deleteBehaviour(["Trigger"]);
        let check = yield behaviour_2.BehaviourOperations.getBehaviours("createObjectProjectId");
        expect(check).toBeTruthy();
        expect(check.length).toEqual(0);
    }));
});
//# sourceMappingURL=behavior.test.js.map