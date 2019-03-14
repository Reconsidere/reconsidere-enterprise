import { Component, OnInit } from '@angular/core';
import { ProcessingChain } from 'src/models/processingchain';
import { ProcessingChainManagementService } from 'src/services/processing-chain-management.service';
import { AuthService } from 'src/services';
import { ToastrService } from 'ngx-toastr';
import * as messageCode from 'message.code.json';
import { FixedCost } from 'src/models/fixedcost';

@Component({
  selector: 'app-processing-chain-management',
  templateUrl: './processing-chain-management.component.html',
  styleUrls: ['./processing-chain-management.component.scss']

})
export class ProcessingChainManagementComponent implements OnInit {

  organizationId: string;
  page: number;
  processChain: ProcessingChain[];

  constructor(private toastr: ToastrService, private authService: AuthService, private processingChainService: ProcessingChainManagementService) { }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
  }

  setId(id) {
    this.organizationId = id;
    if (id !== undefined) {
      this.processingChainService.getProcessingChain(this.organizationId).subscribe(items => this.loadProcessingChain(items), error => error);
    } else {
      this.toastr.warning(messageCode['WARNNING']['WRE013']['summary']);
      return;
    }
  }

  loadProcessingChain(items) {
    if (items !== undefined && items) {
      this.processChain = items;
    } else {
      this.toastr.warning(messageCode['WARNNING']['WRE013']['summary']);
    }
  }


  newItem() {
    if (this.processChain === undefined) {
      this.processChain = [{ _id: undefined, name: '', description: '', active: true, date: new Date(), fixedCost: [], hierarchy: [] }];
    } else {
      this.processChain.push({ _id: undefined, name: '', description: '', active: true, date: new Date(), fixedCost: [], hierarchy: [] });
    }
  }

  veryfyBeforeSave() {
    if (this.processChain === undefined || this.processChain.length <= 0) {
      this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
      throw new Error();
    }
    this.processChain.forEach(item => {
      if (item.name === undefined || item.name === '') {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.description === undefined || item.description === '') {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.date === undefined) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.date === undefined) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
    });
  }

  save() {
    try {
      this.veryfyBeforeSave();
      this.processingChainService.createOrUpdate(this.organizationId, this.processChain);
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
