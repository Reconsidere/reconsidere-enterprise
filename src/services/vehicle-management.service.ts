import { Observable } from 'rxjs';
import { Organization } from './../models/organization';
import { Vehicle } from './../models/vehicle';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleManagementService {

  constructor(private http: HttpClient) { }

  createOrUpdate(organizatioId: string, vehicle: Vehicle) {
    if (vehicle._id) {
      this.update(organizatioId, vehicle);
    } else {
      this.add(organizatioId, vehicle);
    }
  }

  add(organizationId: string, vehicle: Vehicle) {
    this.http
      .post(environment.database.uri + `${organizationId}/vehicle/add/`, vehicle)
      .subscribe(res => console.log('Done'));
  }

  update(organizationId: string, vehicle: Vehicle) {
    this.http
      .put(environment.database.uri + `${organizationId}/vehicle/update/${vehicle._id}`, vehicle)
      .subscribe(res => console.log('Done'));
  }

  get(organizationId: string, id: string): Observable<Vehicle[]> {
    return this.http
      .get<Vehicle[]>(environment.database.uri + `${organizationId}/vehicle/${id}`);
  }

  loadAll(organizationId: string): Observable<Vehicle[]> {
    return this.http
      .get<Vehicle[]>(environment.database.uri + `${organizationId}/vehicle/all`);
  }

}
