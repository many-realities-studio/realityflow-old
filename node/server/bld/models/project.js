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
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;
const user_1 = require("./user");
const object_1 = require("./object");
const projectSchema = new mongoose.Schema({
    Id: String,
    Description: String,
    DateModified: Number,
    ProjectName: String,
    ObjectList: [{ type: ObjectId, ref: object_1.Object }]
}, { usePushEach: true });
projectSchema.post("remove", (err, document) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = document._id;
    user_1.User.updateMany({ Projects: { $in: projectId } }, { $pull: { Projects: projectId } });
}));
exports.Project = mongoose.model("Project", projectSchema);
//# sourceMappingURL=project.js.map