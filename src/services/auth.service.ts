import { Vehicle } from './../models/vehicle';
import { Organization } from 'src/models/organization';
import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  result: any;
  constructor(private http: HttpClient) { }

  public isAuthenticated(): boolean {
    if (!environment.production) { return true; }
  }

  public signup(organization: Organization) {
  }

  public logout() {
    if (!this.isAuthenticated()) { return; }
  }

  public login() { }

  private encript() { }

  private decript() { }

}
