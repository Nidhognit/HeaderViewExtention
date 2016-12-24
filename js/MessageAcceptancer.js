function MessageAcceptance() {
    this._default_msg = h('h4', {}, 'Please, reload this page.');
    this._error_msg = h('h4', {}, 'This tab is not supported.');

}
MessageAcceptance.prototype.nonBreakingDash = function (str) {
    return str.replace(/-/g, '\u2011');
};

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
    for (first in responses) break;
    responses = responses[first];
    var self = this;
    if (!Array.isArray(responses) || isArrayEmpty(responses)) {
        return this._default_msg;
    }

    var view = h();
    var SecurityRating = new SecurityHeaderRating();

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
            h('tbody', {}, self.mapForOwn(responseHeaders, function ({name, value}) {
                name = self.nonBreakingDash(name);
                SecurityRating.checkHeader(name, value);
                return h('tr', {}, [
                    h('td', {}, name),
                    h('td', {}, value)
                ]);
            })),
            h('thead', {className: self.getClassForStatusCode(statusCode)}, [
                h('tr', {}, [
                    h('th', {colSpan: 2}, [
                        h('span', {}, statusLine),
                        h('strong', {}, method),
                        h('span', {}, url),
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
    var self = this;
    var el = document.createElement(tag);
    Object.assign(el, props);

    if (typeof children === 'string') {
        el.textContent = children;
    } else if (Array.isArray(children)) {
        children.forEach(child => el.appendChild(self.render(child)));
    } else {
        console.error('something weird in children', children);
    }

    return el;
};

function h(tag = 'div', props = {}, children = []) {
    return {
        tag,
        props,
        children
    };
}

function isArrayEmpty(arr) {
    return arr.length === 0;
}

function compareHeaders(a, b) {
    var aName = a.name || '';
    var bName = b.name || '';
    return aName.localeCompare(bName);
}
