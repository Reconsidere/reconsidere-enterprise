import { Component, OnInit, Input } from '@angular/core';
import { Inconstant } from 'src/models/inconstant';
import { AuthService } from 'src/services';
import { InconstantCostManagementService } from 'src/services/inconstant-cost-management.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import * as messageCode from 'message.code.json';
import { MaterialManagementService } from 'src/services/material-management.service';
import { Hierarchy } from 'src/models/material';


@Component({
  selector: 'app-inconstant-cost-management',
  templateUrl: './inconstant-cost-management.component.html',
  styleUrls: ['./inconstant-cost-management.component.scss']
})
export class InconstantCostManagementComponent implements OnInit {

  materialSelected;

  private readonly DATEFORMAT = 'dd/MM/yyyy';
  private readonly REGEX = /[^0-9.,]+/;

  private readonly NOTNUMBER = 'NaN';

  private readonly COMMA = ',';

  private readonly DOT = '.';
  organizationId: string;
  page: number;
  isBlocked = true;
  types = Object.values(Inconstant.Type);
  isHidden;
  expenses: any[];
  date;
  itemsMaterials: any[];


  constructor(private materialService: MaterialManagementService, private authService: AuthService, private InconstantCostService: InconstantCostManagementService, private toastr: ToastrService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.isHidden = true;
    this.itemsMaterials = [];
  }

  close() {
    this.isHidden = true;
  }

  clean() {
    this.expenses = [];
    this.isHidden = true;
  }
  loadInconstantCosts(item, date, organizationId) {
    this.organizationId = organizationId;
    this.date = date;
    if (item[0] !== undefined) {
      this.expenses = item;
      if (item[0].inconstant === undefined || item[0].inconstant.length <= 0) {
        this.newItem();
      } else {
        this.expenses[0].inconstant = item[0].inconstant;
        this.isHidden = false;
      }
    }
    return this.expenses[0].inconstant;
  }


  newItem() {
    this.expenses[0].date = this.date;
    const inconstant = { name: undefined, isTypeMaterial: false, typeExpense: undefined, description: undefined, date: this.date, quantity: 1, weight: 0, cost: 0.0, amount: 0.0, };
    if (this.expenses[0].inconstant === undefined || this.expenses[0].inconstant.length <= 0) {
      this.expenses[0].inconstant = [inconstant];
    } else {
      this.expenses[0].inconstant.push(inconstant);
    }
    this.isHidden = false;
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

  typeSelected(object) {
    if (object.typeExpense === Inconstant.Type.Material) {
      object.isTypeMaterial = true;
      this.materialService
        .getHierarchy(this.organizationId)
        .subscribe(item => this.loadMaterials(item), error => error);
    } else {
      object.isTypeMaterial = false;
      object.name = '';
      object.cost = 0.0;
      this.materialSelected = undefined;
    }
  }

  loadMaterials(item) {
    if (item !== undefined) {
      this.insertItems(Hierarchy.types.glass, Hierarchy.Material.Glass, item);
      this.insertItems(Hierarchy.types.isopor, Hierarchy.Material.Isopor, item);
      this.insertItems(Hierarchy.types.metal, Hierarchy.Material.Metal, item);
      this.insertItems(Hierarchy.types.paper, Hierarchy.Material.Paper, item);
      this.insertItems(Hierarchy.types.plastic, Hierarchy.Material.Plastic, item);
      this.insertItems(Hierarchy.types.tetrapack, Hierarchy.Material.Tetrapack, item);
      this.itemsMaterials.sort();
    }
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


  selectedMaterial(item) {
    if (item !== undefined && this.materialSelected !== undefined && this.materialSelected !== '') {
      item.cost = this.materialSelected.pricing.unitPrice[this.materialSelected.pricing.unitPrice.length - 1];
      item.name = this.materialSelected.name;
      this.calculatePrice(item);
    } else {
      item.cost = 0.0;
      item.name = '';
    }
  }

  veryfyBeforeSave(inconstant) {
    if (inconstant === undefined || inconstant.length <= 0) {
      this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
      throw new Error();
    }
    inconstant.forEach(item => {
      if (item.name === undefined) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.cost === undefined || item.cost <= 0) {
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
      if (item.date === undefined) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.description === undefined || item.description === '') {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.typeExpense === undefined || item.typeExpense === '') {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
    });
  }

}
