import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Pricing } from 'src/models/pricing';

@Injectable({
  providedIn: 'root'
})
export class PricingService {

  constructor(private http: HttpClient) { }

  createOrUpdate(organizatioId: string, princing: Pricing) {
    this.add(organizatioId, princing);
  }

  add(organizationId: string, princing: Pricing) {
    this.http
      .post(
        environment.database.uri +
        `/organization/add/pricing/${organizationId}/`,
        princing
      )
      .subscribe(res => console.log('Done'));
  }



  getHierarchy(id) {
    return this.http.get<any>(`${environment.database.uri}/organization/pricing/${id}`);
  }
}
