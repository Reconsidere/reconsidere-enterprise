import { environment } from 'src/environments/environment';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, enableProdMode } from '@angular/core';
import { APP_BASE_HREF, CommonModule, DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ROUTING, routes } from './app.routing';
import { NgxMaskModule } from 'ngx-mask';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { RouterModule } from '@angular/router';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { AdminComponent } from './admin/admin.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { StartcenterComponent } from './startcenter/startcenter.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { CepPipe } from '../pipes/cep.pipe';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VehicleManagementComponent } from './vehicle-management/vehicle-management.component';
import { NgxPaginationModule } from 'ngx-pagination';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { JwtInterceptor } from './security/jwt.interceptor';
import { ErrorInterceptor } from './security/error.interceptor';
import { DecriptEncript } from './security/decriptencript';
import { RecaptchaModule } from 'angular-google-recaptcha';
import { BooltransformPipe } from '../pipes/booltransform.pipe';
import { CalendarModule } from 'primeng/calendar';
import { DateconvertPipe } from '../pipes/dateconvert.pipe';
import { TermFilterPipe } from '../pipes/term-filter.pipe';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MaterialManagementComponent } from './material-management/material-management.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { InternalErrorComponent } from './errors/internal-error/internal-error.component';
import { UcFormComponent } from './forms/uc-form/uc-form.component';
import { HeaderComponent } from './forms/header/header.component';
import { FooterComponent } from './forms/footer/footer.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ToastrModule } from 'ngx-toastr';
import { FixedCostManagementComponent } from './fixed-cost-management/fixed-cost-management.component';
import { ProcessingChainManagementComponent } from './processing-chain-management/processing-chain-management.component';
import { CollectionCostManagementComponent } from './collection-cost-management/collection-cost-management.component';
import { ExpensesManagementComponent } from './expenses-management/expenses-management.component';
import { InconstantCostManagementComponent } from './inconstant-cost-management/inconstant-cost-management.component';
import { EntriesManagementComponent } from './entries-management/entries-management.component';
import { MaterialSummaryComponent } from './materialsummary/material-summary.component';
import { GroupbyPipe } from '../pipes/groupby.pipe';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';



registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    ForgotComponent,
    SignInComponent,
    LogoutComponent,
    AdminComponent,
    ToolbarComponent,
    StartcenterComponent,
    SchedulerComponent,
    CepPipe,
    VehicleManagementComponent,
    BooltransformPipe,
    DateconvertPipe,
    TermFilterPipe,
    MaterialManagementComponent,
    MaterialSummaryComponent,
    NotFoundComponent,
    InternalErrorComponent,
    UcFormComponent,
    HeaderComponent,
    FooterComponent,
    FixedCostManagementComponent,
    ProcessingChainManagementComponent,
    CollectionCostManagementComponent,
    ExpensesManagementComponent,
    InconstantCostManagementComponent,
    EntriesManagementComponent,
    GroupbyPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ROUTING,
    NgxMaskModule.forRoot(),
    HttpClientModule,
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    MatListModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    ToastrModule.forRoot({
        timeOut: 5000,
        progressBar: true,
        preventDuplicates: true
    }),
    FlatpickrModule.forRoot(),
    CommonModule,
    RecaptchaModule.forRoot({
      siteKey: '6Le4YIgUAAAAAJFj9q0jVjfxVR0D_QNfGetw0JKF'
    }),
    CalendarModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    NgbModule.forRoot(),
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LOCALE_ID, useValue: 'pt' },
    AuthService,
    ReactiveFormsModule,
    BrowserModule,
    RouterModule,
    DecriptEncript,
    DatePipe,
    FixedCostManagementComponent,
    ExpensesManagementComponent,
    InconstantCostManagementComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
