import { Component, OnInit } from '@angular/core';
import { PricingService } from 'src/services/pricing.service';
import { AuthService } from 'src/services';
import { Hierarchy } from 'src/models/material';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  materials: [];
  organizationId: string;
  page: number;
  message: string;
  show = false;


  constructor(private authService: AuthService, private valuationService: PricingService) { }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
  }

  setId(id) {
    this.organizationId = id;
    if (id !== undefined) {
      this.valuationService.getHierarchy(this.organizationId).subscribe(items => this.loadMaterials(items), error => error);
    }
  }

  loadMaterials(items) {
    if (items !== undefined) {
      this.setItems(items, Hierarchy.types.glass);
      this.setItems(items, Hierarchy.types.plastic);
      this.setItems(items, Hierarchy.types.paper);
      this.setItems(items, Hierarchy.types.metal);
      this.setItems(items, Hierarchy.types.tetrapack);
      this.setItems(items, Hierarchy.types.isopor);
    }
  }


  private setItems(items: any, type: any) {
    if (items.solid.materials[type].items !== undefined || items.solid.materials[type].items.length > 0) {
      if (this.materials === undefined) {
        this.materials = items.solid.materials[type].items;
      } else {
        this.materials.push.apply(items.solid.materials[type].items);
      }
    }
  }
}
