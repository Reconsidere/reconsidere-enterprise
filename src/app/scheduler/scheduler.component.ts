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

  constructor(private servive: SchedulerService) {
    this.appointmentsData = [];
    this.resourcesData = [];
    this.prioritiesData = [];
  }
  ngOnInit() {
    /*ATENCAO simulando organização ja cadastrada alterar isso aqui*/
    this.organizationMock = new Organization();
    this.organizationMock._id = '5c2e3736014dc837908f24c4';
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
      title = data.appointmentData.title;

    form.option('items', [
      {},
      {
        dataField: 'title',
        editorType: 'dxTextBox',
        editorOptions: {
          width: '100%',
          type: 'text',
          onValueChanged: function(args) {
            title = args.value;
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
      const priority = new Priority(id, georoute.name, '#1e90ff');
      id++;
      this.prioritiesData.push(priority);
      for (const item of georoute.schedules) {
        const appointment = new Appointment();
        let idOwner = 0;
        let priorty = 0;
        appointment._id = georoute._id;
        appointment.title = georoute.name;
        appointment.startDate = item.startDate;
        appointment.endDate = item.endDate;

        for (const turn of item.turns) {
          appointment.startTime = turn.startTime;
          appointment.endTime = turn.endTime;
        }
        this.appointmentsData.push(appointment);
        const resource = new Resource(idOwner, georoute.name, '#1e90ff');
        this.resourcesData.push(resource);
        idOwner++;
        priorty++;
      }
    }
  }

  veryfyBeforeSave(object) {
    if (object.newData === undefined) {
      if (object.appointmentData.title === undefined) {
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
      if (object.newData.title === undefined) {
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
        georoutes.name = e.appointmentData.title;
        georoutes._id = e.appointmentData._id;
        const turn = new Turn(
          e.appointmentData.startTime,
          e.appointmentData.endTime
        );
        const schedule = new Schedule(
          e.appointmentData.startDate,
          e.appointmentData.endDate
        );
        schedule.turns = [turn];
        georoutes.schedules = [schedule];
        this.servive.update(this.organizationMock._id, georoutes);
        this.msgStatus = 'Dados salvos com sucesso';
      } catch (error) {
        this.msgStatus = 'Erro ao salvar!';
        console.log(error);
      }
    } else {
      georoutes.name = e.newData.title;
      georoutes._id = e.newData._id;
      const turn = new Turn(e.newData.startTime, e.newData.endTime);
      const schedule = new Schedule(e.newData.startDate, e.newData.endDate);
      schedule.turns = [turn];
      georoutes.schedules = [schedule];
      this.servive.update(this.organizationMock._id, georoutes);
      this.msgStatus = 'Dados salvos com sucesso';
    }
    this.servive
      .get(this.organizationMock._id)
      .subscribe(x => this.loadGeoroutes(x));
  }

  schedulerRefresh(scheduler) {
    setTimeout(function() {
      scheduler.instance.repaint();
    }, 1000);
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
      georoutes.name = e.appointmentData.title;
      const turn = new Turn(
        e.appointmentData.startTime,
        e.appointmentData.endTime
      );
      const schedule = new Schedule(
        e.appointmentData.startDate,
        e.appointmentData.endDate
      );
      schedule.turns = [turn];
      georoutes.schedules = [schedule];
      this.servive.add(this.organizationMock._id, georoutes);
      this.msgStatus = 'Dados salvos com sucesso';
    } catch (error) {
      this.msgStatus = 'Erro ao salvar!';
      console.log(error);
    }
    /*---------------------------------------------------*/
    this.servive
      .get(this.organizationMock._id)
      .subscribe(x => this.loadGeoroutes(x));

    this.schedulerRefresh(this.scheduler);
  }

  onAppointmentUpdated(e) {
    // this.scheduler.instance.instance().updateAppointment(
    //   this.scheduler.instance,
    //   this.appointmentsData
    //   );
    //this.scheduler.instance.getDataSource().reload();
    //this.scheduler.instance.repaint();
  }
}
