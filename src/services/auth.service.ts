import { Organization } from 'src/models/organization';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import jwt from 'jsonwebtoken';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DecriptEncript } from 'src/app/security/decriptencript';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  result: any;
  private currenTokenSubject: BehaviorSubject<any>;
  public currentToken: Observable<any>;

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

  public signup(organization: Organization) {
    if (organization._id === undefined) {
      this.add(organization);
    } else {
      this.update(organization._id, organization);
    }
  }

  add(organization: Organization) {
    this.http
      .post(environment.api.uri + `api/organization/add`, organization)
      .subscribe(res => console.log('Done'));
  }

  update(organizationId: string, organization: Organization) {
    this.http
      .put(
        environment.database.uri + `/organization/update/${organization._id}`,
        organization
      )
      .subscribe(res => console.log('Done'));
  }

  cleanStorage() {
    localStorage.removeItem('currentToken');
    localStorage.removeItem('currentUserId');
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
      .post<any>(`${environment.database.uri}/organization/user/authenticate`, {
        email: email
      })
      .pipe(
        map(
          user => {
            const isLogged = this.generateToken(user, password);
            if (!isLogged) {
              throw new Error('ERE001');
            }
          },
          error => {
            throw new Error('ERE001');
          }
        )
      );
  }
  getOrganizationId(): Observable<string> {
    const id = JSON.parse(localStorage.getItem('currentUserId'));
    if (id !== null) {
      return this.http.get<string>(
        `${environment.database.uri}/organization/organizationid/${id}`
      );
    } else {
      return new Observable<string>();
    }
  }

  getOrganization(id, organization) {
    return this.http.get<any>(`${environment.database.uri}/organization/${id}`);
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
      localStorage.setItem('currentUserId', JSON.stringify(user._id));
      this.currenTokenSubject.next(user.token);
      return true;
    }
  }

  encript(value) {
    return this.decriptEncript.set(environment.secret, value);
  }

  decript(value) {
    return this.decriptEncript.get(environment.secret, value);
  }
}
