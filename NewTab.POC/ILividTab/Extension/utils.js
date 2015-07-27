var Utils = {};
//Util Helper Functions
Utils.replaceMacrosInString = function(str){
    var macros = str.match(/{(.*?)}/g),
        macroName;

    if(macros) {
        for(var i=0; i < macros.length; i++) {
            macroName = macros[i].replace("{","").replace("}","");
            if('undefined' !== typeof(localStorage.getItem(macroName))) {
                str = str.replace(macros[i], localStorage.getItem(macroName));
            }
        }
    }
    return str;
};

Utils.copyToStorage = function (list){
    for(var item in list){
        localStorage.setItem(item, list[item]);
    }
};

// stringify before saving to Local Storage
Utils.setItem = function (key, value) {
    var str = JSON.stringify(value);
    if (str === undefined)
        throw new Error("LocalStorage.set cannot set an undefined value!");
    localStorage.setItem(key, str);
    return value;
};

// parse before returning
Utils.getItem = function (key) {
    var str;
    if ((key === undefined) || (key === null))
        return null;
    try {
        str = localStorage.getItem(key);
        if ((str === undefined) || (str === null))
            return null;
        // should be like this
        try {
            return JSON.parse(str);
        } catch (e) {
            return str;
        }
    } catch (e) {
        console.error("Storage.get(" + key + "): " + e);
        return null;
    }
};


Utils.ajax = function (url, callback){
    var xmlhttp = new XMLHttpRequest();

    callback = callback || function(res) {};
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            callback(xmlhttp.responseText);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
};

Utils.timer = function (callback, interval, prev){
    var now = new Date().getTime();

    function ontimeout (prev_) {
        return function () {
            Utils.timer(callback, interval, prev_);
        };
    }

    if(now - prev >= interval) {
        callback();
        setTimeout(ontimeout(now), interval);
    } else {
        setTimeout(ontimeout(prev), prev + interval - now);
    }
};

// TODO(malavallim): Temporary solution to read macros from registry.
// Remove it once native messaging is bundled with crx installer.
Utils.readJSONFile = function (fileRelativePath, callback) {
   this.ajax(chrome.extension.getURL(fileRelativePath), function (json) {
        json = JSON.parse(json);
        if ( typeof callback == "function") {
            callback(json);
        }
    });
};

Utils.buildQueryString = function (url, params) {
    var tmp = [];
    if (!params || (typeof params !== "object")) return url;
        for (var a in params) {
            var param = params[a];
            tmp.push(a + "=" + encodeURIComponent(param));
        }
    if (tmp.length > 0) {
        url += (-1 == url.indexOf("?")) ? "?" : "&";
        url += tmp.join("&");
    }
    return url;
}

var browser = {};
browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
Utils.browser = browser;