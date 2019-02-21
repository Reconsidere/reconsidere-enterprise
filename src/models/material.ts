export class Hierarchy {
  solid = {
    materials: {
      paper: { name: 'paper', used: false, items: [] },
      metal: { name: 'metal', used: false, items: [] },
      isopor: { name: 'isopor', used: false, items: [] },
      glass: { name: 'glass', used: false, items: [] },
      plastic: { name: 'plastic', used: false, items: [] },
      tetrapack: { name: 'tetrapack', used: false, items: [] },
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




