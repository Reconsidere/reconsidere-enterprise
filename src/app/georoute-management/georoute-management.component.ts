import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { GeoRoute } from 'src/models/georoute';
import { Schedule } from 'src/models/schedule';
import { forEach } from '@angular/router/src/utils/collection';
import { AuthService } from 'src/services/auth.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-georoute-management',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './georoute-management.component.html',
  styleUrls: ['./georoute-management.component.scss']
})
export class GeorouteManagementComponent implements OnInit {
  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  locale = 'pt';
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen = true;
  geoRoutes: GeoRoute[];

  constructor(private modal: NgbModal, private authService: AuthService) {}

  ngOnInit() {
    this.geoRoutes = [];
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(
    startDate: Date,
    endDate: Date,
    startTime: Date,
    endTime: Date
  ): void {
    this.events.push({
      title: 'Nova rota',
      start: startOfDay(new Date()),
      actions: this.actions,
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }

  addGeoRoute() {
    let geoRoute = new GeoRoute();
    geoRoute.name = 'Nova rota';

    if (geoRoute.schedules === undefined) {
      geoRoute.schedules = [
        new Schedule(new Date(), new Date(), new Date(), new Date())
      ];
    } else {
      geoRoute.schedules.push(
        new Schedule(new Date(), new Date(), new Date(), new Date())
      );
    }

    this.geoRoutes.push(geoRoute);
    this.refresh.next();
  }

  save() {

    //this.authService.add
    this.loadRoutes();
  }

  loadRoutes() {
    //após salvar recarregar lista de rotas ou após entrar na tela
    //this.addEvent(name, startDate, endDate,startTime, endTime);
    //for (let items of this.geoRoutes) {}
  }

  newSchedule(schedules) {
    schedules.push([
      new Schedule(new Date(), new Date(), new Date(), new Date())
    ]);
  }

}
