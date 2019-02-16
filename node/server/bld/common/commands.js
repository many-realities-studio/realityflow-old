"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
class Commands {
}
Commands.value = (_a = class {
    },
    _a.UPDATE = -1000,
    _a.type = (_b = class {
        },
        _b.STRING = -1100,
        _b.COLOR = -1101,
        _b.VECTOR3 = -1102,
        _b.VECTOR4 = -1103,
        _b.INT = -1104,
        _b.FLOAT = -1105,
        _b),
    _a);
Commands.transform = (_c = class {
    },
    _c.UPDATE = -2000,
    _c);
Commands.droplet = (_d = class {
    },
    _d.CREATE = 2000,
    _d.NEW_INSTANCE = 2001,
    _d.UPDATE = 2002,
    _d.DELETE = 2003,
    _d.types = (_e = class {
        },
        _e.PRIMITIVE = 2500,
        _e.PLANE = 2501,
        _e.QUAD = 2502,
        _e.MESH = 2503,
        _e.TEXT = 2504,
        _e.SHAPE = 2505,
        _e.LINE = 2506,
        _e.primitive = (_f = class {
            },
            _f.PRIMITIVE_CUBE = 2100,
            _f.PRIMITIVE_SPHERE = 2101,
            _f.PRIMITIVE_CAPSULE = 2102,
            _f.PRIMITIVE_CYLINDER = 2103,
            _f),
        _e),
    _d);
Commands.modifier = (_g = class {
    },
    _g.APPLY = 8000,
    _g.UPDATE = 8001,
    _g.REMOVE = 8002,
    _g.COMMIT = 8003,
    _g.types = (_h = class {
        },
        _h.ARRAY = 8100,
        _h.SCALE = 8101,
        _h.TRANSLATE = 8102,
        _h.ROTATE = 8103,
        _h.COLOR = 8104,
        _h.TEXTURE = 8105,
        _h.SHADER = 8106,
        _h),
    _g);
Commands.editor = (_j = class {
    },
    _j.SET_BACKDROP = 10000,
    _j);
Commands.project = (_k = class {
    },
    _k.DELETE = 3001,
    _k.CREATE = 3000,
    _k.UPDATE = 3002,
    _k.SET_ACTIVE = 3003,
    _k.SHARE = 3004,
    _k.UNSHARE = 3005,
    _k.ATTACH_SCENE = 3006,
    _k.FIND = 3007,
    _k.FIND_ONE = 3008,
    _k.GET_ACTIVE = 3009,
    _k.DRAFT = 3010,
    _k);
Commands.states = (_l = class {
    },
    _l.NEW = 5000,
    _l.UPDATE = 5001,
    _l.DELETE = 5002,
    _l.SET_ACTIVE = 5003,
    _l.GET = 5007,
    _l.GET_ALL = 5008,
    _l.TRANSITION = 5009,
    _l.ASSOCIATE_FLOW_OBJECT = 5010,
    _l.DISASSOCIATE_FLOW_OBJECT = 5011,
    _l);
Commands.user = (_m = class {
    },
    _m.CREATE = 10000,
    _m.UPDATE = 10001,
    _m.DELETE = 10002,
    _m.FIND = 10003,
    _m.SET_ACTIVE_PROJECT = 10004,
    _m.SET_ACTIVE_SCENE = 10005,
    _m.SET_ACTIVE_STATE = 10006,
    _m.GET_USERS = 8,
    _m);
Commands.client = (_o = class {
    },
    _o.REGISTER_CLIENT = 0,
    _o.LOGIN = 2,
    _o.MAKE_MASTER = 3,
    _o.CONNECTION_REESTABLISHED = 4,
    _o.NEW_CLIENT = 6,
    _o.LOGGING_IN = 7,
    _o.CLIENT_DISCONNECT = 10,
    _o.GET_CLIENTS = 13,
    _o.DELETE_CLIENT = 100,
    _o);
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
