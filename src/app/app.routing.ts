import { LogoutComponent } from './auth/logout/logout.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { VehicleManagementComponent } from './vehicle-management/vehicle-management.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { StartcenterComponent } from './startcenter/startcenter.component';
import { AuthGuard } from './_guards/auth.guard';
import { MaterialManagementComponent } from './material-management/material-management.component';
import { PricingComponent } from './pricing/pricing.component';

export const routes: Routes = [
  //Módulo de segurança
  {path: '', component: StartcenterComponent, canActivate: [AuthGuard]},
  {path: 'sign-up', component: SignUpComponent },
  {path: 'login', component: SignInComponent},
  {path: 'logout', component: LogoutComponent},

  //Módulo de materiais
  {path: 'account', component: SignUpComponent, canActivate: [AuthGuard] },
  {path: 'vehicle-management', component: VehicleManagementComponent, canActivate: [AuthGuard] },
  {path: 'material-management', component: MaterialManagementComponent, canActivate: [AuthGuard]},
  {path: 'scheduler', component: SchedulerComponent, canActivate: [AuthGuard]},
  {path: 'pricing', component: PricingComponent, canActivate: [AuthGuard]},

  //Módulo de formulários

  //Qualquer outro acesso
  {path: '**', redirectTo: '' }
];
export const ROUTING: ModuleWithProviders = RouterModule.forRoot(routes);
