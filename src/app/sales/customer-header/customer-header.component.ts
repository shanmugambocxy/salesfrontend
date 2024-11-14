import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-header',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-header.component.html',
  styleUrl: './customer-header.component.scss',

})
export class CustomerHeaderComponent {
  isLoggedIn$ = this.authService.isLoggedIn;
  username: any = '';

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog,) {

    this.username = sessionStorage.getItem('username');
  }
  goToUrl(url: any) {
    this.router.navigateByUrl(url);
  }
  logout() {


    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Logout',
        message: `Are you sure you want to Logout?`
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // sessionStorage.clear();
        let customerId = sessionStorage.getItem('customerId');
        debugger
        this.authService.customerLogout(customerId).subscribe((res: any) => {
          if (res.message) {
            sessionStorage.clear();
            this.router.navigateByUrl('/customer-login');

          }
        })
      }
    })

  }

  goToRegistration() {
    this.router.navigateByUrl('customer-register')
  }
}
