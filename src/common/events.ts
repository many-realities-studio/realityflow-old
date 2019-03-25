export class Events {
    public static midi = class {
        public static readonly MIDI = 11000;
        public static types = class {
            public static readonly ON = 11101;
            public static readonly OFF = 11102;
        };
    };
    public static key = class {
        public static readonly KEY = 12000;
        public static types = class {
            public static readonly DOWN = 12001;
            public static readonly UP = 12002;
        };
    };
    public static gaze = class {
        public static readonly GAZE = 13000;
        public static types = class {
            public static readonly ON = 13001;
            public static readonly OFF = 13002;
            public static readonly NEAR = 13002;
            public static readonly OUT = 13003;
        };
    };
    public static touch = class {
        public static readonly TOUCH = 14000;
        public static types = class {
            public static readonly BEGIN = 14001;
            public static readonly END = 14002;
        };
    };
};
