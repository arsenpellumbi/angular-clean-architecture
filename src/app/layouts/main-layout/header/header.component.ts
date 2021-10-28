import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userCardItems = [
    {
      label: 'Account',
      items: [
        {
          label: 'Logout',
          icon: 'mdi mdi-logout',
          command: () => {
            this.logout();
          },
        },
      ],
    },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  logout() {
    this.authService.logout();
  }
}
