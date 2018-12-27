import { SchedulerComponent } from './scheduler/scheduler.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { VehicleManagementComponent } from './vehicle-management/vehicle-management/vehicle-management.component';


export const routes: Routes = [
        { path: 'sign-up', component: SignUpComponent},
        { path: 'vehicle-management', component: VehicleManagementComponent},
        { path: 'scheduler', component: SchedulerComponent}
];
export const ROUTING: ModuleWithProviders = RouterModule.forRoot(routes);
