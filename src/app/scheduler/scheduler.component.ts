import { VehicleManagementService } from 'src/services/vehicle-management.service';
import { AbstractControl } from '@angular/forms';
import { routes } from './../app.routing';
import {
  Component,
  OnInit,
  enableProdMode,
  NgModule,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';
import { SchedulerService } from 'src/services/scheduler.service';
import { UserService, AuthService } from 'src/services';
import { User } from 'src/models';
import { GeoRoute } from 'src/models/georoute';
import { Schedule } from 'src/models/schedule';
import { Turn } from 'src/models/turn';
import * as ptBr from 'date-fns/locale/pt';
import { Vehicle } from 'src/models/vehicle';
import { group } from '@angular/animations';
import { forEach } from '@angular/router/src/utils/collection';
import { TouchSequence } from 'selenium-webdriver';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  message: string;
  show = false;
  users: User[] = [];
  georoutes: [GeoRoute];
  page: number;
  organizationId: string;
  vehicles: Vehicle[];

  constructor(
    private schedulerServive: SchedulerService,
    private userService: UserService,
    private authService: AuthService,
    private vehicleService: VehicleManagementService,
    private datePipe: DatePipe
  ) {}

  trick() {
    return this.georoutes;
  }

  ngOnInit() {
    this.page = 1;
    this.loadValues();
  }

  private loadValues() {
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
  }

  setId(id) {
    this.organizationId = id;
    this.getGeoroutes();
    this.getVehicles();
  }

  getVehicles() {
    if (this.organizationId !== undefined) {
      this.vehicleService
        .loadAll(this.organizationId)
        .subscribe(vehicle => this.loadVehicles(vehicle));
    } else {
      this.vehicles = [];
    }
  }

  loadVehicles(vehicles) {
    if (vehicles !== undefined) {
      this.vehicles = vehicles;
    } else {
      this.vehicles = [];
    }
  }

  private getGeoroutes() {
    if (this.organizationId !== undefined) {
      this.schedulerServive
        .getAll(this.organizationId)
        .pipe()
        .subscribe(georoutes => {
          this.loadGeoroutes(georoutes);
        });
    } else {
      this.newRoute();
    }
  }

  loadGeoroutes(values) {
    // if (values === undefined) {
    //   this.newRoute();
    // } else {
    //   this.georoutes = values;
    // }
    this.newRoute();
  }

  newRoute() {
    const tomorrow = new Date();
    const vehicle = new Vehicle();
    vehicle._id = '123';
    vehicle.active = true;
    vehicle.carPlate = '1234-aaaa';
    const georout = new GeoRoute();
    georout.name = 'Nova rota';
    const scheduler = new Schedule();
    scheduler.startDate = new Date();
    scheduler.endDate = new Date(tomorrow.setDate(tomorrow.getDate() + 1));
    scheduler.startTime = new Date();
    scheduler.endTime = new Date();
    scheduler.vehicle = vehicle;
    if (georout.schedules === undefined || georout.schedules.length <= 0) {
      georout.schedules = [scheduler];
    } else {
      georout.schedules.push(scheduler);
    }

    const vehicle2 = new Vehicle();
    vehicle2._id = '123';
    vehicle2.active = true;
    vehicle2.carPlate = '1234-xxl';

    const tomorrow3 = new Date();
    const scheduler2 = new Schedule();
    scheduler2.startDate = new Date();
    scheduler2.endDate = new Date(tomorrow3.setDate(tomorrow3.getDate() + 1));
    scheduler2.startTime = new Date();
    scheduler2.endTime = new Date();
    scheduler2.vehicle = vehicle2;
    georout.schedules.push(scheduler2);

    const vehicle3 = new Vehicle();
    vehicle3._id = '1234';
    vehicle3.active = true;
    vehicle3.carPlate = '1234-xxl';

    const tomorrow2 = new Date();
    const tomorrow5 = new Date();
    const scheduler3 = new Schedule();
    scheduler3.startDate = new Date(tomorrow2.setDate(tomorrow2.getDate() + 1));
    scheduler3.endDate = new Date(tomorrow5.setDate(tomorrow5.getDate() + 1));
    scheduler3.startTime = new Date();
    scheduler3.endTime = new Date();
    scheduler3.vehicle = vehicle3;
    georout.schedules.push(scheduler3);

    if (this.georoutes === undefined || this.georoutes.length <= 0) {
      this.georoutes = [georout];
    } else {
      this.georoutes.push(georout);
    }

    this.georoutes.forEach(route => {
      let index = 0;
      const first = false;
      this.orderbyFieldVehicle('_id', route.schedules);
      route.schedules.forEach(schedule => {
        this.rowspanVehicle(
          schedule.vehicle._id,
          route.schedules,
          '_id',
          index,
          first
        );
        index++;
      });
    });

    this.georoutes.forEach(route => {
      let index = 0;
      const first = false;
      this.orderbyFieldDate('startDate', route.schedules);
      route.schedules.forEach(schedule => {
        this.rowspanDateStart(
          schedule.startDate,
          route.schedules,
          'startDate',
          index,
          first
        );
        index++;
      });
    });

    this.georoutes.forEach(route => {
      let index = 0;
      const first = false;
      this.orderbyFieldDate('endDate', route.schedules);
      route.schedules.forEach(schedule => {
        this.rowspanDateEnd(
          schedule.endDate,
          route.schedules,
          'endDate',
          index,
          first
        );
        index++;
      });
    });
  }

  rowspanVehicle(
    value: any,
    list: any[],
    nameField: any,
    index: any,
    first: any
  ): any {
    const count = list.filter(item => item.vehicle._id === value).length;

    const alreadyExist = list
      .filter(item => item.vehicle._id === value)
      .find(x => x.showVehicle === true);
    if (alreadyExist !== undefined) {
      return;
    }

    list.forEach(element => {
      if (element.vehicle[nameField] === value) {
        if (!first) {
          list[index].rowsVehicle = count;
          list[index].showVehicle = true;
          first = true;
        }
      }
    });
  }

  rowspanDateStart(
    value: any,
    list: any[],
    nameField: any,
    index: any,
    first: any
  ): any {
    const count = list.filter(
      item =>
        this.datePipe.transform(item[nameField], 'dd/mm/yyyy') ===
        this.datePipe.transform(value, 'dd/mm/yyyy')
    ).length;

    const alreadyExist = list
      .filter(
        item =>
          this.datePipe.transform(item[nameField], 'dd/mm/yyyy') ===
          this.datePipe.transform(value, 'dd/mm/yyyy')
      )
      .find(x => x.showStartDate === true);
    if (alreadyExist !== undefined) {
      return;
    }

    list.forEach(element => {
      if (
        this.datePipe.transform(element[nameField], 'dd/mm/yyyy') ===
        this.datePipe.transform(value, 'dd/mm/yyyy')
      ) {
        if (!first) {
          list[index].rowsStartDate = count;
          list[index].showStartDate = true;
          first = true;
        }
      }
    });
  }

  rowspanDateEnd(
    value: any,
    list: any[],
    nameField: any,
    index: any,
    first: any
  ): any {
    const count = list.filter(
      item =>
        this.datePipe.transform(item[nameField], 'dd/mm/yyyy') ===
        this.datePipe.transform(value, 'dd/mm/yyyy')
    ).length;

    const alreadyExist = list
      .filter(
        item =>
          this.datePipe.transform(item[nameField], 'dd/mm/yyyy') ===
          this.datePipe.transform(value, 'dd/mm/yyyy')
      )
      .find(x => x.showEndDate === true);
    if (alreadyExist !== undefined) {
      return;
    }

    list.forEach(element => {
      if (
        this.datePipe.transform(element[nameField], 'dd/mm/yyyy') ===
        this.datePipe.transform(value, 'dd/mm/yyyy')
      ) {
        if (!first) {
          list[index].rowsEndDate = count;
          list[index].showEndDate = true;
          first = true;
        }
      }
    });
  }

  orderbyFieldDate(field: string, schedule: Schedule[]) {
    schedule.sort((a: any, b: any) => {
      if (
        this.datePipe.transform(a[field], 'dd/mm/yyyy') <
        this.datePipe.transform(b[field], 'dd/mm/yyyy')
      ) {
        return -1;
      } else if (
        this.datePipe.transform(a[field], 'dd/mm/yyyy') >
        this.datePipe.transform(b[field], 'dd/mm/yyyy')
      ) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  orderbyFieldVehicle(field: string, schedule: Schedule[]) {
    schedule.sort((a: any, b: any) => {
      if (a.vehicle[field] < b.vehicle[field]) {
        return -1;
      } else if (a.vehicle[field] > b.vehicle[field]) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  // filter(items, element, index) {
  //   if (!items || !element) {
  //     return;
  //   }

  //   const field = element.name;
  //   const value = element.value;

  //   if (!value && items.length <= 0) {
  //     items =  items;
  //     return;
  //   }
  //   if (value && items.length <= 0) {
  //     items =  items;
  //   }

  //   if (!field || !value) {
  //     return items;
  //   }

  //   if (field === 'carPlate') {
  //     this.georoutes[index].schedules = items.filter(singleItem =>
  //       singleItem.vehicle[field].toLowerCase().includes(value.toLowerCase())
  //     );

  //     return this.georoutes[index].schedules;
  //   }

  //   if (field === 'startDate' || field === 'endDate') {
  //     this.georoutes[index].schedules = items.filter(singleItem =>
  //       this.datePipe
  //         .transform(singleItem[field], 'dd/mm/yyyy')
  //         .toLowerCase()
  //         .includes(this.datePipe.transform(value, 'dd/mm/yyyy').toLowerCase())
  //     );
  //     return this.georoutes[index].schedules;
  //   }

  //   this.georoutes[index].schedules = items.filter(singleItem =>
  //     singleItem[field].toLowerCase().includes(value.toLowerCase())
  //   );

  //   return this.georoutes[index].schedules;
  // }

  newScheduler(): Schedule {
    const scheduler = new Schedule();
    return scheduler;
  }

  closeMessage() {
    this.message = undefined;
  }

  veryfyBeforeSave(route: GeoRoute) {
    if (route.name === undefined) {
      throw new Error(
        'Por favor, preencha os campos antes de salvar os dados!'
      );
    }
    if (route.schedules.length <= 0) {
      throw new Error(
        'Por favor, preencha os campos antes de salvar os dados!'
      );
    }
    route.schedules.forEach(schedule => {
      if (
        schedule.startDate === undefined ||
        schedule.endDate === undefined ||
        schedule.startTime === undefined ||
        schedule.endTime === undefined ||
        schedule.vehicle._id === undefined ||
        this.organizationId === undefined ||
        this.organizationId === ''
      ) {
        throw new Error(
          'Por favor, preencha os campos antes de salvar os dados!'
        );
      }
    });
  }

  addScheduler(route) {
    this.georoutes.forEach((items, index) => {
      if (items === route) {
        if (items.schedules !== undefined) {
          items.schedules.push(this.newScheduler());
        } else {
          items.schedules = [this.newScheduler()];
        }
      }
    });
    console.log(this.georoutes);
  }

  removeSchedule(schedule) {
    this.georoutes.forEach((items, index) => {
      items.schedules.forEach((item, i) => {
        if (item === schedule) {
          items.schedules.splice(i, 1);
        }
      });
    });
  }

  remove(route) {}

  expand(route) {
    route.expand = !route.expand;
  }

  save(route) {
    try {
      this.veryfyBeforeSave(route);
      this.schedulerServive.createOrUpdate(this.organizationId, route);
      this.message = 'Dados salvos com sucesso';
    } catch (error) {
      this.message = error;
      console.log(error);
    }
  }
}
