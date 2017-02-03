import AbstractRule from "./AbstractRule";
export default class ContentSecurityPolicyRule extends AbstractRule implements RuleInterface {
    protected header = 'content-security-policy';

    public check():void {
        //todo add code
    }
}