export default class StrictTransportSecurityRule extends AbstractRule implements RuleInterface {
    protected header = 'strict-transport-security';

    public check():void {
        var value = '';
        if (this.valueList.length === 1) {
            let result = value.match(/(max-age=)\d*/);
            if (result && result[0]) {
                let time = result[0].replace('max-age=', '');
                if (parseInt(time) >= 15552000) {
                    this.setRating(10);
                }
            }
        }else if(this.valueList.length > 1){
            this.setRating(0);
        }
    }

    public getVirtualElement() {

    }
}