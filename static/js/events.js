(function (exports) {
    exports.midi = {};
    exports.midi.MIDI = 11000;
    exports.midi.types = {};
    exports.midi.types.ON = 11101;
    exports.midi.types.OFF = 11102;
    exports.key = {};
    exports.key.KEY = 12000;
    exports.key.types = {};
    exports.key.types.DOWN = 12001;
    exports.key.types.UP = 12002;
})(typeof exports === 'undefined' ? this['events'] = {} : module.exports);
