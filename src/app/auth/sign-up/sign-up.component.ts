import { Hierarchy } from '../../../models/material';
import { first } from 'rxjs/operators';
import { User } from './../../../models/user';
import { Location } from './../../../models/location';
import { Observable } from 'rxjs/internal/Observable';
import { Component, OnInit, ViewChild, ElementRef, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from 'src/validations/confirm-password.validator';
import { CNPJValidator } from 'src/validations/valid-cnpj.validator';
import { AuthService } from 'src/services/auth.service';
import { promise, element } from 'protractor';
import { CepService } from 'src/services/cep.service';
import { Organization } from 'src/models/organization';
import { UserService } from 'src/services';
import { Units } from 'src/models/unit';
import { Profile } from 'src/models/profile';
import { access } from 'fs';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

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
  message: boolean;
  passwordUser: string;
  confirmPasswordUser: string;
  myRecaptcha: boolean;
  unit: Units;
  show: boolean;
  showUnit: boolean;
  page: number;
  pageUnit: number;
  pageUser: number;
  organizationId: string;
  returnUrl: string;
  isChecked: boolean;
  isLogged: boolean;
  dynamicCnpj: boolean;
  loading: boolean;
  hierarchy: Hierarchy;

  constructor(private authService: AuthService, private cepService: CepService, private userService: UserService, private router: Router) {
    this.classifications = Object.values(Organization.Classification);
    this.profiles = Object.values(User.Profiles);
    this.organization = new Organization();
    this.organization.hierarchy = new Hierarchy();
    this.organization.active = true;
    this.unit = new Units();
    this.unit.location = new Location();
    this.user = new User();
    this.user.profile = new Profile();
    this.user.active = true;
    this.hierarchy = new Hierarchy();
  }

  ngOnInit() {
    this.authService.isAuthenticated();
    this.dynamicCnpj = true;
    this.page = 1;
    this.pageUnit = 1;
    this.pageUser = 1;
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
    this.loading = false;
    this.isLogged = false;
  }



  setId(id) {
    this.organizationId = id;
    if (id !== undefined) {
      this.isLogged = true;
      this.authService.getOrganization(this.organizationId, this.organization).subscribe(item => this.loadOrganization(item), error => error);
    } else {
      this.isLogged = false;
    }
  }

  private loadOrganization(item) {
    this.organization = item;
    if (this.organization.users !== undefined) {
      this.show = true;
    }
    this.hierarchy = this.organization.hierarchy;
  }

  CEPSearch(value, e) {
    if (e.target.value === undefined || e.target.value === '') {
      this.requiredCheck(e);
      return;
    }
    this.loading = true;
    this.cepService.search(value, this.unit.location, this);
  }

  clean() {
    this.organization = new Organization();
    this.organization.hierarchy = new Hierarchy();
    this.organization.active = true;
    this.unit = new Units();
    this.unit.location = new Location();
    this.user = new User();
    this.user.profile = new Profile();
    this.user.active = true;
    this.passwordUser = undefined;
  }

  closeMessage() {
    this.message = undefined;
  }

  TypeOrganization(value, e) {
    if (value === Organization.Classification.Cooperativa) {
      this.dynamicCnpj = true;
    } else if (value === Organization.Classification.Privada) {
      this.dynamicCnpj = true;
    } else if (value === Organization.Classification.Municipio) {
      this.organization.cnpj = '';
      this.dynamicCnpj = false;
    }
  }

  verifyPasswordUser(e) {
    this.requiredCheck(e);
    if (this.passwordUser === undefined || this.passwordUser === '' || (this.confirmPasswordUser === undefined && this.confirmPasswordUser === '')) {
      return;
    }
    if (this.passwordUser === undefined || this.passwordUser === '' || this.confirmPasswordUser === undefined || this.confirmPasswordUser === '') {
      this.isValidPasswordUser = false;
      return;
    }
    this.user.password = this.passwordUser;
    this.user.password = this.authService.encript(this.user.password);
    this.confirmPasswordUser = this.authService.encript(this.confirmPasswordUser);

    this.isValidPasswordUser = ConfirmPasswordValidator.MatchPassword(this.user.password, this.confirmPasswordUser);
    setTimeout(function () { }.bind(this), 1000);
    if (this.isValidPasswordUser) {
      this.confirmPasswordUser = this.passwordUser;
    } else {
      this.confirmPasswordUser = this.authService.decript(this.confirmPasswordUser);
    }
  }
  requiredCheck(e) {
    if (e.target.value === undefined || e.target.value === '') {
      e.target.classList.add('is-invalid');
    } else {
      e.target.classList.remove('is-invalid');
    }
  }

  verifyCNPJ(e) {
    if (e.target.value === undefined || e.target.value === '') {
      this.requiredCheck(e);
      return;
    }
    this.isValidCNPJ = CNPJValidator.MatchCNPJ(this.organization.cnpj);
    setTimeout(function () { }.bind(this), 1000);
  }

  closeAlertMessage() {
    this.message = false;
  }
  veryfyBeforeSave() {
    if (!this.isLogged) {
      if (this.organization.email === undefined || this.organization.company === undefined || this.organization.tradingName === undefined || this.organization.phone === undefined || this.organization.cellPhone === undefined || this.organization.classification === undefined) {
        this.msgStatus = 'Por favor, preencha os campos antes de salvar os dados!';
        return false;
      }
    } else if (
      this.organization.email === undefined ||
      this.organization.company === undefined ||
      this.organization.tradingName === undefined ||
      this.organization.phone === undefined ||
      this.organization.cellPhone === undefined ||
      this.organization.classification === undefined ||
      this.organization.company === undefined ||
      this.organization.units === undefined ||
      this.organization.hierarchy === undefined ||
      this.organization.units.length <= 0
      || this.hierarchy.solid === undefined
    ) {
      this.msgStatus = 'Por favor, preencha os campos antes de salvar os dados!';
      return false;
    }
    if (this.organization.classification !== Organization.Classification.Municipio) {
      if (this.organization.cnpj === undefined) {
        this.msgStatus = 'Por favor, preencha os campos antes de salvar os dados!';
        return false;
      }
    }

    this.message = this.isValidCNPJ = CNPJValidator.MatchCNPJ(this.organization.cnpj);
    if (!this.message) {
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
    let add = false;
    this.message = true;
    if (!this.veryfyBeforeAddLocation()) {
      return;
    }

    if (this.organization.units === undefined && this.unit._id === undefined) {
      const unit = new Units();
      unit.name = this.unit.name;
      unit.location = this.unit.location;
      this.organization.units = [unit];
      add = true;
    } else if (this.organization.units !== undefined) {
      this.organization.units.forEach((unit, index) => {
        if (this.unit === unit) {
          this.organization.units[index] = unit;
          this.organization.units[index].name = this.unit.name;
          add = true;
        }
      });
    }
    if (!add) {
      this.organization.units.push(this.unit);
    }
    this.cleanLocation();
    this.showUnit = true;
    this.msgStatus = 'Unidade adicionada com sucesso';
  }

  cleanLocation() {
    this.unit = new Units();
    this.unit.location = new Location();
  }

  veryfyBeforeAddLocation() {
    if (this.unit.location === undefined) {
      this.message = true;
      this.msgStatus = 'Verifique se todos os dados da localização foram inseridos.';
      return false;
    }
    if (this.unit.location.state === undefined || this.unit.location.cep === undefined || this.unit.location.publicPlace === undefined || this.unit.location.neighborhood === undefined || this.unit.location.number === undefined || this.unit.location.number < 0 || this.unit.location.county === undefined) {
      this.message = true;
      this.msgStatus = 'Verifique se todos os dados do usuário foram inseridos.';
      return false;
    }
    return true;
  }

  enableDisbale(item, e) {
    item.active = e.checked;
  }

  addOrUpdateUser() {
    let add = false;
    this.message = true;
    if (!this.veryfyBeforeAddUser()) {
      return;
    }
    if (this.organization.users === undefined && this.user._id === undefined) {
      this.organization.users = [this.user];
      this.cleanUser();
    } else if (this.organization.users !== undefined) {
      this.organization.users.forEach((user, index) => {
        if (this.user === user) {
          this.organization.users[index] = user;
          add = true;
        }
      });
      if (!add) {
        this.organization.users.push(this.user);
      }
      this.cleanUser();
    }
    this.show = true;
    this.msgStatus = 'Usuário adicionado com sucesso';
  }
  cleanUser() {
    this.user = new User();
    this.user.profile = new Profile();
    this.user.active = true;
    if (this.isChecked !== undefined) {
      this.isChecked = undefined;
    } else {
      this.isChecked = false;
    }
    this.confirmPasswordUser = undefined;
    this.passwordUser = undefined;
  }

  veryfyBeforeAddUser() {
    if (this.user === undefined) {
      this.message = true;
      this.msgStatus = 'Verifique se todos os dados do usuário foram inseridos.';
      return false;
    }
    if (this.user.email === undefined || this.user.name === undefined || this.user.password === undefined || this.user.active === undefined) {
      this.message = true;
      this.msgStatus = 'Verifique se todos os dados do usuário foram inseridos.';
      return false;
    }
    return true;
  }

  editUser(user: any) {
    this.user = user;
    if (this.user._id) {
      this.passwordUser = this.authService.decript(user.password);
      this.confirmPasswordUser = this.passwordUser;
    }
    if (this.user._id === undefined || this.user._id === '') {
      this.passwordUser = this.authService.decript(this.user.password);
      this.confirmPasswordUser = this.passwordUser;
    }
  }
  editLocation(unit: any) {
    this.unit = unit;
  }

  removeUnit(unit) {
    this.organization.units.forEach((item, index) => {
      if (item === unit) {
        this.organization.units.splice(index, 1);
        this.message = true;
        this.msgStatus = 'Unidade removida';
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
          this.message = true;
          this.msgStatus = 'Usuário removido';
        } else {
        }
      });
    }
  }

  getAdmProfile() {
    const prof = new Profile();
    prof.name = User.Profiles.Administrator;
    prof.access = [User.Profiles.Administrator];
    return prof;
  }

  save() {
    if (!this.isLogged) {
      this.user.profile = this.getAdmProfile();
      this.user.active = true;
      this.veryfyBeforeAddUser();
      this.organization.active = true;
      this.organization.users = [this.user];
    }
    this.organization.hierarchy.solid.materials = this.hierarchy.solid.materials;

    if (!this.myRecaptcha) {
      this.message = true;
      this.msgStatus = 'Por favor, confirme: Não sou um robo';
      return;
    }

    this.message = true;
    if (!this.veryfyBeforeSave()) {
      return;
    }

    try {
      this.authService.signup(this.organization);
      if (this.organization._id === undefined) {
        this.router.navigate(['/']);
      }
      this.msgStatus = 'Dados salvos com sucesso';
    } catch (error) {
      this.msgStatus = 'Erro ao salvar!';
      console.log(error);
    }
  }
}
