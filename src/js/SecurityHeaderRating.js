const VersionChecker = require('./VersionChecker');

function SecurityHeaderRating() {
    this._CSP = 'content-security-policy'; // it some hard, for config, please read https://content-security-policy.com/
    this._HSTS = 'strict-transport-security'; // must be  strict-transport-security: max-age=15552000; or more
    this._HPKP = 'public-key-pins'; //optional https://wiki.mozilla.org/Security/Guidelines/Web_Security#HTTP_Public_Key_Pinning
    this._X_CTP = 'x-content-type-options'; // must be - x-content-type-options: nosniff;
    this._X_Frame = 'x-frame-options'; // must be - x-frame-options: deny || sameorigin
    this._X_XSS = 'x-xss-protection'; // must be - x-xss-protection: 1; mode=block;

    this._versionChecker = new VersionChecker();

    this.rating = 0;
}

SecurityHeaderRating.prototype.checkHeader = function (name, value) {
    name = name.toLowerCase();
    switch (name) {
    case this._CSP:
        this.checkCsp(value.toLowerCase());
        break;
    case this._HSTS:
        this.checkHsts(value.toLowerCase());
        break;
    case this._HPKP:
        this.checkHpkp(value.toLowerCase());
        break;
    case this._X_CTP:
        this.checkXctp(value.toLowerCase());
        break;
    case this._X_Frame:
        this.checkXframe(value.toLowerCase());
        break;
    case this._X_XSS:
        this.checkXxss(value.toLowerCase());
        break;
    case this._versionChecker._backend_lang:
        this._versionChecker.clear();
        this._versionChecker.checkLang(value.toLowerCase());
        this.rating += this._versionChecker.getRating();
        break;
    case this._versionChecker._server:
        this._versionChecker.clear();
        this._versionChecker.checkServer(value.toLowerCase());
        this.rating += this._versionChecker.getRating();
        break;
    }
};
SecurityHeaderRating.prototype.getRating = function () {
    if (this.rating <= 10) {
        return 'F';
    } else if (this.rating <= 20) {
        return 'F+';
    } else if (this.rating <= 30) {
        return 'E';
    } else if (this.rating <= 40) {
        return 'D';
    } else if (this.rating <= 50) {
        return 'C';
    } else if (this.rating <= 60) {
        return 'C+';
    } else if (this.rating <= 70) {
        return 'B';
    } else if (this.rating <= 80) {
        return 'B+';
    } else if (this.rating <= 90) {
        return 'A';
    } else {
        return 'A+';
    }
};

SecurityHeaderRating.prototype.clear = function () {
    this.rating = 0;
    this._versionChecker.clear();
};

SecurityHeaderRating.prototype.checkCsp = function (value) {
    if (value.search('unsafe-inline') > -1 || value.search('eval') > -1) {
        this.rating += 10;
    } else {
        this.rating += 30;
    }
};

SecurityHeaderRating.prototype.checkHsts = function (value) {
    let result = value.match(/(max-age=)\d*/);
    if (result && result[0]) {
        let time = result[0].replace('max-age=','');
        if(parseInt(time) >= 15552000){
            this.rating += 10;
        }
    }
};

SecurityHeaderRating.prototype.checkHpkp = function (/* value */) {
    this.rating += 10; // optional
};

SecurityHeaderRating.prototype.checkXctp = function (value) {
    if (value == 'nosniff') {
        this.rating += 10;
    }
};

SecurityHeaderRating.prototype.checkXframe = function (value) {
    if (value == 'deny' || value == 'sameorigin') {
        this.rating += 25;
    }
};

SecurityHeaderRating.prototype.checkXxss = function (value) {
    if (parseInt(value) == 1) {
        this.rating += 15;
    }
};

SecurityHeaderRating.prototype.getLink = function (callback, value) {
    return this._versionChecker.getLink(callback, value);
};

module.exports = SecurityHeaderRating;
