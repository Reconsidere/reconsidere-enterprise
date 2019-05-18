import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services';
import { ToastrService } from 'ngx-toastr';
import { NeighborhoodSchedulingService } from 'src/services/neighborhood-scheduling.service';
import { SchedulingNeighborhood } from 'src/models/schedulingneighborhood';
import { Itinerary } from 'src/models/itinerary';
import { CepService } from 'src/services/cep.service';
import * as messageCode from 'message.code.json';


@Component({
  selector: 'app-neighborhood-scheduling',
  templateUrl: './neighborhood-scheduling.component.html',
  styleUrls: ['./neighborhood-scheduling.component.scss']
})
export class NeighborhoodSchedulingComponent implements OnInit {

  page: number;
  organizationId: string
  neighborhoodScheduling: SchedulingNeighborhood;
  neighborhoodSchedulingItems: any;
  pageItineray: number;
  daysWeek;
  notSave;


  constructor(private cepService: CepService, private neighborhoodSchedulingService: NeighborhoodSchedulingService, private authService: AuthService, private toastr: ToastrService) {
    this.daysWeek = Object.values(Itinerary.daysWeek);
    this.neighborhoodSchedulingItems = [];
  }

  ngOnInit() {
    this.page = 1;
    this.pageItineray = 1;
    this.authService.isAuthenticated();
    this.getSchedulingNeighborhood();
    this.notSave = false;
  }

  private getSchedulingNeighborhood() {
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
  }

  setId(id) {
    if (id !== undefined) {
      this.organizationId = id;
      this.neighborhoodSchedulingService
        .loadAll(id)
        .subscribe(scheduling => this.loadNeighborhoodScheduling(scheduling));
    }
  }

  loadNeighborhoodScheduling(scheduling) {
    scheduling.forEach(item => {
      let obj = {
        _id: item._id,
        expand: false,
        itinerary: item.itinerary
      }
      this.neighborhoodSchedulingItems.push(item);
    });
  }

  expand(schedNeig) {
    if (schedNeig.expand) {
      schedNeig.expand = false;
    } else {
      schedNeig.expand = true;
    }
  }

  CEPSearch(schedNeig) {
    try {
      this.cepService.searchCep(schedNeig.cep).subscribe(x => this.loadCep(schedNeig, x));
    } catch (error) {
    }
  }

  loadCep(item, value) {
    item.neighborhood = value.bairro;
    item.cep = value.cep;
    this.verify(item);
  }

  verify(item) {
    this.neighborhoodSchedulingItems.forEach(element => {
      if (element.cep.replace('-', '') === item.cep.replace('-', '')) {
        if (item !== element) {
          this.notSave = true;
          this.toastr.warning(messageCode['WARNNING']['WRE018']['summary']);
          return;
        }
      }
    });
    this.notSave = false;
  }

  newNeighborhoodScheduling() {
    let item = { _id: undefined, expand: false, itinerary: undefined };
    item.itinerary = [new Itinerary()];
    this.neighborhoodSchedulingItems.push(item);
  }

  newItineray(schedNeig) {
    schedNeig.itinerary.push(new Itinerary());
  }

  removeItinerary(itinerary) {
    this.neighborhoodSchedulingItems.forEach((item, index) => {
      item.itinerary.forEach((it, i) => {
        if (it === itinerary) {
          item.itinerary.splice(i, 1);
          return;
        }
      });
    });
  }

  // removeScheduling(schedNeig) {
  //   this.neighborhoodSchedulingItems.forEach((item, index) => {
  //     if (item === schedNeig) {
  //       this.neighborhoodSchedulingItems.splice(index, 1);
  //     }
  //   });
  // }


  veryfyBeforeSave() {
    if (this.neighborhoodSchedulingItems === undefined || this.neighborhoodSchedulingItems.length <= 0) {
      this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
      throw new Error();
    }
    this.neighborhoodSchedulingItems.forEach(items => {
      if (
        !items.cep ||
        !items.neighborhood ||
        items.itinerary === undefined || items.itinerary.length <= 0
      ) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      items.itinerary.forEach(itineray => {
        if (!itineray.hour || !itineray.dayWeek) {
          this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
          throw new Error();
        }
      });
    });
  }


  save() {
    try {
      if (this.notSave) {
        this.toastr.warning(messageCode['WARNNING']['WRE018']['summary']);
        return;
      }
      this.veryfyBeforeSave();
      this.neighborhoodSchedulingService.createOrUpdate(this.organizationId, this.neighborhoodSchedulingItems);
      this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
    } catch (error) {
      try {
        this.toastr.error(messageCode['WARNNING']['WRE001']['summary']);
      } catch (e) {
        this.toastr.error(error.message);
      }
    }
  }
}
