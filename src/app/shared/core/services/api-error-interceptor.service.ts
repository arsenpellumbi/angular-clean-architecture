import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from '@angular/common/http';
import { take, exhaustMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Injectable()
export class ApiErrorInterceptorService implements HttpInterceptor {
  constructor(private messageService: MessageService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((errorResponse) => {
        if (errorResponse) {
          switch (errorResponse.status) {
            case 400:
              {
                const errors = errorResponse.error?.errors;
                if (errors) {
                  const errorMessages: string[] = Object.keys(errors).map(
                    (k) => errors[k]
                  );
                  if (errorMessages && errorMessages.length) {
                    errorMessages.forEach((message: string) => {
                      this.messageService.add({
                        severity: 'error',
                        detail: message,
                      });
                    });
                  } else {
                    this.messageService.add({
                      severity: 'error',
                      detail: 'An unknown error occured!',
                    });
                  }
                } else {
                  this.messageService.add({
                    severity: 'error',
                    detail: 'An unknown error occured!',
                  });
                }
              }
              break;
            case 401:
              this.router.navigate(['/error/401']);
              break;
            case 404:
              this.router.navigate(['/error/404']);
              break;
            default:
              this.router.navigate(['/error/500']);
              break;
          }
        } else {
          this.router.navigate(['/error/500']);
        }

        return throwError(errorResponse);
      })
    );
  }
}
