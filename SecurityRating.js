function SecurityHeaderRating() {
    this._CSP = 'content security policy';
    this._Cookies = 'cookies';
    this._CORS = 'cross-origin resource sharing';
    this._HSTS = 'http strict transport security';
    this._Redirection = 'redirection';
    this._RP = 'referrer policy';
    this._SI = 'subresource integrity';
    this._X_CTP = 'x-content-type-options';
    this._X_Frame = 'x-frame-options';
    this._X_XSS = 'x-xss-protection';

    this.rating = 0;
}

SecurityHeaderRating.prototype.checkHeader = function (name, value) {
    switch (name.toLowerCase()) {
        case this._CSP:
            this.checkCsp(value);
            break;
        case this._Cookies:
            this.checkCooKies(value);
            break;
        case this._CORS:
            this.checkCors(value);
            break;
        case this._HSTS:
            this.checkHsts(value);
            break;
        case this._Redirection:
            this.checkRedirection(value);
            break;
        case this._RP:
            this.checkRp(value);
            break;
        case this._SI:
            this.checkSi(value);
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

SecurityHeaderRating.prototype.checkCsp = function (value) {

};

SecurityHeaderRating.prototype.checkCooKies = function (value) {

};

SecurityHeaderRating.prototype.checkCors = function (value) {

};

SecurityHeaderRating.prototype.checkHsts = function (value) {

};

SecurityHeaderRating.prototype.checkRedirection = function (value) {

};

SecurityHeaderRating.prototype.checkRp = function (value) {

};

SecurityHeaderRating.prototype.checkSi = function (value) {

};

SecurityHeaderRating.prototype.checkXctp = function (value) {

};

SecurityHeaderRating.prototype.checkXframe = function (value) {
    value = value.toLowerCase();
    if(value == 'deny' || value == 'sameorigin'){
        this.rating += 20;
    }
};

SecurityHeaderRating.prototype.checkXxss = function (value) {
    if (parseInt(value) == 1) {
        this.rating += 10;
    }
};
