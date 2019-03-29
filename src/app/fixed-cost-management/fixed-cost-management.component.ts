import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/services';
import { FixedCostManagementService } from '../../services/fixed-cost-management.service';
import * as messageCode from 'message.code.json';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Fixed } from 'src/models/fixed';

@Component({
  selector: 'app-fixed-cost-management',
  templateUrl: './fixed-cost-management.component.html',
  styleUrls: ['./fixed-cost-management.component.scss']
})
export class FixedCostManagementComponent implements OnInit {

  private readonly DATEFORMAT = 'dd/MM/yyyy';
  private readonly REGEX = /[^0-9.,]+/;

  private readonly NOTNUMBER = 'NaN';

  private readonly COMMA = ',';

  private readonly DOT = '.';
  organizationId: string;
  pageFixed: number;
  isBlocked = true;
  types = Object.values(Fixed.Type);
  isHidden;
  expenses: any[];
  date;


  constructor(private authService: AuthService, private fixedCostService: FixedCostManagementService, private toastr: ToastrService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.pageFixed = 1;
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
  loadFixedCosts(item, date) {
    this.date = date;
    if (item[0] !== undefined) {
      this.expenses = item;
      if (item[0].fixed === undefined || item[0].fixed.length <= 0) {
        this.newItem();
      } else {
        this.expenses[0].fixed = item[0].fixed;
        this.isHidden = false;
      }
    }
    return this.expenses[0].fixed;
  }


  newItem() {
    this.expenses[0].date = this.date;
    const fixed = { name: undefined, typeExpense: undefined, description: undefined, date: this.date, cost: 0.0, active: true };
    if (this.expenses[0].fixed === undefined || this.expenses[0].fixed.length <= 0) {
      this.expenses[0].fixed = [fixed];
    } else {
      this.expenses[0].fixed.push(fixed);
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
    item.date = new Date();

  }

  veryfyBeforeSave(fixed) {
    if (fixed === undefined || fixed.length <= 0) {
      this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
      throw new Error();
    }
    fixed.forEach(item => {
      if (item.name === undefined) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.cost === undefined || item.cost <= 0) {
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
