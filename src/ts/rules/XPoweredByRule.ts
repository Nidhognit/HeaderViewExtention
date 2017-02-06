import {AbstractRule} from "./AbstractRule";
import PhpLangRule from "./versionRule/PhpLangRule";
export default class XPoweredByRule extends AbstractRule implements RuleInterface {
    protected header = 'x-powered-by';
    protected versionRuleList = [
        new PhpLangRule()
    ];

    public check(): void {
        //todo add code
    }
}