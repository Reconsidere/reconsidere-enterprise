import { Component, OnInit } from '@angular/core';
import { Hierarchy } from 'src/models/material';
import { AuthService } from 'src/services';
import { MaterialManagementService } from 'src/services/material-management.service';

@Component({
  selector: 'app-material-management',
  templateUrl: './material-management.component.html',
  styleUrls: ['./material-management.component.scss']
})
export class MaterialManagementComponent implements OnInit {

  hierarchy: Hierarchy;
  organizationId: string;
  page: number;
  message: string;
  show = false;
  materialsType = [];
  itemsMaterials: any;
  isBlocked = true;

  constructor(private authService: AuthService, private materialService: MaterialManagementService) {
    this.hierarchy = new Hierarchy();
  }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
  }

  setId(id) {
    this.organizationId = id;
    if (id !== undefined) {
      this.materialService.getHierarchy(this.organizationId).subscribe(item => this.loadHierarchy(item), error => error);
    } else {
      this.message = 'Pro favor, para utilizar este recurso primeiro, vá ate a tela de Conta e insira as a classe de materias que deseja utilizar.';
      this.isBlocked = false;
    }
  }

  private loadHierarchy(item) {
    if (item) {
      this.hierarchy = item;
      this.verifyMaterialsTypes();
      this.createSimpleList(this.hierarchy);
    } else {
      this.message = 'Pro favor, para utilizar este recurso primeiro, vá ate a tela de Conta e insira as a classe de materias que deseja utilizar.';
      this.isBlocked = false;
    }
  }

  verifyMaterialsTypes() {
    if (!this.hierarchy.solid.materials.glass.used && !this.hierarchy.solid.materials.isopor.used && !this.hierarchy.solid.materials.metal.used && !this.hierarchy.solid.materials.paper.used && !this.hierarchy.solid.materials.plastic.used && !this.hierarchy.solid.materials.tetrapack.used) {

      this.message = 'Pro favor, para utilizar este recurso primeiro, vá ate a tela de Conta e insira as a classe de materias que deseja utilizar.';
      this.isBlocked = false;
      return;
    }

    if (this.hierarchy.solid.materials.glass.used) {
      if (this.materialsType === undefined) {
        this.materialsType = [Hierarchy.Material.Glass];
      } else {
        this.materialsType.push(Hierarchy.Material.Glass);
      }
    }
    if (this.hierarchy.solid.materials.isopor.used) {
      if (this.materialsType === undefined) {
        this.materialsType = [Hierarchy.Material.Isopor];
      } else {
        this.materialsType.push(Hierarchy.Material.Isopor);
      }
    }
    if (this.hierarchy.solid.materials.metal.used) {
      if (this.materialsType === undefined) {
        this.materialsType = [Hierarchy.Material.Metal];
      } else {
        this.materialsType.push(Hierarchy.Material.Metal);
      }
    }
    if (this.hierarchy.solid.materials.paper.used) {
      if (this.materialsType === undefined) {
        this.materialsType = [Hierarchy.Material.Paper];
      } else {
        this.materialsType.push(Hierarchy.Material.Paper);
      }
    }
    if (this.hierarchy.solid.materials.plastic.used) {
      if (this.materialsType === undefined) {
        this.materialsType = [Hierarchy.Material.Plastic];
      } else {
        this.materialsType.push(Hierarchy.Material.Plastic);
      }
    }
    if (this.hierarchy.solid.materials.tetrapack.used) {
      if (this.materialsType === undefined) {
        this.materialsType = [Hierarchy.Material.Tetrapack];
      } else {
        this.materialsType.push(Hierarchy.Material.Tetrapack);
      }
    }
  }
  createSimpleList(list: Hierarchy) {
    this.insertItems('glass', 'Vidro', list);
    this.insertItems('isopor', 'Isopor', list);
    this.insertItems('metal', 'Metal', list);
    this.insertItems('paper', 'Papel', list);
    this.insertItems('plastic', 'Plástico', list);
    this.insertItems('tetrapack', 'Tetrapack', list);
  }

  insertItems(type: any, typeMaterial: any, list: Hierarchy) {
    if (list.solid.materials[type] !== undefined) {
      list.solid.materials[type].items.forEach(item => {
        if (this.itemsMaterials === undefined) {
          this.itemsMaterials = [{ _id: item._id, typeMaterial: typeMaterial, name: item.name, active: item.active }];
        } else {
          if (item.active) {
            this.itemsMaterials.push({ _id: item._id, typeMaterial: typeMaterial, name: item.name, active: item.active });
          }
        }
      });
    }
  }


  newItem() {
    if (this.itemsMaterials === undefined) {
      this.itemsMaterials = [{ _id: undefined, typeMaterial: '', name: undefined, active: true }];
    } else {
      this.itemsMaterials.push({ _id: undefined, typeMaterial: '', name: undefined, active: true });
    }
  }

  veryfyBeforeSave(itemMaterial) {
    if (
      !itemMaterial.name ||
      !itemMaterial.active
    ) {
      throw new Error(
        'Por favor, preencha os campos antes de salvar os dados!'
      );
    }
  }



  private addToItemsMaterial(itemMaterial) {
    if (itemMaterial.typeMaterial === Hierarchy.Material.Glass) {
      this.insertValues(itemMaterial, 'glass');
    }
    else if (itemMaterial.typeMaterial === Hierarchy.Material.Isopor) {
      this.insertValues(itemMaterial, 'isopor');
    }
    else if (itemMaterial.typeMaterial === Hierarchy.Material.Metal) {
      this.insertValues(itemMaterial, 'metal');
    }
    else if (itemMaterial.typeMaterial === Hierarchy.Material.Paper) {
      this.insertValues(itemMaterial, 'paper');
    }
    else if (itemMaterial.typeMaterial === Hierarchy.Material.Plastic) {
      this.insertValues(itemMaterial, 'plastic');
    }
    else if (itemMaterial.typeMaterial === Hierarchy.Material.Tetrapack) {
      this.insertValues(itemMaterial, 'tetrapack');
    }
  }

  remove(itemMaterial) {
    if (itemMaterial.typeMaterial === Hierarchy.Material.Glass) {
      this.removeItem(itemMaterial, 'glass');
    }
    else if (itemMaterial.typeMaterial === Hierarchy.Material.Isopor) {
      this.removeItem(itemMaterial, 'isopor');
    }
    else if (itemMaterial.typeMaterial === Hierarchy.Material.Metal) {
      this.removeItem(itemMaterial, 'metal');
    }
    else if (itemMaterial.typeMaterial === Hierarchy.Material.Paper) {
      this.removeItem(itemMaterial, 'paper');
    }
    else if (itemMaterial.typeMaterial === Hierarchy.Material.Plastic) {
      this.removeItem(itemMaterial, 'plastic');
    }
    else if (itemMaterial.typeMaterial === Hierarchy.Material.Tetrapack) {
      this.removeItem(itemMaterial, 'tetrapack');
    }
    else {
      this.itemsMaterials.forEach((item, index) => {
        if (item === itemMaterial) {
          this.itemsMaterials.splice(index, 1);
        }
      });
    }
  }
  removeItem(itemMaterial: any, type: string) {
    let isRemoved = false;
    if (this.hierarchy.solid.materials[type].items !== undefined) {
      this.hierarchy.solid.materials[type].items.forEach((item, index) => {
        if (item._id === itemMaterial._id) {
          let obj = { _id: itemMaterial._id, name: itemMaterial.name, active: false };
          this.hierarchy.solid.materials[type].items[index] = obj;
          isRemoved = true;
          this.itemsMaterials.forEach((item, index) => {
            if (item === itemMaterial) {
              this.itemsMaterials.splice(index, 1);
            }
          });
        }
      });
      if (!isRemoved) {
        this.itemsMaterials.forEach((item, index) => {
          if (item === itemMaterial) {
            this.itemsMaterials.splice(index, 1);
            isRemoved = true;
          }
        });
      }
    }
    if (itemMaterial._id !== undefined) {
      this.materialService.add(this.organizationId, this.hierarchy);
    }
  }

  private insertValues(itemMaterial: any, type: string) {
    let isAdd = false;
    if (this.hierarchy.solid.materials[type].items !== undefined) {
      this.hierarchy.solid.materials[type].items.forEach((item, index) => {
        if (item === itemMaterial || item._id === itemMaterial._id) {
          let obj = { _id: itemMaterial._id, name: itemMaterial.name, active: itemMaterial.active };
          this.hierarchy.solid.materials[type].items[index] = obj;
          isAdd = true;
        }
      });
      if (!isAdd) {
        let obj = { _id: itemMaterial._id, name: itemMaterial.name, active: itemMaterial.active };
        this.hierarchy.solid.materials[type].items.push(obj);
      }
    }
    else {
      let obj = { _id: itemMaterial._id, name: itemMaterial.name, active: itemMaterial.active };
      this.hierarchy.solid.materials[type].items = [obj];
    }
  }

  changeClassMaterial(selected, oldValue){
  }

  save(itemMaterial) {
    try {
      this.veryfyBeforeSave(itemMaterial);
      this.addToItemsMaterial(itemMaterial)
      this.materialService.createOrUpdate(this.organizationId, this.hierarchy);
      this.message = 'Dados salvos com sucesso';
    } catch (error) {
      this.message = error;
      console.log(error);
    }
  }

}
