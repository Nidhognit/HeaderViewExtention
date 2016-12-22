function MessageCreator() {
    this._message = [];
}

MessageCreator.prototype.hasRequest = function (tabId, requestId) {
    return typeof this._message[tabId] === 'undefined' || typeof this._message[tabId][requestId] === 'undefined';
};

MessageCreator.prototype.addDetails = function (details) {
    this._message[details.tabId] = {
        [details.requestId]: [],
        statusCode: details.statusCode
    };
};

MessageCreator.prototype.setDetailsToMessage = function (details) {
    this._message[details.tabId][details.requestId].push(details);
};

MessageCreator.prototype.removeDetails = function (tabId) {
    delete this._message[tabId];
};

MessageCreator.prototype.getMessage = function (tabId) {
    return this._message[tabId];
};

MessageCreator.prototype.getStatusCode = function (tabId) {
    return (this._message[tabId] && this._message[tabId].statusCode !== 200) ? this._message[tabId].statusCode.toString() : '';
};
