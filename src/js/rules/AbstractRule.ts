class AbstractRule {
    protected header = '';
    protected rating = 0;
    public correct = false;
    protected valueList = [];

    public checkHeader(name:string):boolean {
        return this.header === name;
    }

    public addValue(value:string):void {
        this.valueList.push(value);
    }

    protected setRating(rating:number, correct:boolean = true):void {
        this.rating += rating;
        this.correct = correct;
    }

    public getRating():number {

        return this.rating;
    }
}
