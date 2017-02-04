import ResponseElement from './ResponseElement';
import {h} from './utils';
export default class ViewGenerator {

    public generateVirtualElement(responseElementList: any[]): any[] {
        let elementCount = responseElementList.length;
        let elementList: any[] = [];

        for (let i = 0; i < elementCount; ++i) {
            let headerCount = responseElementList[i].length;
            if (headerCount !== 0) {
                for (let j = 0; j < headerCount; ++j) {
                    let responseElement: ResponseElement = responseElementList[i][j];
                    if (responseElement.isError === 0) {
                        elementList.push(this.createSuccessSecurityRow(responseElement));
                    }
                    else if (responseElement.isError === 1) {
                        elementList.push(this.createErrorSecurityRow(responseElement));
                    } else {
                        elementList.push(this.createDefaultRow(responseElement));
                    }
                }
            }
        }

        return elementList;
    }

    protected createDefaultRow(responseElement: ResponseElement) {
        return h('tr', {}, [
            h('td', {}, responseElement.header),
            h('td', {}, responseElement.value)
        ]);
    }

    protected createSuccessSecurityRow(responseElement: ResponseElement) {
        return h('tr', {className: 'good-header', title: 'correct security header'}, [
            h('td', {}, responseElement.header),
            h('td', {}, responseElement.value)
        ]);
    }

    protected createErrorSecurityRow(responseElement: ResponseElement) {
        return h('tr', {className: 'error', title: 'wrong security header'}, [
            h('td', {}, responseElement.header),
            h('td', {}, responseElement.value)
        ]);
    }
}
