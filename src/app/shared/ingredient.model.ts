export class Ingredient {
    
    // This can be abbrevited as follows. This:
    /*
    public name: string;
    public amount: number;

    constructor(name: string, amount: number) {
        this.name = name;
        this.amount = amount;
    }
    */
    //turns to this:

    constructor(public name: string, public amount:number) {}
}