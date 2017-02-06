import {AbstractRule} from "./AbstractRule";
export default class XxssProtectionRule extends AbstractRule implements RuleInterface {
    protected header = 'x-xss-protection';

    public check(): void {
        if (this.valueList.length === 1) {
            let value: string = this.valueList[0];
            if (parseInt(value, 10) === 1) {
                this.rating = 15;
                this.addSuccess(['correct security header']);
            } else {
                this.addError(['Header must be "nosniff"'])
            }
        } else if (this.valueList.length > 1) {
            this.addManyHeaderError();
        }
    }
}