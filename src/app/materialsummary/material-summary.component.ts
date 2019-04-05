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
      // this.toastr.warning(messageCode['WARNNING']['WRE007']['summary']);
      this.isBlocked = false;
      return;
    }
  }

  loadAll(items) {
    if (items === undefined || items.length <= 0) {
      // this.toastr.warning(messageCode['WARNNING']['WRE007']['summary']);
      this.isBlocked = false;
      return;
    } else {
      this.createSimpleList(items);
      this.entries.sort(x => x.name);
      this.entriesResult = this.groupBy('name');
    }
  }

  groupBy(key) {
    var names = [];
    this.entriesResult = this.entries.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      if (names.indexOf(x[key]) === -1) {
        names.push(x[key]);
      }
      return rv;
    }, {});
    return this.addToDictionary(names);
    return this.entriesResult;


  }

  addToDictionary(names) {
    var dictionary = [];
    names.forEach(name => {
      dictionary.push({
        key: name,
        value: this.entriesResult[name]
      });
    });

    this.calculateValues(Entries.types.purchase, names);
    this.calculateValues(Entries.types.sale, names);
    return dictionary;
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


  calculateValues(type, names) {
    this.calculateTotal(this.entriesResult, names);
    this.calculateAverage(this.entriesResult, names);
    //this.calculateWeight(this.entriesResult);
    this.calculateQuantityStock(this.entriesResult, names);
  }


  calculateTotal(items, names) {
    names.forEach(name => {
      items[name].forEach(item => {
        if (item.total === undefined || item.total === NaN) {
          item.total = 0.0;
        }
        item.total += item.amount;
      });
    });
  }

  calculateAverage(items, names) {
    names.forEach(name => {
      items[name].forEach(item => {
        let quantity = this.sumQuantity('quantity', this.entries.filter(x => x.name === item.name));
        item.average = item.total / quantity;

      });
    });
  }


  calculateQuantityStock(items, names) {
    let totPurchase;
    let totSale;
    names.forEach(name => {
      let filterPurchase = items[name].filter(x => x.type === Entries.types.purchase && x.name === name);
      let filterSale = items[name].filter(x => x.type === Entries.types.sale && x.name === name);
      totPurchase = this.sumQuantity('quantity', filterPurchase);
      totSale = this.sumQuantity('quantity', filterSale);
      items[name].forEach(res => {
        res.stock = totPurchase - totSale;
        res.stock = Math.abs(res.stock);
      });
    });

  }




  // calculateWeight(items, names) {

  // }


  // generteValuesPurchase(items, type) {
  //   if (items === undefined || items.length <= 0) {
  //     return;
  //   }
  //   let result = [];
  //   items.reduce(function (res, value) {
  //     if (!res[value.name]) {
  //       res[value.name] = { _id: value._id, total: value.amount, type: value.type, name: value.name, quantity: value.quantity, average: 0.0, weight: value.weight, expand: true, typeEntrie: value.typeEntrie, stock: 0.0 };
  //       result.push(res[value.name]);
  //     }

  //     res[value.name].total += value.amount;
  //     res[value.name].weight += value.weight;
  //     return res;
  //   }, {});
  //   this.calculateAverage(result);
  //   this.calculateQuantityStock(result, this.entries.filter(x => x.type === type));

  //   if (this.entriesResult === undefined || this.entriesResult.length <= 0) {
  //     this.entriesResult = result;
  //   } else {
  //     this.addMore(result);
  //   }
  // }

  // addMore(result) {
  //   result.forEach(item => {
  //     this.entriesResult.push(item);
  //   });
  // }



  sumQuantity(prop, items) {
    try {
      return items.reduce(function (a, b) {
        return a + b[prop];
      }, 0);
    } catch (error) {
      return 0;
    }
  }

  // separeteGroups() {
  //   this.entriesResult.forEach(result => {
  //     if (result.type === Entries.types.purchase) {
  //       if (this.entriesPurchase === undefined || this.entriesPurchase.length <= 0) {
  //         this.entriesPurchase = [result];
  //       } else {
  //         this.entriesPurchase.push(result);
  //       }
  //     }
  //     else if (result.type === Entries.types.sale) {
  //       if (this.entriesSale === undefined || this.entriesSale.length <= 0) {
  //         this.entriesSale = [result];
  //       } else {
  //         this.entriesSale.push(result);
  //       }
  //     }
  //   });
  // }



  closeOrExpand(item) {
    if (item.expand) {
      item.expand = false;
    } else {
      item.expand = true;
    }
  }
}
