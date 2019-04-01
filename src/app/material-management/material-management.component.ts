import { Component, OnInit } from '@angular/core';
import { Hierarchy } from 'src/models/material';
import { AuthService } from 'src/services';
import { MaterialManagementService } from 'src/services/material-management.service';
import { MaterialSummary } from 'src/models/materialsummary';
import { CurrencyPipe } from '@angular/common';
import * as messageCode from 'message.code.json';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-material-management',
  templateUrl: './material-management.component.html',
  styleUrls: ['./material-management.component.scss']
})


export class MaterialManagementComponent implements OnInit {
  hierarchy: Hierarchy;
  organizationId: string;
  page: number;
  materialsType = [];
  itemsMaterials: any[];
  isBlocked = true;

  private readonly REGEX = /[^0-9.,]+/;

  private readonly NOTNUMBER = 'NaN';

  private readonly COMMA = ',';

  private readonly DOT = '.';

  constructor(
    private authService: AuthService,
    private materialService: MaterialManagementService,
    private toastr: ToastrService
  ) {
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
      this.materialService
        .getHierarchy(this.organizationId)
        .subscribe(item => this.loadHierarchy(item), error => error);
    } else {
      this.toastr.warning(messageCode['WARNNING']['WRE006']['summary']);
      this.isBlocked = false;
    }
  }

  private loadHierarchy(item) {
    if (item) {
      this.hierarchy = item;
      this.verifyMaterialsTypes();
      this.createSimpleList(this.hierarchy);
    } else {
      this.toastr.warning(messageCode['WARNNING']['WRE006']['summary']);
      this.isBlocked = false;
    }
  }

  verifyMaterialsTypes() {
    if (
      !this.hierarchy.solid.materials.glass.used &&
      !this.hierarchy.solid.materials.isopor.used &&
      !this.hierarchy.solid.materials.metal.used &&
      !this.hierarchy.solid.materials.paper.used &&
      !this.hierarchy.solid.materials.plastic.used &&
      !this.hierarchy.solid.materials.tetrapack.used
    ) {
      this.toastr.warning(messageCode['WARNNING']['WRE006']['summary']);
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
    this.insertItems(Hierarchy.types.glass, Hierarchy.Material.Glass, list);
    this.insertItems(Hierarchy.types.isopor, Hierarchy.Material.Isopor, list);
    this.insertItems(Hierarchy.types.metal, Hierarchy.Material.Metal, list);
    this.insertItems(Hierarchy.types.paper, Hierarchy.Material.Paper, list);
    this.insertItems(Hierarchy.types.plastic, Hierarchy.Material.Plastic, list);
    this.insertItems(Hierarchy.types.tetrapack, Hierarchy.Material.Tetrapack, list);
  }

  insertItems(type: any, typeMaterial: any, list: Hierarchy) {
    if (list.solid.materials[type] !== undefined) {
      list.solid.materials[type].items.forEach(item => {
        if (this.itemsMaterials === undefined) {
          this.itemsMaterials = [
            {
              _id: item._id,
              typeMaterial: typeMaterial,
              name: item.name,
              active: item.active,
              pricing: item.pricing
            }
          ];
        } else {
          if (item.active) {
            this.itemsMaterials.push({
              _id: item._id,
              typeMaterial: typeMaterial,
              name: item.name,
              active: item.active,
              pricing: item.pricing
            });
          }
        }
      });
    }
  }

  newItem() {
    if (this.itemsMaterials === undefined) {
      this.itemsMaterials = [
        { _id: undefined, typeMaterial: '', name: undefined, active: true, pricing: { unitPrice: [0], date: [new Date()], weight: 0, price: 0} }
      ];
    } else {
      this.itemsMaterials.push({
        _id: undefined,
        typeMaterial: '',
        name: undefined,
        active: true,
        pricing: { unitPrice: [0], date: [new Date()], weight: 0, price: 0 }
      });
    }
  }

  veryfyBeforeSave() {
    if (this.itemsMaterials === undefined || this.itemsMaterials.length <= 0) {
      this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
      throw new Error();
    }
    this.itemsMaterials.forEach(item => {
      if (item.name === undefined) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if ((item.pricing === undefined || item.pricing.unitPrice.length <= 0)) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if ((item.pricing.unitPrice[item.pricing.unitPrice.length - 1] <= 0)) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
    });
    if (this.checkDuplicityName()) {
      throw new Error();
    }
  }

  checkDuplicityName() {
    for (let i = 0; i <= this.itemsMaterials.length; i++) {
      for (let j = i; j <= this.itemsMaterials.length; j++) {
        if (i !== j && this.itemsMaterials[i].name === this.itemsMaterials[j].name) {
          this.toastr.warning(messageCode['WARNNING']['WRE015']['summary']);
          return true;
        }
      }
    }
    return false;
  }

  private addToItemsMaterial() {
    this.itemsMaterials.forEach(itemMaterial => {
      if (itemMaterial.typeMaterial === Hierarchy.Material.Glass) {
        this.insertValues(itemMaterial, Hierarchy.types.glass);
      } if (itemMaterial.typeMaterial === Hierarchy.Material.Isopor) {
        this.insertValues(itemMaterial, Hierarchy.types.isopor);
      } if (itemMaterial.typeMaterial === Hierarchy.Material.Metal) {
        this.insertValues(itemMaterial, Hierarchy.types.metal);
      } if (itemMaterial.typeMaterial === Hierarchy.Material.Paper) {
        this.insertValues(itemMaterial, Hierarchy.types.paper);
      } if (itemMaterial.typeMaterial === Hierarchy.Material.Plastic) {
        this.insertValues(itemMaterial, Hierarchy.types.plastic);
      } if (itemMaterial.typeMaterial === Hierarchy.Material.Tetrapack) {
        this.insertValues(itemMaterial, Hierarchy.types.tetrapack);
      }
    });
  }

  remove(itemMaterial) {
    if (itemMaterial.typeMaterial === Hierarchy.Material.Glass) {
      this.removeItem(itemMaterial, Hierarchy.types.glass);
    } else if (itemMaterial.typeMaterial === Hierarchy.Material.Isopor) {
      this.removeItem(itemMaterial, Hierarchy.types.isopor);
    } else if (itemMaterial.typeMaterial === Hierarchy.Material.Metal) {
      this.removeItem(itemMaterial, Hierarchy.types.metal);
    } else if (itemMaterial.typeMaterial === Hierarchy.Material.Paper) {
      this.removeItem(itemMaterial, Hierarchy.types.paper);
    } else if (itemMaterial.typeMaterial === Hierarchy.Material.Plastic) {
      this.removeItem(itemMaterial, Hierarchy.types.plastic);
    } else if (itemMaterial.typeMaterial === Hierarchy.Material.Tetrapack) {
      this.removeItem(itemMaterial, Hierarchy.types.tetrapack);
    } else {
      this.itemsMaterials.forEach((item, index) => {
        if (item === itemMaterial) {
          this.itemsMaterials.splice(index, 1);
        }
      });
    }
  }
  removeItem(itemMaterial: any, type: string) {
    let isRemoved = false;
    let isChanged = false;
    if (this.itemsMaterials !== undefined) {
      this.itemsMaterials.forEach((item, index) => {
        if (item._id !== undefined && item._id === itemMaterial._id && !isChanged) {
          this.itemsMaterials[index].active = false;
          isRemoved = true;
          isChanged = true;
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
  }

  private insertValues(itemMaterial: any, type: string) {
    let isAdd = false;
    if (this.hierarchy.solid.materials[type].items !== undefined) {
      this.hierarchy.solid.materials[type].items.forEach((item, index) => {
        if (item === itemMaterial) {
          let obj = {
            _id: itemMaterial._id,
            name: itemMaterial.name,
            active: itemMaterial.active,
            pricing: itemMaterial.pricing
          };
          this.hierarchy.solid.materials[type].items[index] = obj;
          isAdd = true;
        } else if (item._id !== undefined && item._id === itemMaterial._id) {
          let obj = {
            _id: itemMaterial._id,
            name: itemMaterial.name,
            active: itemMaterial.active,
            pricing: itemMaterial.pricing
          };
          this.hierarchy.solid.materials[type].items[index] = obj;
          isAdd = true;
        }
      });
      if (!isAdd) {
        let obj = {
          _id: itemMaterial._id,
          name: itemMaterial.name,
          active: itemMaterial.active,
          pricing: itemMaterial.pricing
        };
        this.hierarchy.solid.materials[type].items.push(obj);
      }
    } else {
      let obj = {
        _id: itemMaterial._id,
        name: itemMaterial.name,
        active: itemMaterial.active,
        pricing: itemMaterial.pricing
      };
      this.hierarchy.solid.materials[type].items = [obj];
    }
  }

  changePrice(oldValue, value, item, e) {
    if (oldValue === value) {
      return;
    }
    let number = value.replace(this.REGEX, '');
    number = Number(number.replace(this.COMMA, this.DOT)).toFixed(2);
    if (number === this.NOTNUMBER) {
      item.pricing.unitPrice[item.pricing.unitPrice.length - 1] = '';
      return;
    }
    item.pricing.unitPrice[item.pricing.unitPrice.length - 1] = oldValue;
    item.pricing.unitPrice.push(number);
    item.pricing.date.push(new Date());
  }

  changeClassMaterial(selected, oldValue, item) {

    if (selected === oldValue) {
      return;
    }
    if (oldValue === Hierarchy.Material.Glass) {
      this.changeClass(item, selected, Hierarchy.types.glass);
      return;
    }
    if (oldValue === Hierarchy.Material.Isopor) {
      this.changeClass(item, selected, Hierarchy.types.isopor);
      return;
    }
    if (oldValue === Hierarchy.Material.Metal) {
      this.changeClass(item, selected, Hierarchy.types.metal);
      return;
    }
    if (oldValue === Hierarchy.Material.Paper) {
      this.changeClass(item, selected, Hierarchy.types.paper);
      return;
    }
    if (oldValue === Hierarchy.Material.Plastic) {
      this.changeClass(item, selected, Hierarchy.types.plastic);
      return;
    }
    if (oldValue === Hierarchy.Material.Tetrapack) {
      this.changeClass(item, selected, Hierarchy.types.tetrapack);
      return;
    }
  }

  private changeClass(item: any, selected: any, type: any) {
    let isChanged = false;
    let isRemoved = false;
    this.itemsMaterials.forEach((element, index) => {
      if (element._id !== undefined && element._id !== '' && !isChanged) {
        this.hierarchy.solid.materials[type].items.forEach((obj, i) => {
          if (item._id === obj._id) {
            this.hierarchy.solid.materials[type].items.splice(i, 1);
            isRemoved = true;
          }
        });
        if (isRemoved) {
          item.typeMaterial = selected;
          this.itemsMaterials[index] = item;
          isChanged = true;
          isRemoved = false;
        }
      }
    });
  }

  save() {
    try {
      this.veryfyBeforeSave();
      this.addToItemsMaterial();
      this.materialService.createOrUpdate(this.organizationId, this.hierarchy);
      this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
    } catch (error) {
      try {
        this.toastr.error(messageCode['ERROR'][error]['summary']);
      } catch (e) {
        this.toastr.error(error.message);
      }
    }
  }
}
