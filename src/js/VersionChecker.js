function VersionChecker() {
    this._backend_lang = 'x-powered-by';
    this._server = 'server';

    this._php = [[5, 6, 29], [7, 0, 14], [7, 1, 0]];//https://secure.php.net/ChangeLog-7.php
    this._nginx = [[1, 10, 2], [1, 11, 7]];//https://nginx.org/ru/download.html
    this._apache = [[2, 2, 31], [2, 4, 25]];//

    this.rating = 0;
    this._isPhp = false;
    this._isNginx = false;
    this._isApache = false;
    this._vulnVersion = '';
}

VersionChecker.prototype.checkLang = function (value) {
    if (value.search('php') > -1) {
        this.checkPhpLang(value);
    }
};

VersionChecker.prototype.checkServer = function (value) {
    if (value.search('nginx') > -1) {
        this.checkNginxServer(value);
    }
    else if (value.search('apache') > -1) {
        this.checkApacheServer(value);
    }
};

VersionChecker.prototype.clear = function () {
    this.rating = 0;
};

VersionChecker.prototype.getRating = function () {
    return this.rating;
};

VersionChecker.prototype.getLink = function (calback, value) {
    if (this._isPhp) {
        this._isPhp = false;
        return this._createLink(calback, value, 'php');
    } else if (this._isNginx) {
        this._isNginx = false;
        return this._createLink(calback, value, 'nginx');
    } else if (this._isApache) {
        this._isApache = false;
        return this._createLink(calback, value, 'apache');
    }

    return value;
};

VersionChecker.prototype._createLink = function (calback, value, type) {
    return [
        calback('span', {className: 'error'}, value),
        calback('br', {}, ''),
        calback('a', {
            href: 'https://vulners.com/search?query=' + type + '-' + this._vulnVersion,
            target: '_blank'
        }, 'vulnerable version')
    ];
};

VersionChecker.prototype.checkPhpLang = function (value) {
    if (this.isOldVersion(value, this._php)) {
        this.rating = -20;
        this._isPhp = true;
    } else {
        this.rating = -5;
    }
};

VersionChecker.prototype.checkApacheServer = function (value) {
    if (this.isOldVersion(value, this._apache)) {
        this.rating = -20;
        this._isApache = true;
    } else {
        this.rating = -5;
    }
};

VersionChecker.prototype.checkNginxServer = function (value) {
    if (this.isOldVersion(value, this._nginx)) {
        this.rating = -20;
        this._isNginx = true;
    } else {
        this.rating = -5;
    }
};

VersionChecker.prototype.isOldVersion = function (value, currentVersions) {
    let version = value.match(/\d*\.\d*\.\d*/g);
    if (version) {
        this._vulnVersion = version[0];
        let versionList = version[0].split('.');
        let length = currentVersions.length;
        for (let i = 0; i < length; i++) {
            if (currentVersions[i][0] == versionList[0]) {
                if (currentVersions[i][1] > versionList[1]) {
                    return true; //old
                } else if (currentVersions[i][1] == versionList[1]) {
                    if (currentVersions[i][2] > versionList[2]) {
                        return true; //old
                    } else if (currentVersions[i][2] == versionList[2]) {
                        return false; //current
                    }
                }
            }
        }
    }
    return false; //current
};

module.exports = VersionChecker;
