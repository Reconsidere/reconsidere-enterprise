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
  organizationId: string;

  vehicles: Vehicle[];
  typesFuel = Object.values(Vehicle.Fuel);

  constructor(
    private vehicleService: VehicleManagementService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.page = 1;
    //this.authService.isAuthenticated();
    this.getVehicles();
  }

  private getVehicles() {
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
  }

  setId(id) {
    if (id !== undefined) {
      this.organizationId = id;
      this.vehicleService
        .loadAll(id)
        .subscribe(route => this.loadRoutes(route));
    } else {
      this.newVehicle();
    }
  }

  loadRoutes(vehicles) {
    if (vehicles !== undefined) {
      this.vehicles = vehicles;
    } else {
      this.newVehicle();
    }
  }

  newVehicle() {
    const vehicle = new Vehicle();
    vehicle.active = true;
    if (this.vehicles === undefined) {
      this.vehicles = [vehicle];
    } else {
      this.vehicles.push(vehicle);
    }
  }

  remove(vehicle) {
    try {
      if(vehicle._id !== undefined){
        this.vehicleService.remove(this.organizationId,vehicle._id);
      }
      this.message = 'Dados salvos com sucesso';

      this.vehicles.forEach((item,index) => {
        if(item === vehicle){
          this.vehicles.splice(index, 1);
        }
      });
    } catch (error) {
      this.message = error;
      console.log(error);
    }
  }

  closeMessage() {
    this.message = undefined;
  }

  verifyPlate(vehicle, e) {
    if (e.target.value === undefined || e.target.value === '') {
      this.requiredCheck(e);
      return;
    }

    this.message = undefined;

    try {
      this.verify(vehicle);
    } catch (error) {
      this.message = error;
    }
  }

  private verify(vehicle: any) {
    this.vehicles.forEach(item => {
      if (vehicle !== item) {
        if (item.carPlate === vehicle.carPlate) {
          throw new Error('Está placa já está em uso!');
        }
      }
    });
  }

  enableDisbale(item, e) {
    item.active = e.checked;
  }

  save(vehicle) {
    try {
      this.verify(vehicle);
      this.veryfyBeforeSave(vehicle);
      this.vehicleService.createOrUpdate(this.organizationId, vehicle);
      this.message = 'Dados salvos com sucesso';
    } catch (error) {
      this.message = error;
      console.log(error);
    }
  }

  requiredCheck(e) {
    if (e.target.value === undefined || e.target.value === '') {
      e.target.classList.add('is-invalid');
    } else {
      e.target.classList.remove('is-invalid');
    }
  }

  veryfyBeforeSave(vehicle) {
    if (
      !vehicle.carPlate ||
      !vehicle.weightCapacity ||
      !vehicle.emptyVehicleWeight ||
      !vehicle.typeFuel
    ) {
      throw new Error(
        'Por favor, preencha os campos antes de salvar os dados!'
      );
    }
  }
}
