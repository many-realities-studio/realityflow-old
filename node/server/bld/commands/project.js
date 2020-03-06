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
const mongoose = require("mongoose");
const project_1 = require("../models/project");
const user_1 = require("../models/user");
const object_1 = require("../models/object");
var objectId = mongoose.Types.ObjectId();
class ProjectOperations {
    static createProject(projectInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            var newProject = new project_1.Project({
                Id: projectInfo.Id,
                Description: projectInfo.Description,
                DateModified: projectInfo.DateModified,
                ProjectName: projectInfo.ProjectName,
            });
            return yield newProject.save();
        });
    }
    static saveProject(project) {
        return __awaiter(this, void 0, void 0, function* () {
            var promise = yield project.save();
            return promise;
        });
    }
    static fetchProjects(Username) {
        return __awaiter(this, void 0, void 0, function* () {
            var user = yield user_1.User.findOne({ Username: Username }, {});
            var projectsRaw = user.Projects;
            let projects = [];
            projectsRaw.forEach((element, index, arr) => __awaiter(this, void 0, void 0, function* () {
                projects.push((yield project_1.Project.findById(element)).Id);
            }));
            return projects;
        });
    }
    static findProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            var project = yield project_1.Project.findOne({ Id: projectId }).exec();
            return project;
        });
    }
    static deleteProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("deleting project " + projectId);
            yield project_1.Project.findOneAndRemove({ Id: projectId }, function (err, doc) {
                if (err)
                    console.log(err);
            }).exec();
        });
    }
    static deleteObject(projectId, objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            let obj = yield object_1.Object.findOne({ Id: objectId }).exec();
            yield project_1.Project.updateOne({ Id: projectId }, { $pull: { ObjectList: obj._id } });
            object_1.Object.deleteOne({ Id: objectId }).exec();
        });
    }
}
exports.ProjectOperations = ProjectOperations;
//# sourceMappingURL=project.js.map