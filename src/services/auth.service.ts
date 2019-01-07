import { Vehicle } from './../models/vehicle';
import { Organization } from 'src/models/organization';
import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from 'src/environments/environment';
import { User } from 'src/models';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import jwt from 'jsonwebtoken';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  result: any;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    if (!environment.production) {
      return true;
    }
  }

  public signup(organization: Organization) {}

  public logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    // if (!this.isAuthenticated()) {
    //   return;
    // }
  }

  public login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.database.uri}organization/user/authenticate`, {
        email: email,
        password
      })
      .pipe(map(user => this.generateToken(user)));
  }
  generateToken(user) {
    if (user) {
      user.token = jwt.sign({}, environment.secret, {
        algorithm: 'RS256',
        expiresIn: 120,
        subject: user._id
      });
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }

    return user;
  }

  private encript() {}

  private decript() {}
}
