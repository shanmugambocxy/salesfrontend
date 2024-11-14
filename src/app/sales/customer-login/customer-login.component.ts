import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CaptchaService } from '../../services/captcha.service';
import { CryptoService } from '../../services/crypto.service';
import { ToastService } from '../../services/toast.service';
import { CustomerHeaderComponent } from '../customer-header/customer-header.component';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [SharedModule, CustomerHeaderComponent],
  templateUrl: './customer-login.component.html',
  styleUrl: './customer-login.component.scss'
})
export class CustomerLoginComponent implements OnInit, OnDestroy {

  message = '';
  invalidLogin = false
  form!: FormGroup;
  submitted = false;
  error!: string | null;
  hide = true;
  role: any;
  loginDisable: boolean = false;
  captcha!: string;
  userInput!: string;
  captchaStyle: any;
  decryptedResponse: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private titleService: Title,
    private toastService: ToastService,
    private captchaService: CaptchaService,
    private cryptoService: CryptoService,
    private toast: ToastService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.titleService.setTitle('Customer Login');
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9_.-]*$/), // Alphanumeric characters, underscores, dots, or dashes
        Validators.maxLength(20) // Maximum length of 20 characters
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8), // Minimum length of 8 characters
        Validators.maxLength(16), // Maximum length of 16 characters
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/) // Must contain at least one uppercase, one lowercase, one digit, one special character
      ]],
    });
    this.generateCaptcha();
    document.addEventListener('paste', this.preventPaste);
  }

  ngOnDestroy() {
    document.removeEventListener('paste', this.preventPaste);
  }

  preventPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    event.preventDefault(); // Prevent the default right-click behavior
  }

  inputValidate(evt: any, field: any) {
    const theEvent = evt || window.event;
    let key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    let regexValue = /[0-9.]/;
    if (field == 'alphabets') {
      regexValue = /^[a-zA-Z]+$/;
    } else if (field == 'alphaNumeric') {
      regexValue = /[0-9 a-zA-Z]/;
    } else if (field == 'numbersonly') {
      regexValue = /[.0-9 ]/;
    } else if (field == 'alphaNumericWithUnderscore') {
      regexValue = /^[a-zA-Z0-9_]+$/;
    } else if (field === 'email') {
      // Email regex pattern
      regexValue = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    }

    const regex = regexValue;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) {
        theEvent.preventDefault();
      }
    }

    // Prevent pasting using Ctrl+V within the keypress event
    if (theEvent.ctrlKey && (theEvent.key === 'v' || theEvent.key === 'V')) {
      theEvent.preventDefault();
    }

  }

  generateCaptcha(): void {
    const captchaData = this.captchaService.generateCaptchaWithStyle(6);
    this.captcha = captchaData.text;
    this.captchaStyle = captchaData.style;
  }

  preventRightClick(event: MouseEvent): void {
    event.preventDefault();
  }

  checkLogin() {
    debugger
    if (this.form.valid && this.userInput === this.captcha) {
      // this.loginDisable = true;
      // const encryptedCredentials = this.cryptoService.encrypt(this.form.value);
      const loginData = {
        username: this.form.get('username')?.value,
        password: this.form.get('password')?.value,
        // encData: encryptedCredentials
      }
      this.authService.customerLogin(loginData).subscribe(
        (response: any) => {
          console.log(response);
          if (response && response.responseObject.jwtCustomResponse.unitBookingEndTime) {

            let startDate: any = this.datePipe.transform(new Date(), 'dd/MM/yyyy, hh:mm:ss a');

            let endTime = this.parseDateEnd(response.responseObject.jwtCustomResponse.unitBookingEndTime);
            let currentDate = this.parseDateStart(startDate)
            if (currentDate.getTime() > endTime.getTime()) {
              // if (response && response.responseObject.jwtCustomResponse.message != "Your account is already in use on another device") {
              sessionStorage.setItem('token', response.responseObject.jwtCustomResponse.token);
              sessionStorage.setItem('username', response.responseObject.jwtCustomResponse.username);
              sessionStorage.setItem('customerId', response.responseObject.jwtCustomResponse.id);
              sessionStorage.setItem('role', 'Customer');
              sessionStorage.setItem('allottmentStatus', response.responseObject.jwtCustomResponse.allottmentStatus);
              sessionStorage.setItem('unitBooking', response.responseObject.jwtCustomResponse.unitBooking);

              if (response.responseObject.jwtCustomResponse.allottmentStatus == "No") {
                const targetUrl = this.authService.getTargetUrl();
                if (targetUrl) {
                  this.router.navigateByUrl(targetUrl);
                  this.authService.clearTargetUrl();
                } else {
                  // If no target URL, navigate to the default dashboard.
                  // this.router.navigate(['/customer/home']);
                  this.router.navigate([''])
                }
              } else {
                this.router.navigate(['/customer/customer_dashboard'])

              }

            } else {
              // this.logout(response.responseObject.jwtCustomResponse.id)
              this.toastService.showToast('error', "Your account is already in use on another device", "")

            }

          } else if (response && response.responseObject.jwtCustomResponse.message == "Your account is already in use on another device") {
            this.toastService.showToast('error', "Your account is already in use on another device", "")
            this.logout(response.responseObject.jwtCustomResponse.id)

          } else if (response && response.responseObject.jwtCustomResponse.token) {

            sessionStorage.setItem('token', response.responseObject.jwtCustomResponse.token);
            sessionStorage.setItem('username', response.responseObject.jwtCustomResponse.username);
            sessionStorage.setItem('customerId', response.responseObject.jwtCustomResponse.id);
            sessionStorage.setItem('role', 'Customer');
            sessionStorage.setItem('allottmentStatus', response.responseObject.jwtCustomResponse.allottmentStatus);
            sessionStorage.setItem('unitBooking', response.responseObject.jwtCustomResponse.unitBooking);

            if (response.responseObject.jwtCustomResponse.allottmentStatus == "No") {
              const targetUrl = this.authService.getTargetUrl();
              if (targetUrl) {
                this.router.navigateByUrl(targetUrl);
                this.authService.clearTargetUrl();
              } else {
                // If no target URL, navigate to the default dashboard.
                // this.router.navigate(['/customer/home']);
                this.router.navigate([''])
              }
            } else {
              this.router.navigate(['/customer/customer_dashboard'])

            }

          } else {

          }




          // if (response && response.responseObject.jwtCustomResponse.message != "Your account is already in use on another device") {
          //   let startDate: any = this.datePipe.transform(new Date(), 'dd/MM/yyyy, hh:mm:ss a');

          //   let endTime = this.parseDateEnd(response.responseObject.jwtCustomResponse.unitBookingEndTime);
          //   let currentDate = this.parseDateStart(startDate)
          //   if (currentDate.getTime() > endTime.getTime()) {
          //     // if (response && response.responseObject.jwtCustomResponse.message != "Your account is already in use on another device") {
          //     sessionStorage.setItem('token', response.responseObject.jwtCustomResponse.token);
          //     sessionStorage.setItem('username', response.responseObject.jwtCustomResponse.username);
          //     sessionStorage.setItem('customerId', response.responseObject.jwtCustomResponse.id);
          //     sessionStorage.setItem('role', 'Customer');
          //     sessionStorage.setItem('allottmentStatus', response.responseObject.jwtCustomResponse.allottmentStatus);
          //     sessionStorage.setItem('unitBooking', response.responseObject.jwtCustomResponse.unitBooking);

          //     if (response.responseObject.jwtCustomResponse.allottmentStatus == "No") {
          //       const targetUrl = this.authService.getTargetUrl();
          //       if (targetUrl) {
          //         this.router.navigateByUrl(targetUrl);
          //         this.authService.clearTargetUrl();
          //       } else {
          //         // If no target URL, navigate to the default dashboard.
          //         // this.router.navigate(['/customer/home']);
          //         this.router.navigate([''])
          //       }
          //     } else {
          //       this.router.navigate(['/customer/customer_dashboard'])

          //     }

          //   } else {
          //     // this.logout(response.responseObject.jwtCustomResponse.id)
          //     this.toastService.showToast('error', "Your account is already in use on another device", "")

          //   }
          //   // else {
          //   //   this.toastService.showToast('error', response.responseObject.jwtCustomResponse.message, "");
          //   // }
          // } else if (response && response.responseObject.jwtCustomResponse.message == "Your account is already in use on another device") {
          //   this.toastService.showToast('error', "Your account is already in use on another device", "")
          //   this.logout(response.responseObject.jwtCustomResponse.id)

          // }
        },
        (error: any) => {
          this.loginDisable = false;
          if (error.status === 429) {
            this.toastService.showToast('error', 'Account Locked Out', 'Your account has been temporarily locked out due to too many login attempts. Please try again later.');
          } else {
            this.toastService.showToast('error', 'Authentication failed', '');
          }
        }
      );
    } else {
      if (this.form.valid) {
        this.toastService.showToast('error', 'Enter Valid Captcha', '');
      } else if (this.userInput !== this.captcha) {
        this.toastService.showToast('error', 'Check Username or Password', '');
      }
    }
  }

  check() {
    window.open("https://www.google.com/", '_self');

  }

  logout(customerId: any) {


    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Logout',
        message: `Are you sure you want to Logout the previous Login?`
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        debugger
        sessionStorage.clear();
        this.authService.customerLogout(customerId).subscribe((res: any) => {
          if (res.message) {
            sessionStorage.clear();
            this.router.navigate(['']);
            this.toast.showToast('warning', "Logout Successfully.Now you can able to login", "")

          }
        })
      }
    })

  }

  parseDateEnd(dateString: string): Date {
    debugger
    const dateParts = dateString?.split(/,?\s+/); // Split date and time parts
    const [day, month, year] = dateParts[0]?.split('/')?.map(Number); // Parse date part
    const [time, period] = dateParts[1]?.split(' '); // Parse time and period (AM/PM)
    let [hours, minutes, seconds] = time?.split(':').map(Number); // Split hours and minutes

    // Convert PM to 24-hour format
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0; // Midnight case
    }
    let formatedDate = new Date(year, month - 1, day, hours, minutes, seconds);
    return formatedDate // Return parsed Date object


  }
  parseDateStart(dateString: string): Date {
    debugger
    const dateParts = dateString?.split(/,?\s+/); // Split date and time parts
    const [day, month, year] = dateParts[0]?.split('/')?.map(Number); // Parse date part
    const [time, period] = dateParts[1]?.split(' '); // Parse time and period (AM/PM)
    let [hours, minutes, seconds] = time?.split(':').map(Number); // Split hours and minutes

    // Convert PM to 24-hour format
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0; // Midnight case
    }
    let formatedDate = new Date(year, month - 1, day, hours, minutes, seconds);
    return formatedDate // Return parsed Date object


  }


}

