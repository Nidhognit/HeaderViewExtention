import AbstractRule from "./AbstractRule";
export default class DefaultRule extends AbstractRule implements RuleInterface {

    public checkHeader():boolean {
        return true;
    }

    public check():void {
        // code
    }

}
