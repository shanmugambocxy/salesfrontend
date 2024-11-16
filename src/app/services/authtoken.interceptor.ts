import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export const authtokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('token');
  const router = inject(Router);

  debugger

  const skipTokenUrls = ['https://personnelapi.tnhb.in/getAllDivisionCode', '/another-public-endpoint'];

  // Check if the request URL matches any of the skipTokenUrls
  const shouldSkipToken = skipTokenUrls.some((url) => req.url.includes(url));
  const clonedRequest = !shouldSkipToken && token
    ? req.clone({
      headers: req.headers
        .set('Authorization', ` Bearer ${token}`)
      // .set('Content-Type', 'application/json'),
    })
    : req;
  // return next(clonedRequest);

  return next(clonedRequest).pipe(
    tap({
      next: (event: any) => {
        // Inspect successful responses
        if (event?.status) {
          console.log('HTTP Status Code:', event.status);
        }
      },
      error: (error) => {
        // Inspect errors
        console.error('Error Status Code:', error.status);
        if (error.status === 401) {
          console.error('Unauthorized! Redirecting to login...');
          // sessionStorage.clear();
          // router.navigate([''])
          // this.toast.showToast(error, "You have again logged in another tab. Hence, this session is hereby logged out ", "")
          // Handle 401 Unauthorized, e.g., redirect to login
        } else if (error.status === 403) {
          console.error('Forbidden! Access denied.');
          // Handle 403 Forbidden
        } else if (error.status === 0) {

        }
      },
    })
  );
};
