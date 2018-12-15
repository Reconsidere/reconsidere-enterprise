import { Organization } from './../../../models/organization';
import { Vehicle } from './../../../models/vehicle';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { Observable } from 'rxjs';

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

  ngOnInit() {
    this.authService.get().subscribe(x => this.loadVehicles(x));
  }
  loadVehicles(value) {
    for (let items of value) {
      for (let item of items.vehicles) {
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
      //TODO[vinicius]: a organização ja deve vir após o login
      //assim não haverá risco de cruzar dados de usuários
      //Pela regra teremos um modelo de organização e vamos apenas inserindo ou atualizando dados dentro dela
      // e fazendo o update da mesma para guardar estas informações.
      //usando esta organização ja cadastrada para teste de update
      //caso  já exista id do veiculo é um update.

      //ATENCAO simulando organização ja cadastrada alterar isso aqui
      const organization = new Organization();
      organization._id = '5c1508b8149b411e5c7654fd';
      organization.email = 'vinicius@teste.com';
      organization.company = 'empresa a';
      organization.tradingName = 'empresa a fantasia ltda';
      organization.password = '1234567';
      organization.cnpj = '27835753000173';
      organization.phone = 4932222222.0;
      organization.cellPhone = 49999766955.0;
      organization.classification = 'Empresa Privada';
      organization.vehicles = [this.vehicle];

      //organization.vehicles = [this.vehicle];
      if (this.vehicle._id === undefined || this.vehicle._id === '') {
        this.authService.add(organization);
      } else {
        this.authService.update(organization._id, organization);
      }
      this.showForm = false;
      this.msgStatus = 'Dados salvos com sucesso';
    } catch (error) {
      this.msgStatus = 'Erro ao salvar!';
      console.log(error);
    }
  }
}
