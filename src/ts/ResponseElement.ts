type ResponseType = -1 | 0 |1;
export default class ResponseElement {
    public isError: ResponseType = -1;
    public header: string;
    public value: string;
    public messageList: string[] = [];
}