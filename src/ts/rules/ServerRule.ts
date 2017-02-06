import {AbstractRule} from "./AbstractRule";
export default class ServerRule extends AbstractRule implements RuleInterface {
    protected header = 'server';

    public check(): void {
        //todo add code
    }
}