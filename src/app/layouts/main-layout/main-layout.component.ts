import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  items!: MenuItem[];



  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.items = [
      {
        icon: 'mdi mdi-home',
        label: 'Home',
        routerLink: ['/home'],
      },
      {
        icon: 'mdi mdi-folder',
        label: 'Projects',
        routerLink: ['/projects'],
      },
    ];
  }
}
