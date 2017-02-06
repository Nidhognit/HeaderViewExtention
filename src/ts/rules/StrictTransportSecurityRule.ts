import {AbstractRule} from "./AbstractRule";
export default class StrictTransportSecurityRule extends AbstractRule implements RuleInterface {
    protected header = 'strict-transport-security';
    readonly recommendedMaxAge = 15552000;

    public check(): void {
        if (this.valueList.length === 1) {
            if (this.isValidHeader(this.valueList[0])) {
                this.addSuccess(['correct security header']);
                this.rating = 10;
            } else {
                this.addError(['This header must have a value in the format "max-age=number", where "number" must be at least' + this.recommendedMaxAge])
            }
        } else if (this.valueList.length > 1) {
            this.addManyHeaderError();
        }
    }

    protected isValidHeader(value: string): boolean {
        let result = value.match(/(max-age=)\d*/);
        if (result && result[0]) {
            let time = result[0].replace('max-age=', '');
            if (parseInt(time) >= this.recommendedMaxAge) {
                return true;
            }
        }

        return false;
    }
}