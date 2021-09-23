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
const server_1 = require("../server");
const server_2 = require("../server");
const StateTracker_1 = require("../FastAccessStateTracker/StateTracker");
const FlowObject_1 = require("../FastAccessStateTracker/FlowLibrary/FlowObject");
const MessageBuilder_1 = require("../FastAccessStateTracker/Messages/MessageBuilder");
const resolvers = {
    Query: {
        behaviour: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return context.prisma.behaviour.findMany();
        }),
        user: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return context.prisma.user.findMany({ include: { project: { include: { user: true, db_object: true } } } });
        }),
        project: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return context.prisma.project.findMany({ include: { user: true, db_object: true } });
        }),
        object: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return context.prisma.db_object.findMany({ include: { project: true, user: true } });
        }),
    },
    Mutation: {
        createBehaviour: (parent, args, context, info) => {
            const newBehaviour = context.prisma.behaviour.create({
                data: {
                    Id: args.Id,
                    TypeOfTrigger: args.TypeOfTrigger,
                    TriggerObjectId: args.TriggerObjectId,
                    TargetObjectId: args.TargetObjectId,
                    ProjectId: args.ProjectId,
                    NextBehaviour: args.NextBehaviour,
                    Action: JSON.stringify(args.Action),
                },
            });
            return newBehaviour;
        },
        updateBehaviour: (parent, args, context, info) => {
            const updated_Behaviour = context.prisma.behaviour.update({
                data: {
                    TypeOfTrigger: args.TypeOfTrigger,
                    TriggerObjectId: args.TriggerObjectId,
                    TargetObjectId: args.TargetObjectId,
                    ProjectId: args.ProjectId,
                    NextBehaviour: args.NextBehaviour,
                    Action: args.Action,
                },
                where: { Id: args.Id }
            });
            return updated_Behaviour;
        },
        deleteBehaviour: (parent, args, context, info) => {
            const delete_behaviour = context.prisma.behaviour.delete({
                where: { Id: args.Id }
            });
            return delete_behaviour;
        },
        createUser: (_, args, context, __) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(args.input);
            let DateModified = new Date().toISOString();
            const newuser = yield context.prisma.user.create({
                include: {
                    project: true
                },
                data: {
                    Username: args.Username,
                    Password: args.Password,
                },
            });
            return newuser;
        }),
        updateUser: (parent, args, context, info) => {
            const updated_user = context.prisma.user.update({
                data: {
                    Username: args.Username,
                    Password: args.Password,
                },
                where: { Username: args.Username }
            });
            return updated_user;
        },
        deleteUser: (parent, args, context, info) => {
            const finish = server_1.prisma.user.findMany({
                include: {
                    project: {
                        include: {
                            user: true, db_object: true
                        }
                    }
                }
            });
        },
        createProject: (parent, args, context, info) => {
            const create_project = context.prisma.project.create({
                data: {
                    Id: args.Id,
                    Description: args.Description,
                    ProjectName: args.ProjectName,
                    DateModified: new Date().toISOString(),
                    ownerUsername: args.ownerUsername
                },
                include: {
                    user: true,
                    db_object: true
                }
            });
            return create_project;
        },
        updateProject: (parent, args, context, info) => {
            const update_project = context.prisma.project.update({
                data: {
                    Description: args.Description,
                    ProjectName: args.ProjectName,
                    DateModified: new Date().toISOString(),
                    ownerUsername: args.ownerUsername
                },
                where: { Id: args.Id }
            });
            return update_project;
        },
        deleteProject: (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
            const deleteProjObj = context.prisma.db_object.deleteMany({
                where: {
                    projectId: args.Id,
                }
            });
            const deleteProj = context.prisma.project.delete({
                where: {
                    Id: args.Id,
                }
            });
            const [result1, result2] = yield server_1.prisma.$transaction([deleteProjObj, deleteProj]);
            return result2;
        }),
        createObject: (_, args, context, __) => __awaiter(void 0, void 0, void 0, function* () {
            const create_object = context.prisma.db_object.create({
                data: {
                    Id: args.Id,
                    Name: args.Name,
                    X: args.X,
                    Y: args.Y,
                    Z: args.Z,
                    Q_x: args.Q_x,
                    Q_y: args.Q_y,
                    Q_z: args.Q_z,
                    Q_w: args.Q_w,
                    S_x: args.S_x,
                    S_y: args.S_y,
                    S_z: args.S_z,
                    R: args.R,
                    G: args.G,
                    B: args.B,
                    A: args.A,
                    Prefab: args.Prefab,
                    projectId: args.projectId,
                },
                include: {
                    project: true
                }
            });
            FAMaccess(1, args);
            return create_object;
        }),
        updateObject: (_, args, context, __) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                var object = yield StateTracker_1.StateTracker.ReadObject(args.Id, args.projectId, args.username);
            }
            catch (error) {
                console.error(error);
                process.exit(1);
            }
            finally {
                StateTracker_1.StateTracker.UpdateObject(object[0], args.projectId, "client:none", true, args.username);
                StateTracker_1.StateTracker.CheckinObject(args.projectId, args.Id, "client:none", args.username);
                const update_object = context.prisma.db_object.update({
                    data: {
                        Name: object[0].Name,
                        X: object[0].X,
                        Y: object[0].Y,
                        Z: object[0].Z,
                        Q_x: object[0].Q_x,
                        Q_y: object[0].Q_y,
                        Q_z: object[0].Q_z,
                        Q_w: object[0].Q_w,
                        S_x: object[0].S_x,
                        S_y: object[0].S_y,
                        S_z: object[0].S_z,
                        R: object[0].R,
                        G: object[0].G,
                        B: object[0].B,
                        A: object[0].A,
                        Prefab: object[0].Prefab,
                        projectId: object[0].projectId,
                    },
                    where: { Id: object[0].Id }
                });
                return update_object;
            }
        }),
        deleteObject: (_, args, context, __) => __awaiter(void 0, void 0, void 0, function* () {
            const delete_object = context.prisma.db_object.delete({
                where: {
                    Id: args.Id
                }
            });
            yield FAMaccess(2, args);
            return delete_object;
        }),
        createVSGraph: (_, args, context, __) => {
            const create_VSGraph = context.prisma.vs_graph.create({
                data: {
                    Name: args.Name,
                    serializedNodes: args.serializedNodes,
                    edges: args.edges,
                    groups: args.stackNodes,
                    stackNodes: args.stackNodes,
                    pinnedElements: args.pinnedElements,
                    exposedParameters: args.exposedParameters,
                    stickyNotes: args.stickyNotes,
                    position: args.position,
                    scale: args.scale,
                    references: args.references,
                    projectId: args.projectId,
                    project: args.project
                },
                include: {
                    project: true
                }
            });
            return create_VSGraph;
        },
        updateVSGraph: (_, args, context, __) => {
            const update_VSGraph = context.prisma.vs_graph.update({
                data: {
                    Name: args.Name,
                    serializedNodes: args.serializedNodes,
                    edges: args.edges,
                    groups: args.stackNodes,
                    stackNodes: args.stackNodes,
                    pinnedElements: args.pinnedElements,
                    exposedParameters: args.exposedParameters,
                    stickyNotes: args.stickyNotes,
                    position: args.position,
                    scale: args.scale,
                    references: args.references,
                    projectId: args.projectId,
                    project: args.project
                },
                where: { Id: args.Id }
            });
            return update_VSGraph;
        },
        deleteVSGraph: (_, args, context, __) => {
            const delete_VSGraph = context.prisma.vs_graph.delete({
                where: {
                    Id: args.Id
                }
            });
            return delete_VSGraph;
        }
    }
};
function FAMaccess(FAM, args) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (FAM) {
            case 1:
                try {
                    var argsObj = new FlowObject_1.FlowObject(args);
                    var res1 = yield StateTracker_1.StateTracker.CreateObject(argsObj, args.projectId);
                }
                catch (error) {
                    console.error(error);
                    process.exit(1);
                }
                finally {
                    let returnContent = {
                        "MessageType": "CreateObject",
                        "FlowObject": res1[0],
                        "WasSuccessful": (res1[0] == null) ? false : true
                    };
                    let returnMessage = MessageBuilder_1.MessageBuilder.CreateMessage(returnContent, res1[1]);
                    TalkToClients(returnMessage);
                }
                break;
            case 2:
                var res2 = yield StateTracker_1.StateTracker.DeleteObject(args.Id, args.projectId, "none");
                let returnContent = {
                    "MessageType": "DeleteObject",
                    "ObjectId": res2[0],
                    "WasSuccessful": (res2[0] == null) ? false : true,
                };
                let returnMessage = MessageBuilder_1.MessageBuilder.CreateMessage(returnContent, res2[1]);
                TalkToClients(returnMessage);
                break;
        }
    });
}
function TalkToClients(res) {
    console.log("We made it from GraphQL!");
    let clients = res[1];
    if (!clients) {
        console.log("Didn't receive a clients array [We're in Apollo]");
    }
    else {
        for (var i = 0; i < clients.length; i++) {
            let key = clients[i];
            server_2.ServerEventDispatcher.SocketConnections.get(key).send(res[0]);
        }
    }
}
module.exports = { resolvers };
//# sourceMappingURL=index.js.map