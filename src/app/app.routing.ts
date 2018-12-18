import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { VehicleManagementComponent } from './vehicle-management/vehicle-management/vehicle-management.component';
import { GeorouteManagementComponent } from './georoute-management/georoute-management.component';


export const routes: Routes = [
        { path: 'sign-up', component: SignUpComponent},
        { path: 'vehicle-management', component: VehicleManagementComponent},
        { path: 'georoute-management', component: GeorouteManagementComponent}
];
export const ROUTING: ModuleWithProviders = RouterModule.forRoot(routes);
