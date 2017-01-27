/**
 * Global vars & defs
 * Data: {tab_id: {request_id: [(object)], view: (object), statusCode: (int)}}
 */

const MessageCreator = require('./MessageCreator');

let messageCreator = new MessageCreator();

/**
 * Clean & Record the received headers
 */
chrome.webRequest.onHeadersReceived.addListener(function (details) {
    if (messageCreator.hasRequest(details.tabId, details.requestId )) {
        messageCreator.addDetails(details);
    }
    messageCreator.setDetailsToMessage(details);
}, {
    urls: ['http://*/*', 'https://*/*'],
    types: ['main_frame']
}, ['responseHeaders']);

chrome.webRequest.onCompleted.addListener(function (details) {
    if (messageCreator.hasRequest(details.tabId, details.requestId )) {
        messageCreator.addDetails(details);
        messageCreator.setDetailsToMessage(details);
    }

    // data[details.tabId].view = renderPopup(data[details.tabId][details.requestId]);
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
            text: messageCreator.getStatusCode(tabId),
            tabId: tabId
        });
        chrome.browserAction.enable(tabId);


    } else if (info.status === 'loading') {
        chrome.browserAction.disable(tabId);
    }
});

/**
 * Listen for close event and clean tab data.
 */
chrome.tabs.onRemoved.addListener(function (id) {
    messageCreator.removeDetails(id);
});


/**
 * Chrome replaces tabs ids. Go figure...
 */
chrome.webNavigation.onTabReplaced.addListener(function (details) {
    messageCreator.removeDetails(details.replacedTabId);
});

/**
 * Listen for data request & responds with the view html
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (
        request.action === 'show_headers' &&
        sender.id === chrome.runtime.id
    ) sendResponse(messageCreator.getMessage(request.tab_id));
});
