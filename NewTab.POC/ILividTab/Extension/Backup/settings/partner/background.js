var default_values = {};

var param_storeage =
{
    ext_type_value: 'Search',
    params:
    {
        ext_id: 'extid',
        ext_ver: 'extver',
        ext_type: 'extype',

        location: 'osl',
        os_version: 'osver',
        platform: 'ostype',

        browser_name: 'bname',
        browser_version: 'bver',

        sysid: 'sysid',
        appid_dl: 'appid',
        lp: 'lpid',

        clid: 'clid'
    },

    lpCoockieParamModificationRule: function(lp)
    {
        var matches = lp.match(/(\d+)/);
        return matches ? matches[0] : "";
    },

    GetItem: function(name)
    {
        var full_name = "uws." + name;
        return localStorage.getItem(full_name);
    },

    SetItem: function(name, value)
    {
        var full_name = "uws." + name;
        localStorage.setItem(full_name, value);
    }
};


function generateGUID()
{
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(coffee) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (d=='x' ? r : (r&0x7|0x8)).toString(16);
    });
}

function GetUserUniqueID(callback)
{
    var id = param_storeage.GetItem(param_storeage.params.clid);
    if(!id)
    {
        id = '{' + generateGUID() + '}';
    }
    callback(id);
}

function GetExtensionInfo(callback)
{
    chrome.management.get(chrome.i18n.getMessage("@@extension_id"), function(extinfo)
    {
        var info = {};

        info.id = extinfo.id;
        info.version = extinfo.version;
        info.type = extinfo.type;

        callback(info);
    });
}

function GetLocation()
{
    return navigator.language;
}

function GetOsVersion()
{
    if (navigator.appVersion.indexOf("Windows NT 5.0")!=-1) return "5.0";
    if (navigator.appVersion.indexOf("Windows NT 5.1")!=-1) return "5.1";
    if (navigator.appVersion.indexOf("Windows NT 5.2")!=-1) return "5.2";
    if (navigator.appVersion.indexOf("Windows NT 6.0")!=-1) return "6.0";
    if (navigator.appVersion.indexOf("Windows NT 6.1")!=-1) return "6.1";
    if (navigator.appVersion.indexOf("Windows NT 6.2")!=-1) return "6.2";
    if (navigator.appVersion.indexOf("Windows NT 6.3")!=-1) return "6.3";
    return  "Unknown OS";
}

function GetOsType()
{
    return navigator.platform;
}

function GetBrowserName(browser)
{
    try
    {
        var CHROME = 1;
        var re = new RegExp("(" + browser + ")\/(((.*)\\s)|((.*)$))");
        var matches = navigator.appVersion.match(re);
        var b_name = matches[CHROME];
        if(b_name == "Chrome") return  "ch";
        if(b_name == "Firefox") return "ff";
        if(b_name == "Opera") return "op";
        if(b_name == "Internet Explorer") return "ie";
        return  "unknown";
    }
    catch(e)
    {
    }
    return "";
}

function GetBrowserVersion(browser)
{
    try
    {
        var VERSION = 2;
        var re = new RegExp("(" + browser + ")\/(((.*)\\s)|((.*)$))");
        var matches = navigator.appVersion.match(re);
        return  matches[VERSION];
    }
    catch(e)
    {
        console.log("something wrong: " + e);
    }
    return "";
}

function GenXMLNode(node_name, val)
{
    return "<" + node_name + ">" + val + "</" + node_name + ">";
}


function cookieObject(cookies, data)
{
  cookies.reduce(function(obj, cookie)
  {
//      console.log(cookie.name + " = " + cookie.value);

      data[cookie.name] = cookie.value;
  }, {});
}

function buildXML(tag, url, callback)
{
    var xml="<"+tag+">";
    xml += "<client_info>";
    // cookies
    xml += GenXMLNode(param_storeage.params.sysid, param_storeage.GetItem(param_storeage.params.sysid));
    xml += GenXMLNode(param_storeage.params.appid_dl, param_storeage.GetItem(param_storeage.params.appid_dl));
    xml += GenXMLNode(param_storeage.params.lp,  param_storeage.GetItem(param_storeage.params.lp));
    // guid
    xml += GenXMLNode(param_storeage.params.clid, param_storeage.GetItem(param_storeage.params.clid));
    // extension info
    xml += GenXMLNode(param_storeage.params.ext_id, param_storeage.GetItem(param_storeage.params.ext_id));
    xml += GenXMLNode(param_storeage.params.ext_ver, param_storeage.GetItem(param_storeage.params.ext_ver));
    xml += GenXMLNode(param_storeage.params.ext_type, param_storeage.GetItem(param_storeage.params.ext_type));
    //  override per partner's request
    xml += GenXMLNode(param_storeage.params.ext_type, "App");

    // os info
    xml += GenXMLNode(param_storeage.params.os_version, param_storeage.GetItem(param_storeage.params.os_version));
    xml += GenXMLNode(param_storeage.params.platform, param_storeage.GetItem(param_storeage.params.platform));
    xml += GenXMLNode(param_storeage.params.location, param_storeage.GetItem(param_storeage.params.location));
    // browser info
    xml += GenXMLNode(param_storeage.params.browser_name, param_storeage.GetItem(param_storeage.params.browser_name));
    xml += GenXMLNode(param_storeage.params.browser_version, param_storeage.GetItem(param_storeage.params.browser_version));

    xml += "</client_info>";
    xml += "</"+tag+">";

    callback(xml, url);
}

