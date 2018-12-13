import { Organization } from './../../../models/organization';
import { Vehicle } from './../../../models/vehicle';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-vehicle-management',
  templateUrl: './vehicle-management.component.html',
  styleUrls: ['./vehicle-management.component.scss']
})
export class VehicleManagementComponent implements OnInit {
  carPlate: string;
  weightCapacity: number;
  emptyVehicleWeight: number;
  active: boolean;
  fuel: number;
  typeFuel: string;
  availabilityForOperation: boolean;
  typesFuel: string[];
  msgStatus: string;
  showMessage: boolean;
  vehicle: Vehicle;
  vehicles: Vehicle[];

  constructor(private authService: AuthService) {
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
  }

  ngOnInit() {}

  closeAlertMessage() {
    this.showMessage = false;
  }

  loadVehicles() {}

  veryfyBeforeSave() {
    if (
      this.carPlate === undefined ||
      this.weightCapacity === undefined ||
      this.emptyVehicleWeight === undefined ||
      this.typeFuel === undefined
    ) {
      this.msgStatus =
        'Por favor, preencha os campos antes de salvar os dados!';
      return false;
    } else {
      return true;
    }
  }

  loadValuesForEdit() {

  }


  save() {
    this.showMessage = true;
    if (!this.veryfyBeforeSave()) {
      return;
    }
    try {
    //modificar esta forma de cadastrar a empresa,trazer uma existente
    //para manter vinculo e não cruzar dados
      const organization = new Organization();
      this.vehicle.active = this.active;
      this.vehicle.carPlate = this.carPlate;
      this.vehicle.weightCapacity = Number(this.weightCapacity);
      this.vehicle.emptyVehicleWeight = Number(this.emptyVehicleWeight);
      this.vehicle.fuel = this.fuel;
      this.vehicle.typeFuel = this.typeFuel;
      organization.vehicles = [this.vehicle];
      this.authService.add(organization);
      this.msgStatus = 'Dados salvos com sucesso';
    } catch (error) {
      this.msgStatus = 'Erro ao salvar!';
      console.log(error);
    }
  }
}
