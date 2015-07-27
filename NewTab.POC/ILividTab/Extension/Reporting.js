var Reporting = {};
Reporting.NT_PARAM = "gct=hp&o=APN10644A&qrsc=2871&l=dis&sver=3&apn_ptnrs=^AG5";
Reporting.DS_PARAM = "gct=ds&o=APN10644&qrsc=2871&l=dis&sver=3&apn_ptnrs=^AG5";
Reporting.PH_HOME_URL = "http://phn.apnanalytics.com/tr.gif?o=APN10644&anxa=APNToolbar&anxe=PhoneHome&anxp=^AG5^BND406^YY^XX&trgb=CR";
Reporting.INSTALL_URL = "http://anx.apnanalytics.com/tr.gif?&anxa=APNImeshToolbar&anxe=SuccessfulInstall&anxp=^AG5^BND406^YY^XX&installationResult=success&targetbrowser=CR";

// helper function
Reporting.addDoiPh = function (url) {
    if (url && typeof url === "string") {
        return url + ((-1 == url.indexOf("?")) ? "?" : "&") + "doi="+Utils.getItem('doi');
    }
    return "";
};
Reporting.addDoi = function (url) {
    if (url && typeof url === "string") {
        return url + ((-1 == url.indexOf("?")) ? "?" : "&") + "dateOfInstall="+Utils.getItem('doi');
    }
    return "";
};
Reporting.install = function () {
    //if (!localStorage.getItem('doi')){
        Utils.setItem('doi', new Date().toJSON().substring(0,10));
        try {
            SendInstallStats();
            Utils.ajax(Reporting.INSTALL_URL);
        } catch(e) {
            console.error ('error in calling server method SendInstallStats: ' + e);
        }
    //}
};

Reporting.homePhone = function () {
    var prevPhoneHome,
        interval;

    prevPhoneHome = localStorage.getItem("prevPhoneHomeTime") || 0;
    interval = 24 * 60 * 60 * 1000;

    //function report() {
    //    try {
            SendLoginStats();
            Utils.ajax(Reporting.addDoiPh(Reporting.PH_HOME_URL));
            localStorage.setItem("prevPhoneHomeTime", new Date().getTime());
    //    } catch(e) {
    //        console.error ('error in calling server method SendLoginStats: ' + e);
    //    }
    //}
    setTimeout(function() {
        Utils.timer(report, interval, prevPhoneHome);
    }, 5000);
};

Reporting.set_searchURL = function () {
    var buildUrl = function (url, params) {
        if (url && typeof url === "string") {
            if (url.indexOf("?") > -1) {
                url = url.split ("?")[0];
                if (url) {
                    url += (params ? ("?" + params) : "")
                    return Reporting.addDoi (url) +
                            "&d=" + encodeURIComponent(Utils.getItem('d')) +
                            "&v=" + encodeURIComponent(Utils.getItem('v'));
                }
            }
        }
        return "";
    };

    if (!Utils.getItem('d') || ((Utils.getItem('d')).indexOf ('undefined') > -1) ||
        !Utils.getItem('v') || ((Utils.getItem('v')).indexOf ('undefined') > -1)) {
        try {
            GetSearchParameters(function (d, v) {
                Utils.setItem('d', d);
                Utils.setItem('v', v);
                Utils.setItem("searchURL", buildUrl(Config.searchURL, Reporting.NT_PARAM));
            });
        } catch(e) {
            console.error ('error in calling server method GetSearchParameters: ' + e);
        }
    }
};

Reporting.install ();
Reporting.homePhone ();
setTimeout(Reporting.set_searchURL, 5000);
