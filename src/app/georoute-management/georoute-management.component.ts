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
import { Organization } from 'src/models/organization';

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
  georoutes: GeoRoute[];
  msgStatus: string;
  showMessage: boolean;
  georoute: GeoRoute;

  constructor(private modal: NgbModal, private authService: AuthService) {
    this.georoute = new GeoRoute();
  }

  ngOnInit() {
    this.georoutes = [];
    this.authService.get().subscribe(x => this.loadGeoroutes(x));
  }

  loadGeoroutes(value) {
    for (const items of value) {
      for (const georoute of items.georoutes) {
        for (const item of georoute.schedules) {
          this.addEvent(
            georoute.name,
            item.startDate,
            item.endDate,
            item.startTime,
            item.endTime
          );
        }
      }
    }
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
    this.modal.open(this.modalContent, { size: 'lg'});
  }

  addEvent(
    title: string,
    startDate: Date,
    endDate: Date,
    startTime: Date,
    endTime: Date
  ): void {
    this.events = [];
    this.events.push({
      title: title,
      start: startOfDay(startDate),
      actions: this.actions,
      end: endOfDay(endDate),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }

  closeAlertMessage() {
    this.showMessage = false;
  }

  addGeoRoute() {
    const geoRoute = new GeoRoute();
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

    this.georoutes.push(geoRoute);
    this.refresh.next();
  }

  veryfyBeforeSave() {
    for (const items of this.georoutes) {
      if (items.name === undefined) {
        this.msgStatus =
          'Por favor, preencha os campos antes de salvar os dados!';
        return false;
      } else {
        return true;
      }
      for (const schedule of items.schedules) {
        if (
          schedule.startDate === undefined ||
          schedule.endDate === undefined ||
          schedule.startTime === undefined ||
          schedule.endTime === undefined
        ) {
          this.msgStatus =
            'Por favor, preencha os campos antes de salvar os dados!';
          return false;
        } else {
          return true;
        }
      }
    }
  }

  save() {
    this.showMessage = true;
    if (!this.veryfyBeforeSave()) {
      return;
    }

    //TODO[vinicius]: a organização ja deve vir após o login
    //assim não haverá risco de cruzar dados de usuários
    //Pela regra teremos um modelo de organização e vamos apenas inserindo ou atualizando dados dentro dela
    // e fazendo o update da mesma para guardar estas informações.
    //usando esta organização ja cadastrada para teste de update
    //caso  já exista id do veiculo é um update.

    try {
      //ATENCAO simulando organização ja cadastrada alterar isso aqui
      const organization = new Organization();
      organization._id = '5c20cd39875f7935582ad314';
      organization.email = 'vinicius@teste.com';
      organization.company = 'empresa a';
      organization.tradingName = 'empresa a fantasia ltda';
      organization.password = '1234567';
      organization.cnpj = '27835753000173';
      organization.phone = 4932222222.0;
      organization.cellPhone = 49999766955.0;
      organization.classification = 'Empresa Privada';
      if (organization.georoutes === undefined) {
        organization.georoutes = [this.georoutes.pop()];
      } else {
        organization.georoutes.push(this.georoutes.pop());
      }

      if (organization._id === undefined || organization._id === '') {
        this.authService.add(organization);
      } else {
        this.authService.update(organization._id, organization);
      }
      this.msgStatus = 'Dados salvos com sucesso';
      this.authService.get().subscribe(x => this.loadGeoroutes(x));
    } catch (error) {
      this.msgStatus = 'Erro ao salvar!';
      console.log(error);
    }
  }
}
