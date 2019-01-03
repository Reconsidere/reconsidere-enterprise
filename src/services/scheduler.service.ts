import { GeoRoute } from './../models/georoute';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Organization } from 'src/models/organization';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  constructor(private http: HttpClient) {}

  add(id, obj) {
    this.http
      .post(`http://localhost:3000/organization/add/scheduler/${id}`, obj)
      .subscribe(res => console.log('Done'));
  }

  update(id, obj) {
    this.http
      .post(`http://localhost:3000/organization/update/scheduler/${id}`, obj)
      .subscribe(res => console.log('Done'));
  }

  get(id) {
    const uri = `http://localhost:3000/organization/scheduler/${id}`;
    return this.http.get<GeoRoute[]>(uri).pipe();
  }
}
