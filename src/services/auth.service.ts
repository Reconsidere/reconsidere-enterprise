import { Vehicle } from './../models/vehicle';
import { Organization } from 'src/models/organization';
import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  result: any;
  constructor(private http: HttpClient) { }

  add(obj) {
    const uri = 'http://localhost:3000/organization/add';
    this
      .http
      .post(uri, obj)
      .subscribe(res =>
        console.log('Done'));
  }

  get() {
    const uri = 'http://localhost:3000/organization';
    return this
      .http
      .get<Organization[]>(uri)
      .pipe();
  }

  edit(id) {
    const uri = 'http://localhost:3000/organization/edit/' + id;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  update(id, obj) {
    this
      .http
      .post(`http://localhost:3000/organization/update/${id}`, obj)
      .subscribe(res => console.log('Done'));
  }
}
