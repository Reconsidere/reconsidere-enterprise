import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProcessingChain } from 'src/models/processingchain';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FixedCostManagementService {

  constructor(private http: HttpClient) { }


  createOrUpdate(organizatioId: string, processingChain: ProcessingChain) {
    this.update(organizatioId, processingChain);
  }

  update(organizationId: string, processingChain: ProcessingChain) {
    this.http
      .put(
        environment.database.uri +
        `/organization/update/fixedcost/${organizationId}/`,
        processingChain
      )
      .subscribe(res => console.log('Done'));
  }

  getProcessingChain(id) {
    return this.http.get<any>(`${environment.database.uri}/organization/fixedcost/${id}`);
  }
}
