import { Injectable } from '@angular/core';
import { address } from 'src/models/address';
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class CepService {
  result:address;
  constructor(private http:HttpClient) { }

  buscar(cep:string){
    return this.http
        .get(`https://viacep.com.br/ws/${cep}/json/`)
        .subscribe(data => this.result = this.convertToCEP(data));
  }

  private convertToCEP(cepNaResposta):address{
    let addr = new address();
    addr.cep = cepNaResposta.cep;
    addr.city = cepNaResposta.logradouro;
    addr.complement = cepNaResposta.complemento;
    addr.county = cepNaResposta.bairro;
    addr.neighborhood = cepNaResposta.localidade;
    addr.number = cepNaResposta.uf;

    return addr;
  }
}
