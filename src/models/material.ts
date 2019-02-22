export class Hierarchy {
  solid = {
    materials: {
      paper: { name: 'paper', used: false, items: [{ _id: String, name: String, active: Boolean}] },
      metal: { name: 'metal', used: false, items: [{ _id: String, name: String, active: Boolean}] },
      isopor: { name: 'isopor', used: false, items: [{ _id: String, name: String, active: Boolean}] },
      glass: { name: 'glass', used: false, items: [{ _id: String, name: String, active: Boolean}] },
      plastic: { name: 'plastic', used: false, items: [{ _id: String, name: String, active: Boolean}] },
      tetrapack: { name: 'tetrapack', used: false, items: [{ _id: String, name: String, active: Boolean}] },
    },
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
}




