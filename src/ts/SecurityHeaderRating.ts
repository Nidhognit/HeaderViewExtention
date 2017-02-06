import VersionChecker from './VersionChecker';

export default class SecurityHeaderRating {
    protected _CSP = 'content-security-policy'; // it some hard, for config, please read https://content-security-policy.com/
    protected _HSTS = 'strict-transport-security'; // must be  strict-transport-security: max-age=15552000; or more
    protected _HPKP = 'public-key-pins'; // optional https://wiki.mozilla.org/Security/Guidelines/Web_Security#HTTP_Public_Key_Pinning
    protected _X_CTP = 'x-content-type-options'; // must be - x-content-type-options: nosniff;
    protected _X_Frame = 'x-frame-options'; // must be - x-frame-options: deny || sameorigin
    protected _X_XSS = 'x-xss-protection'; // must be - x-xss-protection: 1; mode=block;

    protected _versionChecker = new VersionChecker();

    public rating = 0;
    public correct = false;

    public checkHeader(name: string, value: string) {
        this.correct = false;
        name = name.toLowerCase();
        switch (name) {
            case this._CSP:
                this.checkCsp(value.toLowerCase());
                break;
            case this._HSTS:
                this.checkHsts(value.toLowerCase());
                break;
            case this._HPKP:
                this.checkHpkp();
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
    }

    public getRating(): string {
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
    }

    public clear(): void {
        this.rating = 0;
        this._versionChecker.clear();
    }

    public checkCsp(value: string): void {
        let script = value.match(/script-src.[^;]*;/);
        if (script && script[0]) {
            if (script[0].search('unsafe-inline') > -1 || script[0].search('unsafe-eval') > -1) {
                this.setRating(10, false);
            } else {
                this.setRating(30);
            }
        } else {
            let defaultSrc = value.match(/default-src.[^;]*;/);
            if (defaultSrc && defaultSrc[0] && defaultSrc[0].search('self') > -1) {
                this.setRating(30);
            } else {
                this.setRating(10, false);
            }
        }
    }

    public checkHsts(value: string): void {
        let result = value.match(/(max-age=)\d*/);
        if (result && result[0]) {
            let time = result[0].replace('max-age=', '');
            if (parseInt(time) >= 15552000) {
                this.setRating(10);
            }
        }
    }

    public checkHpkp(/* value */): void {
        this.setRating(10); // optional
    }

    public checkXctp(value: string): void {
        if (value === 'nosniff') {
            this.setRating(10);
        }
    }

    public checkXframe(value: string): void {
        if (value === 'deny' || value === 'sameorigin') {
            this.setRating(25);
        }
    }

    public checkXxss(value: string): void {
        if (parseInt(value, 10) === 1) {
            this.setRating(15);
        }
    }

    public getLink(callback, value) {
        if (this.correct) {
            return [
                callback('span', {className: 'good-header', title: 'correct security header'}, value)
            ];
        }

        return this._versionChecker.getLink(callback, value);
    }

    protected setRating(rating: number, correct: boolean = true): void {
        this.rating += rating;
        this.correct = correct;
    }
}
