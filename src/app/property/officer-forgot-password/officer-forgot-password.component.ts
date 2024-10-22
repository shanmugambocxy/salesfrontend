import { Component, HostListener, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CaptchaService } from '../../services/captcha.service';
import { CryptoService } from '../../services/crypto.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-officer-forgot-password',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './officer-forgot-password.component.html',
  styleUrl: './officer-forgot-password.component.scss'
})
export class OfficerForgotPasswordComponent implements OnInit {

  captchaStyle: any;
  captcha!: string;

  username: any;
  otp!: number;
  newpassword: any;
  cnfpassword: any;
  captchaCode: any;

  usernameDisable: boolean = false;
  sendOtpDisable: boolean = false;
  password: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private titleService: Title,
    private toastService: ToastService,
    private captchaService: CaptchaService,
    private cryptoService: CryptoService
  ) {
    this.titleService.setTitle('Officer | Forgot Password');
  }
  ngOnInit(): void {
    this.generateCaptcha();
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

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    event.preventDefault(); // Prevent the default right-click behavior
  }

  preventRightClick(event: MouseEvent): void {
    event.preventDefault();
  }

  generateCaptcha(): void {
    const captchaData = this.captchaService.generateCaptchaWithStyle(6);
    this.captcha = captchaData.text;
    this.captchaStyle = captchaData.style;
  }

  sendOtp() {
    const username = this.username;
    if (username) {
      this.usernameDisable = true;
      this.sendOtpDisable = true;
      this.authService.officerSendOtp(username).subscribe(
        (response: any) => {
          console.log(response);
          if (response.responseMessage === 'OTP sent successfully') {
            this.toastService.showToast('success', 'OTP Sent to Admin', '');
            this.usernameDisable = true;
            this.sendOtpDisable = true;
            this.password = true;
          }
        },
        (error: any) => {
          console.error(error);
          this.usernameDisable = false;
          this.sendOtpDisable = false;
          if (error.error.responseMessage === 'Username not found') {
            this.toastService.showToast('error', 'Username not found', '');
          } else {
            this.toastService.showToast('error', 'Error while sending OTP', '');
          }
        }
      );
    } else {
      this.toastService.showToast('warning', 'Enter Valid Username', '');
    }
  }

  resetPassword() {
    if (this.captchaCode) {
      if (this.otp && this.newpassword && this.cnfpassword) {
        if (this.newpassword === this.cnfpassword) {
          const data = {
            password: this.newpassword,
            token: this.otp
          };
          this.authService.resetPasswordForOfficer(data).subscribe(
            (response: any) => {
              console.log(response);
              this.toastService.showToast('success', 'Password reset successful', '');
              this.router.navigate(['/officer-login']);
            },
            (error: any) => {
              console.error(error);
              if (error.error.message === 'User not found for the provided token.') {
                this.toastService.showToast('error', 'Enter Valid OTP', '');
              } else {
                this.toastService.showToast('error', 'Password reset failed', error.message || '');
              }
            }
          );
        } else {
          this.toastService.showToast('warning', 'Passwords do not match', '');
        }
      } else {
        this.toastService.showToast('warning', 'Fill all the fields', '');
      }
    } else {
      this.toastService.showToast('warning', 'Enter Captcha', '');
    }
  }


}
