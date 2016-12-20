/**
 * Ask for recorded headers on popup opening
 */

function render({ tag, props, children }) {
    var el = document.createElement(tag);
    Object.assign(el, props);

    if (typeof children === 'string') {
        el.textContent = children;
    } else if (Array.isArray(children)) {
        children.forEach(child => el.appendChild(render(child)));
    } else {
        console.error('something weird in children', children);
    }

    return el;
}

chrome.tabs.getSelected(null, function (tab) {
    chrome.runtime.sendMessage(
        {
            action: 'show_headers',
            tab_id: tab.id
        },
        function (response) {
            var popup = render(response.view);
            document.getElementById('content').appendChild(popup);
        });
});
