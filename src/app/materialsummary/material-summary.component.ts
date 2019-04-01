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

  private readonly DATEFORMAT = 'dd/MM/yyyy';

  private readonly DISABLED = 'disabled';

  constructor(private authService: AuthService, private entriesService: EntriesManagementService, private datePipe: DatePipe, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
    this.entries = [];
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
      this.generteValues();
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
        };

        if (this.entries === undefined || this.entries.length <= 0 && obj.isTypeMaterial) {
          this.entries = [obj];
        } else if (obj.isTypeMaterial) {
          this.entries.push(obj);
        }
      });
    }
  }



  generteValues() {
    let result = [];
    this.entries.reduce(function (res, value) {
      if (!res[value.name]) {
        res[value.name] = { _id: value._id, total: value.amount, typeEntrie: value.typeEntrie, name: value.name, quantity: value.quantity, average: 0.0, weight: value.weight };
        result.push(res[value.name]);
      }
      res[value.name].total += value.amount;
      res[value.name].typeEntrie += value.typeEntrie;
      res[value.name].quantity += value.quantity;
      res[value.name].weight += value.weight;
      return res;
    }, {});
    this.calculateAverage(result);
    this.entries = [];
    this.entries = result;
    console.log(result);
  }

  calculateAverage(result) {
    result.forEach(res => {
      res.average = res.total / this.entries.filter(x => x.name === res.name).length;
    });
  }
}
