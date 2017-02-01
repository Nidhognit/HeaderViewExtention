interface RuleInterface  {
    getHeader(): string;
    check(value: string): void;
    getRating():number;
    getVirtualElement();
}
