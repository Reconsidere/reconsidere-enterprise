import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntriesManagementService {

  constructor(private http: HttpClient) { }


  getEntries(id) {
    return this.http.get<any>(`${environment.database.uri}/organization/entries/${id}`);
  }
}
