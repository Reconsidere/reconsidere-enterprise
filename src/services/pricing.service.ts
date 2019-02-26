import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Pricing } from 'src/models/pricing';
import { Hierarchy } from 'src/models/material';

@Injectable({
  providedIn: 'root'
})
export class PricingService {

  constructor(private http: HttpClient) { }

  createOrUpdate(organizatioId: string, hierarchy: Hierarchy) {
    this.add(organizatioId, hierarchy);
  }

  add(organizationId: string, hierarchy: Hierarchy) {
    this.http
      .post(
        environment.database.uri +
        `/organization/add/pricing/${organizationId}/`,
        hierarchy
      )
      .subscribe(res => console.log('Done'));
  }



  getHierarchy(id) {
    return this.http.get<any>(`${environment.database.uri}/organization/pricing/${id}`);
  }
}
