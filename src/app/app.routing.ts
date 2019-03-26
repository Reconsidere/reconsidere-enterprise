import { LogoutComponent } from './auth/logout/logout.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { VehicleManagementComponent } from './vehicle-management/vehicle-management.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { StartcenterComponent } from './startcenter/startcenter.component';
import { AuthGuard } from '../guards/auth.guard';
import { MaterialManagementComponent } from './material-management/material-management.component';
import { PricingComponent } from './pricing/pricing.component';
import { UcFormComponent } from './forms/uc-form/uc-form.component';
import { FixedCostManagementComponent } from './fixed-cost-management/fixed-cost-management.component';
import { ProcessingChainManagementComponent } from './processing-chain-management/processing-chain-management.component';
import { CollectionCostManagementComponent } from './collection-cost-management/collection-cost-management.component';
import { ExpensesManagementComponent } from './expenses-management/expenses-management.component';
import { EntriesManagementComponent } from './entries-management/entries-management.component';

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

  //Módulo financeiro
  {path: 'processing-chain-management', component: ProcessingChainManagementComponent, canActivate: [AuthGuard]},
  {path: 'expenses-management', component: ExpensesManagementComponent, canActivate: [AuthGuard]},
  {path: 'incoming-out-management', component: EntriesManagementComponent, canActivate: [AuthGuard]},

  //Módulo de formulários
  {path: 'uc-form', component: UcFormComponent },
  {path: 'citizen-registration', component: UcFormComponent },

  //Qualquer outro acesso
  {path: '**', redirectTo: '' }
];
export const ROUTING: ModuleWithProviders = RouterModule.forRoot(routes);
