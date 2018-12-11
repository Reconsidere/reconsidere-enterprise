import { Location } from "./../../../models/location";
import { Observable } from "rxjs/internal/Observable";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmPasswordValidator } from "src/validations/confirm-password.validator";
import { CNPJValidator } from "src/validations/valid-cnpj.validator";
import { AuthService } from "src/services/auth.service";
import { promise } from "protractor";
import { CepService } from "src/services/cep.service";
import { Organization } from "src/models/organization";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"]
})
export class SignUpComponent implements OnInit {
  isValidPassword: boolean;
  isValidCNPJ: boolean;
  classifications: string[];
  organization: Organization;
  email: string;
  password: string;
  confirmPassword: string;
  cnpj: string;
  company: string;
  tradingName: string;
  classification: string;
  cep: string;
  publicPlace: string;
  neighborhood: string;
  number: number;
  county: string;
  state: string;
  complement: string;
  phone: string;
  cellPhone: string;
  msgStatus: string;
  showMessage: boolean;

  constructor(
    private authService: AuthService,
    private cepService: CepService
  ) {
    this.classifications = ["", "Cooperativa", "Empresa Privada", "Município"];
    this.organization = new Organization();
  }

  ngOnInit() {}

  CEPSearch(value) {
    this.cepService.search(value, this);
  }

  verifyPassword() {
    this.isValidPassword = ConfirmPasswordValidator.MatchPassword(
      this.password,
      this.confirmPassword
    );
    setTimeout(function() {}.bind(this), 1000);
  }

  verifyCNPJ() {
    this.isValidCNPJ = CNPJValidator.MatchCNPJ(this.cnpj);
    setTimeout(function() {}.bind(this), 1000);
  }

  closeAlertMessage() {
    this.showMessage = false;
  }
  veryfyBeforeSave() {
    if (
      this.email == undefined ||
      this.company == undefined ||
      this.tradingName == undefined ||
      this.password == undefined ||
      this.cnpj == undefined ||
      this.phone == undefined ||
      this.cellPhone == undefined ||
      this.classification == undefined ||
      this.state == undefined ||
      this.cep == undefined ||
      this.publicPlace == undefined ||
      this.neighborhood == undefined ||
      this.number == undefined ||
      this.county == undefined ||
      this.company == undefined
    ) {
      this.msgStatus =
        "Por favor, preencha os campos antes de salvar os dados!";
      return false;
    }
    this.showMessage = this.isValidPassword = ConfirmPasswordValidator.MatchPassword(
      this.password,
      this.confirmPassword
    );

    if (!this.showMessage) {
      this.msgStatus = "Verifique se as senhas são iguais.";
      return false;
    }

    this.showMessage = this.isValidCNPJ = CNPJValidator.MatchCNPJ(this.cnpj);
    if (!this.showMessage) {
      this.msgStatus = "CNPJ incorreto.";
      return false;
    }
  }

  save() {
    this.showMessage = true;
    if (!this.veryfyBeforeSave()) {
      return;
    }

    try {
      this.organization.email = this.email;
      this.organization.company = this.company;
      this.organization.tradingName = this.tradingName;
      this.organization.password = this.password;
      this.organization.cnpj = this.cnpj;
      this.organization.phone = Number(this.phone);
      this.organization.cellPhone = Number(this.cellPhone);
      this.organization.classification = this.classification;
      this.organization.location = new Location(
        "",
        this.state,
        0,
        0,
        this.cep,
        this.publicPlace,
        this.neighborhood,
        this.number,
        this.county,
        this.company
      );
      this.authService.add(this.organization);
      this.msgStatus = "Dados salvos com sucesso";
    } catch (error) {
      this.msgStatus = "Erro ao salvar!";
      console.log(error);
    }
  }
}
