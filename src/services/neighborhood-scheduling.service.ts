import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NeighborhoodSchedulingService {

  constructor(private http: HttpClient) { }

  createOrUpdate(organizatioId: string, schedulingNeighborhood) {
    this.add(organizatioId, schedulingNeighborhood);
  }

  add(organizationId: string, schedulingNeighborhood) {
    this.http
      .post(
        environment.database.uri +
        `/organization/neighborhoodscheduling/add/${organizationId}/`,
        schedulingNeighborhood
      )
      .subscribe(res => console.log('Done'));
  }

  loadAll(id) {
    return this.http.get<any>(`${environment.database.uri}/organization/neighborhoodscheduling/all/${id}`);
  }
}
