import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services';
import { ToastrService } from 'ngx-toastr';
import * as messageCode from 'message.code.json';
import { IncomingOutManagementService } from 'src/services/incoming-out-management.service';

@Component({
  selector: 'app-incoming-out-management',
  templateUrl: './incoming-out-management.component.html',
  styleUrls: ['./incoming-out-management.component.scss']
})
export class IncomingOutManagementComponent implements OnInit {

  organizationId: string;
  page: number;

  constructor(private authService: AuthService, private toastr: ToastrService, private incomingOutService: IncomingOutManagementService) { }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
  }

  setId(id) {
    this.organizationId = id;
    if (id !== undefined) {
      this.incomingOutService.getIncomingOut(this.organizationId).subscribe(items => this.loadAll(items), error => error);
    } else {
      this.toastr.warning(messageCode['WARNNING']['WRE013']['summary']);
      return;
    }
  }


  loadAll(items) {
    if (items === undefined || items.length <= 0) {
      this.toastr.warning(messageCode['WARNNING']['WRE013']['summary']);
    }
  }

}
