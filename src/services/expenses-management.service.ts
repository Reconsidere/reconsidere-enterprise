import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Expenses } from 'src/models/expenses';

@Injectable({
  providedIn: 'root'
})
export class ExpensesManagementService {

  constructor(private http: HttpClient) { }

  createOrUpdate(organizatioId: string, expenses: Expenses[]) {
    this.update(organizatioId, expenses);
  }

  update(organizationId: string, expenses: Expenses[]) {
    this.http
      .put(
        environment.database.uri +
        `/organization/update/expenses/${organizationId}/`,
        expenses
      )
      .subscribe(res => console.log('Done'));
  }

  getExpanses(id, date) {
    return this.http.get(`${environment.database.uri}/organization/expenses/${id}/${date}`);
  }
}
