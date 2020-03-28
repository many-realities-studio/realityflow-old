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
const behavior_1 = require("../entity/behavior");
class BehaviorOperations {
    static CreateBehavior(behaviorInfo, ChainOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .insert()
                .into(behavior_1.Behavior)
                .values(behaviorInfo)
                .execute();
        });
    }
    static deleteBehavior(objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .delete()
                .from(behavior_1.Behavior)
                .where("ChainOwner = :id", { id: objectId })
                .execute();
        });
    }
    static getBehavior(objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typeorm_1.getConnection(process.env.NODE_ENV).createQueryBuilder()
                .select()
                .from(behavior_1.Behavior, "behavior")
                .where("ChainOwner = :owner", { owner: "Trigger" })
                .orderBy("behavior.Index", "ASC")
                .execute();
        });
    }
}
exports.BehaviorOperations = BehaviorOperations;
//# sourceMappingURL=behavior.js.map