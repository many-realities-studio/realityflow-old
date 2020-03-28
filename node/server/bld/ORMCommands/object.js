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
const object_1 = require("../entity/object");
class ObjectOperations {
    static createObject(objectInfo, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            let project = yield typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .select("Project")
                .from(project_1.Project, "Project")
                .where("Project.Id = :id", { id: projectId })
                .getOne();
            var newObject = new object_1.DBObject();
            newObject.Id = objectInfo.Id;
            newObject.Name = objectInfo.Name;
            newObject.X = objectInfo.X;
            newObject.Y = objectInfo.Y;
            newObject.Z = objectInfo.Z;
            newObject.Q_x = objectInfo.Q_x;
            newObject.Q_y = objectInfo.Q_y;
            newObject.Q_z = objectInfo.Q_z;
            newObject.Q_w = objectInfo.Q_w;
            newObject.S_x = objectInfo.S_x;
            newObject.S_y = objectInfo.S_y;
            newObject.S_z = objectInfo.S_z;
            newObject.R = objectInfo.R;
            newObject.G = objectInfo.G;
            newObject.B = objectInfo.B;
            newObject.A = objectInfo.A;
            newObject.Prefab = objectInfo.Prefab;
            newObject.Project = project;
            yield typeorm_1.getConnection(process.env.NODE_ENV).manager.save(newObject);
        });
    }
    static findObject(objectInfoId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            var object = yield typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .select("DBObject")
                .from(object_1.DBObject, "DBObject")
                .where({ Id: objectInfoId }).getOne();
            return object;
        });
    }
    static updateObject(objectInfo, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            let project = typeorm_1.getConnection(process.env.NODE_ENV).createQueryBuilder().select().from(project_1.Project, "project").where("Id = :id", { id: projectId }).getOne();
            yield typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .update(object_1.DBObject)
                .set({
                X: objectInfo.X,
                Y: objectInfo.Y,
                Z: objectInfo.Z,
                Q_x: objectInfo.Q_x,
                Q_y: objectInfo.Q_y,
                Q_z: objectInfo.Q_z,
                Q_w: objectInfo.Q_w,
                S_x: objectInfo.S_x,
                S_y: objectInfo.S_y,
                S_z: objectInfo.S_z,
                R: objectInfo.R,
                G: objectInfo.G,
                B: objectInfo.B,
                A: objectInfo.A
            })
                .where({ id: objectInfo.id })
                .execute();
        });
    }
    static deleteObject(objectId, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .delete()
                .from(object_1.DBObject)
                .where("Id = :id", { id: objectId })
                .execute();
        });
    }
}
exports.ObjectOperations = ObjectOperations;
//# sourceMappingURL=object.js.map