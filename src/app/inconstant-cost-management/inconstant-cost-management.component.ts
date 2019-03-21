import { Component, OnInit } from '@angular/core';
import { Inconstant } from 'src/models/inconstant';
import { AuthService } from 'src/services';
import { InconstantCostManagementService } from 'src/services/inconstant-cost-management.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import * as messageCode from 'message.code.json';


@Component({
  selector: 'app-inconstant-cost-management',
  templateUrl: './inconstant-cost-management.component.html',
  styleUrls: ['./inconstant-cost-management.component.scss']
})
export class InconstantCostManagementComponent implements OnInit {


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


  constructor(private authService: AuthService, private InconstantCostService: InconstantCostManagementService, private toastr: ToastrService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.isHidden = true;
  }

  close() {
    this.isHidden = true;
  }

  clean() {
    this.expenses = [];
    this.isHidden = true;
  }
  loadInconstantCosts(item, date) {
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
    const inconstant = { name: undefined, type: undefined, description: undefined, date: this.date, quantity: 1, weight: 0, cost: 0.0, amount: 0.0, };
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
    item.date = new Date();
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
