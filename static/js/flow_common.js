if(TextEncoder == undefined)
    var TextEncoder = encoding.TextEncoder;
var wsIsReady = false;
var loggedIn = false;
var loaderAdded = false;
var state_palette_loaded = false;
var state = commands.STATE_DISCONNECTED;
var evt_editorReady = new CustomEvent('editor_ready', {});
var evt_launchEditor = new CustomEvent('launch_editor', {});
var evt_login = new CustomEvent('ws_loggedIn', {});
var evt_disconnect = new CustomEvent('ws_disconnect', {});
var evt_moduleLoaded = new CustomEvent('unity_moduleLoaded', {});
var evt_activateProject = new CustomEvent('flow_activateProject', {});
var editorLoaded = false;

window.addEventListener('ws_ready', wsReady);

function extractKeyValue(obj, value) {
    return Object.keys(obj)[Object.values(obj).indexOf(value)];
}

function wsReady() {
    if(!wsIsReady) {
        //console.log("[flow_common] Setting up default listeners");
        wsIsReady = true;
        ws.addEventListener("message", messageHandler);
        function messageHandler(event) {
            var data = event.data;
            // The decode() method takes a DataView as a parameter, which is a wrapper on top of the ArrayBuffer.
            var dataView = new DataView(data);
            // The TextDecoder interface is documented at http://encoding.spec.whatwg.org/#interface-textdecoder
            var decoder = new TextDecoder('utf-8');
            var decodedString = decoder.decode(dataView);
            // Add the decoded file's text to the <pre> element on the page.
            json = JSON.parse(decodedString);
            if (json.cmd != commands.PING && json.cmd != commands.PONG && json.cmd != commands.TRANSFORM_UPDATE)
                console.log("[flow_common]: ", extractKeyValue(commands,json.cmd), json);
            switch (json.cmd) {
                case commands.UPDATE_MODULES:
                    loadModules();
                    break;
                case commands.client.LOGIN:
                    console.log("[flow_common] logged in and dispatching event")
                    window.dispatchEvent(evt_login);
                    loggedIn = true;
                    break;
            }
        }
    }
}
$(window).on('hashchange', function (change) {
    updateState(window.location.hash);
});

$(function () {
    //console.log("[flow_common] Initializing...")
    for (var i = 0; i < modules.length; i++) {
        $("#" + modules[i] + "Container").hide();
    }
    updateState(window.location.hash);
});

function updateState(hash) {
    //console.log(hash);
    for (var i = 0; i < modules.length; i++) {
        if (modules[i] == hash.substr(1)) {
            $(hash + "Container").show();
            $(hash + "Nav").addClass("active");
        } else {
            $("#" + modules[i] + "Container").hide();
            $("#" + modules[i] + "Nav").removeClass('active');
        }
    }
    if(hash == "#editor"/* && activeProject != null*/) {
        //console.log("Loading editor...");
        if(editorLoaded) {
            window.dispatchEvent(evt_launchEditor);
        } else {
            window.addEventListener('editor_ready', function(){
                window.dispatchEvent(evt_launchEditor);
            });
        }
    }
};

$(function () {
    loadModules();
});


function loadModules() {
    //console.log("[flow_common] Loading modules...");
    var includes = $('.module[data-include]');
    jQuery.each(includes, function () {
        var file = 'modules/' + $(this).data('include') + '.html';
        $(this).load(file);
    });
}
