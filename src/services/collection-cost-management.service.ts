import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProcessingChain } from 'src/models/processingchain';

@Injectable({
  providedIn: 'root'
})
export class CollectionCostManagementService {

  constructor(private http: HttpClient) { }


}
