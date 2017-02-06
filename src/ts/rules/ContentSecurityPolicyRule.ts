import {AbstractRule} from "./AbstractRule";
export default class ContentSecurityPolicyRule extends AbstractRule implements RuleInterface {
    protected header = 'content-security-policy';

    public check(): void {
        if (this.valueList.length === 1) {
            if (!this.checkScriptSrc(this.valueList[0]) && !this.checkDefaultSrc(this.valueList[0])) {
                this.addError(['wrong configuration']);
            }
        } else if (this.valueList.length > 1) {
            this.addManyHeaderError();
        }
    }

    protected checkScriptSrc(value: string): boolean {
        let script = value.match(/script-src.[^;]*;/);
        if (script && script[0]) {
            if (script[0].search('unsafe-inline') > -1) {
                this.addError(['Block script-src have value "unsafe-inline"']);
                this.rating = 10;
            } else if (script[0].search('unsafe-eval') > -1) {
                this.addError(['Block script-src have value "unsafe-eval"']);
            } else {
                this.addSuccess(['correct security header']);
                this.rating = 30;
            }
        }

        return this.rating === 0;
    }

    protected checkDefaultSrc(value: string) {
        let defaultSrc = value.match(/default-src.[^;]*;/);
        if (defaultSrc && defaultSrc[0] && defaultSrc[0].search('self') > -1) {
            this.addSuccess(['correct security header']);
            this.rating = 30;
        } else {
            this.addError(['wrong configuration']);
            this.rating = 10;
        }
    }
}