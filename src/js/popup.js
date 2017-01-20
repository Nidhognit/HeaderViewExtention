const MessageAcceptance = require('./MessageAcceptance');

/**
 * Ask for recorded headers on popup opening
 */

chrome.tabs.getSelected(null, function (tab) {
    chrome.runtime.sendMessage(
        {
            action: 'show_headers',
            tab_id: tab.id
        },
        function (response) {
            const messageAcceptance = new MessageAcceptance();
            const popup = messageAcceptance.render(messageAcceptance.renderPopup(response));

            document.getElementById('content').appendChild(popup);
        });
});
