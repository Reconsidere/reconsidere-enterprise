import { first } from 'rxjs/operators';
import { VehicleManagementService } from 'src/services/vehicle-management.service';
import {
  Component,
  OnInit,
  enableProdMode,
  NgModule,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
  ElementRef
} from '@angular/core';
import { SchedulerService } from 'src/services/scheduler.service';
import { UserService, AuthService } from 'src/services';
import { User } from 'src/models';
import { GeoRoute } from 'src/models/georoute';
import { Schedule } from 'src/models/schedule';
import { Vehicle } from 'src/models/vehicle';
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
  search: ElementRef;
  searchRoute: ElementRef;

  constructor(
    private schedulerServive: SchedulerService,
    private userService: UserService,
    private authService: AuthService,
    private vehicleService: VehicleManagementService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.search = new ElementRef<any>('');
    this.searchRoute = new ElementRef<any>('');
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
    this.newRoute();
    if (values === undefined) {
    } else {
      this.georoutes = values;
      this.georoutes.forEach(route => {
        route.schedules.forEach(schedule => {
          this.verifyConflict(schedule);
        });
      });
      this.blockEdition();
    }
  }
  private blockEdition() {
    this.georoutes.forEach(route => {
      route.schedules.forEach(schedule => {
        schedule.readonly = true;
      });
    });
  }

  newRoute() {
    const georout = new GeoRoute();
    georout.name = 'Nova rota';
    if (georout.schedules === undefined || georout.schedules.length <= 0) {
      georout.schedules = [this.newScheduler()];
    } else {
      georout.schedules.push(this.newScheduler());
    }
    georout.expand = true;

    if (this.georoutes === undefined || this.georoutes.length <= 0) {
      this.georoutes = [georout];
    } else {
      this.georoutes.push(georout);
    }
  }

  orderNew(schedule: any) {
    schedule.rowsVehicle = 1;
    schedule.showVehicle = true;
    schedule.rowsDate = 1;
    schedule.showDate = true;
  }

  verifyConflict(schedule: Schedule) {
    this.georoutes.forEach(route => {
      route.schedules.forEach(item => {
        if (
          this.datePipe.transform(schedule.date, 'dd/MM/yyyy') ===
          this.datePipe.transform(item.date, 'dd/MM/yyyy')
        ) {
          if (schedule !== item) {
            if (
              this.hourCheck(
                schedule.startTime,
                schedule.endTime,
                item.startTime
              ) ||
              this.hourCheck(
                schedule.startTime,
                schedule.endTime,
                item.endTime
              ) ||
              schedule.endTime < schedule.startTime
            ) {
              if (schedule.vehicle._id === item.vehicle._id) {
                schedule.situation = Schedule.Situation.Conflict;
                item.situation = Schedule.Situation.Conflict;
              } else {
                schedule.situation = Schedule.Situation.OverlappingRoute;
              }
            } else {
              item.situation = Schedule.Situation.NoConflict;
              schedule.situation = Schedule.Situation.NoConflict;
            }
          }
        } else {
          item.situation = Schedule.Situation.NoConflict;
          schedule.situation = Schedule.Situation.NoConflict;
        }
      });
    });
  }

  hourCheck(from, to, check) {
    if (
      this.datePipe.transform(check, 'HH:mm') <=
        this.datePipe.transform(to, 'HH:mm') &&
      this.datePipe.transform(check, 'HH:mm') >=
        this.datePipe.transform(from, 'HH:mm')
    ) {
      return true;
    }
    return false;
  }
  newScheduler(): Schedule {
    const scheduler = new Schedule();
    scheduler.situation = 'Sem conflitos';
    scheduler.archived = false;
    scheduler.readonly = false;
    scheduler._id = '';
    scheduler.date = new Date();
    scheduler.startTime = new Date();
    scheduler.endTime = new Date();
    scheduler.vehicle = new Vehicle();
    scheduler.vehicle._id = '';
    scheduler.vehicle.carPlate = '';
    this.orderNew(scheduler);
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
        schedule.date === undefined ||
        schedule.startTime === undefined ||
        schedule.endTime === undefined ||
        schedule.situation === undefined ||
        schedule.vehicle.carPlate === undefined ||
        this.organizationId === undefined ||
        this.organizationId === ''
      ) {
        throw new Error(
          'Por favor, preencha os campos antes de salvar os dados!'
        );
      }
      if (schedule.situation === Schedule.Situation.Conflict) {
        throw new Error(
          'Por favor, verifique rotas em conflitos antes de salvar os dados!'
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
    route.expand = true;
  }

  removeSchedule(schedule) {
    schedule.archived = true;
    schedule.status = GeoRoute.Status.Inactive;
  }

  removeRoute(route) {
    route.archived = true;
  }

  expand(route) {
    route.expand = !route.expand;
  }

  play(route) {
    route.status = GeoRoute.Status.InOperation;
  }

  pause(route) {
    route.status = GeoRoute.Status.Inactive;
  }

  save() {
    try {
      this.georoutes.forEach(route => {
        route.status = GeoRoute.Status.Draft;
        this.veryfyBeforeSave(route);
      });
      this.schedulerServive.createOrUpdate(this.organizationId, this.georoutes);
      this.message = 'Dados salvos com sucesso';
      this.blockEdition();
    } catch (error) {
      this.message = error;
      console.log(error);
    }
  }
}
