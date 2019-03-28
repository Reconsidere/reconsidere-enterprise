import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services';
import { ToastrService } from 'ngx-toastr';
import * as messageCode from 'message.code.json';
import { EntriesManagementService } from 'src/services/entries-management.service';
import { Entries } from 'src/models/entries';
import { MaterialManagementService } from 'src/services/material-management.service';
import { Hierarchy } from 'src/models/material';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'entries-management',
  templateUrl: './entries-management.component.html',
  styleUrls: ['./entries-management.component.scss']
})
export class EntriesManagementComponent implements OnInit {

  organizationId: string;
  page: number;
  entrieItems: any[];
  entries: any;
  types: any[];
  typeEntrie: any[];
  itemsMaterials: any[];
  materialSelected;
  private readonly REGEX = /[^0-9.,]+/;

  private readonly NOTNUMBER = 'NaN';

  private readonly COMMA = ',';

  private readonly DOT = '.';

  constructor(private authService: AuthService, private toastr: ToastrService, private entriesService: EntriesManagementService, private materialService: MaterialManagementService) { }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
    this.types = Object.values(Entries.Type);
    this.typeEntrie = Object.values(Entries.TypeEntrie);
    this.itemsMaterials = [];
  }

  setId(id) {
    this.organizationId = id;
    if (id !== undefined) {
      this.entriesService.getEntries(this.organizationId).subscribe(items => this.loadAll(items), error => error);
    } else {
      this.toastr.warning(messageCode['WARNNING']['WRE013']['summary']);
      return;
    }
  }


  loadAll(items) {
    if (items === undefined || items.length <= 0) {
      this.entries = new Entries();
      this.newItem();
    } else {
      this.entries = items;
      this.createSimpleList(items);
    }
  }

  createSimpleList(list: Entries) {
    this.insertItems(Entries.types.purchase, Entries.Type.Input, list);
    this.insertItems(Entries.types.sale, Entries.Type.Output, list);
  }

  insertItems(type: any, typeEntrie: any, list: Entries) {
    if (list[type] !== undefined) {
      list[type].forEach(item => {
        let obj = {
          _id: item._id,
          name: item.name,
          cost: item.cost,
          typeEntrie: item.typeEntrie,
          date: item.date,
          type: typeEntrie,
          isTypeMaterial: item.typeEntrie === Entries.TypeEntrie.Material ? true : false,
          amount: item.amount,
          weight: item.weight,
          quantity: item.quantity
        }
        if (obj.isTypeMaterial) {
          this.materialService
            .getHierarchy(this.organizationId)
            .subscribe(item => this.loadMaterials(item, obj), error => error);
        }
        if (this.entrieItems === undefined || this.entrieItems.length <= 0) {
          this.entrieItems = [obj];
        } else {
          this.entrieItems.push(obj);
        }
      });
    }
  }

  setMaterial(item) {
    this.materialSelected = this.itemsMaterials.find(x => x.name === item.name);
  }


  newItem() {
    let obj = { _id: undefined, type: undefined, isTypeMaterial: false, typeEntrie: undefined, cost: 0.0, name: undefined, date: new Date(), quantity: 1, weight: 0, amount: 0.0 };
    if (this.entrieItems === undefined || this.entrieItems.length <= 0) {
      this.entrieItems = [obj];
    } else {
      this.entrieItems.push(obj);
    }
  }


  typeSelected(object) {
    if (object.typeEntrie === Entries.TypeEntrie.Material) {
      object.isTypeMaterial = true;
      this.materialService
        .getHierarchy(this.organizationId)
        .subscribe(item => this.loadMaterials(item), error => error);
    } else {
      object.isTypeMaterial = false;
      object.name = '';
      object.cost = 0.0;
      object.amount = 0.0;
      this.materialSelected = undefined;
    }
  }

  selectedMaterial(item) {
    if (item !== undefined && this.materialSelected !== undefined && this.materialSelected !== '') {
      item.name = this.materialSelected.name;
      item.cost = this.materialSelected.pricing.unitPrice[this.materialSelected.pricing.unitPrice.length - 1];
      this.calculatePrice(item);
    } else {
      item.name = '';
      this.materialSelected = undefined;
    }
  }

  loadMaterials(item, object) {
    if (item !== undefined) {
      this.insertaterials(Hierarchy.types.glass, Hierarchy.Material.Glass, item);
      this.insertaterials(Hierarchy.types.isopor, Hierarchy.Material.Isopor, item);
      this.insertaterials(Hierarchy.types.metal, Hierarchy.Material.Metal, item);
      this.insertaterials(Hierarchy.types.paper, Hierarchy.Material.Paper, item);
      this.insertaterials(Hierarchy.types.plastic, Hierarchy.Material.Plastic, item);
      this.insertaterials(Hierarchy.types.tetrapack, Hierarchy.Material.Tetrapack, item);
      this.itemsMaterials.sort();
    }
    if (object !== undefined) {
      this.setMaterial(object);

    }
  }

  insertaterials(type: any, typeMaterial: any, list: Hierarchy) {
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

  changeType(selected, oldValue, item) {
    if (selected === oldValue) {
      return;
    }
    if (oldValue === Entries.Type.Input) {
      this.changeClass(item, selected, Entries.types.purchase);
      return;
    }
    if (oldValue === Entries.Type.Output) {
      this.changeClass(item, selected, Entries.types.sale);
      return;
    }
  }

  private changeClass(item: any, selected: any, type: any) {
    let isChanged = false;
    let isRemoved = false;
    this.entrieItems.forEach((element, index) => {
      if (element._id !== undefined && element._id !== '' && !isChanged) {
        this.entries[type].forEach((obj, i) => {
          if (item._id === obj._id) {
            this.entries[type].splice(i, 1);
            isRemoved = true;
          }
        });
        if (isRemoved) {
          item.typeMaterial = selected;
          this.entrieItems[type][index] = item;
          isChanged = true;
          isRemoved = false;
        }
      }
    });
  }

  changePrice(oldValue, value, item, e) {
    if (oldValue === value) {
      return;
    }
    let number = value.replace(this.REGEX, '');
    number = Number(number.replace(this.COMMA, this.DOT)).toFixed(2);
    if (number === this.NOTNUMBER) {
      item.cost = '';
      return;
    }
    item.cost = Number(number);
    this.calculatePrice(item);

  }

  changeAmount(oldValue, value, item, e) {
    if (oldValue === value) {
      return;
    }
    let number = value.replace(this.REGEX, '');
    number = Number(number.replace(this.COMMA, this.DOT)).toFixed(2);
    if (number === this.NOTNUMBER) {
      item.cost = '';
      return;
    }
    item.amount = Number(number);
    this.calculatePrice(item);
  }

  calculatePrice(item) {
    if (item.cost === undefined && item.quantity === undefined && item.weight === undefined || item.quantity <= 0 && item.weight <= 0 && item.cost <= 0) {
      this.toastr.warning(messageCode['WARNNING']['WRE013']['summary']);
      return;
    }
    else if (item.cost > 0 && item.quantity > 0 && item.weight > 0) {
      item.amount = item.cost * item.quantity * item.weight;
    } else if (item.cost > 0 && item.quantity > 0 && item.weight <= 0) {
      item.amount = item.cost * item.quantity;
    }
    item.date = new Date();
  }

  veryfyBeforeSave() {
    if (this.entrieItems === undefined || this.entrieItems.length <= 0) {
      this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
      throw new Error();
    }
    this.entrieItems.forEach(item => {
      if (item.name === undefined) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.cost === undefined || item.cost <= 0) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.typeEntrie === undefined || item.typeEntrie === '') {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.type === undefined || item.type === '') {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.date === undefined) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.quantity === undefined || item.quantity <= 0) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.amount === undefined || item.amount <= 0) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
    });
  }


  private addToEntrie() {
    this.entrieItems.forEach(entrieItems => {
      if (entrieItems.type === Entries.Type.Input) {
        this.insertValues(entrieItems, Entries.types.purchase);
      } if (entrieItems.type === Entries.Type.Output) {
        this.insertValues(entrieItems, Entries.types.sale);
      }
    });
  }

  private insertValues(itemEntrie: any, type: string) {
    let isAdd = false;
    if (this.entries[type] !== undefined) {
      this.entries[type].forEach((item, index) => {
        if (item === itemEntrie) {
          this.entries[type][index] = itemEntrie;
          isAdd = true;
        } else if (item._id !== undefined && item._id === itemEntrie._id) {
          this.entries[type][index] = itemEntrie;
          isAdd = true;
        }
      });
      if (!isAdd) {
        this.entries[type].push(itemEntrie);
      }
    } else {
      this.entries[type] = [itemEntrie];
    }
  }

  save() {
    try {
      this.veryfyBeforeSave();
      this.addToEntrie();
      this.entriesService.createOrUpdate(this.organizationId, this.entries);
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
