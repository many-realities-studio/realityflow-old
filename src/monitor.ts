console.log("Hello world 3");
const WebSocketIso = require("isomorphic-ws")

//const ws = new WebSocketIso("ws://localhost:8999/");
const ws = new WebSocketIso("ws://tuleap.mrl.ai:8999/");
ws.binaryType='arraybuffer';

ws.onopen = function open() {
  console.log("connected. Woohoo");
  let loginCmd = {cmd: 2,value: {data: 0, timestamp: new Date().getTime()}};
  ws.send(JSON.stringify(loginCmd));
}

ws.onclose = function close() {
  console.log('disconnected');
}

ws.onmessage = function incoming(data: any) {
    console.log("Got message");
    //var arrBuff = (ArrayBuffer)data;
    // The decode() method takes a DataView as a parameter, which is a wrapper on top of the ArrayBuffer.
    var dataView = new DataView(data);
    var decoder = new TextDecoder('utf-8');
    var decodedString = decoder.decode(dataView);
    // Add the decoded file's text to the <pre> element on the page.
    console.log(decodedString);
    let json = JSON.parse(decodedString);

  console.log(json);
}