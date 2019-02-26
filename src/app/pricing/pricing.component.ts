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
  materials: any[];
  organizationId: string;
  page: number;
  message: string;
  show = false;
  hierarchy: Hierarchy;
  isBlocked = true;


  constructor(private authService: AuthService, private pricingService: PricingService) {
    this.hierarchy = new Hierarchy();
  }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
  }

  setId(id) {
    this.organizationId = id;
    if (id !== undefined) {
      this.pricingService.getHierarchy(this.organizationId).subscribe(items => this.loadMaterials(items), error => error);
    } else {
      this.message =
        'Por favor, para utilizar este recurso primeiro, vá ate a tela de Materiais e cadastre-os';
      this.isBlocked = false;
      return;
    }
  }

  loadMaterials(items) {
    if (items.solid.materials[Hierarchy.types.glass].items.length <= 0
      && items.solid.materials[Hierarchy.types.isopor].items.length <= 0
      && items.solid.materials[Hierarchy.types.metal].items.length <= 0
      && items.solid.materials[Hierarchy.types.paper].items.length <= 0
      && items.solid.materials[Hierarchy.types.plastic].items.length <= 0
      && items.solid.materials[Hierarchy.types.tetrapack].items.length <= 0) {
      this.message =
        'Por favor, para utilizar este recurso primeiro, vá ate a tela de Materiais e cadastre-os';
      this.isBlocked = false;
      return;
    } else {
      this.hierarchy = items;
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
        if (items.solid.materials[type].items.length > 0) {
          this.materials = items.solid.materials[type].items;
        }
      } else {
        if (items.solid.materials[type].items.length > 0) {
          items.solid.materials[type].items.forEach((item, index) => {
            this.materials.push(item);
          });
        }
      }
    }
  }

  calculatePrice(item) {
    if (item.pricing !== undefined && item.pricing.unitPrice.length > 0) {
      if (item.pricing.unitPrice[item.pricing.unitPrice.length - 1] > 0 && item.pricing.weight > 0) {
        item.pricing.price = item.pricing.weight * item.pricing.unitPrice[item.pricing.unitPrice.length - 1];
      }
    }
  }

  remove(item) {

  }

  veryfyBeforeSave() {
    if (this.materials === undefined || this.materials.length <= 0) {
      throw new Error(
        'Por favor, preencha os campos antes de salvar os dados!'
      );
    }
    this.materials.forEach(item => {
      if ((item.pricing === undefined || item.pricing.unitPrice.length <= 0)) {
        throw new Error(
          'Por favor, preencha os campos antes de salvar os dados!'
        );
      }
      if (item.pricing.unitPrice[item.pricing.unitPrice.length - 1] <= 0 && item.pricing.weight <= 0) {
        throw new Error(
          'Por favor, preencha os campos antes de salvar os dados!'
        );
      }
      if (item.pricing.unitPrice <= 0 || item.pricing.date === undefined) {
        throw new Error(
          'Por favor, preencha os campos antes de salvar os dados!!'
        );
      }
    });

  }

  private addToMaterial(itemMaterial) {
    if (itemMaterial.typeMaterial === Hierarchy.Material.Glass) {
      this.insertValues(itemMaterial, Hierarchy.types.glass);
    } else if (itemMaterial.typeMaterial === Hierarchy.Material.Isopor) {
      this.insertValues(itemMaterial, Hierarchy.types.isopor);
    } else if (itemMaterial.typeMaterial === Hierarchy.Material.Metal) {
      this.insertValues(itemMaterial, Hierarchy.types.metal);
    } else if (itemMaterial.typeMaterial === Hierarchy.Material.Paper) {
      this.insertValues(itemMaterial, Hierarchy.types.paper);
    } else if (itemMaterial.typeMaterial === Hierarchy.Material.Plastic) {
      this.insertValues(itemMaterial, Hierarchy.types.plastic);
    } else if (itemMaterial.typeMaterial === Hierarchy.Material.Tetrapack) {
      this.insertValues(itemMaterial, Hierarchy.types.tetrapack);
    }
  }

  private insertValues(itemMaterial: any, type: string) {
    let isAdd = false;
    if (this.hierarchy.solid.materials[type].items !== undefined) {
      this.hierarchy.solid.materials[type].items.forEach((item, index) => {
        if (item._id === itemMaterial._id) {
          let obj = {
            _id: itemMaterial._id,
            name: itemMaterial.name,
            active: itemMaterial.active,
            pricing: itemMaterial.pricing
          };
          this.hierarchy.solid.materials[type].items[index] = obj;
          isAdd = true;
        }
      });
      if (!isAdd) {
        let obj = {
          _id: itemMaterial._id,
          name: itemMaterial.name,
          active: itemMaterial.active,
          pricing: itemMaterial.pricing
        };
        this.hierarchy.solid.materials[type].items.push(obj);
      }
    }
  }

  save() {
    try {
      this.veryfyBeforeSave();
      this.addToMaterial(this.materials);
      this.pricingService.createOrUpdate(this.organizationId, this.hierarchy);
      this.message = 'Dados salvos com sucesso';
    } catch (error) {
      this.message = error;
      console.log(error);
    }
  }
}

