import superagent from 'superagent'

class Content {
    public name: string;
    public price: number;

    constructor (name: string,price: number){
        this.name = name;
        this.price = price;
    }
}
