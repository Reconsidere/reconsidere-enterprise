import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({
  providedIn: "root"
})
export class CepService {
  private adrress: string[];
  constructor(private http: HttpClient) { }

  search(cep: string, registerForm: FormGroup) {
    let value = cep.replace(/[^a-zA-Z0-9 ]/g, "");
    return this.http
      .get(`https://viacep.com.br/ws/${value}/json/`)
      .subscribe(data => this.convertToCEP(data, registerForm), error => console.log(error));
  }
  private convertToCEP(cepNaResposta, registerForm) {
    registerForm.controls["cep"].setValue(cepNaResposta.cep);
    registerForm.controls["publicPlace"].setValue(cepNaResposta.logradouro);
    registerForm.controls["complement"].setValue(cepNaResposta.complemento);
    registerForm.controls["neighborhood"].setValue(cepNaResposta.bairro);
    registerForm.controls["county"].setValue(cepNaResposta.localidade);
    registerForm.controls["state"].setValue(cepNaResposta.uf);
  }
}
