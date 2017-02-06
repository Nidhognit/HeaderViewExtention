import ResponseElement from "../../ResponseElement";
type Version = [number, number, number];
export abstract class AbstractVersionRule {
    protected valueList: string[] = [];
    protected vulnVersion:string;
    protected currentVersion:string;
    protected responseElement: ResponseElement[] = [];

    public getVirtualElement(): ResponseElement[] {
        return this.responseElement;
    }

    protected isOldVersion(value, currentVersions: Version[]): boolean {
        let version = value.match(/\d*\.\d*\.\d*/g);

        if (version) {
            this.vulnVersion = version[0];
            let versionList: number[] = version[0].split('.').map(Number);
            let length = currentVersions.length;

            for (let i = 0; i < length; i++) {
                if (currentVersions[i][0] === versionList[0]) {
                    if (currentVersions[i][1] > versionList[1]) {
                        this.currentVersion = currentVersions[i].join('.');
                        return true; // old
                    } else if (currentVersions[i][1] === versionList[1]) {
                        if (currentVersions[i][2] > versionList[2]) {
                            this.currentVersion = currentVersions[i].join('.');
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

    protected addError(errorList: string[]): void {
        let responseElement = new ResponseElement();
        responseElement.isError = 1;
        responseElement.value = this.valueList[0];
        responseElement.messageList = errorList;
        this.responseElement.push(responseElement);
    }

    protected addSuccess(commentList: string[]): void {
        let responseElement = new ResponseElement();
        responseElement.isError = 0;
        responseElement.value = this.valueList[0];
        responseElement.messageList = commentList;
        this.responseElement.push(responseElement);
    }

}
