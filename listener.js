/**
 * Global vars & defs
 * Data: {tab_id: {request_id: [(object)], view: (object), statusCode: (int)}}
 */
var data = {},
    default_msg = createElement('h4', 'Please, reload this page.'),
    error_msg = createElement('h4', 'This tab is not supported.');

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
    },
    {
        urls: ["http://*/*", "https://*/*"],
        types: ['main_frame']
    },
    ["responseHeaders"]
);

chrome.webRequest.onCompleted.addListener(function (details) {
        if (typeof data[details.tabId] === 'undefined' || typeof data[details.tabId][details.requestId] === 'undefined') {
            data[details.tabId] = {
                [details.requestId]: [],
                statusCode: details.statusCode,
                view: default_msg
            };

            data[details.tabId][details.requestId].push(details);
        }

        data[details.tabId].view = renderPopup2(data[details.tabId][details.requestId]);

    },
    {
        urls: ["http://*/*", "https://*/*"],
        types: ['main_frame']
    },
    ["responseHeaders"]
);

/**
 * Update extension icon with status code badge
 */
chrome.tabs.onUpdated.addListener(function (tabId, info) {
    if (info.status === "complete") {
        chrome.browserAction.setBadgeText({
            text: (data[tabId] && data[tabId].statusCode !== 200) ? data[tabId].statusCode.toString() : '',
            tabId: tabId
        });
        chrome.browserAction.enable(tabId);

        if (!data[tabId]) {
            data[tabId].view= error_msg;
        }

    } else if (info.status === "loading") {
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
 * @returns {string}
 */
function renderPopup(responses) {
    var view = default_msg;

    if (typeof responses === 'object' && responses.length > 0) {
        view = '';
        for (var i = 0, l = responses.length; i < l; i++) {

            var headers = responses[i].responseHeaders,
                url = responses[i].url,
                method = responses[i].method,
                status = responses[i].statusLine,

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

function renderPopup2(responses) {
    if (typeof responses === 'object' && responses.length > 0) {
        var view = document.createElement('div');
        for (var i = 0, l = responses.length; i < l; i++) {

            var headers = responses[i].responseHeaders,
                url = responses[i].url,
                method = responses[i].method,
                status = responses[i].statusLine,

                colorClass = (responses[i].statusCode === 200) ? 'success'
                    : (responses[i].statusCode < 400) ? 'warning' : 'error';

            headers.sort(function (a, b) {
                return (a.name.localeCompare(b.name))
            });

            var table = document.createElement('table');
            var thead = document.createElement('thead');
            table.appendChild(thead);
            thead.className = colorClass;
            var tr = document.createElement('tr');
            thead.appendChild(tr);
            var th = document.createElement('th');
            tr.appendChild(th);
            th.colspan = 2;
            th.appendChild(createElement('span', status));
            th.appendChild(createElement('strong', method));
            th.appendChild(createElement('span', url));

            var tbody = document.createElement('tbody');
            table.appendChild(tbody);
            //build the headers rows
            for (var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    headers[key].name = headers[key].name.replace(new RegExp('-', 'g'), '&#8209;'); //non breaking dash replace
                    var newtr = document.createElement('tr');
                    newtr.appendChild(createElement('td', headers[key].name));
                    newtr.appendChild(createElement('td', headers[key].value));
                    tbody.appendChild(newtr);
                }
            }

            view.appendChild(table);
        }

    } else {
        view = default_msg;
    }

    return view;
}
function createElement(name, text) {
    var el = document.createElement(name);
    el.innerText = text;
    return el;
}