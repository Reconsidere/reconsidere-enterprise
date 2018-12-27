import { Component, OnInit, enableProdMode, NgModule } from '@angular/core';
import { Appointment, Resource, Priority, AppService } from 'src/services/app.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


if(!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {

  appointmentsData: Appointment[];
  resourcesData: Resource[];
  prioritiesData: Priority[];
  currentDate: Date = new Date(2017, 4, 1);

  constructor(service: AppService) {
    this.appointmentsData = service.getAppointments();
    this.resourcesData = service.getResources();
    this.prioritiesData = service.getPriorities();

  }

  ngOnInit() {
  }

}


