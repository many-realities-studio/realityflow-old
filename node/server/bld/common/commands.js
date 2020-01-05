"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b;
class Commands {
}
Commands.request = (_a = class {
    },
    _a.object = 1,
    _a.project = 2,
    _a.scene = 3,
    _a.user = 4,
    _a.client = 5,
    _a.interaction = 6,
    _a);
Commands.action = (_b = class {
    },
    _b.CREATE = 1,
    _b.FETCH = 2,
    _b.UPDATE = 3,
    _b.DELETE = 4,
    _b.FETCH_LIST = 5,
    _b.LOGIN = 6,
    _b.LOGOUT = 7,
    _b.ADD_USER = 8,
    _b);
Commands.commented = {};
Commands.TRANSFORM_UPDATE = 1;
Commands.ERROR = 5;
Commands.PING = 9;
Commands.PONG = 11;
Commands.NEW_USER = 12;
Commands.UPDATE_EXTENSIONS = 1000;
Commands.UPDATE_MODULES = 1001;
Commands.UPDATE_API = 1002;
Commands.ERROR_NO_CLIENT_FOUND = 0;
Commands.CLIENT_EDITOR = 0;
Commands.CLIENT_WEB = 1;
Commands.CLIENT_MAGICLEAP = 2;
Commands.CLIENT_HOLOLENS = 3;
Commands.CLIENT_MONITOR = 4;
Commands.STATE_CONNECTED = 0;
Commands.STATE_DISCONNECTED = 1;
exports.Commands = Commands;
//# sourceMappingURL=commands.js.map