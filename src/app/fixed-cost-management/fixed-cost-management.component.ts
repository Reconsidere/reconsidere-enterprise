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
  page: number;
  isBlocked = true;
  types = Object.values(Fixed.Type);
  isHidden;
  expanse;


  constructor(private authService: AuthService, private fixedCostService: FixedCostManagementService, private toastr: ToastrService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.isHidden = true;
  }

  close() {
    this.isHidden = true;
  }

  loadFixedCosts(item) {
    if (item !== undefined) {
      this.expanse = item;
      if (item.fixed === undefined || item.fixed.length <= 0) {
        this.newItem();
      } else {
        this.expanse.fixed = item.fixed;
        this.isHidden = false;
      }
    }
    return this.expanse.fixed;
  }


  newItem() {
    if (this.expanse.fixed === undefined) {
      this.expanse.fixed = [{
         type: undefined, description: undefined, name: undefined, active: true, cost: 0.0, date: new Date()
      }
      ];
    } else {
      this.expanse.fixed.push({
         type: undefined, description: undefined, name: undefined, active: true, cost: 0.0, date: new Date()
      });
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
      if (item.type === undefined || item.type === '') {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
    });
  }
}
