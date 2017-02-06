export default class MessageCreator {
    public _message = [];

    public hasRequest(tabId, requestId) {
        return typeof this._message[tabId] === 'undefined' || typeof this._message[tabId][requestId] === 'undefined';
    }

    public addDetails(details) {
        this._message[details.tabId] = {
            [details.requestId]: [],
            statusCode: details.statusCode
        };
    }

    public setDetailsToMessage(details) {
        this._message[details.tabId][details.requestId].push(details);
    }

    public removeDetails(tabId) {
        delete this._message[tabId];
    }

    public getMessage(tabId) {
        return this._message[tabId];
    }

    public getStatusCode(tabId) {
        return (this._message[tabId] && this._message[tabId].statusCode !== 200) ? this._message[tabId].statusCode.toString() : '';
    }
}

