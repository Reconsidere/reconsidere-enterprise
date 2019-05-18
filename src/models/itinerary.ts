export class Itinerary {
    constructor() { }

    dayWeek: string;
    hour: Date;
}
export namespace Itinerary {
    export enum daysWeek {
        sunday = 'Domingo',
        monday = 'Segunda-feira',
        tuesday = 'Terça-feira',
        wednesday = 'Quarta-feira',
        thursday = 'Quinta-feira',
        friday = 'Sexta-feira',
        saturday = 'Sábado'
    }
}