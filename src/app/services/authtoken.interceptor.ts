import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs';

export const authtokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('token');
  const router = inject(Router);



  debugger
  // ngxLoader.start();
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

          let checkUserType = sessionStorage.getItem('userType');
          if (checkUserType == "Customer") {
            sessionStorage.clear();
            router.navigate(['']);

          } else if (checkUserType == "Allotte") {
            sessionStorage.clear();
            router.navigate(['customer-allottee-login']);

          } else if (checkUserType == "Admin") {
            sessionStorage.clear();

            router.navigate(['officer-login']);

          } else {
            router.navigate([''])

          }
          // sessionStorage.clear();
          // this.toast.showToast(error, "You have again logged in another tab. Hence, this session is hereby logged out ", "")
          // Handle 401 Unauthorized, e.g., redirect to login
        } else if (error.status === 403) {
          console.error('Forbidden! Access denied.');
          // Handle 403 Forbidden
        } else if (error.status === 0) {

        }
      },

    }),
    // finalize(() => {
    //   // Stop the loader when the request completes (success or error)
    //   ngxLoader.stop();
    // })
  );
};
