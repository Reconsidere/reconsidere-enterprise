import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services';
import { ToastrService } from 'ngx-toastr';
import * as messageCode from 'message.code.json';
import { ExpensesManagementService } from 'src/services/expenses-management.service';


@Component({
  selector: 'app-expenses-management',
  templateUrl: './expenses-management.component.html',
  styleUrls: ['./expenses-management.component.scss']
})
export class ExpensesManagementComponent implements OnInit {
  organizationId: string;
  page: number;
  typeProcessing: [];
  processChain: any[];
  expanses: any[];
  isBlocked = true;
  typeExpanse: [];


  constructor(private authService: AuthService, private toastr: ToastrService, private expansesService: ExpensesManagementService) { }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
  }

  setId(id) {
    this.organizationId = id;
    if (id !== undefined) {
      this.expansesService.getProcessingChain(this.organizationId).subscribe(items => this.loadExpanses(items), error => error);
    } else {
      this.toastr.warning(messageCode['WARNNING']['WRE012']['summary']);
      this.isBlocked = false;
      return;
    }
  }

  loadExpanses(items) {
    if (items === undefined || items.length <= 0) {
      this.toastr.warning(messageCode['WARNNING']['WRE012']['summary']);
      this.isBlocked = false;
      return;
    }
    this.processChain = items;
    this.typeProcessing = items;
    items.forEach(processingChain => {
      processingChain.expanses.forEach(expanse => {
        let obj = {
          _id: expanse._id,
          name: expanse.name,
          active: expanse.active,
          price: expanse.price,
          processingType: processingChain,
          date: expanse.date,
          type: expanse.type,
          description: expanse.description
        };
        if (this.expanses === undefined || this.expanses.length <= 0) {
          this.expanses = [obj];
        } else {
          this.expanses.push(obj);
        }
      });
    });
  }

  newItem() {
    if (this.expanses === undefined) {
      this.expanses = [{ _id: undefined, type: undefined, processingType: '', name: undefined, active: true, price: 0.0, date: new Date(), description: undefined }];
    } else {
      this.expanses.push({ _id: undefined, type: undefined, processingType: '', name: undefined, active: true, price: 0.0, date: new Date(), description: undefined });
    }
  }


  veryfyBeforeSave() {
    if (this.expanses === undefined || this.expanses.length <= 0) {
      this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
      throw new Error();
    }
    this.expanses.forEach(item => {
      if (item.name === undefined) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.price === undefined || item.price <= 0) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.description === undefined) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.date === undefined) {
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
