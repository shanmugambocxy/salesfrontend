import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CustomerHeaderComponent } from '../customer-header/customer-header.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Location } from '@angular/common';
import { CaptchaService } from '../../services/captcha.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-register',
  standalone: true,
  imports: [SharedModule, CustomerHeaderComponent],
  templateUrl: './customer-register.component.html',
  styleUrl: './customer-register.component.scss'
})

export class CustomerRegisterComponent {
  name!: string;
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

  captcha!: string;
  captchaStyle: any;
  captchatxt: any;
  form!: FormGroup;
  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastService,
    private location: Location,
    private captchaService: CaptchaService,
    private fb: FormBuilder,
  ) {
    this.generateCaptcha()
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      email: ['', Validators.required],
      aadhaar: ['', Validators.required],
      pan: ['', Validators.required],
      captchatxt: ['', Validators.required],
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
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(8), // Minimum length of 8 characters
        Validators.maxLength(16), // Maximum length of 16 characters
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/) // Must contain at least one uppercase, one lowercase, one digit, one special character
      ]],
      allottmentStatus: ['No'],
      unitBooking: ['No']
    })
  }




  sendOtp() {
    debugger
    if (this.form.valid) {
      if (this.form.value.name && this.form.value.username && this.form.value.mobileNumber && this.form.value.aadhaar) {
        if (this.form.value.password == this.form.value.confirmPassword) {
          if (this.captcha == this.form.value.captchatxt) {
            let create = {
              "email": this.form.value.email,
              "contactNumber": this.form.value.mobileNumber
            }
            this.authService.createRegistration(create).subscribe((res: any) => {
              if (res && res.responseMessage == "OTP Send successfully") {
                const data = {
                  "name": this.form.value.name,
                  "username": this.form.value.username,
                  "password": this.form.value.password,
                  "email": this.form.value.email,
                  "contactNumber": this.form.value.mobileNumber,
                  "aadhaarNumber": this.form.value.aadhaar,
                  "panNumber": this.form.value.pan,
                  "allottmentStatus": "No",
                  "unitBooking": "No",
                }
                sessionStorage.setItem('endTime', res.responseObject.otpExpiryTime)
                sessionStorage.setItem('formData', JSON.stringify(data))
                this.router.navigate(['verify-otp'])

              } else if (res.responseMessage == "Email already exists" || res.responseMessage == "ContactNumber already exists") {
                this.toast.showToast('error', res.responseMessage + " " + ".Otp sent successfully", "")
                let resendOTP = {
                  "email": this.form.value.email,
                  "contactNumber": this.form.value.mobileNumber
                }
                this.authService.resendOTP(resendOTP).subscribe((res: any) => {
                  if (res) {
                    const data = {
                      "name": this.form.value.name,
                      "username": this.form.value.username,
                      "password": this.form.value.password,
                      "email": this.form.value.email,
                      "contactNumber": this.form.value.mobileNumber,
                      "aadhaarNumber": this.form.value.aadhaar,
                      "panNumber": this.form.value.pan,
                      "allottmentStatus": "No",
                      "unitBooking": "No",
                    }
                    sessionStorage.setItem('endTime', res.responseObject.otpExpiryTime)

                    sessionStorage.setItem('formData', JSON.stringify(data))
                    this.router.navigate(['verify-otp'])
                  }


                })
              }

            })


          } else {
            this.toast.showToast('error', 'Please Enter Valid Captcha.', '');

          }
          // const data = {
          //   "name": this.name,
          //   "username": this.username,
          //   "password": this.password,
          //   "email": this.email,
          //   "contactNumber": this.mobileNumber,
          //   "aadhaarNumber": this.aadhaar,
          //   "panNumber": this.pan,
          //   "allottmentStatus": "No",
          //   "unitBooking": "No"
          // }
          // this.authService.sentOtpToCustomer(data).subscribe(
          //   (response: any) => {
          //     console.log(response);
          //     this.toast.showToast('success', 'Successfully sent OTP to Email', '');
          //     this.showSendOtpBtn = false;
          //     this.showVerifyOtpBtn = true;

          //     this.formFrozen = true;
          //     this.showOtpField = true;
          //     this.startTimer();
          //   },
          //   (error: any) => {
          //     console.error(error);
          //     this.toast.showToast('error', 'Error while sending OTP', '');
          //   }
          // );
        } else {
          this.toast.showToast('error', 'Please Check The Confirm Password Fields.', '');

        }

      } else {
        this.toast.showToast('error', 'Please Fill Required Fields.', '');

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



    this.authService.resendOtp(this.email).subscribe(res => {
      if (res) {
        this.minutes = 5;
        this.seconds = 0;
        this.showResendButton = false;
        this.startTimer();

      }
    })
  }

  generateCaptcha(): void {
    const captchaData = this.captchaService.generateCaptchaWithStyle(6);
    this.captcha = captchaData.text;
    this.captchaStyle = captchaData.style;
  }
  inputValidate(evt: any, field: any) {
    const theEvent = evt || window.event;
    let key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    let regexValue = /[0-9.]/;
    if (field == 'alphabets') {
      regexValue = /^[a-zA-Z]+$/;
    } else if (field == 'alphaNumeric') {
      regexValue = /[0-9A-Za-z]/;
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
  preventRightClick(event: MouseEvent): void {
    event.preventDefault();
  }
  back() {
    this.location.back();
  }



  verifyMobileNumber(event: any) {
    debugger
    let value = event.target.value;
    if (value.length == 10) {
      // alert("mobilenumber " + value)

    }
  }

  verifyEmail() {
    debugger
  }

}
