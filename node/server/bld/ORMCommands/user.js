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
const user_1 = require("../entity/user");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;
class UserOperations {
    static createUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var newUser = new user_1.User();
            newUser.Username = username,
                newUser.Password = password,
                yield typeorm_1.getConnection(process.env.NODE_ENV).manager.save(newUser);
        });
    }
    static findUser(Username) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .select("user")
                .from(user_1.User, "user")
                .where("user.Username = :username", { username: Username })
                .getOne();
            return foundUser;
        });
    }
    static deleteUser(Username) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("attempting to delete user " + Username);
            yield typeorm_1.getConnection(process.env.NODE_ENV)
                .createQueryBuilder()
                .delete()
                .from(user_1.User)
                .where("Username = :username", { username: Username })
                .execute();
        });
    }
    static authenticateUser(Username, Password) {
        return __awaiter(this, void 0, void 0, function* () {
            let passwordObject = yield typeorm_1.getConnection(process.env.NODE_ENV).
                createQueryBuilder().
                select("User.Password").
                from(user_1.User, "User").
                where("Username = :username", { username: Username }).
                execute();
            if (!passwordObject[0])
                return false;
            return yield bcrypt.compare(Password, passwordObject[0].User_Password);
        });
    }
}
exports.UserOperations = UserOperations;
//# sourceMappingURL=user.js.map