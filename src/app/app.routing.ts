import { SignUpComponent } from './sign-up/sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';


export const routes: Routes = [
    { path: 'sign-up', component: SignUpComponent },
]
export const ROUTING: ModuleWithProviders = RouterModule.forRoot(routes);
