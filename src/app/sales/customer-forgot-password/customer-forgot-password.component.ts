import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CustomerHeaderComponent } from '../customer-header/customer-header.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { SalesService } from '../../services/sales.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-customer-forgot-password',
  standalone: true,
  imports: [SharedModule, CustomerHeaderComponent, MatRadioModule],
  templateUrl: './customer-forgot-password.component.html',
  styleUrl: './customer-forgot-password.component.scss'
})
export class CustomerForgotPasswordComponent {

  form!: FormGroup;
  options = '1';
  userName: any = "";
  mobile: any = "";
  email: any = "";
  aadharno: any = "";
  verify1: any = "";
  options2: any = "1"
  verify2: any = "";
  confirmpassword: any = "";
  isViewVerify1: boolean = false;
  isViewVerify2: boolean = false;
  isPaswordView: boolean = false;
  userNameData: any = ""
  constructor(private fb: FormBuilder, private salesService: SalesService, private toast: ToastService
  ) {

  }

  ngOnInit() {
    this.form = this.fb.group({

      // username: [''],
      name: [''],
      emailID: [''],
      mobileNummber: [''],
      aadharno: [''],
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

    })
  }
  search() {
    debugger
    let data: any = ''
    if (this.options == "1") {
      data = {
        "username": this.userName,
        "contactNumber": null,
        "email": null,
        "aadhaarNo": null
      }
    } else if (this.options == "2") {
      data = {
        "username": null,
        "contactNumber": this.mobile,
        "email": null,
        "aadhaarNo": null
      }
    }
    else if (this.options == "3") {
      data = {
        "username": null,
        "contactNumber": null,
        "email": this.email,
        "aadhaarNo": null
      }
    }
    else {
      data = {
        "username": null,
        "contactNumber": null,
        "email": null,
        "aadhaarNo": this.aadharno
      }
    }

    this.salesService.searchForgotPassword(data).subscribe((res: any) => {
      if (res && res.responseObject == "OTP generated successfully.") {
        this.isViewVerify1 = true;
      } else {
        this.isViewVerify1 = false;

      }
    })


  }

  verifyapi1() {
    this.salesService.forgotPasswordVerify1(this.verify1).subscribe(res => {
      if (res) {
        let getUserData: any = res;
        this.form.patchValue({
          name: getUserData.name,
          emailID: getUserData.email,
          mobileNummber: getUserData.contactNumber,
          aadharno: getUserData.aadhaarNo,
        })
        this.userNameData = getUserData.username;
        this.isViewVerify1 = false;
        this.isViewVerify2 = true;
      } else {
        this.isViewVerify2 = false;

        this.isViewVerify1 = true;

      }
    })
  }

  verifyapi2() {
    this.salesService.forgotPasswordSendOtp2(this.userNameData).subscribe((res: any) => {
      if (res && res.responseMessage == "OTP sent successfully") {
        this.isPaswordView = true;
        this.isViewVerify2 = false;
        this.isViewVerify1 = false;

      } else {
        this.isPaswordView = false;
        this.isViewVerify2 = true;
        this.isViewVerify1 = false;


      }
    })

  }

  changePassword() {


    let newPassword = this.form.value.password;
    let confirmPassword = this.form.value.confirmPassword;
    if (newPassword == confirmPassword) {
      let data = {
        "username": this.userNameData,
        "password": this.form.value.password,
        "forgotOtp": this.verify2
      }
      this.salesService.changePasswordForgot(data).subscribe((res: any) => {
        if (res && res.body && res.body.responseStatus) {
          this.toast.showToast('success', "Password Changed successfully", "")
        }
      })
    } else {
      this.toast.showToast('error', "Confirm password is not match", "")
    }


  }
  onSelectionChange(event: any) {
    console.log('options', this.options);

    this.userName = "";
    this.mobile = "";
    this.email = "";
    this.aadharno = "";
    debugger
  }

}
