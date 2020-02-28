"use strict";
exports.__esModule = true;
// NOTE: FAM Stands for Fast Access Memory
var FlowProject = /** @class */ (function () {
    function FlowProject(json) {
        this._ObjectList = [];
        this.Id = json.Id;
        this.Description = json.Description;
        this.DateModified = json.DateModified;
        this.ProjectName = json.ProjectName;
    }
    FlowProject.prototype.ToString = function () {
        throw new Error("Method not implemented.");
    };
    /**
     * Adds an object to a project, saving it to both FAM and the database
     * @param objectToAdd The object which should be added to the project
     */
    FlowProject.prototype.AddObject = function (objectToAdd) {
        this._ObjectList.push(objectToAdd);
    };
    /**
     * Removes an object from the list of available objects and returns the object removed
     * Also deletes object from the database
     * @param objectToRemove
     */
    FlowProject.prototype.DeleteObject = function (objectToRemove) {
        var index = this._ObjectList.findIndex(function (element) { return element.Id == objectToRemove.Id; });
    };
    /**
     * Returns FlowObject with the given ID number
     * @param objectId
     */
    FlowProject.prototype.GetObject = function (objectId) {
        return this._ObjectList.find(function (element) { return element.Id == objectId; });
    };
    /**
     * Creates an object and attaches it to the desired project in both the FAM and the Database
     * @param objectToCreate
     */
    FlowProject.prototype.CreateObject = function (objectToCreate) {
        // Save for fast access
        this.AddObject(objectToCreate);
    };
    /**
     * Updates the object in the FAM without saving to the database
     * @param newObject
     */
    FlowProject.prototype.UpdateFAMObject = function (newObject) {
        // Get the object that we are changing from the specified project
        var oldObject = this.GetObject(newObject.Id);
        // Update all properties of the old object to the new object.
        oldObject.UpdateProperties(newObject);
    };
    // TODO: Find out what this does (or needs to do)
    FlowProject.OpenProject = function (projectToOpen) {
        throw new Error("Method not implemented.");
    };
    return FlowProject;
}());
exports.FlowProject = FlowProject;
