class AbstractRule {
    protected rating = 0;
    public correct = false;

    protected setRating(rating: number, correct: boolean = true): void {
        this.rating += rating;
        this.correct = correct;
    }

    public getRating():number {

        return this.rating;
    }
}
