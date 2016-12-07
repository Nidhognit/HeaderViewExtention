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
            document.getElementById('content').innerHTML = response.view;
        });
});
