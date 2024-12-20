import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CaptchaService } from '../../services/captcha.service';
import { CryptoService } from '../../services/crypto.service';
import { ToastService } from '../../services/toast.service';
import { SharedModule } from '../../shared/shared.module';
import { CustomerHeaderComponent } from '../../sales/customer-header/customer-header.component';

@Component({
  selector: 'app-officer-login',
  standalone: true,
  imports: [SharedModule, CustomerHeaderComponent],
  templateUrl: './officer-login.component.html',
  styleUrl: './officer-login.component.scss'
})
export class OfficerLoginComponent implements OnInit, OnDestroy {

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
    private cryptoService: CryptoService
  ) {
    this.titleService.setTitle('Login');
  }

  ngOnInit(): void {
    sessionStorage.clear();
    sessionStorage.setItem('userType', "Admin");

    // sessionStorage.clear();



    this.form = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9_.-]*$/), // Alphanumeric characters, underscores, dots, or dashes
        // Validators.maxLength(20) // Maximum length of 20 characters
        Validators.maxLength(50) // Maximum length of 20 characters

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
      // this.authService.authenticate(loginData).subscribe(
      this.authService.customerLogin(loginData).subscribe(

        (response: any) => {
          console.log(response);
          if (response && response.responseObject.jwtCustomResponse.message == "Authentication successful") {
            if (response.responseObject.jwtCustomResponse.userType == "officer") {
              sessionStorage.setItem('token', response.responseObject.jwtCustomResponse.token);
              sessionStorage.setItem('username', response.responseObject.jwtCustomResponse.username);
              sessionStorage.setItem('code', response.responseObject.jwtCustomResponse.code);
              sessionStorage.setItem('division', response.responseObject.jwtCustomResponse.division);
              sessionStorage.setItem('role', response.responseObject.jwtCustomResponse.role);
              if (response.responseObject.jwtCustomResponse.role === 'AE' || response.responseObject.jwtCustomResponse.role === 'AEE' || response.responseObject.jwtCustomResponse.role === 'Surveyor') {
                this.router.navigate(['/employee/handingover_generate']);
                localStorage.setItem('subItem', "handingover")
              } else {
                this.router.navigate(['/employee/all-schemes']);
              }
            } else {
              this.toastService.showToast("error", "Login Invalid", "")
            }

          }
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

}