function buildXMLAndSaveToStorage(type, url, callback)
{
    GetUserUniqueID(function(user_id)
    {
        GetExtensionInfo(function (ext_info)
        {
            chrome.cookies.getAll({}, function(cookies)
            {
               var data = {};
               cookieObject(cookies, data);

               // save all params in local storage
               param_storeage.SetItem(param_storeage.params.clid, user_id);

               param_storeage.SetItem(param_storeage.params.ext_id, ext_info.id);
               param_storeage.SetItem(param_storeage.params.ext_ver, ext_info.version);
               param_storeage.SetItem(param_storeage.params.ext_type, param_storeage.ext_type_value);

               param_storeage.SetItem(param_storeage.params.location, GetLocation());
               param_storeage.SetItem(param_storeage.params.os_version, GetOsVersion());
               param_storeage.SetItem(param_storeage.params.platform, GetOsType());

               param_storeage.SetItem(param_storeage.params.browser_name, GetBrowserName("Chrome"));
               param_storeage.SetItem(param_storeage.params.browser_version, GetBrowserVersion("Chrome"));

               param_storeage.SetItem(param_storeage.params.sysid, data.sysid);
               param_storeage.SetItem(param_storeage.params.appid_dl, data.appid_dl);

               param_storeage.SetItem(param_storeage.params.lp, param_storeage.lpCoockieParamModificationRule(data.lp ? data.lp : ""));

              buildXML(type, url, callback);


            });
        });
    });
}

function CryptByAES_WithBase64(stats)
{
    var KEY_STR = 'ciorhalodkhsivnitshrreipyrizliou';
    var key = CryptoJS.enc.Utf8.parse(KEY_STR);
    var encrypted = CryptoJS.AES.encrypt(stats, key, { mode: CryptoJS.mode.ECB } );
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

function EscapeCharacters(str)
{
    var escaped = escape(str);
    return escaped.replace('+', '%2B');
}

function AddStatsHeader(stats)
{
    var content = "XML=<secured_request><salt>533</salt><data>";
    content += stats;
    content += "</data></secured_request>";
    return content;
}


function SendData(url, data)
{
  var http = new XMLHttpRequest();
  http.open("POST", url, false);
  http.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  http.send(data);

  return http.status;
}

function SendStats(type, url)
{
    try
    {
        buildXMLAndSaveToStorage(type, url, function (xml, url)
        {
             var stats = xml;
//             console.log(stats);

             var cryptData = CryptByAES_WithBase64(stats);
//             console.log(cryptData);

             var data_with_header_content = AddStatsHeader(cryptData);
//             console.log(data_with_header_content);

             //var result_data = EscapeCharacters(data_with_header_content);
             //console.log(result_data);
             // send
             console.log( SendData(url, data_with_header_content) );
        });
    }
    catch(e)
    {
        console.log("something wrong: " + e);
    }
}

function GetDaysFromTimePeriod(date)
{
    var cur_time = new Date();
    var total_remains = (cur_time.getTime() - date.getTime());
    var sec_count = parseInt(total_remains / 1000);
    var DAY = 86400; //60 * 60 * 24
    return parseInt(sec_count / DAY);
}


function GetSearchParameters(callback)
{
    GetExtensionInfo(function (ext_info)
    {
        chrome.cookies.getAll({}, function(cookies)
        {
            var data = {};
            cookieObject(cookies, data);

            param_storeage.SetItem(param_storeage.params.ext_ver, ext_info.version);
            param_storeage.SetItem(param_storeage.params.sysid, data.sysid);
            param_storeage.SetItem(param_storeage.params.appid_dl, data.appid_dl);

            var sys_id =  param_storeage.GetItem( param_storeage.params.sysid);
            var app_id =  param_storeage.GetItem( param_storeage.params.appid_dl);
            var ext_ver = param_storeage.GetItem( param_storeage.params.ext_ver);

            var d = sys_id.toString() + "_" + app_id.toString();
            param_storeage.SetItem('d', d);

            var v = ext_ver.toString() + "_" + GetDaysFromTimePeriod(new Date("june,1,2013,00:00:00")).toString();

            callback(d, v);
        })
    });
}

function test_for_d_v()
{
    GetSearchParameters(function(d, v)
    {
        console.log("D = " + d);
        console.log("V = " + v);
    });
}

function SendLoginStats()
{
    var domain="http://service.bandoobe.com/ext_login_stats.php";
    SendStats("ext_login_request", domain);
}

function SendInstallStats()
{
    var domain="http://service.bandoobe.com/ext_install_stats.php";
    SendStats("ext_install_stats_request", domain);
}