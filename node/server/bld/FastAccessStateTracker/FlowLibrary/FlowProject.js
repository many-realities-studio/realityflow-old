"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FlowProject {
    constructor(json) {
        this._ObjectList = [];
        this._BehaviorList = [];
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
    AddBehavior(objectId, behaviorToAdd) {
        this._ObjectList.find(element => element.Id == objectId).behavior = behaviorToAdd;
    }
    DeleteBehavior(objectId) {
        this._ObjectList.find(element => element.Id == objectId).behavior = null;
    }
    GetBehavior(objectId) {
        return this._ObjectList.find(element => element.Id == objectId).behavior;
    }
    static OpenProject(projectToOpen) {
        throw new Error("Method not implemented.");
    }
}
exports.FlowProject = FlowProject;
//# sourceMappingURL=FlowProject.js.map