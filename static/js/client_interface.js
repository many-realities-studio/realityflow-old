var ws;
var protocol;
function clientStateToClass(clientState) {
    var retState = "";
    switch (clientState) {
        case commands.STATE_DISCONNECTED:
            retState = " ";
            break;
        case commands.STATE_CONNECTED:
            retState = "list-group-item-success";
            break;
    }
    return retState;
}

function getType(clientType) {
    var editorDescription = "";
    switch (clientType) {
        case commands.CLIENT_EDITOR:
            editorDescription = "Unity";
            break;
        case commands.CLIENT_WEB:
            editorDescription = "Web";
            break;
        case commands.CLIENT_RIPPLE:
            editorDescription = "Rpl";
            break;
        case commands.CLIENT_HOLOLENS:
            editorDescription = "Holo";
            break;
        case commands.CLIENT_MONITOR:
            editorDescription = "Monitor";
            break;
    }
    return editorDescription;
}
var clientID = -1;
var reconnectTime = 2000;
var evt = new CustomEvent('ws_ready', {});


$("document").ready(function () {
    if (window.location.protocol == "https:")
        protocol = "wss";
    else
        protocol = "ws";
    //console.log("Creating a new websocket to " + protocol + '://' + window.location.hostname + ':' + 8082)
    ws = new WebSocket(protocol + '://' + window.location.hostname + ':' + 8082);
    ws.addEventListener("message", messageHandler);
    ws.binaryType = 'arraybuffer';
    ws.addEventListener("close", closeHandler);
    ws.addEventListener("open", openHandler);
    ws.addEventListener("error", errorHandler);

    // Document setup here
});

function errorHandler(event) {
    //console.log("Error!", event);
}

function openHandler(event) {
    //console.log("[web] Connection opened");
    heartbeat = setInterval(function () {
        if (ws.readyState != 3) {
            sendCommand(commands.PING, 0);
        }
        else clearInterval(heartbeat)
    }, 15000);
    reconnectTime = 2000;
    window.dispatchEvent(evt)
}

function closeHandler(event) {
    loggedIn = false;
    wsIsReady = false;
    //console.log("WebSocket Error: ", event, "trying again in " + reconnectTime);
    if(heartbeat !=null)
        clearInterval(heartbeat);
    setTimeout(function () {
        //console.log("Reconnecting...");
        ws = new WebSocket(protocol + '://' + window.location.hostname + ':' + window.location.port);
        ws.binaryType = 'arraybuffer';
        ws.addEventListener("open", openHandler);
        ws.addEventListener("message", messageHandler);
        ws.onclose = closeHandler;
        ws.onerror = errorHandler;
    }, reconnectTime);
    if(reconnectTime < 10000)
        reconnectTime *= 2;
}

function remoteFunctionCall(command, data, cb) {
    //console.log("Sending a remote function:", command, data);
    remoteCommands[command] = function (value) {
        if (cb != null && cb != undefined)
            cb(value);
        delete remoteCommands[command];
    };
    sendCommand(command, data);
}

var remoteCommands = [];
var listeners = [];
var listenerNames = [];
function registerListener(command, cb) {
    if (listeners[command] == undefined && listenerNames[cb.name] == undefined) {
        listeners[command] = [];
        listeners[command].push(cb);
        listenerNames[cb.name] = true
    }
}

function removeAllListeners(command) {
    if (listeners[command] != undefined) {
        listeners[command].forEach(function (func) {
            delete listenerNames[listeners[command][func].name];
        });
        delete listeners[command];
    }
}

function messageHandler(event) {
    var data = event.data;
    // The decode() method takes a DataView as a parameter, which is a wrapper on top of the ArrayBuffer.
    var dataView = new DataView(data);
    // The TextDecoder interface is documented at http://encoding.spec.whatwg.org/#interface-textdecoder
    var decoder = new TextDecoder('utf-8');
    var decodedString = decoder.decode(dataView);
    // Add the decoded file's text to the <pre> element on the page.
    json = JSON.parse(decodedString);
    if (listeners[json.cmd] != undefined) {
        $.each(listeners[json.cmd], function (index, value) {
            console.log("[client_interface] Calling listener " + json.cmd + " with value ", json.value.data);
            value(json.value.data);
        });
    }
    if (remoteCommands[json.cmd] != undefined) {
        remoteCommands[json.cmd](json.value.data);
        console.log("[client_interface] calling remote command callback " + json.cmd + " with value ", json.value.data);
    } else
        switch (json.cmd) {
            case commands.client.MAKE_MASTER:
                break;
            case commands.PING:
                sendCommand(commands.PONG, 0);
                break;
            default:
                if (extractKeyValue(commands, json.cmd) == undefined)
                    //console.log("[web] Unrecognized Command", json);
                break;
        }
};

function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // in case params look like: list[]=thing1&list[]=thing2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });

            // set parameter value (use 'true' if empty)
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            paramValue = paramValue.toLowerCase();

            // if parameter name already exists
            if (obj[paramName]) {
                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                // if no array index number specified...
                if (typeof paramNum === 'undefined') {
                    // put the value on the end of the array
                    obj[paramName].push(paramValue);
                }
                // if array index number specified...
                else {
                    // put the value at that index number
                    obj[paramName][paramNum] = paramValue;
                }
            }
            // if param name doesn't exist yet, set it
            else {
                obj[paramName] = paramValue;
            }
        }
    }
    return obj;
}
