import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from 'src/services';
import { ToastrService } from 'ngx-toastr';
import * as messageCode from 'message.code.json';
import { ExpensesManagementService } from 'src/services/expenses-management.service';
import { FixedCostManagementComponent } from '../fixed-cost-management/fixed-cost-management.component';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-expenses-management',
  templateUrl: './expenses-management.component.html',
  styleUrls: ['./expenses-management.component.scss']
})
export class ExpensesManagementComponent implements OnInit {
  organizationId: string;
  page: number;
  expenses: any[];
  typeExpanse: [];
  existMonth;
  dateMonth: Date;
  isExpandFixed;
  isExpandInconstant;
  showButtonAdd;
  amountTotal;
  afterSave;


  @ViewChild('myComponentFixed') fixed: any;
  @ViewChild('myComponentInconstat') inconstant: any;
  constructor(private authService: AuthService, private toastr: ToastrService, private expansesService: ExpensesManagementService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.showButtonAdd = false;
    this.existMonth = false;
    this.dateMonth = new Date();
    this.page = 1;
    this.authService.isAuthenticated();
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
    this.amountTotal = 0.0;
  }

  setId(id) {
    this.organizationId = id;
    if (id !== undefined) {
      this.expansesService.getExpanses(this.organizationId, this.dateMonth).subscribe(items => this.loadExpanses(items), error => error);
    } else {
      this.toastr.warning(messageCode['WARNNING']['WRE013']['summary']);
      this.existMonth = false;
      this.showButtonAdd = true;
      return;
    }
  }

  changeDate() {
    this.expansesService.getExpanses(this.organizationId, this.dateMonth).subscribe(items => this.loadExpanses(items), error => error);
  }


  openFixed() {
    if (this.afterSave) {
      if (this.isExpandFixed) {
        this.isExpandFixed = true;
        this.expenses[0].fixed = this.fixed.loadFixedCosts(this.expenses, this.dateMonth);
        this.calculateTotalAmount();
      }
    } else if (!this.isExpandFixed) {
      this.isExpandFixed = true;
      this.expenses[0].fixed = this.fixed.loadFixedCosts(this.expenses, this.dateMonth);
      this.calculateTotalAmount();
    } else {
      this.isExpandFixed = false;
      this.fixed.close();
    }
  }

  openInconstant() {
    if (this.afterSave) {
      if (this.isExpandInconstant) {
        this.isExpandInconstant = true;
        this.expenses[0].inconstant = this.inconstant.loadInconstantCosts(this.expenses, this.dateMonth, this.organizationId);
        this.calculateTotalAmount();
      }
    }
    else if (!this.isExpandInconstant) {
      this.isExpandInconstant = true;
      this.expenses[0].inconstant = this.inconstant.loadInconstantCosts(this.expenses, this.dateMonth, this.organizationId);
      this.calculateTotalAmount();
    } else {
      this.isExpandInconstant = false;
      this.inconstant.close();
    }
  }

  loadExpanses(item) {
    if (item === null || item === undefined || item.length <= 0) {
      this.existMonth = false;
      this.expenses = [];
      this.isExpandFixed = false;
      this.isExpandInconstant = false;
      this.showButtonAdd = true;
      if (this.fixed !== undefined) {
        this.fixed.clean();
      }
      if (this.inconstant !== undefined) {
        this.inconstant.clean();
      }
      return;
    }
    this.expenses = undefined;
    this.expenses = [item];
    this.existMonth = true;
    this.showButtonAdd = false;
  }

  calculateTotalAmount() {
    this.amountTotal = 0.0;
    this.expenses[0].fixed.forEach(fixed => {
      this.amountTotal += fixed.cost;
    });
    this.expenses[0].inconstant.forEach(inconstant => {
      this.amountTotal += inconstant.cost;
    });
  }

  newItem() {
    this.expenses = [{ date: new Date(), fixed: [], inconstant: [], uncertain: [] }];
    this.existMonth = true;
    this.showButtonAdd = false;
    this.amountTotal = 0.0;
  }


  veryfyBeforeSave() {
    if (this.expenses[0] === undefined) {
      this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
      throw new Error();
    }

    if (this.expenses[0].date === undefined) {
      this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
      throw new Error();
    }


    if (this.expenses[0].fixed !== undefined && this.expenses[0].fixed.length > 0) {
      this.fixed.veryfyBeforeSave(this.expenses[0].fixed);
    }

    if (this.expenses[0].inconstant !== undefined && this.expenses[0].inconstant.length > 0) {
      this.inconstant.veryfyBeforeSave(this.expenses[0].inconstant);
    }
  }

  async save() {
    try {
      this.veryfyBeforeSave();
      await this.waitSave(1000);
      await this.reloadAfterSave(1000);
      this.afterSave = true;
      this.openFixed();
      this.openInconstant();
      this.afterSave = false;
    } catch (error) {
      try {
        this.toastr.error(messageCode['ERROR'][error]['summary']);
      } catch (e) {
        this.toastr.error(error.message);
      }

    }
  }

  waitSave(ms: number) {
    this.expansesService.createOrUpdate(this.organizationId, this.expenses);
    this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  reloadAfterSave(ms: number) {
    this.expansesService.getExpanses(this.organizationId, this.dateMonth).subscribe(items => this.loadExpanses(items), error => error);
    return new Promise(resolve => setTimeout(resolve, ms));

  }
}
