import { first } from 'rxjs/operators';
import { User } from './../../../models/user';
import { Location } from './../../../models/location';
import { Observable } from 'rxjs/internal/Observable';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  QueryList
} from '@angular/core';
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
  profile: Profile;
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
  pageUser: number;
  organizationId: string;
  returnUrl: string;
  isChecked: boolean;
  menu: boolean;

  constructor(
    private authService: AuthService,
    private cepService: CepService,
    private userService: UserService,
    private router: Router
  ) {
    this.classifications = Object.values(Organization.Classification);
    this.profiles = Object.values(User.Profiles);
    this.organization = new Organization();
    this.organization.active = true;
    this.unit = new Units();
    this.unit.location = new Location();
    this.user = new User();
    this.user.active = true;
    this.profile = new Profile();
  }

  ngOnInit() {
    this.authService.isAuthenticated();
    this.page = 1;
    this.pageUnit = 1;
    this.pageUser = 1;
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
  }

  setId(id) {
    this.organizationId = id;
    if (id !== undefined) {
      this.menu = true;
      this.authService
        .getOrganization(this.organizationId, this.organization)
        .subscribe(item => this.loadOrganization(item), error => error);
    } else {
      this.menu = false;
    }
  }

  private loadOrganization(item) {
    this.organization = item[0];
    if (this.organization.users !== undefined) {
      this.show = true;
    }
    this.confirmPasswordOrganization =  this.organization.password;
  }

  CEPSearch(value) {
    this.cepService.search(value, this.unit.location);
  }

  clean() {
    this.organization = new Organization();
    this.organization.active = true;
    this.unit = new Units();
    this.unit.location = new Location();
    this.user = new User();
    this.user.active = true;
    this.profile = new Profile();
  }

  TypeOrganization(value) {
    if (value === Organization.Classification.Cooperativa) {
    } else if (value === Organization.Classification.Privada) {
    } else if (value === Organization.Classification.Municipio) {
    }
  }

  profileChange(value, checked) {
    if (this.profile === undefined && checked) {
      this.profile.access = [value];
    } else if (this.profile !== undefined && checked) {
      if (this.profile.access === undefined) {
        this.profile.access = [value];
      } else {
        this.profile.access.push(value);
      }
    } else if (!checked) {
      this.profile.access.forEach((item, index) => {
        if (item === value) {
          this.profile.access.splice(index, 1);
        }
      });
    }
  }

  verifyPasswordOrganization() {
    if (this.organization._id !== undefined) {
      this.isValidPasswordOrganization = ConfirmPasswordValidator.MatchPassword(
        this.authService.decript(this.organization.password),
        this.confirmPasswordOrganization
      );
      setTimeout(function() {}.bind(this), 1000);
    } else {
      this.isValidPasswordOrganization = ConfirmPasswordValidator.MatchPassword(
        this.organization.password,
        this.confirmPasswordOrganization
      );
      this.organization.password = this.authService.encript(
        this.organization.password
      );
    }
    setTimeout(function() {}.bind(this), 1000);
  }
  verifyPasswordUser() {
    if (this.user._id !== undefined) {
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
      this.user.password = this.authService.encript(this.user.password);
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
      this.organization.units === undefined ||
      this.organization.units.length <= 0
    ) {
      this.msgStatus =
        'Por favor, preencha os campos antes de salvar os dados!';
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
    this.cleanLocation();
    this.showUnit = true;
    this.msgStatus = 'Usuário adicionado com sucesso';
  }

  cleanLocation() {
    this.unit = new Units();
    this.unit.location = new Location();
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
    this.user.profiles = [this.profile];
    if (this.organization.users === undefined && this.user._id === undefined) {
      this.organization.users = [this.user];
      this.cleanUser();
    } else if (
      this.organization.users !== undefined &&
      this.user._id === undefined
    ) {
      this.organization.users.push(this.user);
      this.cleanUser();
    } else if (this.user._id !== undefined) {
      this.organization.users.forEach((item, index) => {
        if (item._id === this.user._id) {
          this.organization.users[index] = this.user;
          this.cleanUser();
          return;
        }
      });
    } else {
      this.organization.users.push(this.user);
      this.cleanUser();
    }
    this.show = true;
    this.msgStatus = 'Usuário adicionado com sucesso';
  }
  cleanUser() {
    this.user = new User();
    this.profile = new Profile();
    this.user.active = true;
    if (this.isChecked !== undefined) {
      this.isChecked = undefined;
    } else {
      this.isChecked = false;
    }
    this.confirmPasswordUser = undefined;
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
    this.user.password = this.authService.encript(user.password);
    this.confirmPasswordUser = user.password;
  }
  editLocation(unit: any) {
    this.unit = unit;
  }

  removeUnit(unit) {
    this.organization.units.forEach((item, index) => {
      if (item === unit) {
        this.organization.units.splice(index, 1);
        this.showMessage = true;
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
          this.showMessage = true;
          this.msgStatus = 'Usuário removida';
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
