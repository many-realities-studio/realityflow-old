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
exports.BehaviourOperations = void 0;
const typeorm_1 = require("typeorm");
const behaviour_1 = require("../entity/behaviour");
class BehaviourOperations {
    static CreateBehaviour(BehaviourInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .insert()
                .into(behaviour_1.Behaviour)
                .values(BehaviourInfo)
                .execute();
        });
    }
    static deleteBehaviour(BehaviourId) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .delete()
                .from(behaviour_1.Behaviour)
                .where("Id IN (:...id)", { id: BehaviourId });
            console.log(query.getQueryAndParameters());
            yield query.execute();
        });
    }
    static getBehaviours(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("PROJECTID");
            console.log(projectId);
            let query = typeorm_1.getConnection(process.env.NODE_ENV).createQueryBuilder()
                .select("Behaviour")
                .from(behaviour_1.Behaviour, "Behaviour")
                .where("Behaviour.ProjectId = :ProjectId", { ProjectId: projectId });
            console.log(query.getSql());
            return yield query.getMany();
        });
    }
    static updateBehaviour(Behaviour) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .update(Behaviour)
                .set(Behaviour)
                .where("Id = :id", { id: Behaviour.Id })
                .execute();
        });
    }
    static LinkNewToOld(projectId, child, parents) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = yield typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .select("Behaviour")
                .from(behaviour_1.Behaviour, "Behaviour")
                .where("Behaviour.Id IN (:...parentList)", { parentList: parents })
                .getMany();
            console.log(list);
            list.map((x, index, arr) => {
                let NextBehaviour = JSON.parse(x.NextBehaviour);
                NextBehaviour.push(child);
                x.NextBehaviour = JSON.stringify(NextBehaviour);
                console.log("HELLO! link behaviour");
                console.log(x);
                return x;
            });
            yield typeorm_1.getConnection(process.env.NODE_ENV).manager.save(list);
        });
    }
}
exports.BehaviourOperations = BehaviourOperations;
//# sourceMappingURL=behaviour.js.map