"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowProject = void 0;
class FlowProject {
    constructor(json) {
        this._ObjectList = [];
        this._BehaviourList = [];
        this._VSGraphList = [];
        this._NodeViewList = [];
        this._AvatarList = [];
        this.Id = json.Id;
        this.Description = json.Description;
        this.DateModified = json.DateModified;
        this.ProjectName = json.ProjectName;
    }
    AddObject(objectToAdd) {
        this._ObjectList.push(objectToAdd);
        return true;
    }
    DeleteObject(objectToRemove, client) {
        let index = this._ObjectList.findIndex((element) => element.Id == objectToRemove);
        if (index > -1 && this._ObjectList[index].CurrentCheckout == client) {
            this._ObjectList.splice(index);
            return true;
        }
        else
            return false;
    }
    GetObject(objectId) {
        return this._ObjectList.find(element => element.Id == objectId);
    }
    CheckoutObject(objectId, client) {
        let obj = this._ObjectList.find(element => element.Id == objectId);
        if (obj != undefined && obj.CurrentCheckout == null) {
            this._ObjectList.find(element => element.Id == objectId).CurrentCheckout = client;
            return true;
        }
        else
            return false;
    }
    CheckinObject(objectId, client) {
        let obj = this._ObjectList.find(element => element.Id == objectId);
        if (obj != undefined && obj.CurrentCheckout == client) {
            obj.CurrentCheckout = null;
            return true;
        }
        else
            return false;
    }
    GetObjectHolder(objectId) {
        return this._ObjectList.find(element => element.Id == objectId).CurrentCheckout;
    }
    UpdateFAMObject(newObject, client) {
        var oldObject = this._ObjectList.find(element => element.Id == newObject.Id);
        if (oldObject != undefined && oldObject.CurrentCheckout == client) {
            oldObject.UpdateProperties(newObject);
            return true;
        }
        else
            return false;
    }
    AddAvatar(AvatarToAdd) {
        this._AvatarList.push(AvatarToAdd);
        return true;
    }
    DeleteAvatar(AvatarToRemove, client) {
        let index = this._AvatarList.findIndex((element) => element.Id == AvatarToRemove);
        if (index > -1) {
            this._AvatarList.splice(index);
            return true;
        }
        else
            return false;
    }
    GetAvatar(AvatarId) {
        return this._AvatarList.find(element => element.Id == AvatarId);
    }
    GetAvatarList() {
        return this._AvatarList;
    }
    UpdateFAMAvatar(newAvatar, client) {
        var oldAvatar = this._AvatarList.find(element => element.Id == newAvatar.Id);
        if (oldAvatar != undefined) {
            oldAvatar.UpdateProperties(newAvatar);
            return true;
        }
        else
            return false;
    }
    UpdateBehaviour(newBehaviour, client) {
        var oldBehaviour = this._BehaviourList.find(element => element.Id == newBehaviour.Id);
        if (oldBehaviour != undefined) {
            oldBehaviour.UpdateProperties(newBehaviour);
            return true;
        }
        else
            return false;
    }
    AddBehaviour(BehaviourToAdd) {
        this._BehaviourList.push(BehaviourToAdd);
    }
    DeleteBehaviour(BehaviourToRemove) {
        this._BehaviourList = this._BehaviourList.filter((behaviour, index, arr) => BehaviourToRemove.indexOf(behaviour.Id) == -1);
        return true;
    }
    GetBehaviour(BehaviourId) {
        return this._BehaviourList.find(element => element.Id == BehaviourId);
    }
    static OpenProject(projectToOpen) {
        throw new Error("Method not implemented.");
    }
    AddVSGraph(vsGraphToAdd) {
        this._VSGraphList.push(vsGraphToAdd);
        return true;
    }
    DeleteVSGraph(vsGraphToRemove, client) {
        let index = this._VSGraphList.findIndex((element) => element.Id == vsGraphToRemove);
        if (index > -1) {
            this._VSGraphList.splice(index);
            return true;
        }
        else
            return false;
    }
    GetVSGraph(vsGraphId) {
        return this._VSGraphList.find(element => element.Id == vsGraphId);
    }
    CheckoutNodeView(flowNodeView, client) {
        this._NodeViewList.push(flowNodeView);
        let nv = this._NodeViewList.find(element => element.NodeGUID == flowNodeView.NodeGUID);
        if (nv != undefined && nv.CurrentCheckout == null) {
            this._NodeViewList.find(element => element.NodeGUID == flowNodeView.NodeGUID).CurrentCheckout = client;
            return true;
        }
        else
            return false;
    }
    CheckinNodeView(nodeGUID, client) {
        let nv = this._NodeViewList.find(element => element.NodeGUID == nodeGUID);
        if (nv != undefined && nv.CurrentCheckout == client) {
            nv.CurrentCheckout = null;
            let index = this._NodeViewList.findIndex((element) => element.NodeGUID == nodeGUID);
            if (index > -1) {
                this._NodeViewList.splice(index);
            }
            return true;
        }
        else
            return false;
    }
    UpdateFAMVSGraph(newVSGraph, client) {
        var oldVSGraph = this._VSGraphList.find(element => element.Id == newVSGraph.Id);
        if (oldVSGraph != undefined) {
            oldVSGraph.UpdateProperties(newVSGraph);
            return true;
        }
        else
            return false;
    }
    GetNodeView(nodeGUID) {
        return this._NodeViewList.find(element => element.NodeGUID == nodeGUID);
    }
    UpdateFAMNodeView(newNodeView, client) {
        var oldNodeView = this._NodeViewList.find(element => element.NodeGUID == newNodeView.NodeGUID);
        if (oldNodeView != undefined && oldNodeView.CurrentCheckout == client) {
            oldNodeView.UpdateProperties(newNodeView);
            return true;
        }
        else
            return false;
    }
}
exports.FlowProject = FlowProject;
//# sourceMappingURL=FlowProject.js.map