export class Events {
    public static midi = class {
        public static const MIDI = 11000;
        public static types = class {
            public static const ON = 11101;
            public static const OFF = 11102;
        };
    };
    public static key = class {
        public static const KEY = 12000;
        public static types = class {
            public static const DOWN = 12001;
            public static const UP = 12002;
        };
    };
    public static gaze = class {
        public static const GAZE = 13000;
        public static types = class {
            public static const ON = 13001;
            public static const OFF = 13002;
            public static const NEAR = 13002;
            public static const OUT = 13003;
        };
    };
    public static touch = class {
        public static const TOUCH = 14000;
        public static types = class {
            public static const BEGIN = 14001;
            public static const END = 14002;
        };
    };
};
