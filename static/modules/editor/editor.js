var activeProject = null;
var activeBubble = null;

function ws_wrapper(websocket) {
    return {
        send: function (msg) {
            // The decode() method takes a DataView as a parameter, which is a wrapper on top of the ArrayBuffer.
            var dataView = new DataView(msg);
            // The TextDecoder interface is documented at http://encoding.spec.whatwg.org/#interface-textdecoder
            var decoder = new TextDecoder('utf-8');
            var decodedString = decoder.decode(dataView);
            // Add the decoded file's text to the <pre> element on the page.
            json = JSON.parse(decodedString);
            //console.log("Intercepting msg", json);
            websocket.send(msg);
        },
        addEventListener: function (name, cb) {
            websocket.addEventListener(name, cb);
        },
        readyState: websocket.readyState,
        close: websocket.close
    }
}

function createSocket() {
    return ws_wrapper(ws);
}

function UnityProgress(dom) {
    this.progress = 0.0;
    this.message = "";
    this.dom = dom;
    var parent = dom.parentNode;
    this.SetProgress = function (progress) {
        if (this.progress < progress)
            this.progress = progress;
        if (progress > 0) {
            document.getElementById("spinner").style.display = "none";
            document.getElementById("bgBar").style.display = "block";
            document.getElementById("progressBar").style.display = "inherit";
        }
        if (progress == 1) {
            document.getElementById("spinner").style.display = "inherit";
            document.getElementById("bgBar").style.display = "none";
            document.getElementById("progressBar").style.display = "none";
        }
        this.Update();
    }
    this.SetMessage = function (message) {
        if (!message || message.length == 0 && this.progress > 0) {
            this.SetProgress(1);
            return;
        }
        this.message = message;
        this.Update();
    }
    this.Clear = function () {
        document.getElementById("loadingBox").style.display = "none";
    }
    this.Update = function () {
        var length = 200 * Math.min(this.progress, 1);
        bar = document.getElementById("progressBar")
        if (bar != null)
            bar.style.width = length + "px";
        loadingInfo = document.getElementById("loadingInfo");
        if (loadingInfo != null)
            document.getElementById("loadingInfo").innerHTML = this.message;
    }
    this.Update();
}
UnityProgress(window.document);