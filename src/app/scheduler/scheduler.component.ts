import { Component, OnInit, enableProdMode, NgModule } from '@angular/core';
import { GeoRoute } from 'src/models/georoute';
import { Priority } from 'src/models/priority';
import { Appointment } from 'src/models/appointment';
import { Resource } from 'src/models/resource';
import { Organization } from 'src/models/organization';
import { HttpClient } from '@angular/common/http';
import { SchedulerService } from 'src/services/scheduler.service';
import { Schedule } from 'src/models/schedule';
import { Turn } from 'src/models/turn';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  appointmentsData: Appointment[];
  resourcesData: Resource[];
  prioritiesData: Priority[];
  currentDate: Date = new Date();
  georoutes: GeoRoute[];
  msgStatus: string;
  showMessage: boolean;

  constructor(private servive: SchedulerService) {
    this.appointmentsData = [];
    this.resourcesData = [];
    this.prioritiesData = [];
  }
  ngOnInit() {
    this.georoutes = [];
    this.servive.get().subscribe(x => this.loadGeoroutes(x));
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
    let id = 0;
    for (const items of value) {
      for (const georoute of items.georoutes) {
        const priority = new Priority(id, georoute.name, '#1e90ff');
        id++;
        this.prioritiesData.push(priority);
        for (const item of georoute.schedules) {
          let idOwner = 0;
          let priorty = 0;
          const appointment = new Appointment(
            georoute.name,
            item.startDate,
            item.endDate,
            item.startTime,
            item.endTime
          );
          this.appointmentsData.push(appointment);
          const resource = new Resource(idOwner, georoute.name, '#1e90ff');
          this.resourcesData.push(resource);
          idOwner++;
          priorty++;
        }
      }
    }
  }

  veryfyBeforeSave(object) {
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
    return true;
  }

  /**
   * Este método deve atualizar os valores das rotas após o usuário editar e clicar em salvar
   * Salvar no banco e após isso atualizara novamente a lista do loadGeoroutes;
   */
  onAppointmentUpdating(e) {}

  onAppointmentUpdated(e) {
    console.log(e);
  }
  onAppointmentAdding(e) {
    console.log(e);
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
      //ATENCAO simulando organização ja cadastrada alterar isso aqui
      const organization = new Organization();
      organization._id = '5c2d692d44daaf1bfc926d7e';
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

      if (organization._id === undefined || organization._id === '') {
        this.servive.add(georoutes);
      } else {
        this.servive.update(organization._id, georoutes);
      }
      this.msgStatus = 'Dados salvos com sucesso';
    } catch (error) {
      this.msgStatus = 'Erro ao salvar!';
      console.log(error);
    }
    this.georoutes = [];
    this.servive.get().subscribe(x => this.loadGeoroutes(x));
  }
}
