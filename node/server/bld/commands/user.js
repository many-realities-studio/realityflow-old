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
const user_1 = require("../models/user");
const project_1 = require("../models/project");
var objectId = mongoose.Types.ObjectId();
class UserOperations {
    static createUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var newUser = new user_1.User({
                Username: username,
                Password: password,
                Projects: [],
            });
            yield newUser.save();
        });
    }
    static findUser(Username) {
        return __awaiter(this, void 0, void 0, function* () {
            var returnedUser = null;
            const foundUser = yield user_1.User.findOne({ Username: Username });
            return foundUser;
        });
    }
    static loginUser(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            var foundUser = yield user_1.User.findOne({ Username: userInfo.Username }).exec(function (err) {
                if (err)
                    console.error(err);
            });
            return foundUser;
        });
    }
    static updateUser(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_1.User.findOneAndUpdate({ Username: userInfo.Username }, {
                Username: userInfo.Username,
                Password: userInfo.Password,
            }).exec(function (err) {
                if (err) {
                    console.error(err);
                }
                else {
                    console.log('User ' + userInfo.Username + ' updated successfully.');
                }
            });
        });
    }
    static addProjectToUser(Username, projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            let project = yield project_1.Project.findOne({ Id: projectId });
            yield user_1.User.findOneAndUpdate({ Username: Username }, { $push: { Projects: project._id } }).exec();
        });
    }
    static deleteUser(Username) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("attempting to delete user " + Username);
            yield user_1.User.findByIdAndRemove({ Username: Username }).exec(function (err, doc) {
                if (err) {
                    console.error(err);
                }
            });
        });
    }
    static authenticateUser(Username, Password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield user_1.User.findOne({ Username: Username });
            let retval = false;
            user.schema.methods.comparePassword.call(user, Password, function (error, match) {
                retval = match;
            });
            return retval;
        });
    }
}
exports.UserOperations = UserOperations;
//# sourceMappingURL=user.js.map