import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services';
import { CollectionCostManagementService } from 'src/services/collection-cost-management.service';
import { ToastrService } from 'ngx-toastr';
import * as messageCode from 'message.code.json';
import { Vehicle } from 'src/models/vehicle';
import { VehicleManagementService } from 'src/services/vehicle-management.service';
import { isNgTemplate } from '@angular/compiler';


@Component({
  selector: 'app-collection-cost-management',
  templateUrl: './collection-cost-management.component.html',
  styleUrls: ['./collection-cost-management.component.scss']
})
export class CollectionCostManagementComponent implements OnInit {

  collectionCosts: any[];
  vehicles: Vehicle[];
  organizationId: string;
  page: number;
  isBlocked = true;
  typeProcessing: [];
  processChain: any[];

  constructor(private vehicleService: VehicleManagementService, private authService: AuthService, private collectionCostService: CollectionCostManagementService, private toastr: ToastrService) { }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
  }

  setId(id) {
    // this.organizationId = id;
    // if (id !== undefined) {
    //   this.collectionCostService.getProcessingChain(this.organizationId).subscribe(items => this.loadCollectionCots(items), error => error);
    //   this.getVehicles();
    // } else {
    //   this.toastr.warning(messageCode['WARNNING']['WRE012']['summary']);
    //   this.isBlocked = false;
    //   return;
    // }
  }

  loadCollectionCots(items) {
    if (items === undefined || items.length <= 0) {
      this.toastr.warning(messageCode['WARNNING']['WRE012']['summary']);
      this.isBlocked = false;
      return;
    }
    this.processChain = items;
    this.typeProcessing = items;
    items.forEach(processingChain => {
      processingChain.collectionCosts.forEach(collectionCost => {
        let obj = {
          _id: collectionCost._id,
          name: collectionCost.name,
          active: collectionCost.active,
          priceFuel: collectionCost.priceFuel,
          processingType: processingChain,
          date: collectionCost.date,
          distance: collectionCost.distance,
          averageConsumption: collectionCost.averageConsumption,
          vehicle: collectionCost.vehicle,
        };
        if (this.collectionCosts === undefined || this.collectionCosts.length <= 0) {
          this.collectionCosts = [obj];
        } else {
          this.collectionCosts.push(obj);
        }
      });
    });

  }

  getVehicles() {
    if (this.organizationId !== undefined) {
      this.vehicleService.loadAll(this.organizationId).subscribe(vehicle => this.loadVehicles(vehicle));
    } else {
      this.vehicles = [new Vehicle()];
    }
  }

  loadVehicles(vehicles) {
    if (vehicles !== undefined) {
      this.vehicles = vehicles;
    } else {
      this.vehicles = [new Vehicle()];
    }
  }

  newItem() {
    if (this.collectionCosts === undefined) {
      this.collectionCosts = [{ _id: undefined, distance: 0, name: undefined, active: true, priceFuel: 0, date: new Date(), averageConsumption: 0, price: 0 }];
    } else {
      this.collectionCosts.push({ _id: undefined, distance: 0, name: undefined, active: true, priceFuel: 0, date: new Date(), averageConsumption: 0, price: 0 });
    }
  }

  private changeTypeProcessing(selected, oldValue, item) {
    let isRemoved = false;
    this.collectionCosts.forEach((element, index) => {
      if (element._id !== undefined && element._id !== '') {
        this.processChain.forEach((obj, i) => {
          obj.collectionCost.forEach((cost, remove) => {
            if (item._id === cost._id) {
              obj.collectionCost.splice(remove, 1);
              isRemoved = true;
            } else {
            }
          });
        });
      }
    });
  }

  addToItemsCollectionCost() {
    this.collectionCosts.forEach(collectionCost => {
      let isAdd = false;
      if (this.processChain !== undefined) {
        this.processChain.forEach((processChain, index) => {
          if (collectionCost.processingType === processChain) {
            let obj = {
              name: collectionCost.name,
              active: collectionCost.active,
              priceFuel: collectionCost.priceFuel,
              date: collectionCost.date,
              distance: collectionCost.distance,
              averageConsumption: collectionCost.averageConsumption,
              vehicle: collectionCost.vehicle,
              price: collectionCost.price
            };
            processChain.collectionCost.forEach((ProcessChainCollectionCost, index) => {
              if (collectionCost._id === ProcessChainCollectionCost._id) {
                processChain.collectionCost[index] = obj;
                isAdd = true;
              }
            });
            if (!isAdd) {
              if (processChain.collectionCost === undefined || processChain.collectionCost.length <= 0) {
                processChain.collectionCost = [obj];
              } else {
                processChain.collectionCost.push(obj);
              }
              isAdd = false;
            }
          }
        });
      }
    });
  }

  calculatePrice(item) {
    item.price = (item.distance * item.priceFuel) / item.averageConsumption;
    this.calculateConsumption(item);
  }

  calculateConsumption(item) {
    item.consumption = item.distance / item.averageConsumption;
  }

  veryfyBeforeSave() {
    if (this.collectionCosts === undefined || this.collectionCosts.length <= 0) {
      this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
      throw new Error();
    }
    this.collectionCosts.forEach(item => {
      if (item.name === undefined) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.priceFuel === undefined || item.priceFuel <= 0) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.distance === undefined || item.distance <= 0) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.date === undefined) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.averageConsumption || item.averageConsumption <= 0) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.price || item.price <= 0) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.vehicle === undefined) {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
      if (item.vehicle._id === undefined || item.vehicle._id === '') {
        this.toastr.warning(messageCode['WARNNING']['WRE001']['summary']);
        throw new Error();
      }
    });
  }

  save() {
    try {
      this.veryfyBeforeSave();
      this.addToItemsCollectionCost();
      //this.collectionCostService.createOrUpdate(this.organizationId, this.processChain);
      this.toastr.success(messageCode['SUCCESS']['SRE001']['summary']);
    } catch (error) {
      try {
        this.toastr.error(messageCode['ERROR'][error]['summary']);
      } catch (e) {
        this.toastr.error(error.message);
      }
    }
  }

}
