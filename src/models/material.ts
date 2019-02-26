import { Pricing } from './pricing';

export class Hierarchy {
  solid = {
    materials: {
      paper: {
        name: 'paper',
        used: false,
        items: [
          {
            _id: String, name: String, active: Boolean,
            pricing: { unitPrice: [], date: [], weight: Number }
          }
        ]
      },
      metal: {
        name: 'metal',
        used: false,
        items: [
          {
            _id: String, name: String, active: Boolean,
            pricing: { unitPrice: [], date: [], weight: Number }
          }
        ]
      },
      isopor: {
        name: 'isopor',
        used: false,
        items: [
          {
            _id: String, name: String, active: Boolean,
            pricing: { unitPrice: [], date: [], weight: Number }
          }
        ]
      },
      glass: {
        name: 'glass',
        used: false,
        items: [
          {
            _id: String, name: String, active: Boolean,
            pricing: { unitPrice: [], date: [], weight: Number }
          }
        ]
      },
      plastic: {
        name: 'plastic',
        used: false,
        items: [
          {
            _id: String, name: String, active: Boolean,
            pricing: { unitPrice: [], date: [], weight: Number }
          }
        ]
      },
      tetrapack: {
        name: 'tetrapack',
        used: false,
        items: [
          {
            _id: String, name: String, active: Boolean,
            pricing: { unitPrice: [], date: [], weight: Number }
          }
        ]
      }
    }
  };
  semisolid = {};
  liquid = {};

  constructor() { }
}

export namespace Hierarchy {
  export enum Classification {
    Solid = 'Sólido',
    SemiSolid = 'Semi-Sólido',
    Liquid = 'Liquido'
  }
}
export namespace Hierarchy {
  export enum Category {
    Recyclable = 'Reciclável',
    Compostable = 'Compostável',
    NotRecycable = 'Não reciclável',
    Dangerous = 'Perigoso'
  }
}

export namespace Hierarchy {
  export enum Material {
    Paper = 'Papel',
    Plastic = 'Plástico',
    Glass = 'Vidro',
    Metal = 'Metal',
    Isopor = 'Isopor',
    Tetrapack = 'Tetrapack'
  }

  export enum types {
    paper = 'paper',
    plastic = 'plastic',
    glass = 'glass',
    metal = 'metal',
    isopor = 'isopor',
    tetrapack = 'tetrapack'
  }
}
