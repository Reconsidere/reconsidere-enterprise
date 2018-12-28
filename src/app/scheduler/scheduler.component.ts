import { AuthService } from 'src/services/auth.service';
import { Component, OnInit, enableProdMode, NgModule } from '@angular/core';
import { GeoRoute } from 'src/models/georoute';
import { Priority } from 'src/models/priority';
import { Appointment } from 'src/models/appointment';
import { Resource } from 'src/models/resource';

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

  constructor(private authService: AuthService) {
    this.appointmentsData = [];
    this.resourcesData = [];
    this.prioritiesData = [];
  }
  ngOnInit() {
    this.georoutes = [];
    this.authService.get().subscribe(x => this.loadGeoroutes(x));
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
            idOwner,
            georoute.name,
            priorty,
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

  /**
   * Este método deve atualizar os valores das rotas após o usuário editar e clicar em salvar
   * Salvar no banco e após isso atualizara novamente a lista do loadGeoroutes;
   */
  onAppointmentUpdating(e) {
    console.log(e);
  }

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
    console.log(e);
  }

}
