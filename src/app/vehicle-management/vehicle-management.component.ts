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
  
  page: number;
  message: string;
  show = false;
  
  vehicle: any;
  vehicles: Observable<Vehicle[]>;
  typesFuel = Object.values(Vehicle.Fuel);
  
  organizationMock: Organization;

  userProfile: {
    organizationId: '5c2e3736014dc837908f24c4';
  }

  constructor(private service: VehicleManagementService) {
    this.vehicle = new Vehicle();
    this.show = true;
  }
  
  ngOnInit() {
    this.page = 1;
    this.vehicles = this.service.loadAll(this.userProfile.organizationId);
  }

  clean() {
    this.vehicle = new Vehicle();
  }

  closeMessage() {
    this.message = undefined;
  }

  edit(vehicle: any) {
    this.vehicle = vehicle;
    this.show = true;
  }

  save() {
    try {
      this.veryfyBeforeSave()
      this.service.createOrUpdate(this.organizationMock._id, this.vehicle);
      this.show = false;
      this.message = 'Dados salvos com sucesso';
    } catch (error) {
      this.message = error;
      console.log(error);
    }
  }

  veryfyBeforeSave() {
    if (!this.vehicle.carPlate || !this.vehicle.weightCapacity  
        || !this.vehicle.emptyVehicleWeight  || !this.vehicle.typeFuel
    ) {
      throw new Error('Por favor, preencha os campos antes de salvar os dados!');
    }
  }

}