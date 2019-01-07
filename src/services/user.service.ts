import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<User[]>(`${config.apiUrl}/users`);
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
