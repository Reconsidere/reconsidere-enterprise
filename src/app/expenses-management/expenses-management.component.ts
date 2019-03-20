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
  isExpand;


  @ViewChild('myComponentFixed') fixed: any;
  constructor(private authService: AuthService, private toastr: ToastrService, private expansesService: ExpensesManagementService, private datePipe: DatePipe) {
  }

  ngOnInit() {
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
      return;
    }
  }


  openFixed() {
    if (!this.isExpand) {
      this.isExpand = true;
      this.expenses[0].fixed = this.fixed.loadFixedCosts(this.expenses);
    } else {
      this.isExpand = false;
      this.fixed.close();
    }
  }

  loadExpanses(item) {
    if (item === undefined || item._id === undefined) {
      this.existMonth = false;
      return;
    }
    this.expenses = item;
    this.existMonth = true;
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
