"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b, _c, _d, _e;
class Commands {
}
Commands.object = (_a = class {
    },
    _a.CREATE = 2000,
    _a.DELETE = 2002,
    _a.UPDATE = 2001,
    _a.UPDATELONGTERM = 2003,
    _a);
Commands.project = (_b = class {
    },
    _b.DELETE = 3009,
    _b.CREATE = 3000,
    _b.UPDATE = 3002,
    _b.FETCH = 3003,
    _b.ADD_USER = 3005,
    _b.OPEN = 3007,
    _b.FIND_ONE = 3008,
    _b);
Commands.scene = (_c = class {
    },
    _c.CREATE = 4000,
    _c.UPDATE = 4001,
    _c.DELETE = 4002,
    _c);
Commands.user = (_d = class {
    },
    _d.CREATE = 10000,
    _d.UPDATE = 10001,
    _d.LOGIN = 10002,
    _d.LOGOUT = 10003,
    _d.FIND = 10004,
    _d.DELETE = 10005,
    _d);
Commands.client = (_e = class {
    },
    _e.REGISTER_CLIENT = 5000,
    _e.LOGIN = 5001,
    _e.MAKE_MASTER = 3,
    _e.CONNECTION_REESTABLISHED = 4,
    _e.NEW_CLIENT = 6,
    _e.LOGGING_IN = 7,
    _e.CLIENT_DISCONNECT = 10,
    _e.GET_CLIENTS = 13,
    _e.DELETE_CLIENT = 100,
    _e);
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
