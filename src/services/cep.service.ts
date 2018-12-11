import { Location } from './../models/location';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SignUpComponent } from 'src/app/auth/sign-up/sign-up.component';

@Injectable({
  providedIn: "root"
})
export class CepService {
  private adrress: string[];
  constructor(private http: HttpClient) { }

  search(value: string, component: SignUpComponent) {
    value = value.replace(/[^a-zA-Z0-9 ]/g, "");
    return this.http
      .get(`https://viacep.com.br/ws/${value}/json/`)
      .subscribe(data => this.convertToCEP(data, component), error => console.log(error));
  }
  private convertToCEP(cepNaResposta, component) {
    component.cep = cepNaResposta.cep;
    component.publicPlace = cepNaResposta.logradouro;
    component.complement = cepNaResposta.complemento;
    component.neighborhood = cepNaResposta.bairro;
    component.county = cepNaResposta.localidade;
    component.state = cepNaResposta.uf;
  }
}
