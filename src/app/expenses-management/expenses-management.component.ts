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
    if (!this.isExpandFixed) {
      this.isExpandFixed = true;
      this.expenses[0].fixed = this.fixed.loadFixedCosts(this.expenses, this.dateMonth);
    } else {
      this.isExpandFixed = false;
      this.fixed.close();
    }
  }

  openInconstant() {
    if (!this.isExpandInconstant) {
      this.isExpandInconstant = true;
      this.expenses[0].inconstant = this.inconstant.loadInconstantCosts(this.expenses, this.dateMonth);
    } else {
      this.isExpandInconstant = false;
      this.inconstant.close();
    }
  }

  loadExpanses(item) {
    if (item === null || item === undefined || item._id === undefined) {
      this.existMonth = false;
      this.expenses = [];
      this.isExpandFixed = false;
      this.isExpandInconstant = false;
      this.showButtonAdd = true;
      this.fixed.clean();
      this.inconstant.clean();
      return;
    }
    this.expenses = [item];
    this.existMonth = true;
    this.showButtonAdd = false;
  }


  newItem() {
    this.expenses = [{ date: new Date(), fixed: [], inconstant: [], uncertain: [] }];
    this.existMonth = true;
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


    if (this.expenses[0].fixed !== undefined) {
      this.fixed.veryfyBeforeSave(this.expenses[0].fixed);
    }
  }


  save() {
    try {
      this.
        veryfyBeforeSave();
      this.expansesService.createOrUpdate(this.organizationId, this.expenses);
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
