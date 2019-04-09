import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services';
import { Hierarchy } from 'src/models/material';
import { DatePipe } from '@angular/common';
import * as messageCode from 'message.code.json';
import { ToastrService } from 'ngx-toastr';
import { MaterialSummary } from 'src/models/materialSummary';
import { MaterialSummaryService } from 'src/services/material-summary.service';
import { EntriesManagementService } from 'src/services/entries-management.service';
import { Entries } from 'src/models/entries';


@Component({
  selector: 'material-summary',
  templateUrl: './material-summary.component.html',
  styleUrls: ['./material-summary.component.scss']
})
export class MaterialSummaryComponent implements OnInit {
  entries: any[];
  organizationId: string;
  page: number;
  isBlocked = true;
  entriesResult;
  entriesPurchase;
  entriesSale;
  dateFilterInitial;
  dateFilterFinal;

  private readonly DATEFORMAT = 'dd/MM/yyyy';

  private readonly DISABLED = 'disabled';

  constructor(private authService: AuthService, private entriesService: EntriesManagementService, private datePipe: DatePipe, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
    this.entries = [];
    this.entriesResult = [];
    this.entriesPurchase = [];
    this.entriesSale = [];
  }

  setId(id) {
    this.organizationId = id;
    if (id !== undefined) {
      this.entriesService.getEntries(this.organizationId).subscribe(items => this.loadAll(items), error => error);
    } else {
      this.toastr.warning(messageCode['WARNNING']['WRE016']['summary']);
      this.isBlocked = false;
      return;
    }
  }

  loadAll(items) {
    if (items === undefined || items === null || items.length <= 0) {
      this.toastr.warning(messageCode['WARNNING']['WRE013']['summary']);
      this.isBlocked = false;
      return;
    } else {
      this.createSimpleList(items);
      this.entries.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

      this.entriesResult = this.groupBy('name');
    }
  }


  filterMaterial() {
    if (!this.dateFilterInitial && !this.dateFilterInitial) {
      this.entriesService.getEntries(this.organizationId).subscribe(items => this.loadAll(items), error => error);
    } else {
      if (this.dateFilterInitial > this.dateFilterFinal) {
        this.toastr.warning(messageCode['WARNNING']['WRE017']['summary']);
        return;
      }
      let filter;
      if (this.dateFilterInitial && !this.dateFilterFinal) {
        filter = {
          dateInitial: this.dateFilterInitial,
          dateFinal: this.dateFilterInitial
        };

      } else if (!this.dateFilterInitial && this.dateFilterFinal) {
        filter = {
          dateInitial: this.dateFilterFinal,
          dateFinal: this.dateFilterFinal
        };
      } else {
        filter = {
          dateInitial: this.dateFilterInitial,
          dateFinal: this.dateFilterFinal
        };
      }
      this.entriesService.getFilteredEntries(this.organizationId, filter).subscribe(items => this.loadAll(items), error => error);
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
          typeEntrie: type === Entries.types.purchase ? Entries.Type.Input : Entries.Type.Output,
          date: item.date,
          type: type,
          isTypeMaterial: item.typeEntrie === Entries.TypeEntrie.Material ? true : false,
          amount: item.amount,
          weight: item.weight,
          quantity: item.quantity
        };

        if (this.entries === undefined || this.entries.length <= 0 && obj.isTypeMaterial) {
          this.entries = [obj];
        } else if (obj.isTypeMaterial) {
          this.entries.push(obj);
        }
      });
    }
  }


  groupBy(key) {
    var names = [];
    var results = [];
    this.entriesResult = this.reduce(names, key, this.entries);
    this.sum(Entries.types.sale, names, results);
    this.sum(Entries.types.purchase, names, results);
    this.entriesResult = results;
    this.entriesResult = this.reduce(names, key, this.entriesResult);
    this.calculateQuantityStock(this.entriesResult, names);
    this.calculateWeightStock(this.entriesResult, names);
    this.calculateTotal(this.entriesResult, names);
    this.calculateAverage(this.entriesResult, names, Entries.types.purchase);
    this.calculateAverage(this.entriesResult, names, Entries.types.sale);

    this.entriesResult = this.addToDictionary(names);
    return this.entriesResult;
  }

  reduce(names, key, items) {
    return items.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      if (names.indexOf(x[key]) === -1) {
        names.push(x[key]);
      }
      return rv;
    }, {});
  }

  sum(type, names, results) {
    names.forEach(name => {
      let object = { _id: undefined, amount: 0.0, type: type, name: undefined, quantity: 0.0, average: 0.0, weight: 0.0, expand: undefined, typeEntrie: undefined, stock: 0.0 };

      this.entriesResult[name].forEach(item => {
        if (item.type === type) {
          object.amount += item.amount;
          object.quantity += item.quantity;
          object.weight += item.weight;
          object._id = item._id;
          object.type = item.type;
          object.name = item.name;
          object.typeEntrie = item.typeEntrie;
          object.expand = true;

        } else {
          return;
        }
      });
      if (object._id !== undefined) {
        results.push(object);
      }
    });
    return results;
  }



  addToDictionary(names) {
    var dictionary = [];
    names.forEach(name => {
      dictionary.push({
        key: name,
        value: this.entriesResult[name]
      });
    });
    return dictionary;
  }




  calculateTotal(items, names) {
    let totPurchase;
    let totSale;
    names.forEach(name => {
      let filterPurchase = items[name].filter(x => x.type === Entries.types.purchase && x.name === name);
      let filterSale = items[name].filter(x => x.type === Entries.types.sale && x.name === name);
      totPurchase = this.sumValues('amount', filterPurchase);
      totSale = this.sumValues('amount', filterSale);
      items[name].forEach(res => {
        res.total = totPurchase - totSale;
        res.total = Math.abs(res.total);
      });
    });

  }

  calculateAverage(items, names, type) {
    names.forEach(name => {
      let quantity = this.sumValues('quantity', items[name].filter(x => x.name === name && x.type === type));
      if (quantity === 0) {
        return;
      }
      items[name].forEach(res => {
        if (res.type === type) {
          let average = res.amount / quantity;
          res.average = Math.abs(average);
        }
      });
    });
  }

  calculateQuantityStock(items, names) {
    let totPurchase;
    let totSale;
    names.forEach(name => {
      let filterPurchase = items[name].filter(x => x.type === Entries.types.purchase && x.name === name);
      let filterSale = items[name].filter(x => x.type === Entries.types.sale && x.name === name);
      totPurchase = this.sumValues('quantity', filterPurchase);
      totSale = this.sumValues('quantity', filterSale);
      items[name].forEach(res => {
        res.stock = totPurchase - totSale;
        res.stock = Math.abs(res.stock);
      });
    });

  }

  calculateWeightStock(items, names) {
    let totPurchase;
    let totSale;
    names.forEach(name => {
      let filterPurchase = items[name].filter(x => x.type === Entries.types.purchase && x.name === name);
      let filterSale = items[name].filter(x => x.type === Entries.types.sale && x.name === name);
      totPurchase = this.sumValues('weight', filterPurchase);
      totSale = this.sumValues('weight', filterSale);
      items[name].forEach(res => {
        res.weightStock = totPurchase - totSale;
        res.weightStock = Math.abs(res.weightStock);
      });
    });

  }

  sumValues(prop, items) {
    try {
      return items.reduce(function (a, b) {
        return a + b[prop];
      }, 0);
    } catch (error) {
      return 0;
    }
  }

  closeOrExpand(item) {
    if (item.expand) {
      item.expand = false;
    } else {
      item.expand = true;
    }
  }
}
