export class incomingOut {
    _id: string;
    date: Date;
    type: string;

}


export namespace incomingOut {
    export enum Type {
        Input = 'Entrada',
        Output = 'Saída',
    }
}