export default class ContentSecurityPolicyRule extends AbstractRule implements RuleInterface {
    protected header = 'content-security-policy';

    public check():void {
        var value = '';
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

    public getVirtualElement() {

    }
}