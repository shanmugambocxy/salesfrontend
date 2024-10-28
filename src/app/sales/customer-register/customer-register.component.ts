import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CustomerHeaderComponent } from '../customer-header/customer-header.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-customer-register',
  standalone: true,
  imports: [SharedModule, CustomerHeaderComponent],
  templateUrl: './customer-register.component.html',
  styleUrl: './customer-register.component.scss'
})

export class CustomerRegisterComponent {
  firstName!: string;
  lastName!: string;
  mobileNumber!: string;
  email!: string;
  aadhaar!: string;
  pan!: string;
  username!: string;
  password!: string;
  confirmPassword!: string;
  otp!: string;

  showSendOtpBtn: boolean = true;
  showVerifyOtpBtn: boolean = false;

  formFrozen: boolean = false;
  showOtpField: boolean = false;
  showResendButton: boolean = false;
  showTimer: boolean = false;
  minutes: number = 5;
  seconds: number = 0;
  timer: any;
  hide = true;
  hide2 = true;
  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastService,
    private location: Location
  ) { }

  sendOtp() {
    if (this.firstName && this.lastName && this.username && this.mobileNumber && this.aadhaar) {
      if (this.password == this.confirmPassword) {


        const data = {
          "firstname": this.firstName,
          "lastname": this.lastName,
          "username": this.username,
          "password": this.password,
          "email": this.email,
          "contactNumber": this.mobileNumber,
          "aadhaarNumber": this.aadhaar,
          "panNumber": this.pan
        }
        this.authService.sentOtpToCustomer(data).subscribe(
          (response: any) => {
            console.log(response);
            this.toast.showToast('success', 'Successfully sent OTP to Email', '');
            this.showSendOtpBtn = false;
            this.showVerifyOtpBtn = true;

            this.formFrozen = true;
            this.showOtpField = true;
            this.startTimer();
          },
          (error: any) => {
            console.error(error);
            this.toast.showToast('error', 'Error while sending OTP', '');
          }
        );
      } else {
        this.toast.showToast('error', 'Please Check The Confirm Password Fields.', '');

      }

    } else {
      this.toast.showToast('error', 'Please Fill Required Fields.', '');

    }
  }

  verifyOtp() {
    const data = {
      "email": this.email,
      "verifyToken": this.otp,
    }
    this.authService.customerOtpVerification(data).subscribe(
      (response: any) => {
        console.log(response);
        this.toast.showToast('success', 'OTP Verified Successfully', '');
        this.router.navigate(['/customer-login']);
      },
      (error: any) => {
        console.error(error);
        this.toast.showToast('error', 'Error while verifiying OTP', '');
      }
    );
  }

  startTimer() {
    this.showTimer = true;
    this.timer = setInterval(() => {
      if (this.minutes === 0 && this.seconds === 0) {
        clearInterval(this.timer);
        // this.showResendButton = true;
      } else {
        if (this.seconds === 0) {
          this.minutes--;
          this.seconds = 59;
        } else {
          this.seconds--;
        }
      }
    }, 1000);
  }

  resendOTP() {
    this.minutes = 5;
    this.seconds = 0;
    this.showResendButton = false;
    this.startTimer();
  }
  inputValidate(evt: any, field: any) {
    const theEvent = evt || window.event;
    let key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    let regexValue = /[0-9.]/;
    if (field == 'alphabets') {
      regexValue = /^[a-zA-Z]+$/;
    } else if (field == 'alphaNumeric') {
      regexValue = /[0-9A-Z]/;
    } else if (field == 'numbersonly') {
      regexValue = /[0-9]/;
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
  back() {
    this.location.back();
  }

}
