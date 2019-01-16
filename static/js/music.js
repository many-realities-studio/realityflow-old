WebMidi.enable(function (err) {

  if (err) {
    //console.log("WebMidi could not be enabled.", err);
  } else {
    //console.log("WebMidi enabled!");
    //console.log(WebMidi.inputs);
    //console.log(WebMidi.outputs);
    var output = WebMidi.outputs[0];
    //output.playNote("C3");
    var input = WebMidi.inputs[0];
    // Listen for a 'note on' message on all channels
    input.addListener('noteon', "all",
      function (e) {
        console.log(e);
        // console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
        // console.log("[object_inspector] Sending command", cmd);
        sendCommand(events.midi.types.ON, e.note); //<---
      }
    );
    // Listen for a 'note on' message on all channels
    input.addListener('noteoff', "all",
      function (e) {
        console.log(e);
        // console.log("Received 'noteoff' message (" + e.note.name + e.note.octave + ").");
        // console.log("[object_inspector] Sending command", cmd);
        sendCommand(events.midi.types.OFF, e.note); //<---  
      }
    );
  }
});