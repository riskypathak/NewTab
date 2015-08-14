﻿var SYSTEM_ID = 1;
var forceAppid = true;
if (typeof appid == "undefined") {
    var appid = false;
    forceAppid = false;
}
var cid = false;
var urchinAppidVal = "";
var urchinCreVal = "";
var urchinPrefix = "";
var appidLang = "";
var appidLoadedFlag = false;

// JS Pass address params
var params = {};
function getParams(pDecode) {
    var queryStr = document.location.search.toString();
    queryStr = (queryStr.substring(0, 1) == '?') ? queryStr.substring(1) : queryStr;
    var pairs = queryStr.split('&');
    for (var pair, i = 0; i < pairs.length && (pair = pairs[i].split('=')) ; i++)
        for (var y = 0; y < pair.length; y++)
            if (y == 0)
                params[pair[y]] = "";
            else
                params[pair[0]] = pDecode ? decodeURIComponent(pair[y]) : pair[y];
}

function appidLoaded(mlHost, SystemID, appidValue, pageId) {
    try {
        if (!appidLoadedFlag) {
            appidLoadedFlag = true;

            if (forceAppid)
                appidObj.forceAppId(appidValue);
            appidObj.init(SystemID, mlHost);
            appidObj.setLpId(pageId);
            appidObj.track('hit');
            appid = appidObj.getAppID();
        }
    }
    catch (err) { }
}

var mlHost = (("https:" == document.location.protocol) ? "https://" : "http://");
var mlHost = mlHost + "www.mlstat.com";

if (typeof addListener != 'function') {
    function addListener(element, type, expression, bubbling) {
        bubbling = bubbling || false;

        if (window.addEventListener) // Standard
        {
            element.addEventListener(type, expression, bubbling);
            return true;
        }
        else if (window.attachEvent) // IE
        {
            element.attachEvent("on" + type, expression);
            return true;
        }
        else {
            return false;
        }
    }
}

function initPage(SystemID, pageId, pageLanguage, initDL, autoDLTimeout) {
    SYSTEM_ID = SystemID = SystemID || SYSTEM_ID;
    autoDLTimeout = parseInt(autoDLTimeout) || 0;

    addListener(window, "load", function () {
        getParams();
        appidLang = pageLanguage;

        cid = false;

        if (params["cid"] && params["cid"] != "") {
            cid = params["cid"];
        }

        lpCookieValue = "n=" + pageId + (pageLanguage != "en" ? ":lng=" + pageLanguage : "");
        lpCookieValue += cid ? ":cid=" + cid : '';
        saveCookie("lp", lpCookieValue, 5 * 365, true);

        urchinAppidVal = appid ? "/appid[" + appid + "]" : "";
        urchinPrefix = '/sysid[' + SystemID + ']' + "/" + pageLanguage + "/lp" + pageId;

        try { pageTracker._trackPageview(urchinPrefix + urchinAppidVal); } catch (e) { }

        var i = 0, db;
        while (db = document.getElementById('downloadButton' + (++i))) {
            addListener(db, 'click', function (element) {
                return function () {
                    downloadClick(element);
                }
            }(db));
        }


        if (initDL >= 2) {
            setTimeout(
				function () {

				    if (typeof afterCount == 'function') {
				        afterCount();
				    }
				    else {
				        document.getElementById('downloadFrame').src = document.getElementById('downloadButton1').href;
				        downloadClick(null, '/download_auto');
				    }

				}, autoDLTimeout * 1000 + 1);
        }
        fireCustomEvent('init');
    });

    // Loading ML stat async.
    try {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = mlHost + "/scripts/appid.V2.js";
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);

        // Check when script is done loading.
        if (typeof (s.addEventListener) != 'undefined') {
            /* FF, Chrome, Safari */
            s.addEventListener('load', function () {
                appidLoaded(mlHost, SystemID, appid, pageId);
            },
			false);
        }
        else {
            /* IE */
            function handleIeState() {
                if (s.readyState == 'loaded' || s.readyState == 'complete') {
                    appidLoaded(mlHost, SystemID, appid, pageId);
                }
            }
            s.attachEvent('onreadystatechange', handleIeState);
        }
    }
    catch (err) { }
}

function trackStatEvents(baseTrackingCode) {
    try { pageTracker._trackPageview(urchinPrefix + baseTrackingCode + urchinAppidVal); } catch (e) { }
    try { appidObj.track('download', appidLang); } catch (e) { }
}
function downloadClick(linkObj, baseTrackingCode) {
    if (linkObj && linkObj.href) {
        location = linkObj.href;
    }
    if (!baseTrackingCode) {
        baseTrackingCode = "/download";
    }

    var isFF = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    var isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
    var button = linkObj && linkObj.getAttribute ? '/btn[' + linkObj.getAttribute('id') + ']' : false;
    baseTrackingCode = button ? baseTrackingCode + button : baseTrackingCode;
    if (isChrome || isFF) {
        setTimeout(function () { trackStatEvents(baseTrackingCode); }, 1500);
    } else {
        trackStatEvents(baseTrackingCode);
    }
    fireCustomEvent('download');
    return false;
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return false;
}

function getCookieDomain() {
    var hostDomain = document.location.host;
    var domainParts = hostDomain.split('.');
    var dl = domainParts.length;

    return (dl <= 2) ? '.' + hostDomain : '.' + (domainParts.slice(dl - 2)).join('.');
}

function saveCookie(name, value, days, domain, secure) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }

    var domainStr = "";
    var secureStr = "";

    if (domain != null) {
        if (domain == true)
            domainStr = "domain=" + getCookieDomain() + "; ";
        else
            domainStr = "domain=" + domain + "; ";
    }

    if (secure != null && secure == true) {
        secureStr = "secure";
    }

    document.cookie = name + "=" + value + expires + "; " + domainStr + "path=/; " + secureStr;
}



var custom_events = {
    "init": {
        "fire_once": true,
        "fired": false,
        "callbacks": []
    },
    "download": {
        "fire_once": false,
        "callbacks": []
    }
}


function onCustomEvent(event, callback) {
    if (event in custom_events) {
        event = custom_events[event];
        if (event.fire_once && event.fired) {
            callback();
            return -1;
        } else {
            event.callbacks.push(callback);
            return event.callbacks.length - 1;
        }
    }
    return false;
}

function fireCustomEvent(event) {
    if (event in custom_events) {
        event = custom_events[event];
        if (event.fire_once && event.fired) {
            return;
        }

        for (var i = 0; i < event.callbacks.length; i++) {
            event.callbacks[i]();
        }

        if (event.fire_once) {
            callbacks = [];
            event.fired = true;
        }
    }
}

function clearDownloadEvents() {
    var download_button = null
		, i = 0;
    while (download_button = document.getElementById('downloadButton' + (++i))) {
        download_button.onclick = null;
    }
}
