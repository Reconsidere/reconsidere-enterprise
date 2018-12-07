import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  result: any;
  constructor(private http: HttpClient) { }

  addSignUp(obj) {
    const uri = 'http://localhost:3000/signUp/add';
    this
      .http
      .post(uri, obj)
      .subscribe(res =>
        console.log('Done'));
  }

  getSignUp() {
    const uri = 'http://localhost:3000/signUp';
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  editSignUp(id) {
    const uri = 'http://localhost:3000/signUp/edit/' + id;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }
}
