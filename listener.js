/**
 * Global vars & defs
 * Data: {tab_id: {request_id: [(object)], view: (string), statusCode: (int)}}
 */
var data        = {},
    default_msg = '<h4>Please, reload this page.</h4>',
    error_msg   = '<h4>This tab is not supported.</h4>';

/**
 * Clean & Record the received headers
 */
chrome.webRequest.onHeadersReceived.addListener(function (details) {

        if (typeof data[details.tabId] === 'undefined' || typeof data[details.tabId][details.requestId] === 'undefined') {
            // Init the entry for the tab && request id
            // (Bonus: this also delete previous & outdated request entries. Did it by accident lol)
            data[details.tabId] = {
                [details.requestId]: [],
                statusCode         : details.statusCode,
                view               : default_msg
            };
        }

        // Push the received request details into the request id object
        data[details.tabId][details.requestId].push(details);
    },
    {
        urls : ["http://*/*", "https://*/*"],
        types: ['main_frame'] // Track only requests at top level (tab url)
    },
    ["responseHeaders"]
);

chrome.webRequest.onCompleted.addListener(function (details) {

        if (typeof data[details.tabId] === 'undefined' || typeof data[details.tabId][details.requestId] === 'undefined') {
            // Init the entry for the tab && request id
            // (Bonus: this also delete previous & outdated request entries. Did it by accident lol)
            data[details.tabId] = {
                [details.requestId]: [],
                statusCode         : details.statusCode,
                view               : default_msg
            };

            // Fallback, fill with the only data available
            data[details.tabId][details.requestId].push(details);
        }

        // Render popup html with parsed info
        data[details.tabId].view = renderPopup(data[details.tabId][details.requestId]);

    },
    {
        urls : ["http://*/*", "https://*/*"],
        types: ['main_frame'] // Track only requests at top level (tab url)
    },
    ["responseHeaders"]
);

/**
 * Update extension icon with status code badge
 */
chrome.tabs.onUpdated.addListener(function (tabId, info) {
    if (info.status === "complete") {
        //set badge for status code if different than 200 OK
        chrome.browserAction.setBadgeText({
            text : (data[tabId] && data[tabId].statusCode !== 200) ? data[tabId].statusCode.toString() : '',
            tabId: tabId
        });
        // Re-enable the button
        chrome.browserAction.enable(tabId);

        // Mark unsuported tabs
        if (!data[tabId]) {
            data[tabId] = {view: error_msg};
        }

    } else if (info.status === "loading") {
        //disable the button
        chrome.browserAction.disable(tabId);
    }
});

/**
 * Listen for close event and clean tab data.
 */
chrome.tabs.onRemoved.addListener(function (id) {
    delete data[id];
});


/**
 * Sneaky bastard..
 * Chrome replaces tabs ids. Go figure...
 */
chrome.webNavigation.onTabReplaced.addListener(function (details) {
    delete data[details.replacedTabId];
});

/**
 * Listen for data request & responds with the view html
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (
        request.action === "show_headers" &&
        sender.id === chrome.runtime.id
    ) sendResponse(data[request.tab_id] || {view: default_msg});
});


/**
 * Render the popup view element
 * @param obj
 * @returns {string}
 */
function renderPopup(responses) {
    //set default message & vars
    var view = default_msg;

    if (typeof responses === 'object' && responses.length > 0) {
        view = ''; // reset the view

        // iterates through request path and builds the tables
        for (var i = 0,l = responses.length; i < l; i++) {

            var headers   = responses[i].responseHeaders,
                url       = responses[i].url,
                method    = responses[i].method,
                status    = responses[i].statusLine,

                colorClass = (responses[i].statusCode === 200) ? 'success'
                    : (responses[i].statusCode < 400) ? 'warning' : 'error';

            headers.sort(function (a, b) {
                return (a.name.localeCompare(b.name))
            });

            //start building html
            view += '<table>';
            //table headings
            view += '<thead class="' + colorClass + '">';
            view += '<tr><th colspan="2">' + status + '<span><strong>' + method + '</strong>&nbsp;' + url + '</span></th></tr>';
            view += '</thead><tbody>';

            //build the headers rows
            for (var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    headers[key].name = headers[key].name.replace(new RegExp('-', 'g'), '&#8209;'); //non breaking dash replace
                    view += '<tr><td>' + headers[key].name + '</td><td>' + headers[key].value + '</td></tr>'
                }
            }

            view += '</tbody></table>';
        }

    }

    return view;
}