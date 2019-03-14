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
  organizationId: string;
  page: number;
  isBlocked = true;
  fixedCosts: any[];
  typeProcessing: [];
  processChain: any[];

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
      this.isBlocked = false;
      return;
    }
    this.processChain = items;
    this.typeProcessing = items;
    items.forEach(processingChain => {
      processingChain.fixedCost.forEach(fixedCost => {
        let obj = {
          _id: fixedCost._id,
          name: fixedCost.name,
          active: fixedCost.active,
          price: fixedCost.price,
          processingType: processingChain,
          date: fixedCost.date,
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
        _id: undefined, processingType: '', name: undefined, active: true, price: [0.0], date: [undefined]
      }
      ];
    } else {
      this.fixedCosts.push({
        _id: undefined, processingType: '', name: undefined, active: true, price: [0.0], date: [undefined]
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
      item.price = '';
      return;
    }
    if (item._id === undefined) {
      item.price = [number];
      item.date = [new Date()];
      return;
    }
    item.price = [oldValue];
    item.price.push(number);
    item.date.push(new Date());
  }

  private changeTypeProcessing(selected, oldValue, item) {
    let isRemoved = false;
    this.fixedCosts.forEach((element, index) => {
      if (element._id !== undefined && element._id !== '') {
        this.processChain.forEach((obj, i) => {
          obj.fixedCost.forEach((cost, remove) => {
            if (item._id === cost._id) {
              obj.fixedCost.splice(remove, 1);
              isRemoved = true;
            } else {
            }
          });
        });
      }
    });
  }

  addToItemsFixedCost() {
    this.fixedCosts.forEach(fixedCost => {
      let isAdd = false;
      if (this.processChain !== undefined) {
        this.processChain.forEach((processChain, index) => {
          if (fixedCost.processingType === processChain) {
            let obj = {
              _id: fixedCost._id,
              name: fixedCost.name,
              active: fixedCost.active,
              price: fixedCost.price,
              date: fixedCost.date,
            };
            processChain.fixedCost.forEach((ProcessChainFixedCost, index) => {
              if (fixedCost._id === ProcessChainFixedCost._id) {
                processChain.fixedCost[index] = obj;
                isAdd = true;
              }
            });
            if (!isAdd) {
              if (processChain.fixedCost === undefined || processChain.fixedCost.length <= 0) {
                processChain.fixedCost = [obj];
              } else {
                processChain.fixedCost.push(obj);
              }
              isAdd = false;
            }
          }
        });
      }
    });
  }


  veryfyBeforeSave() {
    if (this.fixedCosts === undefined || this.fixedCosts.length <= 0) {
      this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
      throw new Error();
    }
    this.fixedCosts.forEach(item => {
      if (item.name === undefined) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if ((item.price === undefined || item.price.length <= 0)) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if ((item.price[item.price.length - 1] <= 0)) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if ((item.date === undefined || item.date.length <= 0)) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if ((item.date[item.date.length - 1] === undefined || item.date[item.date.length - 1] === '')) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
    });
  }


  save() {
    try {
      this.veryfyBeforeSave();
      this.addToItemsFixedCost();
      this.fixedCostService.createOrUpdate(this.organizationId, this.processChain);
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
