import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialManagementService {

  constructor(private http: HttpClient) { }


  getHierarchy(id) {
    return this.http.get<any>(`${environment.database.uri}/hierarchy/materials/${id}`);
  }
}
