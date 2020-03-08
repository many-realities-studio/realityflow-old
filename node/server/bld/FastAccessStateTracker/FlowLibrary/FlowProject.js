"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class FlowProject {
    constructor(json) {
        this._ObjectList = [];
        this.Id = uuid_1.v4();
        this.Description = json.Description;
        this.DateModified = json.DateModified;
        this.ProjectName = json.ProjectName;
    }
    AddObject(objectToAdd) {
        this._ObjectList.push(objectToAdd);
    }
    DeleteObject(objectToRemove) {
        const index = this._ObjectList.findIndex((element) => element.Id == objectToRemove.Id);
        this._ObjectList.splice(index);
    }
    GetObject(objectId) {
        return this._ObjectList.find(element => element.Id == objectId);
    }
    CreateObject(objectToCreate) {
        this.AddObject(objectToCreate);
    }
    UpdateFAMObject(newObject) {
        var oldObject = this.GetObject(newObject.Id);
        oldObject.UpdateProperties(newObject);
    }
    static OpenProject(projectToOpen) {
        throw new Error("Method not implemented.");
    }
}
exports.FlowProject = FlowProject;
//# sourceMappingURL=FlowProject.js.map