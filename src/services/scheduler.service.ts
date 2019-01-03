import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Organization } from 'src/models/organization';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {

  constructor(private http: HttpClient) { }


  add(obj) {
    const uri = 'http://localhost:3000/organization/add';
    this.http.post(uri, obj).subscribe(res => console.log('Done'));
  }
  update(id, obj) {
    this.http
      .post(`http://localhost:3000/organization/update/scheduler/${id}`, obj)
      .subscribe(res => console.log('Done'));
  }

  get() {
    const uri = 'http://localhost:3000/organization';
    return this.http.get<Organization[]>(uri).pipe();
  }
}
