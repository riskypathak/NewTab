/**
 * This file adds a webRequest Blocker to catch the __domain__ URLS configured
 * in manifest and adds params to it.
 *
 * This is needed since we wont always be using update_url to install, in which
 * case GC cannot use the __PARAM__ whose values are in registry.
 */

//////////////////////Webrequest Blocking/////////////////////////
if(chrome.webRequest) {
    chrome.webRequest.onBeforeRequest.addListener(function(info) {
        try {
            var searchUrl = JSON.parse(localStorage.getItem('searchURL')).replace("%7Bquery%7D", ""),
                url = info.url;
                //Catch the HP __domain__ and redirect to __domain__/queryParams
            if(info.url == "http://www.search.ask.com/?gct=hp") {
                url = searchUrl.replace("dts.search.ask.com", "www.search.ask.com")
                               .replace("/sr", "")
                               .replace("&q=", "")
                               .replace("gct=bar", "gct=hp");
             }
             else return;

             //Catch the DS __domain__ and redirect to __domain__/queryParams
//             else if(!info.url.match(/gct=/) && info.url.indexOf("http://dts.search.ask.com/web?q=") != -1) {//means the
//                 url = searchUrl.replace(/gct=[^&]*/, 'gct=ds') + info.url.match(/q=[^&]*/)[0].substring(2);
//                    url = url + "&src=crb";
//            }//Catch the SP __domain__ and redirect to __domain__/queryParams
//            else if(info.url == "http://www.search.ask.com/?gct=hp") {
//                    url = searchUrl.replace("/web", "").replace("&q=", "").replace("gct=bar", "gct=hp");
//            }

            return { redirectUrl: url };
        } catch(e) {
            return;
        }
    },
    // filters
    {
        urls: ["http://www.search.ask.com/*", "http://dts.search.ask.com/*", "http://www.search.ask.com/*"],
        types: ["main_frame"]
    },
    // extraInfoSpec
    ["blocking"]);

    //Fix the startup page issue - Reload all tabs that have the default www.search.ask.com open, so that params can be added to it
    chrome.windows.getAll({populate: true}, function (windows) {
        for (var w in windows)
            for (var t in windows[w].tabs)
               if(windows[w].tabs[t].url == "http://www.search.ask.com/?gct=hp")
                chrome.tabs.reload(windows[w].tabs[t].id);
    });
}