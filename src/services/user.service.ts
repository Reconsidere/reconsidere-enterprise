import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/models';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAll(organizationId, users) {
    return this.http
      .get(`${config.apiUrl}/${organizationId}/user`)
      .pipe(
        map(
          items => {
            return this.loadUsers(items, users);
          },
          error => {
            throw new Error('Login incorreto');
          }
        )
      );
  }

  loadUsers(items, users) {
    if (users === undefined) {
      users = items;
    } else {
      users.push(items);
    }
    return users;
  }

  createOrUpdate(organizatioId: string, user: User) {
    if (user._id) {
      this.update(organizatioId, user);
    } else {
      this.add(organizatioId, user);
    }
  }

  add(organizationId: string, user: User) {
    this.http
      .post(environment.database.uri + `${organizationId}/user/add/`, user)
      .subscribe(res => console.log('Done'));
  }

  update(organizationId: string, user: User) {
    this.http
      .put(
        environment.database.uri + `${organizationId}/user/update/${user._id}`,
        user
      )
      .subscribe(res => console.log('Done'));
  }
}
