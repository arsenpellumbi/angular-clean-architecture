import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    this.authService.login(email, password).subscribe(
      () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          detail: 'Loged in successfully!',
        });
        this.router.navigate(['/projects']);
        form.reset();
      },
      (errorMessage: string) => {
        this.error = errorMessage;
        this.messageService.add({
          severity: 'error',
          detail: errorMessage,
        });
        this.isLoading = false;
      }
    );
  }
}
