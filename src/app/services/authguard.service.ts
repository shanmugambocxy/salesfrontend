import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService {

  constructor(private router: Router) { }

  canActivate(): boolean {
    let getToken = sessionStorage.getItem('token');
    debugger
    if (!getToken) {
      return true; // Allow access to login if not logged in
    } else {
      // Redirect to home if already logged in
      let role = sessionStorage.getItem('role');
      let alloteStatus = sessionStorage.getItem('allottmentStatus');
      if (role && role == 'Customer') {
        if (alloteStatus == "No") {
          this.router.navigate(['booking-status'])

        } else {
          this.router.navigate(['/customer/customer_dashboard'])

        }
      } else if (role == 'AE' || role == 'AEE' || role == 'Surveyor') {
        this.router.navigate(['/employee/handingover_generate']);

      } else {
        this.router.navigate(['/employee/all-schemes']);

      }
      return false;
    }
  }
}
