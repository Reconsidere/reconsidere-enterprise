import { Vehicle } from './../models/vehicle';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehicleManagementService {

  constructor(private http: HttpClient) { }

  add(id, obj) {
    this.http
      .post(`http://localhost:3000/organization/add/vehicle/${id}`, obj)
      .subscribe(res => console.log('Done'));
  }

  update(id, obj) {
    this.http
      .post(`http://localhost:3000/organization/update/vehicle/${id}`, obj)
      .subscribe(res => console.log('Done'));
  }

  get(id) {
    const uri = `http://localhost:3000/organization/vehicle/${id}`;
    return this.http.get<Vehicle[]>(uri).pipe();
  }
}
