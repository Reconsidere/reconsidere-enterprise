import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services';
import { ToastrService } from 'ngx-toastr';
import * as messageCode from 'message.code.json';
import { EntriesManagementService } from 'src/services/entries-management.service';
import { Entries } from 'src/models/entries';
import { MaterialManagementService } from 'src/services/material-management.service';
import { Hierarchy } from 'src/models/material';

@Component({
  selector: 'entries-management',
  templateUrl: './entries-management.component.html',
  styleUrls: ['./entries-management.component.scss']
})
export class EntriesManagementComponent implements OnInit {

  organizationId: string;
  page: number;
  entrieItems: any[];
  entries: any;
  types: any[];
  typeEntrie: any[];
  itemsMaterials: any[];
  isTypeMaterial;
  materialSelected;

  constructor(private authService: AuthService, private toastr: ToastrService, private incomingOutService: EntriesManagementService, private materialService: MaterialManagementService) { }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
    this.types = Object.values(Entries.Type);
    this.typeEntrie = Object.values(Entries.TypeEntrie);
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
    } else {
      this.newItem();
    }
  }

  newItem() {
    this.entrieItems = [{ _id: undefined, type: undefined, typeEntrie: undefined, cost: 0, name: undefined, date: new Date() }];
  }


  typeSelected(object) {
    if (object.typeEntrie === Entries.TypeEntrie.Material) {
      this.isTypeMaterial = true;
      this.materialService
        .getHierarchy(this.organizationId)
        .subscribe(item => this.loadMaterials(item), error => error);
    } else {
      this.isTypeMaterial = false;
      this.materialSelected = undefined;
    }
  }

  selectedMaterial(item) {
    if (item !== undefined && this.materialSelected !== undefined && this.materialSelected !== '') {
      item.name = this.materialSelected.name;
    } else {
      item.name = '';
    }
  }

  loadMaterials(item) {
    if (item !== undefined) {
      this.insertItems(Hierarchy.types.glass, Hierarchy.Material.Glass, item);
      this.insertItems(Hierarchy.types.isopor, Hierarchy.Material.Isopor, item);
      this.insertItems(Hierarchy.types.metal, Hierarchy.Material.Metal, item);
      this.insertItems(Hierarchy.types.paper, Hierarchy.Material.Paper, item);
      this.insertItems(Hierarchy.types.plastic, Hierarchy.Material.Plastic, item);
      this.insertItems(Hierarchy.types.tetrapack, Hierarchy.Material.Tetrapack, item);
      this.itemsMaterials.sort();
    }
  }
  insertItems(type: any, typeMaterial: any, list: Hierarchy) {
    if (list.solid.materials[type] !== undefined) {
      list.solid.materials[type].items.forEach(item => {
        if (this.itemsMaterials === undefined) {
          this.itemsMaterials = [
            {
              _id: item._id,
              typeMaterial: typeMaterial,
              name: item.name,
              active: item.active,
              pricing: item.pricing
            }
          ];
        } else {
          if (item.active) {
            this.itemsMaterials.push({
              _id: item._id,
              typeMaterial: typeMaterial,
              name: item.name,
              active: item.active,
              pricing: item.pricing
            });
          }
        }
      });
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
