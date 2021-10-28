import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../prime-ng.module';
import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './error.component';
import { Error404Component } from './error404/error404.component';
import { Error401Component } from './error401/error401.component';
import { Error500Component } from './error500/error500.component';

@NgModule({
  declarations: [ErrorComponent, Error404Component, Error401Component, Error500Component],
  imports: [CommonModule, PrimeNgModule, ErrorRoutingModule],
})
export class ErrorModule {}
