import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Hierarchy } from 'src/models/material';

@Injectable({
  providedIn: 'root'
})
export class MaterialManagementService {

  constructor(private http: HttpClient) { }

  createOrUpdate(organizatioId: string, hierarchy: Hierarchy) {
    this.add(organizatioId, hierarchy);
  }

  add(organizationId: string, hierarchy: Hierarchy) {
    this.http
      .post(
        environment.database.uri +
        `/organization/add/hierarchy/${organizationId}/`,
        hierarchy
      )
      .subscribe(res => console.log('Done'));
  }

  getHierarchy(id) {
    return this.http.get<any>(`${environment.database.uri}/organization/hierarchy/${id}`);
  }
}
