import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProcessingChain } from 'src/models/processingchain';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FixedCostManagementService {

  constructor(private http: HttpClient) { }

}
