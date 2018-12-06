import { Observable } from 'rxjs/internal/Observable';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { SearchItem } from 'src/models/SearchItem';
import { SignUpService } from 'src/services/sign-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  result: SearchItem;
  classifications: string[];
  email: string;
  password: string;
  confirmPassword: string;
  cnpj: string;
  fantasyName: string;
  classification: string;
  cep: string;
  publicPlace: string;
  neighborhood: String;
  number: string;
  county: string;
  state: string;
  complement: string;
  phone: string;
  cellPhone: string;

  constructor(private http: HttpClient, private signUpService: SignUpService) {
    this.result = new SearchItem();
    this.classifications = ["Cooperativa", "Empresa Privada", "Município"];
  }

  ngOnInit() {
  }

  CEPSearch(value) {
    let removedSpecialCaracter = value.replace(/[^a-zA-Z0-9 ]/g, "");
    this.search(removedSpecialCaracter);
  }

  search(cepValue: string) {
    return this.http
      .get(`https://viacep.com.br/ws/${cepValue}/json/`)
      .subscribe(data => this.convertToCEP(data));
  }

  private convertToCEP(cepNaResposta) {
    

    this.cep = cepNaResposta.cep;
    this.publicPlace = cepNaResposta.logradouro;
    this.complement = cepNaResposta.complemento;
    this.neighborhood = cepNaResposta.bairro;
    this.county = cepNaResposta.localidade;
    this.state = cepNaResposta.uf;
  }


  save() {
    const obj = {
      email: this.email,
      password: this.password,
      cnpj: this.cnpj,
      fantasyName: this.fantasyName,
      classification: this.classification,
      cep: this.cep,
      publicPlace: this.publicPlace,
      neighborhood: this.neighborhood,
      number: Number(this.number),
      county: this.county,
      state: this.state,
      complement: this.complement,
      phone: this.phone,
      cellPhone: this.cellPhone,
    }

    this.signUpService.addSignUp(obj);
  }
}

