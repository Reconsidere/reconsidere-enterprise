import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ROUTING, routes } from './app.routing';
import {NgxMaskModule} from 'ngx-mask';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpService } from 'src/services/sign-up.service';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ROUTING,
    NgxMaskModule.forRoot(),
    HttpClientModule,
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(routes)

  ],
  
  providers: [{provide: APP_BASE_HREF, useValue: '/' }, SignUpService,ReactiveFormsModule,BrowserModule, RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
