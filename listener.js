/**
 * Global vars & defs
 * Data: {tab_id: {request_id: [(object)], view: (object), statusCode: (int)}}
 */

function h(tag = 'div', props = {}, children = []) {
    return {
        tag,
        props,
        children
    };
}

var data = {},
    default_msg = h('h4', {}, 'Please, reload this page.'),
    error_msg = h('h4', {}, 'This tab is not supported.');

/**
 * Clean & Record the received headers
 */
chrome.webRequest.onHeadersReceived.addListener(function (details) {
    if (typeof data[details.tabId] === 'undefined' || typeof data[details.tabId][details.requestId] === 'undefined') {
        data[details.tabId] = {
            [details.requestId]: [],
            statusCode: details.statusCode,
            view: default_msg
        };
    }

    data[details.tabId][details.requestId].push(details);
}, {
    urls: ['http://*/*', 'https://*/*'],
    types: ['main_frame']
}, ['responseHeaders']);

chrome.webRequest.onCompleted.addListener(function (details) {
    if (typeof data[details.tabId] === 'undefined' || typeof data[details.tabId][details.requestId] === 'undefined') {
        data[details.tabId] = {
            [details.requestId]: [],
            statusCode: details.statusCode,
            view: default_msg
        };

        data[details.tabId][details.requestId].push(details);
    }

    data[details.tabId].view = renderPopup(data[details.tabId][details.requestId]);
}, {
    urls: ['http://*/*', 'https://*/*'],
    types: ['main_frame']
}, ['responseHeaders']);

/**
 * Update extension icon with status code badge
 */
chrome.tabs.onUpdated.addListener(function (tabId, info) {
    if (info.status === 'complete') {
        chrome.browserAction.setBadgeText({
            text: (data[tabId] && data[tabId].statusCode !== 200) ? data[tabId].statusCode.toString() : '',
            tabId: tabId
        });
        chrome.browserAction.enable(tabId);

        if (!data[tabId]) {
            data[tabId].view = error_msg;
        }

    } else if (info.status === 'loading') {
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
        request.action === 'show_headers' &&
        sender.id === chrome.runtime.id
    ) sendResponse(data[request.tab_id] || {view: default_msg});
});

/**
 * nonBreakingDash
 * non breaking dash replace
 * @param str
 * @returns {string}
 */
function nonBreakingDash(str) {
    return str.replace(/-/g, '\u2011');
}

function forOwn(obj, callback) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            callback(obj[key], key, obj);
        }
    }
}

function mapForOwn(obj, callback) {
    var arr = [];

    forOwn(obj, function (value, key, _obj) {
        arr.push(callback(value, key, _obj));
    });

    return arr;
}

function compareHeaders(a, b) {
    var aName = a.name || '';
    var bName = b.name || '';
    return aName.localeCompare(bName);
}

function isArrayEmpty(arr) {
    return arr.length === 0;
}

function getClassForStatusCode(statusCode) {
    if (statusCode < 200 && statusCode >= 100) {
        return 'info';
    }
    else if (statusCode < 300 && statusCode >= 200) {
        return 'success';
    }
    else if (statusCode < 400 && statusCode >= 300) {
        return 'redirect';
    }
    else if (statusCode < 500 && statusCode >= 400) {
        return 'warning';
    }

    return 'error';
}

function renderPopup(responses) {
    if (!Array.isArray(responses) || isArrayEmpty(responses)) {
        return default_msg;
    }

    var view = h();

    for (var i = 0, l = responses.length; i < l; i++) {
        var {
            responseHeaders,
            url,
            method,
            statusLine,
            statusCode
            } = responses[i];

        responseHeaders.sort(compareHeaders);

        var table = h('table', {}, [
            h('thead', {className: getClassForStatusCode(statusCode)}, [
                h('tr', {}, [
                    h('th', {colSpan: 2}, [
                        h('span', {}, statusLine),
                        h('strong', {}, method),
                        h('span', {}, url)
                    ])
                ])
            ]),
            h('tbody', {}, mapForOwn(responseHeaders, function ({ name, value }) {
                return h('tr', {}, [
                    h('td', {}, nonBreakingDash(name)),
                    h('td', {}, value)
                ]);
            }))
        ]);

        //build the headers rows

        view.children.push(table);
    }

    return view;
}
