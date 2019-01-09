import { User } from './../../../models/user';
import { Location } from './../../../models/location';
import { Observable } from 'rxjs/internal/Observable';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from 'src/validations/confirm-password.validator';
import { CNPJValidator } from 'src/validations/valid-cnpj.validator';
import { AuthService } from 'src/services/auth.service';
import { promise } from 'protractor';
import { CepService } from 'src/services/cep.service';
import { Organization } from 'src/models/organization';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  isValidPasswordOrganization: boolean;
  isValidPasswordUser: boolean;
  isValidCNPJ: boolean;
  classifications: string[];
  profiles: string[];
  organization: Organization;
  user: User;
  msgStatus: string;
  showMessage: boolean;
  confirmPasswordOrganization: string;
  confirmPasswordUser: string;
  myRecaptcha: boolean;

  constructor(
    private authService: AuthService,
    private cepService: CepService
  ) {
    this.classifications = Object.values(Organization.Classification);
    this.profiles = Object.values(User.Profiles);
    this.organization = new Organization();
    this.organization.location = new Location(
      '',
      '',
      0,
      0,
      '',
      '',
      '',
      0,
      '',
      ''
    );
    this.user = new User();
  }

  ngOnInit() {}

  CEPSearch(value) {
    this.cepService.search(value, this);
  }

  clean() {
    this.organization = new Organization();
    this.organization.location = new Location(
      '',
      '',
      0,
      0,
      '',
      '',
      '',
      0,
      '',
      ''
    );
    this.user = new User();
  }

  TypeOrganization(value) {
    if (value === Organization.Classification.Cooperativa) {
    } else if (value === Organization.Classification.Privada) {
    } else if (value === Organization.Classification.Municipio) {
    }
  }

  profileChange(value, event) {
    if (this.user.profiles === undefined && event) {
      this.user.profiles = [value];
      return;
    }
    if (!event) {
      this.user.profiles.forEach((item, index) => {
        if (item === value) {
          this.user.profiles.splice(index, 1);
        }
      });
      return;
    }
    if (!this.user.profiles.includes(value) && event) {
      this.user.profiles.push(value);
    }
  }

  verifyPasswordOrganization() {
    this.isValidPasswordOrganization = ConfirmPasswordValidator.MatchPassword(
      this.organization.password,
      this.confirmPasswordOrganization
    );
    setTimeout(function() {}.bind(this), 1000);
  }
  verifyPasswordUser() {
    this.isValidPasswordUser = ConfirmPasswordValidator.MatchPassword(
      this.user.password,
      this.confirmPasswordUser
    );
    setTimeout(function() {}.bind(this), 1000);
  }

  verifyCNPJ() {
    this.isValidCNPJ = CNPJValidator.MatchCNPJ(this.organization.cnpj);
    setTimeout(function() {}.bind(this), 1000);
  }

  closeAlertMessage() {
    this.showMessage = false;
  }
  veryfyBeforeSave() {
    if (
      this.organization.email === undefined ||
      this.organization.company === undefined ||
      this.organization.tradingName === undefined ||
      this.organization.password === undefined ||
      this.organization.cnpj === undefined ||
      this.organization.phone === undefined ||
      this.organization.cellPhone === undefined ||
      this.organization.classification === undefined ||
      this.organization.location.state === undefined ||
      this.organization.location.cep === undefined ||
      this.organization.location.publicPlace === undefined ||
      this.organization.location.neighborhood === undefined ||
      this.organization.location.number === undefined ||
      this.organization.location.county === undefined ||
      this.organization.company === undefined
    ) {
      this.msgStatus =
        'Por favor, preencha os campos antes de salvar os dados!';
      return false;
    }
    this.showMessage = this.isValidPasswordOrganization = ConfirmPasswordValidator.MatchPassword(
      this.organization.password,
      this.confirmPasswordOrganization
    );

    this.showMessage = this.isValidPasswordUser = ConfirmPasswordValidator.MatchPassword(
      this.user.password,
      this.confirmPasswordUser
    );

    if (!this.showMessage) {
      this.msgStatus = 'Verifique se as senhas são iguais.';
      return false;
    }

    this.showMessage = this.isValidCNPJ = CNPJValidator.MatchCNPJ(
      this.organization.cnpj
    );
    if (!this.showMessage) {
      this.msgStatus = 'CNPJ incorreto.';
      return false;
    } else {
      return true;
    }
  }

  onScriptLoad() {
    console.log('Google reCAPTCHA loaded and is ready for use!');
  }

  onScriptError() {
    console.log('Something went long when loading the Google reCAPTCHA');
  }

  save() {
    this.showMessage = true;
    if (!this.veryfyBeforeSave()) {
      return;
    }

    try {
      this.authService.signup(this.organization);
      this.msgStatus = 'Dados salvos com sucesso';
    } catch (error) {
      this.msgStatus = 'Erro ao salvar!';
      console.log(error);
    }
  }
}
