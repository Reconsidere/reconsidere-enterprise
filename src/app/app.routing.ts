import { SchedulerComponent } from './scheduler/scheduler.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { VehicleManagementComponent } from './vehicle-management/vehicle-management.component';
import { AuthGuard } from './_guards';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { StartcenterComponent } from './startcenter/startcenter.component';

export const routes: Routes = [
  {
    path: '',
    component: StartcenterComponent,
    canActivate: [AuthGuard]
  },
  { path: 'sign-up', component: SignUpComponent },
  {
    path: 'vehicle-management',
    component: VehicleManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'scheduler',
    component: SchedulerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: SignInComponent
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];
export const ROUTING: ModuleWithProviders = RouterModule.forRoot(routes);
