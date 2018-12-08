import { Observable } from "rxjs/internal/Observable";
import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { SearchItem } from "src/models/SearchItem";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmPasswordValidator } from "src/validations/confirm-password.validator";
import { CNPJValidator } from "src/validations/valid-cnpj.validator";
import { AuthService } from "src/services/auth.service";


@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"]
})
export class SignUpComponent implements OnInit {
  //TODO[vinicius]: transformas cep em um pipe.
  result: SearchItem;

  registerForm: FormGroup;
  submitted = false;
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

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.result = new SearchItem();
    this.classifications = ["", "Cooperativa", "Empresa Privada", "Município"];
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        email: ["", [Validators.required, Validators.email]],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20)
          ]
        ],
        confirmPassword: [
          "",
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20)
          ]
        ],
        cnpj: ["", Validators.required],
        fantasyName: ["", Validators.required],
        classification: ["", Validators.required],
        cep: ["", Validators.required],
        publicPlace: ["", Validators.required],
        neighborhood: ["", Validators.required],
        number: ["", Validators.required],
        county: ["", Validators.required],
        state: ["", Validators.required],
        complement: ["", Validators.required],
        phone: ["", Validators.required],
        cellPhone: ["", Validators.required]
      },
      {
        validator: [ConfirmPasswordValidator.MatchPassword, CNPJValidator.MatchCNPJ]
      }
    );
  }

  CEPSearch(value) {
    let removedSpecialCaracter = value.replace(/[^a-zA-Z0-9 ]/g, "");
    this.search(removedSpecialCaracter);
  }

  search(cep: string) {
    return this.http
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .subscribe(data => this.convertToCEP(data));
  }

  private convertToCEP(cepNaResposta) {
    this.registerForm.controls["cep"].setValue(cepNaResposta.cep);
    this.registerForm.controls["publicPlace"].setValue(
      cepNaResposta.logradouro
    );
    this.registerForm.controls["complement"].setValue(
      cepNaResposta.complemento
    );
    this.registerForm.controls["neighborhood"].setValue(cepNaResposta.bairro);
    this.registerForm.controls["county"].setValue(cepNaResposta.localidade);
    this.registerForm.controls["state"].setValue(cepNaResposta.uf);
  }

  get f() {
    return this.registerForm.controls;
  }

  save() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    const obj = {
      email: this.registerForm.controls["email"].value,
      password: this.registerForm.controls["password"].value,
      cnpj: this.registerForm.controls["cnpj"].value,
      fantasyName: this.registerForm.controls["fantasyName"].value,
      classification: this.registerForm.controls["classification"].value,
      cep: this.registerForm.controls["cep"].value,
      publicPlace: this.registerForm.controls["publicPlace"].value,
      neighborhood: this.registerForm.controls["neighborhood"].value,
      number: Number(this.registerForm.controls["number"].value),
      county: this.registerForm.controls["county"].value,
      state: this.registerForm.controls["state"].value,
      complement: this.registerForm.controls["complement"].value,
      phone: this.registerForm.controls["phone"].value,
      cellPhone: this.registerForm.controls["cellPhone"].value
    };

    this.authService.addSignUp(obj);
  }
}
