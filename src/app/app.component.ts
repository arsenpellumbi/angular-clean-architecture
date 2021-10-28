import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './auth/core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-clean-architecture';

  constructor(private primengConfig: PrimeNGConfig, private authService: AuthService) {}
  
  ngOnInit() {
    this.authService.autoLogin();
    this.primengConfig.ripple = true;
  }
}
