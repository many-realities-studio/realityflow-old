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
exports.VSGraphOperations = void 0;
const typeorm_1 = require("typeorm");
const project_1 = require("../entity/project");
const vsgraph_1 = require("../entity/vsgraph");
class VSGraphOperations {
    static createVSGraph(vsGraphInfo, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            let project = yield typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .select("Project")
                .from(project_1.Project, "Project")
                .where("Project.Id = :id", { id: projectId })
                .getOne();
            var newVSGraph = new vsgraph_1.VSGraph();
            newVSGraph.Id = vsGraphInfo.Id;
            newVSGraph.Name = vsGraphInfo.Name;
            newVSGraph.serializedNodes = JSON.stringify(vsGraphInfo.serializedNodes);
            newVSGraph.edges = JSON.stringify(vsGraphInfo.edges);
            newVSGraph.groups = JSON.stringify(vsGraphInfo.groups);
            newVSGraph.stackNodes = JSON.stringify(vsGraphInfo.stackNodes);
            newVSGraph.pinnedElements = JSON.stringify(vsGraphInfo.pinnedElements);
            newVSGraph.exposedParameters = JSON.stringify(vsGraphInfo.exposedParameters);
            newVSGraph.stickyNotes = JSON.stringify(vsGraphInfo.stickyNotes);
            newVSGraph.position = JSON.stringify(vsGraphInfo.position);
            newVSGraph.scale = JSON.stringify(vsGraphInfo.scale);
            newVSGraph.references = JSON.stringify(vsGraphInfo.references);
            newVSGraph.paramIdToObjId = JSON.stringify(vsGraphInfo.paramIdToObjId);
            newVSGraph.Project = project;
            yield typeorm_1.getConnection(process.env.NODE_ENV).manager.save(newVSGraph);
        });
    }
    static findVSGraph(vsGraphInfoId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            var vsGraph = yield typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .select("VSGraph")
                .from(vsgraph_1.VSGraph, "VSGraph")
                .where({ Id: vsGraphInfoId }).getOne();
            return vsGraph;
        });
    }
    static updateVSGraph(vsGraphInfo, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .update(vsgraph_1.VSGraph)
                .set({
                serializedNodes: JSON.stringify(vsGraphInfo.serializedNodes),
                edges: JSON.stringify(vsGraphInfo.edges),
                groups: JSON.stringify(vsGraphInfo.groups),
                stackNodes: JSON.stringify(vsGraphInfo.stackNodes),
                pinnedElements: JSON.stringify(vsGraphInfo.pinnedElements),
                exposedParameters: JSON.stringify(vsGraphInfo.exposedParameters),
                stickyNotes: JSON.stringify(vsGraphInfo.stickyNotes),
                position: JSON.stringify(vsGraphInfo.position),
                scale: JSON.stringify(vsGraphInfo.scale),
                references: JSON.stringify(vsGraphInfo.references),
                paramIdToObjId: JSON.stringify(vsGraphInfo.paramIdToObjId)
            })
                .where("Id = :id", { id: vsGraphInfo.Id })
                .execute();
        });
    }
    static deleteVSGraph(vsGraphId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .delete()
                .from(vsgraph_1.VSGraph)
                .where("Id = :id", { id: vsGraphId })
                .execute();
        });
    }
}
exports.VSGraphOperations = VSGraphOperations;
//# sourceMappingURL=vsgraph.js.map