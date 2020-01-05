"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const user_1 = require("../models/user");
var objectId = mongoose.Types.ObjectId();
class UserOperations {
    static createUser(userInfo) {
        var newUser;
        var newUser = new user_1.User({
            username: userInfo.username,
            password: userInfo.password,
            clients: undefined,
            activeProject: undefined,
            projects: undefined,
            friends: undefined
        });
        var promise = newUser.save();
        promise.then(function (err, doc) {
            newUser = doc;
            return newUser;
        });
        return promise;
    }
    static findUser(userInfo) {
        var returnedUser;
        var promise = user_1.User.findById(userInfo._id).exec();
        promise.then(function (err, doc) {
            returnedUser = doc;
            return returnedUser;
        });
        return promise;
    }
    static loginUser(userInfo) {
        var promise = user_1.User.findOne({ username: userInfo.username }).exec();
        promise.then(function (doc) {
            return doc;
        });
        return promise;
    }
    static updateUser(userInfo) {
        user_1.User.findOneAndUpdate({ _id: userInfo._id }, {
            username: userInfo.username,
            password: userInfo.password,
            clients: userInfo.clients,
            activeProject: userInfo.activeProject,
            projects: userInfo.projects,
            friends: userInfo.friends
        }, function (err) {
            if (err) {
                console.log('ERROR: Failed to update user: ' + userInfo.username);
            }
            else {
                console.log('User ' + userInfo.username + ' updated successfully.');
            }
        });
    }
    static deleteUser(userInfo) {
        console.log("attempting to delete user " + userInfo._id);
        user_1.User.findByIdAndRemove({ _id: userInfo._id }, function (err, doc) {
            if (err) {
                console.log(err);
            }
        });
    }
}
exports.UserOperations = UserOperations;
//# sourceMappingURL=user.js.map