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
const typeorm_1 = require("typeorm");
const project_1 = require("../entity/project");
const user_1 = require("../entity/user");
class ProjectOperations {
    static createProject(projectInfo, Username) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield typeorm_1.getConnection(process.env.NODE_ENV).createQueryBuilder().
                select("User").
                from(user_1.User, "User").
                where("User.Username = :username", { username: Username }).getOne();
            var newProject = new project_1.Project();
            newProject.Id = projectInfo.Id,
                newProject.Description = projectInfo.Description,
                newProject.DateModified = projectInfo.DateModified,
                newProject.ProjectName = projectInfo.ProjectName,
                newProject.Owner = user;
            yield typeorm_1.getConnection(process.env.NODE_ENV).manager.save(newProject);
            return newProject.Id;
        });
    }
    static fetchProjects(usernameToFetch) {
        return __awaiter(this, void 0, void 0, function* () {
            let projects = yield typeorm_1.getConnection(process.env.NODE_ENV).createQueryBuilder()
                .select("project")
                .from(project_1.Project, "project")
                .where("project.ownerUsername = :username", { username: usernameToFetch })
                .getMany();
            return projects;
        });
    }
    static findProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            let project = yield typeorm_1.getConnection(process.env.NODE_ENV).createQueryBuilder().
                select("project").
                from(project_1.Project, "project").
                where("Id = :id", { id: projectId })
                .getOne();
            return project;
        });
    }
    static deleteProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .delete()
                .from(project_1.Project)
                .where("Id = :id", { id: projectId })
                .execute();
        });
    }
}
exports.ProjectOperations = ProjectOperations;
//# sourceMappingURL=project.js.map