"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b, _c, _d, _e, _f, _g, _h;
class Events {
}
Events.midi = (_a = class {
    },
    _a.MIDI = 11000,
    _a.types = (_b = class {
        },
        _b.ON = 11101,
        _b.OFF = 11102,
        _b),
    _a);
Events.key = (_c = class {
    },
    _c.KEY = 12000,
    _c.types = (_d = class {
        },
        _d.DOWN = 12001,
        _d.UP = 12002,
        _d),
    _c);
Events.gaze = (_e = class {
    },
    _e.GAZE = 13000,
    _e.types = (_f = class {
        },
        _f.ON = 13001,
        _f.OFF = 13002,
        _f.NEAR = 13002,
        _f.OUT = 13003,
        _f),
    _e);
Events.touch = (_g = class {
    },
    _g.TOUCH = 14000,
    _g.types = (_h = class {
        },
        _h.BEGIN = 14001,
        _h.END = 14002,
        _h),
    _g);
exports.Events = Events;
;
