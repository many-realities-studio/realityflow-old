function receivedString(s) {
    //console.log("Got the string " + s);
    $("#objName").val(s);
}

function sendTransformCommand(cmd, value, transform) {
    var cmd = { cmd: cmd, value: { data: value, timestamp: new Date().getTime() }, transform: transform };
    ws.send(JSON.stringify(cmd));
}

function sendCustomCommand(cmd, data) {
    data.timestamp = new Date().getTime();
    var new_cmd = { cmd: cmd, value: data };
    ws.send(JSON.stringify(new_cmd));
}

function sendCommand(cmd, value) {
    var cmd = { cmd: cmd, value: { data: value, timestamp: new Date().getTime() } };
    ws.send(JSON.stringify(cmd));
}

window.addEventListener('ws_ready', function () {
    //console.log("[unity_interface] adding listener back again");
    ws.addEventListener("message", unityMessageHandler);
    /*    
        if(!loggedIn) {
        var obj = getAllUrlParams(window.location.href);
        if (obj == undefined)
            obj = { uid: 0, username: "Admin" };
        var loginCmd = { cmd: commands.client.LOGIN, value: obj.uid };
        ws.send(JSON.stringify(loginCmd));
        }
        */
});
if (wsIsReady) {
    //console.log("[unity_interface] adding listener back");
    ws.addEventListener("message", unityMessageHandler);
    /*
        if(!loggedIn) {
            
        var obj = getAllUrlParams(window.location.href);
        if (obj == undefined)
            obj = { uid: 0, username: "Admin" };
        var loginCmd = { cmd: commands.client.LOGIN, value: obj.uid };
        ws.send(JSON.stringify(loginCmd));
        }
        */
}

var client_messages = [];
function unityMessageHandler(event) {
    var data = event.data;
    var array = new Uint8Array(event.data);
    client_messages.push(array);
    // The decode() method takes a DataView as a parameter, which is a wrapper on top of the ArrayBuffer.
    var dataView = new DataView(data);
    // The TextDecoder interface is documented at http://encoding.spec.whatwg.org/#interface-textdecoder
    var decoder = new TextDecoder('utf-8');
    var decodedString = decoder.decode(dataView);
    // Add the decoded file's text to the <pre> element on the page.
    json = JSON.parse(decodedString);
    if (json.cmd != commands.PING && json.cmd != commands.PONG && json.cmd != commands.TRANSFORM_UPDATE)
        console.log("[unity_interface]: ", extractKeyValue(commands, json.cmd), json);
    switch (json.cmd) {
        case commands.UPDATE_EXTENSIONS:
            //console.log("Updating extensions...");
            $.each($(".panel[data-include]"), function () {
                var id = $(this).attr('id');
                loadExtensions(id);
            });
            $.each($(".modal[data-include]"), function () {
                var id = $(this).attr('id');
                loadExtensions(id);
            })
            break;
        case commands.client.LOGIN:
            if (!localStorage.getItem('unityClientID')) {
                var obj = getAllUrlParams(window.location.href);
                if (obj == undefined)
                    obj = { uid: 0, username: "Admin" };
                var payload = {
                    data: {
                        cameraOffset: {},
                        cameraRotation: {},
                        description: "Chrome",
                        deviceModel: navigator.userAgent,
                        deviceType: 1,
                        dpi: 0,
                        resolutionX: window.innerWidth,
                        resolutionY: window.innerHeight,
                        uid: obj.uid,
                    },
                    type: commands.CLIENT_WEB
                };
                sendCustomCommand(commands.client.REGISTER_CLIENT, payload);
            } else {
                clientID = localStorage.getItem('unityClientID');
                sendCommand(commands.client.CONNECTION_REESTABLISHED, clientID);
            }
            break;
        case commands.client.CONNECTION_REESTABLISHED:
            console.log("[unity_interface] Reestablished connection");
            break;
        case commands.ERROR:
            console.log("[unity_interface] Error:", json.value.data);
            if (json.value.data == commands.ERROR_NO_CLIENT_FOUND) {
                var obj = getAllUrlParams(window.location.href);
                if (obj == undefined)
                    obj = { uid: 0, username: "Admin" };
                var payload = {
                    data: {
                        cameraOffset: {},
                        cameraRotation: {},
                        description: "Chrome",
                        deviceModel: navigator.userAgent,
                        deviceType: 1,
                        dpi: 0,
                        resolutionX: window.innerWidth,
                        resolutionY: window.innerHeight,
                        uid: obj.uid,
                    },
                    type: commands.CLIENT_WEB
                }
                sendCustomCommand(commands.client.REGISTER_CLIENT, payload);
            }
            break;
        case commands.client.REGISTER_CLIENT:
            clientID = json.value.data;
            localStorage.setItem('unityClientID', json.value.data);
            break;
        case commands.client.NEW_CLIENT:
            console.log("[unity_interface] Adding client ", json.value.data.type,
                getType(json.value.data.type),
                clientStateToClass(json.value.data.state));
            break;
        case commands.client.LOGGING_IN:
            break;
        case commands.user.GET_USERS:
            //console.log("[unity_interface] Got users:", json.value);
            break;
        case commands.client.CLIENT_DISCONNECT:
            //console.log("[unity_interface] Client disconnected");
            break;
        case commands.PING:
            sendCommand(commands.PONG, 0);
            break;
    }
};
