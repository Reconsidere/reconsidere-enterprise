import { User } from './../../../models/user';
import { Location } from './../../../models/location';
import { Observable } from 'rxjs/internal/Observable';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from 'src/validations/confirm-password.validator';
import { CNPJValidator } from 'src/validations/valid-cnpj.validator';
import { AuthService } from 'src/services/auth.service';
import { promise, element } from 'protractor';
import { CepService } from 'src/services/cep.service';
import { Organization } from 'src/models/organization';
import { UserService } from 'src/services';
import { Units } from 'src/models/unit';

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
  unit: Units;
  show: boolean;
  showUnit: boolean;
  page: number;
  pageUnit: number;
  constructor(
    private authService: AuthService,
    private cepService: CepService,
    private userService: UserService
  ) {
    this.classifications = Object.values(Organization.Classification);
    this.profiles = Object.values(User.Profiles);
    this.organization = new Organization();
    this.organization.active = true;
    this.unit = new Units();
    this.unit.location = new Location();
    this.user = new User();
    this.user.active = true;
  }

  ngOnInit() {
    this.authService.isAuthenticated();
    const id = JSON.parse(localStorage.getItem('currentOrganizationID'));
    if (id !== null && id !== undefined) {
      this.authService
        .getOrganization(id, this.organization)
        .subscribe(item => this.loadOrganization(item));
    }
    this.page = 1;
    this.pageUnit = 1;
  }

  private loadOrganization(item) {
    this.organization = item[0];
    if (this.organization.users !== undefined) {
      this.show = true;
    }
    this.organization.password = this.authService.decript(
      this.organization.password
    );
    this.confirmPasswordOrganization = this.organization.password;
  }

  CEPSearch(value) {
    this.cepService.search(value, this.unit.location);
  }

  clean() {
    this.organization = new Organization();
    this.organization.active = true;
    this.unit.location = new Location();
    this.user = new User();
    this.user.active = true;
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
    if (this.user._id !== undefined || this.user._id !== '') {
      this.isValidPasswordUser = ConfirmPasswordValidator.MatchPassword(
        this.authService.decript(this.user.password),
        this.confirmPasswordUser
      );
      setTimeout(function() {}.bind(this), 1000);
    } else {
      this.isValidPasswordUser = ConfirmPasswordValidator.MatchPassword(
        this.user.password,
        this.confirmPasswordUser
      );
    }
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
      this.organization.company === undefined ||
      this.organization.units.length <= 0
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

  addOrUpdateLocation() {
    this.showMessage = true;
    if (!this.veryfyBeforeAddLocation()) {
      return;
    }

    if (this.organization.units === undefined) {
      const unit = new Units();
      unit.name = this.unit.name;
      unit.location = this.unit.location;
      this.organization.units = [unit];
    } else if (this.unit._id !== undefined) {
      this.organization.units.forEach((item, index) => {
        if (item._id === this.unit._id) {
          this.organization.units[index].name = this.unit.name;
          this.organization.units[index].location = this.unit.location;
        }
      });
    } else {
      this.organization.units.push(this.unit);
    }
    this.unit = new Units();
    this.unit.location = new Location();
    this.showUnit = true;
    this.msgStatus = 'Usuário adicionado com sucesso';
  }

  veryfyBeforeAddLocation() {
    if (this.unit.location === undefined) {
      this.showMessage = true;
      this.msgStatus =
        'Verifique se todos os dados da localização foram inseridos.';
      return false;
    }
    if (
      this.unit.location.state === undefined ||
      this.unit.location.cep === undefined ||
      this.unit.location.publicPlace === undefined ||
      this.unit.location.neighborhood === undefined ||
      this.unit.location.number === undefined ||
      this.unit.location.county === undefined
    ) {
      this.showMessage = true;
      this.msgStatus =
        'Verifique se todos os dados do usuário foram inseridos.';
      return false;
    }
    return true;
  }

  addOrUpdateUser() {
    this.showMessage = true;
    if (!this.veryfyBeforeAddUser()) {
      return;
    }

    if (this.organization.users === undefined && this.user._id === undefined) {
      this.organization.users = [this.user];
      this.user = new User();
    } else if (this.user._id !== undefined) {
      this.organization.users.forEach((item, index) => {
        if (item._id === this.user._id) {
          this.organization.users[index] = this.user;
          this.user = new User();
          this.confirmPasswordUser = '';
          return;
        }
      });
    } else {
      this.organization.users.push(this.user);
      this.user = new User();
    }
    this.show = true;
    this.msgStatus = 'Usuário adicionado com sucesso';
  }

  veryfyBeforeAddUser() {
    if (this.user === undefined) {
      this.showMessage = true;
      this.msgStatus =
        'Verifique se todos os dados do usuário foram inseridos.';
      return false;
    }
    if (
      this.user.email === undefined ||
      this.user.name === undefined ||
      this.user.password === undefined ||
      this.user.active === undefined
    ) {
      this.showMessage = true;
      this.msgStatus =
        'Verifique se todos os dados do usuário foram inseridos.';
      return false;
    }
    return true;
  }

  editUser(user: any) {
    this.user = user;
    this.user.password = this.authService.decript(user.password);
    this.confirmPasswordUser = user.password;
  }
  editLocation(unit: any) {
    this.unit = unit;
  }

  removeUnit(unit) {
    this.organization.users.forEach((item, index) => {
      if (item._id === unit._id) {
        this.organization.units.splice(index, 1);
      } else {
      }
    });
  }

  /**Remove from the list, if user not exist in database, if user exist dont remove from the list
   * because delete is blocked. Is permited only remove new user.
   */
  removeUser(user) {
    if (this.user._id === undefined) {
      this.organization.users.forEach((item, index) => {
        if (item === user) {
          this.organization.users.splice(index, 1);
        } else {
        }
      });
    }
  }

  save() {
    if (!this.myRecaptcha) {
      this.showMessage = true;
      this.msgStatus = 'Por favor, confirme: Não sou um robo';
      return;
    }

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
