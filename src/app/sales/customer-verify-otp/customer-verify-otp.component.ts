import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CustomerHeaderComponent } from '../customer-header/customer-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-verify-otp',
  standalone: true,
  imports: [SharedModule, CustomerHeaderComponent],
  templateUrl: './customer-verify-otp.component.html',
  styleUrl: './customer-verify-otp.component.scss'
})
export class CustomerVerifyOtpComponent {
  otpverify: any = ''
  formData: any;
  showTimer: boolean = false;
  minutes: number = 3;
  seconds: number = 0;
  timer: any;
  endDate: any = '';
  constructor(private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toast: ToastService,
    private datePipe: DatePipe) {
    debugger
    let data: any = sessionStorage.getItem('formData')
    this.formData = JSON.parse(data);
    if (this.formData) {

    } else {
      this.back();
    }
    let endTime: any = sessionStorage.getItem('endTime');
    // this.endDate = endTime ? JSON.parse(endTime) : '';
    this.endDate = endTime ? endTime : '';

    console.log('formData', this.formData);

    this.getTimeDifference();
  }

  ngOnInit() {
    window.addEventListener('popstate', () => {

      console.log('User clicked back button');
      sessionStorage.removeItem('formData');
      sessionStorage.removeItem('endTime');
    });

  }

  getTimeDifference() {
    let startDate = new Date();
    let endDate = new Date(this.endDate);
    let diffInMilliseconds: any;

    if (startDate instanceof Date && endDate instanceof Date) {
      if (endDate.getTime() > startDate.getTime()) {
        diffInMilliseconds = Math.abs(endDate.getTime() - startDate.getTime())
      } else {
        diffInMilliseconds = endDate.getTime() - startDate.getTime()

      }
    } else {
      console.log('startdate', startDate);
      console.log('endDate', endDate);


    }



    if (diffInMilliseconds > 0) {
      console.log('diffInMilliseconds', diffInMilliseconds);

      // Convert milliseconds into seconds
      const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
      console.log('milliseconds', Math.round(diffInMilliseconds) / 1000);

      // Convert seconds into minutes and seconds
      // const minutes = Math.floor(diffInSeconds / 60);
      this.minutes = Math.round(diffInSeconds / 60);

      // const seconds = diffInSeconds % 60;
      // const seconds = 0;
      this.seconds = 0;


    } else {
      this.minutes = 0;
      this.seconds = 0;
    }

    this.startTimer();
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


  verifyOtp() {
    debugger
    let data = {
      "email": this.formData.email,
      "contactNumber": this.formData.contactNumber,
      "otp": this.otpverify
    }
    this.authService.verifyOTP(data).subscribe((res: any) => {
      if (res.responseMessage == "OTP verified successfully") {



        const customerData = {
          // "name": this.formData.name,
          // "username": this.formData.username,
          // "password": this.formData.password,
          // "email": this.formData.email,
          // "contactNumber": this.formData.contactNumber,
          // "aadhaarNumber": this.formData.aadhaarNumber,
          // "panNumber": this.formData.panNumber,
          // "allottmentStatus": "No",
          // "unitBooking": "No",



          "name": this.formData.name,
          "email": this.formData.email,
          "contactNumber": this.formData.contactNumber,
          "username": this.formData.username,
          "password": this.formData.password,
          "role": "Customer",
          "userType": "Customer",
          "citynRural": "",
          "division": "",
          "circle": "",
          "code": "",
          "aadhaarNo": this.formData.aadhaarNumber,
          "pancardNo": this.formData.panNumber,
          "bookingStatus": "No",
          "allottmentStatus": "No"
        }

        this.authService.sentOtpToCustomer(customerData).subscribe(
          (response: any) => {
            console.log(response);
            if (response) {
              this.toast.showToast('success', 'Registration Successfully ', '');
              this.router.navigate(['']);

            }

          },
          (error: any) => {
            console.error(error);
            this.toast.showToast('error', 'Error while Register', '');
          }
        );

      } else if (res.responseMessage == "Invalid OTP or user details. Please try again.") {

        this.toast.showToast('error', 'Invalid Otp', '');

      }
    })
  }
  resendOtp() {

    const currentDate = new Date();
    const newDate = new Date(currentDate.getTime() + 3 * 60000);
    // Format the new date using DatePipe
    const formattedDate = newDate;
    let data = {
      "email": this.formData.email,
      "contactNumber": this.formData.contactNumber,
      "otpCreatedDateTime": currentDate,
      "otpExpiryTime": formattedDate
    }
    this.authService.resendOTP(data).subscribe((res: any) => {
      if (res) {
        sessionStorage.setItem('endTime', res.responseObject.otpExpiryTime)
        this.endDate = res.responseObject.otpExpiryTime;
        this.getTimeDifference();
      }
    })
  }
  back() {
    this.router.navigate(['customer-register'])
  }

  ngOnDestroy() {
    sessionStorage.removeItem('formData');
    sessionStorage.removeItem('endTime');

  }

}
