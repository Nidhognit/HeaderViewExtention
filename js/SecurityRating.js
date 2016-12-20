function SecurityHeaderRating() {
    this._CSP = 'content-security-policy'; // it some hard, for config, please read https://content-security-policy.com/
    this._Cookies = 'cookies'; // must have "secure" or "httponly"
    this._HSTS = 'strict-transport-security'; // must be  strict-transport-security: max-age=15552000; or more
    this._HPKP = 'public-key-pins'; //optional https://wiki.mozilla.org/Security/Guidelines/Web_Security#HTTP_Public_Key_Pinning
    this._X_CTP = 'x-content-type-options'; // must be - x-xss-protection: nosniff;
    this._X_Frame = 'x-frame-options'; // must be - x-frame-options: deny || sameorigin
    this._X_XSS = 'x-xss-protection'; // must be - x-xss-protection: 1; mode=block;

    this.rating = 0;
}

SecurityHeaderRating.prototype.checkHeader = function (name, value) {
    value = value.toLowerCase();
    switch (name.toLowerCase()) {
        case this._CSP:
            this.checkCsp(value);
            break;
        case this._Cookies:
            this.checkCookies(value);
            break;
        case this._HSTS:
            this.checkHsts(value);
            break;
        case this._HPKP:
            this.checkHpkp(value);
            break;
        case this._X_CTP:
            this.checkXctp(value);
            break;
        case this._X_Frame:
            this.checkXframe(value);
            break;
        case this._X_XSS:
            this.checkXxss(value);
            break;
    }
};
SecurityHeaderRating.prototype.getRating = function () {
    if (this.rating === 10) {
        return 'F';
    }  else if (this.rating <= 20) {
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
    } else if (this.rating <= 100) {
        return 'A+';
    }
};

SecurityHeaderRating.prototype.checkCsp = function (value) {
    if (value.search('unsafe-inline') || value.search('data:') || value.search('eval')) {
        this.rating += 5;
    } else {
        this.rating += 25;
    }
};

SecurityHeaderRating.prototype.checkCookies = function (value) {
    if (value.search('secure') || value.search('httponly')) {
        this.rating += 5;
    } else {
        this.rating += 20;
    }
};

SecurityHeaderRating.prototype.checkHsts = function (value) {
    var result = value.match(/(max-age=)\d*/);
    if (result[0] && parseInt(result[0]) > 15552000) {
        this.rating += 10;
    }
};

SecurityHeaderRating.prototype.checkHpkp = function (value) {
    this.rating += 10; // optional
};

SecurityHeaderRating.prototype.checkXctp = function (value) {
    if (value == 'nosniff') {
        this.rating += 5;
    }
};

SecurityHeaderRating.prototype.checkXframe = function (value) {
    if (value == 'deny' || value == 'sameorigin') {
        this.rating += 20;
    }
};

SecurityHeaderRating.prototype.checkXxss = function (value) {
    if (parseInt(value) == 1) {
        this.rating += 10;
    }
};
