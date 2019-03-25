import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncomingOutManagementService {

  constructor(private http: HttpClient) { }


  getIncomingOut(id) {
    return this.http.get<any>(`${environment.database.uri}/organization/processingchain/${id}`);
  }
}
