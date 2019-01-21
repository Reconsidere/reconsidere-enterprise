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

  constructor(
    private schedulerServive: SchedulerService,
    private userService: UserService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.page = 1;
    this.getGeoroutes();
  }
  setId(id) {
    this.organizationId = id;
    this.schedulerServive
      .getAll(this.organizationId)
      .pipe()
      .subscribe(georoutes => {
        this.loadGeoroutes(georoutes);
      });
  }

  loadGeoroutes(values) {
    if (values === undefined) {
      this.newRoute();
    } else {
      this.georoutes = values;
    }
  }

  newRoute() {
    const turn = new Turn();
    turn.startTime = new Date();
    turn.endTime = new Date();

    const scheduler = new Schedule();
    scheduler.startDate = new Date();
    scheduler.endDate = new Date();
    scheduler.turns = [turn];

    const georout = new GeoRoute();
    georout.name = 'Nova rota';
    georout.schedules = [scheduler];

    if (this.georoutes === undefined || this.georoutes.length <= 0) {
      this.georoutes = [georout];
    } else {
      this.georoutes.push(georout);
    }
  }

  newScheduler(): Schedule {
    const turn = new Turn();
    turn.startTime = new Date();
    turn.endTime = new Date();

    const scheduler = new Schedule();
    scheduler.startDate = new Date();
    scheduler.endDate = new Date();
    scheduler.turns = [turn];
    return scheduler;
  }

  closeMessage() {
    this.message = undefined;
  }

  veryfyBeforeSave(route: GeoRoute) {
    if (route.name === undefined) {
      route.schedules.forEach(schedule => {
        if (
          schedule.startDate === undefined ||
          schedule.endDate === undefined ||
          this.organizationId === undefined ||
          this.organizationId === ''
        ) {
          throw new Error(
            'Por favor, preencha os campos antes de salvar os dados!'
          );
        }
        schedule.turns.forEach(turn => {
          if (turn.startTime === undefined || turn.endTime === undefined) {
            throw new Error(
              'Por favor, preencha os campos antes de salvar os dados!'
            );
          }
        });
      });
    }
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

  private getGeoroutes() {
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
  }
}
