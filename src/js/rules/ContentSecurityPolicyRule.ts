export default class ContentSecurityPolicyRule extends AbstractRule implements RuleInterface {
    protected header = 'content-security-policy';
    protected rating = 0;

    public getHeader():string {
        return this.header;
    }

    public check(value:string):void {
        // code
    }

    public getRating():number {

        return this.rating;
    }

    public getVirtualElement() {

    }
}