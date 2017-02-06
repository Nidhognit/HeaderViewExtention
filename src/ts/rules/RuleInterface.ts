interface RuleInterface {
    checkHeader(name: string): boolean;

    check(): void;

    addValue(value: string): void;

    getRating(): number;

    getVirtualElement(): any[];
}
