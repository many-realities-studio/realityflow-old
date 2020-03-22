if (!wsIsReady) {
    window.addEventListener('ws_ready', registerMsgHandler);
} else {
    window.addEventListener('ws_ready', registerMsgHandler);
    registerMsgHandler();
}
function registerMsgHandler() {
    ws.addEventListener("message", monitorMessageHandler);
    var obj = getAllUrlParams(window.location.href);
    if (obj == undefined)
        obj = { uid: 0, username: "Admin" };
    sendCommand(commands.client.LOGIN, obj.uid);
}

function monitorMessageHandler(event) {
    var data = event.data;
    // The decode() method takes a DataView as a parameter, which is a wrapper on top of the ArrayBuffer.
    var dataView = new DataView(data);
    // The TextDecoder interface is documented at http://encoding.spec.whatwg.org/#interface-textdecoder
    var decoder = new TextDecoder('utf-8');
    var decodedString = decoder.decode(dataView);
    // Add the decoded file's text to the <pre> element on the page.
    json = JSON.parse(decodedString);
    switch (json.cmd) {
        case commands.client.LOGIN:
            //console.log("[monitor_interface]  Successfully logged in, registering new client next");
            clientID = localStorage.getItem('monitorClientID')
            if (!clientID) {
                sendCommand(commands.client.REGISTER_CLIENT, commands.CLIENT_MONITOR);
            } else {
                sendCommand(commands.client.CONNECTION_REESTABLISHED, clientID);
            }
            break;
        case commands.client.CONNECTION_REESTABLISHED:
            sendCommand(commands.user.GET_USERS, 0);
            break;
        case commands.ERROR:
            //console.log("[monitor_interface]  commands.ERROR: " + json.value);
            sendCommand(commands.client.REGISTER_CLIENT, commands.CLIENT_MONITOR);
            break;
        case commands.client.REGISTER_CLIENT:
            localStorage.setItem("monitorClientID", json.value);
            sendCommand(commands.user.GET_USERS, 0);
            break;
        case commands.client.NEW_CLIENT:
            console.log("[monitor_interface]  Adding client ", json.value.type,
                getType(json.value.type),
                clientStateToClass(json.value.data.state));
            if (document.getElementById(json.value._id) == null) {
                $("#user_" + json.value.uid + ">.clients").append("<a href='#' class='list-group-item client " + clientStateToClass(json.value.state) +
                    "' id='" + json.value._id + "'>" +
                    "<button type='button' class='btn btn-danger deleteClient'><span class='glyphicon glyphicon-minus'></span></button>" + "<span class='clientType'>" + getType(json.value.type) +
                    "</span><span class='transform'/><span class='quat'/><span class='label label-default'>" +
                    json.value._id.substr(-5) + "</span></a>");
            } else {
                $("#" + json.value._id).addClass("active");
            }
            break;
        case commands.client.MAKE_MASTER:
            $(".user > div").removeClass("master");
            if (json.value.data != "")
                $("#" + json.value).addClass("master");
            break;
        case commands.user.NEW_USER:
            break;
        case commands.user.GET_USERS:
            //console.log("[monitor_interface] Got users:", json.value);
            function deleteClient(client) {
                //console.log("[monitor_interface] Got clicked " + client.target.parentNode.parentNode.id);
                //console.log(client);
                deleteClientById(client.target.parentNode.parentNode.id);
            }
            $("#users").empty();
            for (var userIndex in json.value) {
                var user = json.value[userIndex];
                var userDiv = $("<div class='user' id='user_" + user._id + "'><h3>" + user.username + "</h3></div>");
                var clientDiv = $("<div class='list-group clients'></div>");
                $(clientDiv).on('click', "span.client > button.deleteClient > span", deleteClient);
                userDiv.append(clientDiv);
                $("#users").prepend(userDiv);
                for (var clientObj in json.value[userIndex].clients) {
                    addClient(json.value[userIndex].clients[clientObj]);
                    function addClient(client) {
                        console.log("[monitor_interface] Adding client ", client.type,
                            getType(client.type),
                            clientStateToClass(client.state));
                        clientDiv.append("<span" +
                            " class='list-group-item client " +
                            clientStateToClass(client.state) + "' id='" + client._id + "'>" +
                            "<button type='button' class='btn btn-danger deleteClient'>" +
                            "<span class='glyphicon glyphicon-minus'></span></button>" + "<span class='clientType'>" +
                            getType(client.type) +
                            "</span><span class='transform'/><span class='quat'/><span class='label label-default'>" +
                            client._id.substr(-5) + "</span></span>");
                    }
                }
            }
            break;
        case commands.client.CLIENT_DISCONNECT:
            //console.log("[monitor_interface] Client disconnected");
            $("#" + json.value._id).removeClass("active");
            break;
        case commands.PING:
            sendCommand(commands.PONG, 0);
            break;
        case commands.PONG:
            break;
        case commands.TRANSFORM_UPDATE:
            $("#" + json.value.data + " > .transform").html("<p>X: " +
                json.transform.x.toFixed(4) + "</p><p>y: " + json.transform.y.toFixed(4) + "</p><p>z: " + json.transform.z.toFixed(4) + "</p>");
            break;
        case commands.client.DELETE_CLIENT:
            //console.log("Deleting client!",json.value);    
            $("#" + json.value.data._id).remove();
            break;
    }
}

function deleteClientById(clientID) {
    //console.log("[monitor_interface] Sending delete command with value " + clientID);
    sendCommand(commands.client.DELETE_CLIENT, clientID);
}


