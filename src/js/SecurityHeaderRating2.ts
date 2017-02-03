import ContentSecurityPolicyRule from './rules/ContentSecurityPolicyRule';
import StrictTransportSecurityRule from './rules/StrictTransportSecurityRule';
import DefaultRule from './rules/DefaultRule';

type Header = [{name: string, value: string}];

export default class SecurityHeaderRating {
    protected rating = 0;

    protected ruleList = [
        new ContentSecurityPolicyRule(),
        new StrictTransportSecurityRule(),
        new DefaultRule()
    ];

    public readHeaderList(headerList: Header): void {
        let listCount = headerList.length;
        for (let i = 0; i < listCount; ++i) {
            this.recognizeHeader(headerList[i].name, headerList[i].value);
        }
    }

    public recognizeHeader(name: string, value: string): void {
        name = name.toLowerCase();
        let ruleCount = this.ruleList.length;
        for (let i = 0; i < ruleCount; ++i) {
            let rule: RuleInterface = this.ruleList[i];
            if (rule.checkHeader(name)) {
                rule.addValue(value);
                break;
            }
        }
    }

    public getHeaderObject(): any[] {
        let headerList = [];

        let ruleCount = this.ruleList.length;
        for (let i = 0; i < ruleCount; ++i) {
            let rule: RuleInterface = this.ruleList[i];
            rule.check();
            this.rating += rule.getRating();
            headerList.push(rule.getVirtualElement());
        }

        return headerList;
    }
}