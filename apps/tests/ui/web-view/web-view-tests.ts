﻿import TKUnit = require("../../TKUnit");
import helper = require("../helper");
import page = require("ui/page");

// <snippet module="ui/web-view" title="WebView">
// # WebView
// Using a WebView requires the web-view module.
// ``` JavaScript
import webViewModule = require("ui/web-view");
// ```
// </snippet>

// ### Declaring a WebView.
//```XML
//  <Page>
//      <WebView src="{{ someUrl | pathToLocalFile | htmlString }}" />
//  </Page>
//```

// </snippet>

var _createWebViewFunc = function (): webViewModule.WebView {
    // <snippet module="ui/web-view" title="WebView">
    // ### Creating a WebView
    // ``` JavaScript
    var webView = new webViewModule.WebView();
    // ```
    // </snippet>
    return webView;
}

export var testLoadExistingUrl = function () {
    var newPage: page.Page;
    var webView = _createWebViewFunc();
    var pageFactory = function (): page.Page {
        newPage = new page.Page();
        newPage.content = webView;
        return newPage;
    };
    
    helper.navigate(pageFactory);

    var testFinished = false;
    var actualUrl;
    var actualError;

    // <snippet module="ui/web-view" title="WebView">
    // ### Using WebView
    // ``` JavaScript
    webView.on(webViewModule.WebView.loadFinishedEvent, function (args: webViewModule.LoadEventData) {
        // <hide>
        actualUrl = args.url;
        actualError = args.error;
        testFinished = true;
        // </hide>
        var message;
        if (!args.error) {
            message = "WebView finished loading " + args.url;
        }
        else {
            message = "Error loading " + args.url + ": " + args.error;
        }
        //console.log(message);
    });
    webView.url = "https://httpbin.org/html";

    TKUnit.wait(4);

    helper.goBack();

    if (testFinished) {
        TKUnit.assert(actualUrl === "https://httpbin.org/html", "args.url should equal https://httpbin.org/html");
        TKUnit.assert(actualError === undefined, actualError);
    }
    else {
        TKUnit.assert(false, "TIMEOUT");
    }
}

export var testLoadLocalFile = function () {
    var newPage: page.Page;
    var webView = _createWebViewFunc();
    var pageFactory = function (): page.Page {
        newPage = new page.Page();
        newPage.content = webView;
        return newPage;
    };

    helper.navigate(pageFactory);

    var testFinished = false;
    var actualHtml;
    var actualTitle;
    var actualError;

    var expectedTitle = 'MyTitle';
    var expectedHtml = '<span style="color:red">Test</span>';

    // <snippet module="ui/web-view" title="WebView">
    // ### Using WebView
    // ``` JavaScript
    webView.on(webViewModule.WebView.loadFinishedEvent, function (args: webViewModule.LoadEventData) {
        // <hide>
        if (webView.ios) {
            actualHtml = webView.ios.stringByEvaluatingJavaScriptFromString("document.body.innerHTML").trim();
        } else if (webView.android) {
            actualTitle = webView.android.getTitle()
        }

        actualError = args.error;
        testFinished = true;
        // </hide>
        var message;
        if (!args.error) {
            message = "WebView finished loading " + args.url;
        }
        else {
            message = "Error loading " + args.url + ": " + args.error;
        }
        //console.log(message);
    });
    webView.src = "~/ui/web-view/test.html";

    TKUnit.wait(4);

    helper.goBack();

    if (testFinished) {
        if (webView.ios) {
            TKUnit.assert(actualHtml === expectedHtml, "File ~/ui/web-view/test.html not loaded properly. Actual: " + actualHtml);
        } else if (webView.android) {
            TKUnit.assert(actualTitle === expectedTitle, "File ~/ui/web-view/test.html not loaded properly. Actual: " + actualTitle);
        }
        TKUnit.assert(actualError === undefined, actualError);
    }
    else {
        TKUnit.assert(false, "TIMEOUT");
    }
}

export var testLoadHTMLString = function () {
    var newPage: page.Page;
    var webView = _createWebViewFunc();
    var pageFactory = function (): page.Page {
        newPage = new page.Page();
        newPage.content = webView;
        return newPage;
    };

    helper.navigate(pageFactory);

    var testFinished = false;
    var actualHtml;
    var actualTitle;
    var actualError;

    var expectedTitle = 'MyTitle';
    var expectedHtml = '<span style="color:red">Test</span>';

    // <snippet module="ui/web-view" title="WebView">
    // ### Using WebView
    // ``` JavaScript
    webView.on(webViewModule.WebView.loadFinishedEvent, function (args: webViewModule.LoadEventData) {
        // <hide>
        if (webView.ios) {
            actualHtml = webView.ios.stringByEvaluatingJavaScriptFromString("document.body.innerHTML").trim();
        } else if (webView.android) {
            actualTitle = webView.android.getTitle()
        }

        actualError = args.error;
        testFinished = true;
        // </hide>
        var message;
        if (!args.error) {
            message = "WebView finished loading " + args.url;
        }
        else {
            message = "Error loading " + args.url + ": " + args.error;
        }
        //console.log(message);
    });
    webView.src = '<!DOCTYPE html><html><head><title>MyTitle</title><meta charset="utf-8" /></head><body><span style="color:red">Test</span></body></html>';

    TKUnit.wait(4);

    helper.goBack();

    if (testFinished) {
        if (webView.ios) {
            TKUnit.assert(actualHtml === expectedHtml, "HTML string not loaded properly. Actual: " + actualHtml);
        } else if (webView.android) {
            TKUnit.assert(actualTitle === expectedTitle, "HTML string not loaded properly. Actual: " + actualTitle);
        }
        TKUnit.assert(actualError === undefined, actualError);
    }
    else {
        TKUnit.assert(false, "TIMEOUT");
    }
}

export var testLoadInvalidUrl = function () {
    var newPage: page.Page;
    var webView = _createWebViewFunc();
    var pageFactory = function (): page.Page {
        newPage = new page.Page();
        newPage.content = webView;
        return newPage;
    };

    helper.navigate(pageFactory);

    var testFinished = false;
    var actualError;
    webView.on(webViewModule.WebView.loadFinishedEvent, function (args: webViewModule.LoadEventData) {
        if (actualError) {
            // Android call this twice -- the second time args.error is undefined.
            return;
        }
        actualError = args.error;
        testFinished = true;
    });
    webView.url = "kofti://mnogokofti";

    TKUnit.wait(4);

    helper.goBack();

    if (testFinished) {
        TKUnit.assert(actualError !== undefined, "There should be an error.");
    }
    else {
        TKUnit.assert(false, "TIMEOUT");
    }
}