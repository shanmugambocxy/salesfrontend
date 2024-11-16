import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor(private router: Router) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    debugger
    const authToken = sessionStorage.getItem('token');
    const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } });

    return next.handle(authReq).pipe(
      catchError(error => {
        // Handle specific error statuses here
        if (error.status === 401) {

          console.error('Unauthorized request');
          this.router.navigateByUrl('');
        }
        // Pass the error to the caller
        return throwError(error);
      })
    );
  }
}
