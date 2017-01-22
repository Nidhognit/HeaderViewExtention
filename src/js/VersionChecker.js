function VersionChecker() {
    this._backend_lang = 'x-powered-by';
    this._server = 'server';

    this._php = [[5, 6, 30], [7, 0, 15], [7, 1, 1]];//https://secure.php.net/ChangeLog-7.php OR https://github.com/php/php-src/releases
    this._nginx = [[1, 10, 2], [1, 11, 7]];//https://nginx.org/ru/download.html
    this._apache = [[2, 2, 31], [2, 4, 25]];//

    this.rating = 0;
    this._isPhp = false;
    this._isNginx = false;
    this._isApache = false;
    this._vulnVersion = '';
    this._currentVersion = '';
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

VersionChecker.prototype.getLink = function (callback, value) {
    if (this._isPhp) {
        this._isPhp = false;
        return this._createLink(callback, value, 'php');
    } else if (this._isNginx) {
        this._isNginx = false;
        return this._createLink(callback, value, 'nginx');
    } else if (this._isApache) {
        this._isApache = false;
        return this._createLink(callback, value, 'apache');
    }

    return value;
};

VersionChecker.prototype._createLink = function (callback, value, type) {
    return [
        callback('span', {className: 'error'}, value),
        callback('span', {}, ' (current: ' + this._currentVersion + ')'),
        callback('br', {}, ''),
        callback('a', {
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
                    this._currentVersion = currentVersions[i].join('.');
                    return true; //old
                } else if (currentVersions[i][1] == versionList[1]) {
                    if (currentVersions[i][2] > versionList[2]) {
                        this._currentVersion = currentVersions[i].join('.');
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
