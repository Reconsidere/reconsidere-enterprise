import { Component, OnInit } from '@angular/core';
import { Hierarchy } from 'src/models/material';
import { AuthService } from 'src/services';
import { MaterialManagementService } from 'src/services/material-management.service';

@Component({
  selector: 'app-material-management',
  templateUrl: './material-management.component.html',
  styleUrls: ['./material-management.component.scss']
})
export class MaterialManagementComponent implements OnInit {

  hierarchy: Hierarchy;
  organizationId: string;
  page: number;
  message: string;
  show = false;
  typeMaterial: string;
  materialsType = [];
  itemsMaterials: any;

  constructor(private authService: AuthService, private materialService: MaterialManagementService) {
    this.hierarchy = new Hierarchy();
    this.materialsType = Object.values(Hierarchy.Material);
  }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
  }

  setId(id) {
    this.organizationId = id;
    if (id !== undefined) {
      this.materialService.getHierarchy(this.organizationId).subscribe(item => this.loadHierarchy(item), error => error);
    } else {
    }
  }

  private loadHierarchy(item) {
    if (item !== undefined && item.length > 0)
      this.hierarchy = item[0];
    this.createSimpleList(this.hierarchy);
  }
  createSimpleList(list: Hierarchy) {
    this.itemsMaterials.apply({ name: 'glass' }, list.solid.materials.glass);
    this.itemsMaterials.apply({ name: 'isopor' }, list.solid.materials.isopor);
    this.itemsMaterials.apply({ name: 'metal' }, list.solid.materials.metal);
    this.itemsMaterials.apply({ name: 'paper' }, list.solid.materials.paper);
    this.itemsMaterials.apply({ name: 'plastic' }, list.solid.materials.plastic);
    this.itemsMaterials.apply({ name: 'tetrapack' }, list.solid.materials.tetrapack);
  }


  newItem() {
  }

}
