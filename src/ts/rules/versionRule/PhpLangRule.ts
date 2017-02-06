import {AbstractVersionRule} from "./AbstractVersionRule";
type Version = [number, number, number];
export default class PhpLangRule extends AbstractVersionRule {
    protected version: Version[] = [[5, 6, 30], [7, 0, 15], [7, 1, 1]]; // https://secure.php.net/ChangeLog-7.php OR https://github.com/php/php-src/releases

    public checkValue(value: string): boolean {
        if (value.search('php') > -1) {
            this.valueList.push(value);
            return true;
        }

        return false;
    }

    public check() {

    }
}