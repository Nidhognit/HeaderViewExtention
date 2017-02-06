import {AbstractRule} from "./AbstractRule";
import ResponseElement from "../ResponseElement";
export default class DefaultRule extends AbstractRule implements RuleInterface {

    public checkHeader():boolean {
        return true;
    }

    public check():void {
        let headerCount = this.valueList.length;

        for (let i = 0; i < headerCount; i++) {
            let responseElement = new ResponseElement();
            responseElement.isError = -1;
            responseElement.header = this.header.toUpperCase();
            responseElement.value = this.valueList[i];
            this.responseElement.push(responseElement);
        }
    }
}