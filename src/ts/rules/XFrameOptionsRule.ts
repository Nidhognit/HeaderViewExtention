import {AbstractRule} from "./AbstractRule";
export default class XFrameOptionsRule extends AbstractRule implements RuleInterface {
    protected header = 'x-frame-options';

    public check(): void {
        if (this.valueList.length === 1) {
            let value: string = this.valueList[0];
            if (value === 'deny') {
                this.rating = 25;
                this.addSuccess(['correct security header "deny"']);
            } else if (value === 'sameorigin') {
                this.rating = 25;
                this.addSuccess(['correct security header "sameorigin"']);
            } else {
                this.addError(['Header must be "nosniff"'])
            }
        } else if (this.valueList.length > 1) {
            this.addManyHeaderError();
        }
    }
}