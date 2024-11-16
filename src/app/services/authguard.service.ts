import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SalesService } from './sales.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService {

  constructor(private router: Router, private salesService: SalesService) { }

  async canActivate(): Promise<boolean> {
    let getToken = sessionStorage.getItem('token');
    debugger
    if (!getToken) {
      return true; // Allow access to login if not logged in
    } else {
      // Redirect to home if already logged in
      let role = sessionStorage.getItem('role');
      let alloteStatus = sessionStorage.getItem('allottmentStatus');
      let customerId = sessionStorage.getItem('customerId');
      let customerData: any;
      if (customerId) {
        customerData = await this.salesService.getCustomerById(customerId).toPromise()

      }
      if (role && role == 'Customer') {
        if (customerData.allottmentStatus == "No") {
          this.router.navigate(['booking-status'])

        } else {
          this.router.navigate(['/customer/customer_dashboard'])

        }
      } else if (role == 'AE' || role == 'AEE' || role == 'Surveyor') {
        this.router.navigate(['/employee/handingover_generate']);

      } else if (role == "Admin") {
        this.router.navigate(['/employee/all-schemes']);

      } else {
        this.router.navigate(['']);

      }
      return false;
    }
  }
}
