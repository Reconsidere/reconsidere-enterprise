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
  constructor(private http: HttpClient) {}

  createOrUpdate(organizatioId: string, vehicle: Vehicle) {
    if (vehicle._id) {
      this.update(organizatioId, vehicle);
    } else {
      this.add(organizatioId, vehicle);
    }
  }

  add(organizationId: string, vehicle: Vehicle) {
    this.http
      .post(
        environment.database.uri +
          `organization/add/vehicle/${organizationId}/`,
        vehicle
      )
      .subscribe(res => console.log('Done'));
  }

  update(organizationId: string, vehicle: Vehicle) {
    this.http
      .put(environment.database.uri + `organization/update/vehicle/${organizationId}`, vehicle)
      .subscribe(res => console.log('Done'));
  }

  get(organizationId: string, id: string): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(
      environment.database.uri + `organization/${organizationId}/vehicle/${id}`
    );
  }

  loadAll(organizationId: string): Observable<Vehicle[]> {
    return this.http
      .get<Vehicle[]>(
        environment.database.uri + `organization/vehicle/${organizationId}`
      )
      .pipe();
  }

  remove(organizationId, id: string) {
    this.http
      .delete(
        environment.database.uri +
          `organization/remove/vehicle/${organizationId}/${id}`
      )
      .subscribe(res => console.log('Done'));
  }
}
