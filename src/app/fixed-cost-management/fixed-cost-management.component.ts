import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services';
import { FixedCostManagementService } from '../../services/fixed-cost-management.service';
import { ProcessingChain } from 'src/models/processingchain';
import * as messageCode from 'message.code.json';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

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
  processingChain: ProcessingChain;
  organizationId: string;
  page: number;
  isBlocked = true;
  fixedCosts: any[];
  typeProcessing: [];

  constructor(private authService: AuthService, private fixedCostService: FixedCostManagementService, private toastr: ToastrService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
  }

  setId(id) {
    this.organizationId = id;
    if (id !== undefined) {
      this.fixedCostService.getProcessingChain(this.organizationId).subscribe(items => this.loadFixedCosts(items), error => error);
    } else {
      this.toastr.warning(messageCode['WARNNING']['WRE012']['summary']);
      this.isBlocked = false;
      return;
    }
  }

  loadFixedCosts(items) {
    if (items === undefined || items.length <= 0) {
      this.toastr.warning(messageCode['WARNNING']['WRE012']['summary']);
      return;
    }
    this.typeProcessing = items;
    items.forEach(processingChain => {
      processingChain.fixedCost.forEach(fixedCost => {
        let obj = {
          _id: fixedCost._id,
          name: fixedCost.name,
          active: fixedCost.active,
          price: fixedCost.price[fixedCost.price.length - 1],
          processingType: processingChain,
          date: this.datePipe.transform(fixedCost.date[fixedCost.date.length - 1], this.DATEFORMAT),
        };
        if (this.fixedCosts === undefined || this.fixedCosts.length <= 0) {
          this.fixedCosts = [obj];
        } else {
          this.fixedCosts.push(obj);
        }
      });
    });
  }

  newItem() {
    if (this.fixedCosts === undefined) {
      this.fixedCosts = [{
        _id: undefined, processingType: '', name: undefined, active: true, price: 0, date: undefined
      }
      ];
    } else {
      this.fixedCosts.push({
        _id: undefined, processingType: '', name: undefined,active: true, price: 0, date: undefined
      });
    }
  }

  changePrice(oldValue, value, item, e) {
    if (oldValue === value) {
      return;
    }
    let number = value.replace(this.REGEX, '');
    number = Number(number.replace(this.COMMA, this.DOT)).toFixed(2);
    if (number === this.NOTNUMBER) {
      item.price[item.price.length - 1] = '';
      return;
    }
    if (item._id === undefined) {
      item.price = number;
      item.date = new Date();
      return;
    }
    item.price[item.price.length - 1] = oldValue;
    item.price.push(number);
    item.date.push(new Date());
  }

  changeTypeProcessing(selected, oldValue, item) {
     this.fixedCosts.forEach(fixedCost => {
       if(fixedCost === item){

       }
     });
  }

}
