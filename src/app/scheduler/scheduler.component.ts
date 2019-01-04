import { AbstractControl } from '@angular/forms';
import { routes } from './../app.routing';
import {
  Component,
  OnInit,
  enableProdMode,
  NgModule,
  ViewChild
} from '@angular/core';
import { GeoRoute } from 'src/models/georoute';
import { Priority } from 'src/models/priority';
import { Appointment } from 'src/models/appointment';
import { Resource } from 'src/models/resource';
import { Organization } from 'src/models/organization';
import { HttpClient } from '@angular/common/http';
import { SchedulerService } from 'src/services/scheduler.service';
import { Schedule } from 'src/models/schedule';
import { Turn } from 'src/models/turn';
import { DxSchedulerComponent } from 'devextreme-angular';
import { UserService } from 'src/services';
import { User } from 'src/models';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  @ViewChild('targetScheduler') scheduler: DxSchedulerComponent;
  appointmentsData: Appointment[];
  resourcesData: Resource[];
  prioritiesData: Priority[];
  currentDate: Date = new Date();
  msgStatus: string;
  showMessage: boolean;
  organizationMock: Organization;
  users: User[] = [];

  constructor(
    private servive: SchedulerService,
    private userService: UserService
  ) {
    this.appointmentsData = [];
    this.resourcesData = [];
    this.prioritiesData = [];
  }
  ngOnInit() {
    this.userService
      .getAll()
      .pipe(first())
      .subscribe(users => {
        this.users = users;
      });

    /*ATENCAO simulando organização ja cadastrada alterar isso aqui*/
    this.organizationMock = new Organization();
    this.organizationMock._id = '5c2f79136ba73239dc432b95';
    /*---------------------------------------------------*/
    this.servive
      .get(this.organizationMock._id)
      .subscribe(x => this.loadGeoroutes(x));
  }

  onAppointmentFormCreated(data) {
    const form = data.form;
    let startDate = data.appointmentData.startDate,
      endDate = data.appointmentData.endDate,
      startTime = data.appointmentData.startTime,
      endTime = data.appointmentData.endTime,
      text = data.appointmentData.text;

    form.option('items', [
      {},
      {
        dataField: 'text',
        editorType: 'dxTextBox',
        editorOptions: {
          width: '100%',
          type: 'text',
          onValueChanged: function(args) {
            text = args.value;
          }
        }
      },
      {
        dataField: 'startDate',
        editorType: 'dxDateBox',
        editorOptions: {
          width: '100%',
          type: 'date',
          displayFormat: 'dd/MM/yyyy',
          onValueChanged: function(args) {
            startDate = args.value;
          }
        }
      },
      {
        dataField: 'endDate',
        editorType: 'dxDateBox',
        editorOptions: {
          width: '100%',
          type: 'date',
          displayFormat: 'dd/MM/yyyy',
          onValueChanged: function(args) {
            endDate = args.value;
          }
        }
      },
      {
        dataField: 'startTime',
        editorType: 'dxDateBox',
        editorOptions: {
          width: '100%',
          type: 'time',
          onValueChanged: function(args) {
            startTime = args.value;
          }
        }
      },
      {
        dataField: 'endTime',
        editorType: 'dxDateBox',
        editorOptions: {
          width: '100%',
          type: 'time',
          onValueChanged: function(args) {
            endTime = args.value;
          }
        }
      }
    ]);
  }

  loadGeoroutes(value) {
    this.appointmentsData = [];
    this.resourcesData = [];
    this.prioritiesData = [];
    let id = 0;
    for (const georoute of value) {
      const priority = new Priority(id, georoute.name, '#6CB2EB');
      this.prioritiesData.push(priority);
      id++;
      for (const item of georoute.schedules) {
        const appointment = new Appointment();
        let idOwner = 0;
        let priorty = 0;
        appointment._id = georoute._id;
        appointment.text = georoute.name;
        appointment.startDate = item.startDate;
        appointment.endDate = item.endDate;

        for (const turn of item.turns) {
          appointment.startTime = turn.startTime;
          appointment.endTime = turn.endTime;
        }
        this.appointmentsData.push(appointment);
        const resource = new Resource(idOwner, georoute.name, '#6CB2EB');
        this.resourcesData.push(resource);
        idOwner++;
        priorty++;
      }
    }
  }

  veryfyBeforeSave(object) {
    if (object.newData === undefined) {
      if (object.appointmentData.text === undefined) {
        this.msgStatus =
          'Por favor, preencha os campos antes de salvar os dados!';
        return false;
      }
      if (
        object.appointmentData.startDate === undefined ||
        object.appointmentData.endDate === undefined
      ) {
        this.msgStatus =
          'Por favor, preencha os campos antes de salvar os dados!';
        return false;
      }
      if (
        object.appointmentData.startTime === undefined ||
        object.appointmentData.endTime === undefined
      ) {
        this.msgStatus =
          'Por favor, preencha os campos antes de salvar os dados!';
        return false;
      }
    } else {
      if (object.newData.text === undefined) {
        this.msgStatus =
          'Por favor, preencha os campos antes de salvar os dados!';
        return false;
      }
      if (
        object.newData.startDate === undefined ||
        object.newData.endDate === undefined
      ) {
        this.msgStatus =
          'Por favor, preencha os campos antes de salvar os dados!';
        return false;
      }
      if (
        object.newData.startTime === undefined ||
        object.newData.endTime === undefined
      ) {
        this.msgStatus =
          'Por favor, preencha os campos antes de salvar os dados!';
        return false;
      }
    }
    return true;
  }

  /**
   * Este método deve atualizar os valores das rotas após o usuário editar e clicar em salvar
   * Salvar no banco e após isso atualizara novamente a lista do loadGeoroutes;
   */
  onAppointmentUpdating(e) {
    this.showMessage = true;
    if (!this.veryfyBeforeSave(e)) {
      return;
    }
    const georoutes = new GeoRoute();
    if (e.newData === undefined) {
      try {
        georoutes.name = e.appointmentData.text;
        georoutes._id = e.appointmentData._id;
        const turn = new Turn(
          e.appointmentData.startTime,
          e.appointmentData.endTime
        );
        let newDate = new Date(e.appointmentData.startDate).toDateString();
        const timeStringInit =
          new Date(e.appointmentData.startTime).getHours() +
          ':' +
          new Date(e.appointmentData.startTime).getMinutes() +
          ':00';
        const dateInit = new Date(newDate + ' ' + timeStringInit);
        newDate = new Date(e.appointmentData.endDate).toDateString();
        const timeStringEnd =
          new Date(e.appointmentData.endTime).getHours() +
          ':' +
          new Date(e.appointmentData.endTime).getMinutes() +
          ':00';
        const dateEnd = new Date(newDate + ' ' + timeStringEnd);

        const schedule = new Schedule(dateInit, dateEnd);
        schedule.turns = [turn];
        georoutes.schedules = [schedule];
        this.servive.update(this.organizationMock._id, georoutes);
        this.msgStatus = 'Dados salvos com sucesso';
      } catch (error) {
        this.msgStatus = 'Erro ao salvar!';
        console.log(error);
      }
    } else {
      georoutes.name = e.newData.text;
      georoutes._id = e.newData._id;
      const turn = new Turn(e.newData.startTime, e.newData.endTime);
      let newDate = new Date(e.newData.startDate).toDateString();
      const timeStringInit =
        new Date(e.newData.startTime).getHours() +
        ':' +
        new Date(e.newData.startTime).getMinutes() +
        ':00';
      const dateInit = new Date(newDate + ' ' + timeStringInit);
      newDate = new Date(e.newData.endDate).toDateString();
      const timeStringEnd =
        new Date(e.newData.endTime).getHours() +
        ':' +
        new Date(e.newData.endTime).getMinutes() +
        ':00';
      const dateEnd = new Date(newDate + ' ' + timeStringEnd);

      const schedule = new Schedule(dateInit, dateEnd);
      schedule.turns = [turn];
      georoutes.schedules = [schedule];
      this.servive.update(this.organizationMock._id, georoutes);
      this.msgStatus = 'Dados salvos com sucesso';
    }
  }

  /**
   * Este método salva as novas rotas
   * Salvar no banco e após isso atualizara novamente a lista do loadGeoroutes;
   */
  onAppointmentAdded(e) {
    this.showMessage = true;
    if (!this.veryfyBeforeSave(e)) {
      return;
    }

    try {
      const georoutes = new GeoRoute();
      georoutes.name = e.appointmentData.text;
      const turn = new Turn(
        e.appointmentData.startTime,
        e.appointmentData.endTime
      );
      let newDate = new Date(e.appointmentData.startDate).toDateString();
      const timeStringInit =
        e.appointmentData.startTime.getHours() +
        ':' +
        e.appointmentData.startTime.getMinutes() +
        ':00';
      const dateInit = new Date(newDate + ' ' + timeStringInit);
      newDate = new Date(e.appointmentData.endDate).toDateString();
      const timeStringEnd =
        e.appointmentData.endTime.getHours() +
        ':' +
        e.appointmentData.endTime.getMinutes() +
        ':00';
      const dateEnd = new Date(newDate + ' ' + timeStringEnd);

      const schedule = new Schedule(dateInit, dateEnd);
      schedule.turns = [turn];
      georoutes.schedules = [schedule];
      this.servive.add(this.organizationMock._id, georoutes);
      this.msgStatus = 'Dados salvos com sucesso';
    } catch (error) {
      this.msgStatus = 'Erro ao salvar!';
      console.log(error);
    }
  }

  closeAlertMessage() {
    this.showMessage = false;
  }
  onAppointmentUpdated(e) {
    setTimeout(
      () =>
        this.servive
          .get(this.organizationMock._id)
          .subscribe(x => this.loadGeoroutes(x)),
      500
    );
  }

  onAppointmentAdding(e) {
    setTimeout(
      () =>
        this.servive
          .get(this.organizationMock._id)
          .subscribe(x => this.loadGeoroutes(x)),
      500
    );
  }
}
