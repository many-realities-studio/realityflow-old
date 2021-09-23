"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowNodeView = void 0;
class FlowNodeView {
    constructor(json) {
        this.LocalPos = json.LocalPos;
        this.NodeGUID = json.NodeGUID;
        this.CurrentCheckout = null;
    }
    UpdateProperties(newNodeView) {
        this.LocalPos = newNodeView.LocalPos;
    }
}
exports.FlowNodeView = FlowNodeView;
//# sourceMappingURL=FlowNodeView.js.map