type Version = [number, number, number];

export default class VersionChecker {
    public _backend_lang: string = 'x-powered-by';
    public _server: string = 'server';
    public _php: Version[] = [[5, 6, 30], [7, 0, 18], [7, 1, 4]]; // https://secure.php.net/ChangeLog-7.php OR https://github.com/php/php-src/releases
    public _nginx: Version[] = [[1, 11, 13], [1, 12, 0]]; // https://nginx.org/ru/download.html
    public _apache: Version[] = [[2, 2, 32], [2, 4, 25]]; // https://httpd.apache.org/download.cgi
    public _isPhp: boolean = false;
    public _isNginx: boolean = false;
    public _isApache: boolean = false;
    public _vulnVersion: string = '';
    public _currentVersion: string = '';

    public rating: number = 0;

    public checkLang(value): void {
        if (value.search('php') > -1) {
            this.checkPhpLang(value);
        }
    }

    public checkServer(value): void {
        if (value.search('nginx') > -1) {
            this.checkNginxServer(value);
        }
        else if (value.search('apache') > -1) {
            this.checkApacheServer(value);
        }
    }

    public clear(): void {
        this.rating = 0;
    }

    public getRating(): number {
        return this.rating;
    }

    public getLink(callback, value: any): any[] {
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
    }

    public _createLink(callback, value, type): any[] {
        return [
            callback('span', {className: 'error'}, value),
            callback('span', {}, ' (current: ' + this._currentVersion + ')'),
            callback('br', {}, ''),
            callback('a', {
                href: 'https://vulners.com/search?query=affectedSoftware.name:"' + type + '"%20%20AND%20affectedSoftware.version:^' + this._vulnVersion,
                target: '_blank'
            }, 'vulnerable version')
        ];
    }

    public checkPhpLang(value): void {
        if (this.isOldVersion(value, this._php)) {
            this.rating = -20;
            this._isPhp = true;
        } else {
            this.rating = -5;
        }
    }

    public checkApacheServer(value): void {
        if (this.isOldVersion(value, this._apache)) {
            this.rating = -20;
            this._isApache = true;
        } else {
            this.rating = -5;
        }
    }

    public checkNginxServer(value): void {
        if (this.isOldVersion(value, this._nginx)) {
            this.rating = -20;
            this._isNginx = true;
        } else {
            this.rating = -5;
        }
    }

    public isOldVersion(value, currentVersions: Version[]): boolean {
        let version = value.match(/\d*\.\d*\.\d*/g);

        if (version) {
            this._vulnVersion = version[0];
            let versionList: number[] = version[0].split('.').map(Number);
            let length = currentVersions.length;

            for (let i = 0; i < length; i++) {
                if (currentVersions[i][0] === versionList[0]) {
                    if (currentVersions[i][1] > versionList[1]) {
                        this._currentVersion = currentVersions[i].join('.');
                        return true; // old
                    } else if (currentVersions[i][1] === versionList[1]) {
                        if (currentVersions[i][2] > versionList[2]) {
                            this._currentVersion = currentVersions[i].join('.');
                            return true; // old
                        } else if (currentVersions[i][2] === versionList[2]) {
                            return false; // current
                        }
                    }
                }
            }
        }
        return false; // current
    }
}
