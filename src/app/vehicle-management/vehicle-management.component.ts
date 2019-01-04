import { Organization } from '../../models/organization';
import { Vehicle } from '../../models/vehicle';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { Observable } from 'rxjs';
import { VehicleManagementService } from 'src/services/vehicle-management.service';

@Component({
  selector: 'app-vehicle-management',
  templateUrl: './vehicle-management.component.html',
  styleUrls: ['./vehicle-management.component.scss']
})
export class VehicleManagementComponent implements OnInit {
  typesFuel: string[];
  msgStatus: string;
  showMessage: boolean;
  vehicle: Vehicle;
  vehicles: Vehicle[] = [];
  p = 1;
  showForm = false;
  organizationMock: Organization;

  constructor(private service: VehicleManagementService) {
    this.typesFuel = [
      '',
      'Gasolina Comum',
      'Gasolina Aditivada',
      'Gasolina Premium',
      'Etanol',
      'Diesel',
      'Gás'
    ];
    this.vehicle = new Vehicle();

    /*ATENCAO simulando organização ja cadastrada alterar isso aqui*/
    this.organizationMock = new Organization();
    this.organizationMock._id = '5c2e3736014dc837908f24c4';
    /*---------------------------------------------------*/
  }

  ngOnInit() {
    this.service
      .get(this.organizationMock._id)
      .subscribe(x => this.loadVehicles(x));
  }
  loadVehicles(value) {
    for (const items of value) {
      for (const item of items.vehicles) {
        this.vehicles.push(item);
      }
    }
  }

  openForm() {
    if (this.showForm) {
      this.showForm = false;
      this.clean();
    } else {
      this.showForm = true;
    }
  }
  clean() {
    this.vehicle.carPlate = undefined;
    this.vehicle.active = undefined;
    this.vehicle.emptyVehicleWeight = undefined;
    this.vehicle.fuel = undefined;
    this.vehicle.typeFuel = undefined;
    this.vehicle.weightCapacity = undefined;
    this.vehicle._id = undefined;
  }

  closeAlertMessage() {
    this.showMessage = false;
  }

  veryfyBeforeSave() {
    if (
      this.vehicle.carPlate === undefined ||
      this.vehicle.weightCapacity === undefined ||
      this.vehicle.emptyVehicleWeight === undefined ||
      this.vehicle.typeFuel === undefined
    ) {
      this.msgStatus =
        'Por favor, preencha os campos antes de salvar os dados!';
      return false;
    } else {
      return true;
    }
  }

  loadValuesForEdit(item) {
    this.vehicle.carPlate = item.carPlate;
    this.vehicle.active = item.active;
    this.vehicle.emptyVehicleWeight = item.emptyVehicleWeight;
    this.vehicle.fuel = item.fuel;
    this.vehicle.typeFuel = item.typeFuel;
    this.vehicle.weightCapacity = item.weightCapacity;
    this.vehicle._id = item._id;
    this.showForm = true;
  }
  save() {
    this.showMessage = true;
    if (!this.veryfyBeforeSave()) {
      return;
    }
    try {
      if (this.vehicle._id === undefined) {
        this.service.add(this.organizationMock._id, this.vehicle);
      } else {
        this.service.update(this.organizationMock._id, this.vehicle);
      }
      this.showForm = false;
      this.msgStatus = 'Dados salvos com sucesso';
    } catch (error) {
      this.msgStatus = 'Erro ao salvar!';
      console.log(error);
    }
  }
}
