import { Observable } from 'rxjs/internal/Observable';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { SearchItem } from 'src/models/SearchItem';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  result: SearchItem;
  classifications: string[];
  email: string;
  password : string;
  confirmPassword :string;
  cnpj : string;
  fantasyName: string;
  classification : string;
  cep: string;
  publicPlace: string;
  neighborhood:String;
  number: string;
  county:string;
  state:string;
  complement:string;
  phone:string;
  cellPhone:string;

  constructor(private http: HttpClient) {
    this.result = new SearchItem();
    this.classifications = ["Cooperativa","Empresa Privada","Município"];
  }

  ngOnInit() {
  }

  CEPSearch(value) {
    let removedSpecialCaracter = value.replace(/[^a-zA-Z0-9 ]/g, "");
    this.search(removedSpecialCaracter);
  }

  search(cep: string) {
    return this.http
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .subscribe(data => this.result = this.convertToCEP(data));
  }

  private convertToCEP(cepNaResposta): SearchItem {
    let cep = new SearchItem();

    cep.cep = cepNaResposta.cep;
    cep.publicPlace = cepNaResposta.logradouro;
    cep.complement = cepNaResposta.complemento;
    cep.neighborhood = cepNaResposta.bairro;
    cep.county = cepNaResposta.localidade;
    cep.state = cepNaResposta.uf;
    return cep;
  }


  save(){

  }
}

