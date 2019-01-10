import { Priority } from 'src/models/priority';
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
import { JwtHelperService } from '@auth0/angular-jwt';
import { cleanSession } from 'selenium-webdriver/safari';
import { DecriptEncript } from 'src/app/_helpers/decriptencript';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  result: any;
  private currenTokenSubject: BehaviorSubject<any>;
  public currentToken: Observable<any>;
  private userID: string;

  constructor(
    private http: HttpClient,
    private decriptEncript: DecriptEncript
  ) {
    this.currenTokenSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentToken'))
    );
    this.currentToken = this.currenTokenSubject.asObservable();
  }

  public get currenTokenValue(): any {
    return this.currenTokenSubject.value;
  }

  public isAuthenticated(): boolean {
    if (!environment.production) {
      return true;
    }

    const jwtHelper = new JwtHelperService();
    if (jwtHelper.isTokenExpired(this.currenTokenSubject.value)) {
      this.cleanStorage();
      return false;
    }
    return true;
  }

  public signup(organization: Organization) {}

  cleanStorage() {
    localStorage.removeItem('currentToken');
    localStorage.removeItem('currentOrganizationID');
    this.currenTokenSubject.next(null);
  }

  public logout() {
    if (!this.isAuthenticated()) {
      return;
    }
    this.cleanStorage();
  }

  public login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.database.uri}organization/user/authenticate`, {
        email: email
      })
      .pipe(
        map(
          user => {
            const isLogged = this.generateToken(user, password);
            if (!isLogged) {
              throw new Error('Login incorreto');
            }
          },
          error => {
            throw new Error('Login incorreto');
          }
        )
      );
  }
  private getOrganizationId() {
    return this.http
      .get(
        `${environment.database.uri}organization/organizationid/${this.userID}`
      )
      .subscribe(id => this.setId(id));
  }
  setId(id) {
    return localStorage.setItem('currentOrganizationID', JSON.stringify(id));
  }

  getOrganization(id, organization) {
    return this.http
      .get<any>(`${environment.database.uri}organization/${id}`);
  }



  generateToken(user, password): boolean {
    if (user) {
      const decryptPass = this.decript(user.password);
      if (password !== decryptPass) {
        return false;
      } else {
        const id = user._id;
        user.token = jwt.sign({ id }, environment.secret, {
          expiresIn: 3600 // uma hora
        });
      }
      localStorage.setItem('currentToken', JSON.stringify(user.token));
      this.currenTokenSubject.next(user.token);
      this.userID = user._id;
      this.getOrganizationId();
      return true;
    }
  }

  private encript(value) {
    return this.decriptEncript.set(environment.secret, value);
  }

  private decript(value) {
    return this.decriptEncript.get(environment.secret, value);
  }
}
