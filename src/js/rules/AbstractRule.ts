import ResponseElement from "../ResponseElement";
export default class AbstractRule {
    protected header: string;
    protected rating: number = 0;
    protected valueList: string[] = [];
    protected responseElement: ResponseElement[] = [];

    public checkHeader(name: string): boolean {
        return this.header === name;
    }

    public addValue(value: string): void {
        this.valueList.push(value);
    }

    public getRating(): number {
        return this.rating;
    }

    public getVirtualElement(): ResponseElement[] {
        return this.responseElement;
    }

    protected addError(errorList: string[]): void {
        let responseElement = new ResponseElement();
        responseElement.isError = 1;
        responseElement.header = this.header.toUpperCase();
        responseElement.value = this.valueList[0];
        responseElement.messageList = errorList;
        this.responseElement.push(responseElement);
    }

    protected addSuccess(commentList: string[]): void {
        let responseElement = new ResponseElement();
        responseElement.isError = 0;
        responseElement.header = this.header.toUpperCase();
        responseElement.value = this.valueList[0];
        responseElement.messageList = commentList;
        this.responseElement.push(responseElement);
    }

    protected addManyHeaderError(): void {
        let errorList = ['This head should be in one copy'];
        let headerCount = this.valueList.length;

        for (let i = 0; i < headerCount; i++) {
            let responseElement = new ResponseElement();
            responseElement.isError = 1;
            responseElement.header = this.header.toUpperCase();
            responseElement.value = this.valueList[i];
            responseElement.messageList = errorList;
            this.responseElement.push(responseElement);
        }
    }
}
