const SecurityHeaderRating = require('./SecurityHeaderRating');
const { h, isArrayEmpty, compareHeaders } = require('./utils');

function MessageAcceptance() {
    this._default_msg = h('h4', {}, 'Please, reload this page.');
}

MessageAcceptance.prototype.forOwn = function (obj, callback) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            callback(obj[key], key, obj);
        }
    }
};

MessageAcceptance.prototype.mapForOwn = function (obj, callback) {
    var arr = [];

    this.forOwn(obj, function (value, key, _obj) {
        arr.push(callback(value, key, _obj));
    });

    return arr;
};

MessageAcceptance.prototype.getClassForStatusCode = function (statusCode) {
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
};

MessageAcceptance.prototype.renderPopup = function (responses) {
    for (var first in responses) break;
    responses = responses[first];
    let self = this;
    if (!Array.isArray(responses) || isArrayEmpty(responses)) {
        return this._default_msg;
    }

    let view = h();
    const SecurityRating = new SecurityHeaderRating();

    for (let i = 0, l = responses.length; i < l; i++) {
        let {
            responseHeaders,
            url,
            method,
            statusLine,
            statusCode
        } = responses[i];

        responseHeaders.sort(compareHeaders);
        SecurityRating.clear();

        var table = h('table', {}, [
            h('tbody', {}, self.mapForOwn(responseHeaders, function ({name, value}) {
                SecurityRating.checkHeader(name, value);
                return h('tr', {}, [
                    h('td', {}, name),
                    h('td', {}, SecurityRating.getLink(h, value))
                ]);
            })),
            h('thead', {className: self.getClassForStatusCode(statusCode)}, [
                h('tr', {}, [
                    h('th', {colSpan: 2}, [
                        h('strong', {}, statusLine),
                        h('br', {}),
                        h('strong', {}, method),
                        h('span', {className: 'span80'}, url),
                        h('span', {className: 'circle-rating'}, SecurityRating.getRating())
                    ])
                ])
            ])
        ]);

        view.children.push(table);
    }

    return view;
};

MessageAcceptance.prototype.render = function ({tag, props, children}) {
    const self = this;
    let el = document.createElement(tag);
    Object.assign(el, props);

    if (typeof children === 'string' || typeof children === 'number') {
        el.textContent = children;
    } else if (Array.isArray(children)) {
        children.forEach(child => el.appendChild(self.render(child)));
    } else {
        console.error('something weird in children', children);
    }

    return el;
};

module.exports = MessageAcceptance;
