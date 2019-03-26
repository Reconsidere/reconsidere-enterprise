import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services';
import { ToastrService } from 'ngx-toastr';
import * as messageCode from 'message.code.json';
import { EntriesManagementService } from 'src/services/entries-management.service';
import { Entries } from 'src/models/entries';

@Component({
  selector: 'app-incoming-out-management',
  templateUrl: './incoming-out-management.component.html',
  styleUrls: ['./incoming-out-management.component.scss']
})
export class EntriesManagementComponent implements OnInit {

  organizationId: string;
  page: number;
  entrieItems: any[];
  entries: Entries;

  constructor(private authService: AuthService, private toastr: ToastrService, private incomingOutService: EntriesManagementService) { }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
  }

  setId(id) {
    this.organizationId = id;
    if (id !== undefined) {
      this.incomingOutService.getEntries(this.organizationId).subscribe(items => this.loadAll(items), error => error);
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

  changeType(selected, oldValue, item) {
    if (selected === oldValue) {
      return;
    }
    if (oldValue === Entries.Type.Input) {
      this.changeClass(item, selected, Entries.types.purchase);
      return;
    }
    if (oldValue === Entries.Type.Output) {
      this.changeClass(item, selected, Entries.types.sale);
      return;
    }
  }

  private changeClass(item: any, selected: any, type: any) {
    let isChanged = false;
    let isRemoved = false;
    this.entrieItems.forEach((element, index) => {
      if (element._id !== undefined && element._id !== '' && !isChanged) {
        this.entries[type].forEach((obj, i) => {
          if (item._id === obj._id) {
            this.entries[type].splice(i, 1);
            isRemoved = true;
          }
        });
        if (isRemoved) {
          item.typeMaterial = selected;
          this.entries[type][index] = item;
          isChanged = true;
          isRemoved = false;
        }
      }
    });
  }

}
