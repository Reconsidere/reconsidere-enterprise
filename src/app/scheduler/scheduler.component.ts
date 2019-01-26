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
    if (values === undefined) {
      this.newRoute();
    } else {
      this.georoutes = values;
    }
  }

  newRoute() {
    const tomorrow = new Date();
    const vehicle = new Vehicle();
    vehicle._id = '123';
    vehicle.active = true;
    vehicle.carPlate = '1234-aaaa';
    tomorrow.setDate(tomorrow.getDate() + 1);
    const georout = new GeoRoute();
    georout.name = 'Nova rota';
    const scheduler = new Schedule();
    scheduler.startDate = new Date();
    scheduler.endDate = tomorrow;
    scheduler.startTime = new Date();
    scheduler.endTime = new Date();
    scheduler.vehicle = vehicle;
    georout.schedules = [scheduler];

    const vehicle2 = new Vehicle();
    vehicle2._id = '1234';
    vehicle2.active = true;
    vehicle2.carPlate = '1234-xxl';

    const scheduler2 = new Schedule();
    scheduler2.startDate = new Date(tomorrow.setDate(tomorrow.getDate() + 2));
    scheduler2.endDate = tomorrow;
    scheduler2.startTime = new Date();
    scheduler2.endTime = new Date();
    scheduler2.vehicle = vehicle2;
    georout.schedules.push(scheduler2);

    const scheduler3 = new Schedule();
    scheduler3.startDate = new Date();
    scheduler3.endDate = tomorrow;
    scheduler3.startTime = new Date();
    scheduler3.endTime = new Date();
    scheduler3.vehicle = vehicle2;
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
      const helper = {};
      if (this.groupList === undefined || this.groupList.length <= 0) {
        this.groupList = route.schedules.reduce(this.groupAll(helper), []);
      } else {
        this.groupList.push(route.schedules.reduce(this.groupAll(helper), []));
      }
    });

    /** ate aqui esta grupado por id veiculo data inicio e data fim
     * o problema que por existir dois veiculos com dis diferentes ele gera duas datas
     * do emsmo dia por ter dois veiculos diferente
     **/

    console.log(this.groupList);

    // const args = ['vehicle._id', 'startDate', 'endDate'];

    // args.forEach(function(filterobj) {
    //   let filterkey = Object.keys(filterobj)[0];
    //   let filtervalue = filterobj[filterkey];
    //   myobjects.forEach(function(objectToFilter) {
    //     if (objectToFilter[filterkey] != filtervalue && filtervalue != '') {
    //       // object didn't match a filter value so remove it from array via filter
    //       returnobjects = returnobjects.filter(obj => obj !== objectToFilter);
    //     }
    //   });
    // });

    // const field = 'startDate';
    // const groupedObj = this.groupList.reduce((prev, cur) => {
    //   if (!prev[cur[field]]) {
    //     prev[cur[field]] = [cur];
    //   } else {
    //     prev[cur[field]].push(cur);
    //   }
    //   return prev;
    // }, {});
    // this.groupList = this.group(groupedObj);
    // console.log(this.groupList);
  }

  private group(groupedObj: any) {
    return Object.keys(groupedObj).map(key => ({
      key: key,
      value: groupedObj[key]
    }));
  }

  private groupAll(helper: {}): (
    previousValue: any[],
    currentValue: Schedule,
    currentIndex: number,
    array: Schedule[]
  ) => any[] {
    return function(r, o) {
      const key = o.vehicle._id + '-' + o.startDate + '-' + o.endDate;
      if (!helper[key]) {
        helper[key] = Object.assign({}, o);
        r.push(helper[key]);
      } else {
        helper[key].key += o.vehicle._id + o.startDate + o.endDate;
      }
      return r;
    };
  }

  newScheduler(): Schedule {
    const scheduler = new Schedule();
    return scheduler;
  }

  closeMessage() {
    this.message = undefined;
  }

  rowspanStartDate() {}

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
