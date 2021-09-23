"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowVSGraph = void 0;
class FlowVSGraph {
    constructor(json) {
        this.Id = json.Id;
        this.Name = json.Name;
        this.serializedNodes = json.serializedNodes;
        this.edges = json.edges;
        this.groups = json.groups;
        this.stackNodes = json.stackNodes;
        this.pinnedElements = json.pinnedElements;
        this.exposedParameters = json.exposedParameters;
        this.stickyNotes = json.stickyNotes;
        this.position = json.position;
        this.scale = json.scale;
        this.references = json.references;
        this.paramIdToObjId = json.paramIdToObjId;
    }
    UpdateProperties(newVSGraph) {
        this.Name = newVSGraph.Name;
        this.serializedNodes = newVSGraph.serializedNodes;
        this.edges = newVSGraph.edges;
        this.groups = newVSGraph.groups;
        this.stackNodes = newVSGraph.stackNodes;
        this.pinnedElements = newVSGraph.pinnedElements;
        this.exposedParameters = newVSGraph.exposedParameters;
        this.stickyNotes = newVSGraph.stickyNotes;
        this.position = newVSGraph.position;
        this.scale = newVSGraph.scale;
        this.references = newVSGraph.references;
        this.paramIdToObjId = newVSGraph.paramIdToObjId;
    }
}
exports.FlowVSGraph = FlowVSGraph;
//# sourceMappingURL=FlowVSGraph.js.map