import { GeoRoute } from './../models/georoute';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Organization } from 'src/models/organization';
import { Schedule } from 'src/models/schedule';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  constructor(private http: HttpClient) {}

  createOrUpdate(organizatioId: string, georoute: GeoRoute[]) {
    this.update(organizatioId, georoute);
  }

  private add(organizationId, georoute: GeoRoute[]) {
    this.http
      .post(
        environment.database.uri +
          `/organization/add/scheduler/${organizationId}`,
        georoute
      )
      .subscribe(res => console.log('Done'));
  }

  private update(organizationId, georoute: GeoRoute[]) {
    this.http
      .put(
        environment.database.uri +
          `/organization/update/scheduler/${organizationId}`,
        georoute
      )
      .subscribe(res => console.log('Done'));
  }

  remove(organizationId, id: string) {
    this.http
      .delete(
        environment.database.uri +
          `/organization/remove/scheduler/${organizationId}/${id}`
      )
      .subscribe(res => console.log('Done'));
  }

  getAll(id): Observable<GeoRoute[]> {
    const uri = environment.database.uri + `/organization/scheduler/${id}`;
    return this.http.get<GeoRoute[]>(uri).pipe();
  }
}
