/**
 * This file includes the required ext-all js and css files based upon "theme" and "direction"
 * url parameters.  It first searches for these parameters on the page url, and if they
 * are not found there, it looks for them on the script tag src query string.
 * For example, to include the neptune flavor of ext from an index page in a subdirectory
 * of extjs/examples/:
 * <script type="text/javascript" src="../../examples/shared/include-ext.js?theme=neptune"></script>
 */
(function() {
    function getQueryParam(name) {
        var regex = RegExp('[?&]' + name + '=([^&]*)');

        var match = regex.exec(location.search) || regex.exec(path);
        return match && decodeURIComponent(match[1]);
    }

    function hasOption(opt, queryString) {
        var s = queryString || location.search;
        var re = new RegExp('(?:^|[&?])' + opt + '(?:[=]([^&]*))?(?:$|[&])', 'i');
        var m = re.exec(s);

        return m ? (m[1] === undefined || m[1] === '' ? true : m[1]) : false;
    }

    function getCookieValue(name){
        var cookies = document.cookie.split('; '),
            i = cookies.length,
            cookie, value;

        while(i--) {
           cookie = cookies[i].split('=');
           if (cookie[0] === name) {
               value = cookie[1];
           }
        }

        return value;
    }

    var scriptEls = document.getElementsByTagName('script'),
        path = scriptEls[scriptEls.length - 1].src,
        rtl = getQueryParam('rtl'),
        theme = getQueryParam('theme') || 'neptune',
        includeCSS = !hasOption('nocss', path),
        neptune = (theme === 'neptune'),
        repoDevMode = getCookieValue('ExtRepoDevMode'),
        suffix = [],
        i = 3,
        neptunePath;
	theme = 'classic';
	neptune = false;
    rtl = rtl && rtl.toString() === 'true'

    while (i--) {
        path = path.substring(0, path.lastIndexOf('/'));
    }
        
    if (theme && theme !== 'classic') {
        suffix.push(theme);
    }
    if (rtl) {
        suffix.push('rtl');
    } 

    suffix = (suffix.length) ? ('-' + suffix.join('-')) : '';
	path = path + '/crm';
    if (includeCSS) {
        document.write('<link rel="stylesheet" type="text/css" href="' + path + '/resources/css/ext-all' + suffix + '-debug.css"/>');
    }   
	//var path1 = 'http://rawgit.com/tbabi17/mera/master';
	var path1 = 'sdk/git';
    document.write('<script type="text/javascript" src="' + path + '/shared/ext-all-debug.js"></script>');
    document.write('<script type="text/javascript" src="' + path + '/ux/MouseEventForwarding.js"></script>');
    document.write('<script type="text/javascript" src="' + path + '/ux/DataDrop.js"></script>');

    document.write('<script type="text/javascript" src="sdk/lang.js"></script>');
    document.write('<script type="text/javascript" src="' + path1 + '/forms.js"></script>');
    document.write('<script type="text/javascript" src="' + path1 + '/charts.js"></script>');
    document.write('<script type="text/javascript" src="' + path1 + '/models.js"></script>');
    document.write('<script type="text/javascript" src="sdk/models.js"></script>');
    document.write('<script type="text/javascript" src="' + path1 + '/extend.js"></script>');
    document.write('<script type="text/javascript" src="' + path1 + '/windows.js"></script>');
    document.write('<script type="text/javascript" src="' + path1 + '/ocr.js"></script>');
    document.write('<script type="text/javascript" src="sdk/ocr.js"></script>');
    document.write('<script type="text/javascript" src="' + path1 + '/deals.js"></script>');
    document.write('<script type="text/javascript" src="' + path1 + '/module.js"></script>');
    document.write('<script type="text/javascript" src="' + path1 + '/viewport.js"></script>');
    document.write('<script type="text/javascript" src="' + path1 + '/crypto/sha.js"></script>');
    document.write('<script type="text/javascript" src="' + path1 + '/crypto/sha512.js"></script>');
    document.write('<script type="text/javascript" src="sdk/lang.js"></script>');
    if (neptune) {
        neptunePath = (repoDevMode ? path + '/..' : path) +
            '/packages/ext-theme-neptune/build/ext-theme-neptune' +
            (repoDevMode ? '-dev' : '') + '.js';

        if (repoDevMode &&  window.ActiveXObject) {
            Ext = {
                _beforereadyhandler: function() {
                    Ext.Loader.loadScript({ url: neptunePath });
                }
            };
        } else {
            document.write('<script type="text/javascript" src="' + neptunePath + '" defer></script>');
        }
    }

})();