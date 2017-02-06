import {AbstractRule} from "./AbstractRule";
export default class XContentTypeOptionsRule extends AbstractRule implements RuleInterface {
    protected header = 'x-content-type-options';

    public check(): void {
        if (this.valueList.length === 1) {
            if (this.valueList[0] === 'nosniff') {
                this.rating = 10;
                this.addSuccess(['correct security header "nosniff"']);
            } else {
                this.addError(['Header must be "nosniff"'])
            }
        } else if (this.valueList.length > 1) {
            this.addManyHeaderError();
        }
    }

}