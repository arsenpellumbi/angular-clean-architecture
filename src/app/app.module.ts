import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PrimeNgModule } from './prime-ng.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiErrorInterceptorService } from './shared/core/services/api-error-interceptor.service';
import { StaticMenuComponent } from './layouts/main-layout/static-menu/static-menu.component';
import { HeaderComponent } from './layouts/main-layout/header/header.component';
import { ContainerComponent } from './layouts/main-layout/container/container.component';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    StaticMenuComponent,
    HeaderComponent,
    ContainerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PrimeNgModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiErrorInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
