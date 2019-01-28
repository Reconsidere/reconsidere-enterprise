import { VehicleManagementService } from 'src/services/vehicle-management.service';
import { AbstractControl } from '@angular/forms';
import { routes } from './../app.routing';
import {
  Component,
  OnInit,
  enableProdMode,
  NgModule,
  ViewChild
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
  groupList: any[];

  constructor(
    private schedulerServive: SchedulerService,
    private userService: UserService,
    private authService: AuthService,
    private vehicleService: VehicleManagementService
  ) {}
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
    vehicle2._id = '1234';
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
    vehicle3._id = '123';
    vehicle3.active = true;
    vehicle3.carPlate = '1234-xxl';

    const tomorrow2 = new Date();
    const tomorrow5 = new Date();
    const scheduler3 = new Schedule();
    scheduler3.startDate = new Date(tomorrow2.setDate(tomorrow2.getDate() + 1));
    scheduler3.endDate = new Date(tomorrow5.setDate(tomorrow5.getDate() + 2));
    scheduler3.startTime = new Date();
    scheduler3.endTime = new Date();
    scheduler3.vehicle = vehicle3;
    georout.schedules.push(scheduler3);

    if (this.georoutes === undefined || this.georoutes.length <= 0) {
      this.georoutes = [georout];
    } else {
      this.georoutes.push(georout);
    }

    this.groupBy();
  }

  groupBy() {
    this.georoutes.forEach(route => {
      this.orderbyFieldVehicle('_id', route.schedules);
      this.calculateVehicleRows(route.schedules);
      this.orderbyFieldDate('startDate', route.schedules);
      this.calculateStartDateRows(route.schedules);
      this.orderbyFieldDate('endDate', route.schedules);
      this.calculateEndDateRows(route.schedules);

      console.log(route.schedules);
    });

    // if (this.groupList === undefined || this.groupList.length <= 0) {
    //   this.groupList = route.schedules;
    // } else {
    //   this.groupList.push(route.schedules);
    // }
    // const helper = {};
    // if (this.groupList === undefined || this.groupList.length <= 0) {
    //   this.groupList = route.schedules.reduce(this.groupAll(helper), []);
    // } else {
    //   this.groupList.push(route.schedules.reduce(this.groupAll(helper), []));
    // }
  }


  orderbyFieldDate(field: string, schedule: Schedule[]) {
    schedule.sort((a: any, b: any) => {
      if (a[field].toDateString() < b[field].toDateString()) {
        return -1;
      } else if (a[field].toDateString() > b[field].toDateString()) {
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

  // private groupAll(helper: {}): (
  //   previousValue: any[],
  //   currentValue: Schedule,
  //   currentIndex: number,
  //   array: Schedule[]
  // ) => any[] {
  //   return function(r, o) {
  //     const key = o.vehicle._id + '-' + o.startDate + '-' + o.endDate;
  //     if (!helper[key]) {
  //       helper[key] = Object.assign({}, o);
  //       r.push(helper[key]);
  //     } else {
  //       helper[key].key += o.vehicle._id + o.startDate + o.endDate;
  //     }
  //     return r;
  //   };
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

  calculateStartDateRows(schedules: any[]) {
    let isPReviousShow = false;
    let x = 0;
    if (schedules.length > 0) {
      schedules[0].matchPreviousRowStartDate = false;
      for (let i = 0; i < schedules.length; i++) {
        let rows = 1;
        // if (isPReviousShow) {
        //   schedules[x].rowsStartDate = rows;
        //   x++;
        //   return;
        // }
        // rows = 1;
        const field = schedules[i].startDate.toDateString();
        for (let j = i + 1; j < schedules.length; j++) {
          if (
            isPReviousShow &&
            schedules[j].startDate.toDateString() !== field &&
            !schedules[j].matchPreviousRowStartDate
          ) {
            schedules[j].rowsStartDate = rows;
            schedules[j].matchPreviousRowStartDate = false;
          } else if (
            schedules[j].startDate.toDateString() === field &&
            !schedules[j].matchPreviousRowStartDate
          ) {
            rows++;
            schedules[j].matchPreviousRowStartDate = true;
            isPReviousShow = true;
          } else {
            schedules[j].matchPreviousRowStartDate = false;
            break;
          }
        }
        schedules[i].rowsStartDate = rows;
        x++;
      }
    }
  }

  calculateEndDateRows(schedules: any[]) {
    let x = 0;
    let isPReviousShow = false;
    if (schedules.length > 0) {
      schedules[0].matchPreviousRowEndDate = false;
      for (let i = 0; i < schedules.length; i++) {
        let rows = 1;
        //x++;
        // if (isPReviousShow) {
        //   schedules[x].rowsEndDate = rows;
        //   return;
        // }
        //rows = 1;
        const field = schedules[i].endDate.toDateString();
        for (let j = i + 1; j < schedules.length; j++) {
          if (
            isPReviousShow &&
            schedules[j].endDate.toDateString() !== field &&
            !schedules[j].matchPreviousRowEndDate
          ) {
            schedules[j].rowsEndDate = rows;
            schedules[j].matchPreviousRowEndDate = false;
          } else if (
            schedules[j].endDate.toDateString() === field &&
            !schedules[j].matchPreviousRowEndDate
          ) {
            rows++;
            schedules[j].matchPreviousRowEndDate = true;
            isPReviousShow = true;
          } else {
            schedules[j].matchPreviousRowEndDate = false;
            break;
          }
        }
        schedules[i].rowsEndDate = rows;
        x++;
      }
    }
  }

  calculateVehicleRows(schedules: any[]) {
    let isPReviousShow = false;
    let x = 0;
    if (schedules.length > 0) {
      schedules[0].matchPreviousRowVehicle = false;
      for (let i = 0; i < schedules.length; i++) {
        let rows = 1;
        // if (isPReviousShow) {
        //   schedules[x].rowsVehicle = rows;
        //   x++;
        //   return;
        // }
        // rows = 1;
        const field = schedules[i].vehicle._id;
        for (let j = i + 1; j < schedules.length; j++) {
          if (
            isPReviousShow &&
            schedules[j].vehicle._id !== field &&
            !schedules[j].matchPreviousRowVehicle
          ) {
            schedules[j].rowsVehicle = rows;
            schedules[j].matchPreviousRowVehicle = false;
          } else if (
            schedules[j].vehicle._id === field &&
            !schedules[j].matchPreviousRowVehicle
          ) {
            rows++;
            schedules[j].matchPreviousRowVehicle = true;
            isPReviousShow = true;
          } else {
            schedules[j].matchPreviousRowVehicle = false;
            break;
          }
        }
        schedules[i].rowsVehicle = rows;
        x++;
      }
    }
  }
}
