import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Entries } from 'src/models/entries';

@Injectable({
  providedIn: 'root'
})
export class EntriesManagementService {

  constructor(private http: HttpClient) { }


  createOrUpdate(organizatioId: string, entrie: Entries) {
    this.update(organizatioId, entrie);
  }


  update(organizationId: string, entrie: Entries) {
    this.http
      .put(
        environment.database.uri +
        `/organization/update/entries/${organizationId}/`,
        entrie
      )
      .subscribe(res => console.log('Done'));
  }

  getEntries(id) {
    return this.http.get<any>(`${environment.database.uri}/organization/entries/${id}`);
  }

  getFilteredEntries(id, filter) {
    return this.http.post(`${environment.database.uri}/organization/entries/filter/${id}`, filter);

  }
}
