import { Component, HostListener, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SalesService } from '../../services/sales.service';
import { Observable, forkJoin } from 'rxjs';
import { ReservationService } from '../../services/reservation.service';
import { Title } from '@angular/platform-browser';
import { ToastService } from '../../services/toast.service';
import { PropertyService } from '../../services/property.service';
import { MatStepper } from '@angular/material/stepper';
import { DatePipe, Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-customer-application',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-application.component.html',
  styleUrl: './customer-application.component.scss'
})

export class CustomerApplicationComponent {

  unitDetailsForm!: FormGroup;
  applicantForm!: FormGroup;
  bankDetailsForm!: FormGroup;
  feeForm!: FormGroup;

  maxPhotoSizeInBytes = 5 * 1024 * 1024;
  maxFileSizeInBytes = 8 * 1024 * 1024;
  photoSizeError = false;
  fileSizeError = false;
  reservationStatus: any;
  customerId: any;
  id: any;
  email: any;
  phonenumber: any;
  Date: any;
  selectedPhotoFileName: any;
  selectedSignatureFileName: any;
  blockNo!: any;
  schemeId: any;
  unitNId: any;
  floorNo!: any;
  reservation: any;
  populateData: any;
  incomeData: any;
  incomeNotMatched: boolean = true;

  carParkingSlot1: any;
  carParkingSlot2: any;
  modeOfAllotement: any = '';

  reservationId: any;

  selectedJointSignatureFileName: any;
  reservationDeclarationForm: FormGroup;

  maxDate!: string;

  minutes = 20;
  seconds = 0;
  interval: any;
  logoutminutes = 21;
  logoutseconds = 0;
  logoutinterval: any;

  nativeOfTamilnaduFile!: File;
  birthCertificateFile!: File;
  aadhaarProofFile!: File;
  panProofFile!: File;
  incomeCertificateFile!: File;
  reservationCategoryProofFile!: File;
  reservationSubCategoryProofFile!: File;
  signatureFile!: File;
  jointSignatureFile!: File;
  applicantPhotoFile!: File;
  imgUrl: any;

  selfDeclaration: boolean = false;

  districts = [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kancheepuram",
    "Kanniyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivagangai",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thiruvallur",
    "Thiruvarur",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvannamalai",
    "Vellore",
    "Villuppuram",
    "Virudhunagar"
  ];

  stateList = ["Tamilnadu"]
  @ViewChild('stepper') private stepper!: MatStepper;

  constructor(
    private formBuilder: FormBuilder,
    private salesService: SalesService,
    private dialog: MatDialog,
    private router: Router,
    private reservationService: ReservationService,
    private title: Title,
    private toast: ToastService,
    private propertyService: PropertyService,
    private location: Location,
    private datePipe: DatePipe,
    private authService: AuthService
  ) {
    this.title.setTitle('Application Form');
    this.reservationDeclarationForm = this.formBuilder.group({
      check1: [false, Validators.requiredTrue],
      check2: [false, Validators.requiredTrue],
      check3: [false, Validators.requiredTrue],
      check4: [false, Validators.requiredTrue],
      check5: [false, Validators.requiredTrue],
      check6: [false, Validators.requiredTrue],
    });




  }


  // @HostListener('window:load', ['$event'])
  // onLoad(event: Event) {
  //   this.router.navigate(['/customer/home']);
  // }
  ngOnInit() {
    window.addEventListener('popstate', () => {

      console.log('User clicked back button');
      this.logout();

    });
    // let minutes = sessionStorage.getItem('minutes');
    // let seconds = sessionStorage.getItem('seconds')
    // this.minutes = minutes ? parseInt(minutes) : 0;
    // this.seconds = seconds ? parseInt(seconds) : 0;
    debugger
    this.reservationStatus = sessionStorage.getItem('reservationStatus');
    this.customerId = sessionStorage.getItem('customerId');
    this.blockNo = sessionStorage.getItem('block');
    this.schemeId = sessionStorage.getItem('schemeId');
    this.unitNId = sessionStorage.getItem('unitId');
    this.floorNo = sessionStorage.getItem('floor');
    this.id = sessionStorage.getItem('id');
    this.carParkingSlot1 = sessionStorage.getItem('selectedCarParkingSlot1');
    this.carParkingSlot2 = sessionStorage.getItem('selectedCarParkingSlot2');
    this.reservationId = sessionStorage.getItem('reservationId');
    // this.propertyService.getSchemeById(schemeId).subscribe(res => {
    //   if (res) {

    //   }
    // })
    this.salesService.getUpdatedTimeByUnit(this.schemeId, 1).subscribe(getRes => {
      if (getRes && getRes.responseObject) {

        let checkUnit = getRes.responseObject.filter((x: any) => x.id == this.unitNId);
        debugger
        if (checkUnit && checkUnit.length > 0 && checkUnit[0].bookingStatus != 'Completed') {
          let curreDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy, hh:mm:ss a');
          let getMinutesAndSeconds = this.getTimeDifference(curreDate, checkUnit[0]?.unitBookingEndTime)
          console.log('getMinutesAndSeconds', getMinutesAndSeconds);
          var minitues: any = "";
          var seconds: any = "";
          minitues = getMinutesAndSeconds.minutes && getMinutesAndSeconds.minutes > 20 ? 0 : getMinutesAndSeconds.minutes;
          seconds = getMinutesAndSeconds.seconds;

          this.minutes = minitues;
          this.seconds = seconds;
          // let logOutMinutesSeconds = this.getTimeDifference(curreDate, checkUnit[0]?.logoutEndTime);
          // this.logoutminutes = logOutMinutesSeconds.minutes && logOutMinutesSeconds.minutes > 21 ? 0 : logOutMinutesSeconds.minutes;
          // this.logoutseconds = logOutMinutesSeconds.seconds;
          this.startTimer();
          // this.startTimerLogout();


        }


      }

    })

    this.unitDetailsForm = this.formBuilder.group({
      unitAccountNo: [''],
      unitType: [''],
      cityRural: [''],
      circle: [''],
      divisionName: [''],
      scheme: [''],
      type: [''],
      blockNo: [''],
      floorNo: [''],
      unitNo: [''],
      UDS_Area: [''],
      plinthArea: [''],

      ccCode: [''],
      priorityCode: [''],
      reservationName: [''],

      priorityBasis: [''],
      costOfUnit: ['']
    });

    this.applicantForm = this.formBuilder.group({
      applicantName: [''],
      dateOfBirth: [''],
      age: [''],
      maritalStatus: [''],
      aadhaarNumber: [''],
      panNumber: [''],
      applicantFathersName: [''],


      jointApplicantName: [''],
      jointApplicantDateOfBirth: [''],
      jointApplicantAge: [''],
      jointApplicantAadhaarNumber: [''],
      relationWithApplicant: [''],
      jointApplicantFathername: [''],

      mobileNumber: [''],
      emailId: [''],
      address1: [''],
      address2: [''],
      pincode: [''],
      district: [''],
      state: [''],


      applicantMonthlyIncome: [''],
      jointApplicantMonthlyIncome: [''],
      totalMonthlyIncome: [''],


      applicantSpouseName: [''],
      jointApplicantSpouseName: [''],


    });

    this.bankDetailsForm = this.formBuilder.group({
      bankName: [''],
      accountNumber: [''],
      ifscCode: ['', [Validators.required, Validators.pattern('^[A-Z]{4}0[0-9]{6}$')]],
      accountHolderName: [''],
      branchName: ['']
    });

    this.feeForm = this.formBuilder.group({
      applicationFee: [''],
      registrationFee: [200],
      amountPaid: [''],
      grandTotal: ['']
    });

    this.getDate();
    this.getUnitSchemeDetails();
    this.setMaxDate();
    this.getCustomerById();
    // if (this.reservationId) {
    //   this.getReservationData();
    // }
    this.getAllIncome();
    this.calculateTotalMonthlyIncome();
    this.deleteBookingList();
  }
  // @HostListener('window:load', ['$event'])
  // onLoad(event: Event) {
  //   this.router.navigate(['/customer/home']);
  // }
  getTimeDifference(start: any, end: any): { minutes: number, seconds: number } {

    debugger

    const startDate = this.parseDate(start);
    const endDate = this.parseDate(end);

    let startDateWithTime = startDate.getTime();
    let endDateWithTime = endDate.getTime();
    let diffInMilliseconds: any;
    if (endDate.getTime() > startDate.getTime()) {
      diffInMilliseconds = Math.abs(endDate.getTime() - startDate.getTime())
    } else {
      diffInMilliseconds = endDate.getTime() - startDate.getTime()

    }



    if (diffInMilliseconds > 0) {
      console.log('diffInMilliseconds', diffInMilliseconds);

      // Convert milliseconds into seconds
      const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
      console.log('milliseconds', Math.round(diffInMilliseconds) / 1000);

      // Convert seconds into minutes and seconds
      // const minutes = Math.floor(diffInSeconds / 60);
      const minutes = Math.round(diffInSeconds / 60);

      // const seconds = diffInSeconds % 60;
      // const seconds = 0;
      const seconds = 0;

      return { minutes, seconds };
    } else {
      const minutes = 0;
      const seconds = 0;
      return { minutes, seconds };
    }


    // if (minutes < 31) {
    //   return { minutes, seconds };
    // } else {
    //   const minutes = 0;
    //   const seconds = 0;
    //   return { minutes, seconds };
    // }

  }
  parseDate(dateString: string): Date {
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

    return new Date(year, month - 1, day, hours, minutes, seconds); // Return parsed Date object

    // const parsedDate = new Date(dateString);

    // // Format it using DatePipe
    // const formattedDate = this.datePipe.transform(parsedDate, 'EEE MMM d yyyy HH:mm:ss zzzz', 'GMT+0530');
    // // let checkDate = formattedDate;

    // return parsedDate;
  }
  deleteBookingList() {
    this.salesService.deleteALLBookingDetailsList().subscribe(res => {

    })
  }

  setApplicationFee() {
    let applicationFee: string;
    debugger
    // switch (this.populateData.schemeData.schemeType) {
    //   case 'HIG':
    //     applicationFee = '500';
    //     break;
    //   case 'MIG':
    //     applicationFee = '300';
    //     break;
    //   case 'LIG':
    //     applicationFee = '200';
    //     break;
    //   case 'EWS':
    //     applicationFee = '100';
    //     break;
    //   default:
    //     applicationFee = '0';
    //     break;
    // }
    this.propertyService.getAllApplication().subscribe(
      (response: any) => {
        console.log(response);
        if (response) {
          let application = response;
          let filterType = application.filter((x: any) => x.type == this.populateData.schemeData.schemeType)
          if (filterType && filterType.length > 0) {
            applicationFee = filterType[0].fees;
            this.feeForm.patchValue({ applicationFee: applicationFee });
            this.calculateGrandTotal();
          }
        }

      },
      (error: any) => {
        console.error(error);
      }
    );


  }

  // @HostListener('window:popstate', ['$event'])
  // onPopState(event: any): void {

  //   event.preventDefault();
  //   // Optional: Redirect to a specific route instead of back navigation
  //   this.router.navigateByUrl('');

  // }


  startTimer() {
    this.interval = setInterval(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          clearInterval(this.interval);
          // this.router.navigate(['/customer/home']);
          // let checkAllotedStatus = sessionStorage.getItem('allottmentStatus');
          // if (checkAllotedStatus == "No") {
          //   this.router.navigate([''])
          // } else {
          //   this.router.navigate(['/customer/customer_dashboard'])

          // }

          this.router.navigate(['']);

        } else {
          this.minutes--;
          this.seconds = 59;
        }
      } else {
        this.seconds--;
      }
    }, 1000);
  }
  startTimerLogout() {
    this.logoutinterval = setInterval(() => {
      if (this.logoutseconds === 0) {
        if (this.logoutminutes === 0) {
          clearInterval(this.logoutinterval);
          // this.router.navigate(['/customer/home']);
          let checkAllotedStatus = sessionStorage.getItem('allottmentStatus');
          if (checkAllotedStatus == "No") {
            this.router.navigate([''])
          } else {
            this.router.navigate(['/customer/customer_dashboard'])

          }
        } else {
          this.logoutminutes--;
          this.logoutseconds = 59;
        }
      } else {
        this.logoutseconds--;
      }
    }, 1000);
  }

  setMaxDate(): void {
    const today = new Date();
    const maxYear = today.getFullYear() - 21;
    const maxMonth = today.getMonth() + 1; // getMonth() is zero-based
    const maxDay = today.getDate();

    // Format the date to YYYY-MM-DD
    this.maxDate = `${maxYear}-${maxMonth < 10 ? '0' + maxMonth : maxMonth}-${maxDay < 10 ? '0' + maxDay : maxDay}`;
  }

  onFileChange(event: any, type: string): void {
    const file = event.target.files[0];
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert MB to Bytes

    if (file.size > maxSizeInBytes) {
      this.toast.showToast('warning', `File size should not exceed ${maxSizeInMB} MB`, '');
      event.target.value = ''; // Reset the file input
      return;
    }

    switch (type) {
      case 'nativeOfTamilnadu':
        this.nativeOfTamilnaduFile = file;
        break;
      case 'birthCertificate':
        this.birthCertificateFile = file;
        break;
      case 'aadhaarProof':
        this.aadhaarProofFile = file;
        break;
      case 'panProof':
        this.panProofFile = file;
        break;
      case 'incomeCertificate':
        this.incomeCertificateFile = file;
        break;
      case 'reservationCategoryProof':
        this.reservationCategoryProofFile = file;
        break;
      case 'reservationSubCategoryProof':
        this.reservationSubCategoryProofFile = file;
        break;
      case 'signature':
        this.signatureFile = file;
        break;
      case 'jointSignature':
        this.jointSignatureFile = file;
        break;
      case 'applicantPhoto':
        this.applicantPhotoFile = file;
        break;
    }
    const reader = new FileReader();
    if (this.applicantPhotoFile) {

      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.imgUrl = reader.result;
        console.log('this.imgUrl', this.imgUrl);

      }
    }

  }


  getDate() {
    const today = new Date();

    // Get the day, month, and year components
    const day = String(today.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = today.getFullYear();

    // Create the formatted date string in "dd-mm-yyyy" format
    this.Date = `${day}-${month}-${year}`;
  }

  calculateApplicantAge(): void {
    const dateOfBirth = this.applicantForm.get('dateOfBirth')?.value;
    if (dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();

      // Check if the birthday hasn't occurred this year yet
      if (today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        age--;
      }

      this.applicantForm.get('age')?.setValue(age);
    } else {
      this.applicantForm.get('age')?.setValue(undefined);
    }
  }

  calculateJointAge(): void {
    const dateOfBirth = this.applicantForm.get('jointApplicantDOB')?.value;
    if (dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();

      // Check if the birthday hasn't occurred this year yet
      if (today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        age--;
      }

      this.applicantForm.get('jointApplicantAge')?.setValue(age);
    } else {
      this.applicantForm.get('jointApplicantAge')?.setValue(undefined);
    }
  }

  getReservationData() {
    // this.reservation = this.reservationService.getSharedData();
    this.reservationService.getReservationById(this.reservationId).subscribe(
      (response: any) => {
        console.log(response);
        this.unitDetailsForm.patchValue({
          ccCode: response.ccCode,
          priorityCode: response.priorityCode,
          reservationName: response.reservationName,
          // plinthArea: response.plinthArea
        })
      },
      (error: any) => {
        console.log(error);
      }
    );
    console.log(this.reservation);
  }

  getUnitSchemeDetails() {
    this.salesService.getUnitById(this.unitNId).subscribe(
      (response) => {

        console.log(response);
        this.populateData = response;
        this.carParkingSlot1 = this.populateData.totalOpenCarParking;
        this.carParkingSlot2 = this.populateData.totalCoveredCarParking;
        this.modeOfAllotement = this.populateData.modeOfAllotment;
        localStorage.setItem('projectStatus', this.populateData.schemeData.projectStatus);
        if (this.modeOfAllotement == 'LOT') {
          this.getReservationData();

        }
        console.log(this.populateData);
        this.unitDetailsForm.patchValue({
          unitAccountNo: this.populateData.unitAccountNumber,
          scheme: this.populateData.schemeData.schemeName,
          unitType: this.populateData.schemeData.unitType,
          cityRural: this.populateData.schemeData.cityAndRural,
          circle: this.populateData.schemeData.circle,
          type: this.populateData.schemeData.schemeType,
          unitNo: this.populateData.unitNo,
          UDS_Area: this.populateData.uds,
          plinthArea: this.populateData.plinthArea,
          costOfUnit: this.populateData.unitCost,
          blockNo: this.populateData.blockNo,
          floorNo: this.populateData.floorNo,
          reservationStatus: this.reservationStatus,
          divisionName: this.populateData.schemeData.nameOfTheDivision
        });
        this.feeForm.patchValue({
          amountPaid: (parseInt(this.populateData.unitCost) * 0.1).toFixed(2)
        });
        this.setApplicationFee();
        // this.calculateGrandTotal();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  inputValidate(evt: any, field: any) {
    const theEvent = evt || window.event;
    let key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    let regexValue = /[0-9.]/;
    if (field == 'alphabets') {
      regexValue = /^[a-zA-Z\s]+$/;
    } else if (field == 'alphaNumeric') {
      regexValue = /[0-9 a-zA-Z]/;
    } else if (field == 'numbersonly') {
      regexValue = /[0-9]/;
    } else if (field == 'alphaNumericWithUnderscore') {
      regexValue = /^[a-zA-Z0-9_]+$/;
    } else if (field === 'email') {
      // Email regex pattern
      regexValue = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    } else if (field === 'IFSC') {
      // Email regex pattern
      regexValue = /^[A-Z0-9]+$/;
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

  calculateGrandTotal() {
    debugger
    const applicationFee = parseFloat(this.feeForm.get('applicationFee')?.value);
    const applicationFeeWithGst = applicationFee * 1.18; // Including GST
    const initialAmount = parseFloat(this.feeForm.get('amountPaid')?.value);
    const registrationFee = parseFloat(this.feeForm.get('registrationFee')?.value);

    const grandTotal = initialAmount + applicationFeeWithGst + registrationFee;
    this.feeForm.patchValue({ grandTotal: grandTotal.toFixed(2), applicationFee: applicationFeeWithGst });
  }

  getCustomerById() {
    this.salesService.getCustomerById(this.customerId).subscribe(
      (response) => {
        console.log(response);
        this.applicantForm.patchValue({
          emailId: response.email,
          mobileNumber: response.contactNumber
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  createCustomerApplication() {

    this.salesService.getUnitById(this.unitNId).subscribe(res => {

      if (res.bookingStatus != "Completed") {


        if (!this.unitDetailsForm.valid || !this.applicantForm.valid || !this.bankDetailsForm.valid) {
          this.toast.showToast('warning', 'Please Fill All The Fields', '');
          return;
        }
        if (this.incomeNotMatched) {
          this.toast.showToast('warning', 'Income Not Matched', '');
          return;
        }
        if (!this.reservationDeclarationForm.valid) {
          this.toast.showToast('warning', 'Check all the Self Declarations', '');
          return;
        }
        var filesToUpload: any;
        if (this.modeOfAllotement != 'FCFS') {


          filesToUpload = [
            { name: 'nativeOfTamilnaduFile', file: this.nativeOfTamilnaduFile },
            { name: 'aadhaarProofFile', file: this.aadhaarProofFile },
            { name: 'incomeCertificateFile', file: this.incomeCertificateFile },
            { name: 'reservationSubCategoryProofFile', file: this.reservationSubCategoryProofFile },
            { name: 'jointSignatureFile', file: this.jointSignatureFile },
            // { name: 'birthCertificateFile', file: this.birthCertificateFile },
            { name: 'panProofFile', file: this.panProofFile },
            { name: 'reservationCategoryProofFile', file: this.reservationCategoryProofFile },
            { name: 'signatureFile', file: this.signatureFile },
            { name: 'applicantPhotoFile', file: this.applicantPhotoFile },
          ];
        } else {
          filesToUpload = [
            { name: 'nativeOfTamilnaduFile', file: this.nativeOfTamilnaduFile },
            { name: 'aadhaarProofFile', file: this.aadhaarProofFile },
            { name: 'incomeCertificateFile', file: this.incomeCertificateFile },
            // { name: 'reservationSubCategoryProofFile', file: this.reservationSubCategoryProofFile },
            { name: 'jointSignatureFile', file: this.jointSignatureFile },
            // { name: 'birthCertificateFile', file: this.birthCertificateFile },
            { name: 'panProofFile', file: this.panProofFile },
            // { name: 'reservationCategoryProofFile', file: this.reservationCategoryProofFile },
            { name: 'signatureFile', file: this.signatureFile },
            { name: 'applicantPhotoFile', file: this.applicantPhotoFile },
          ];
        }

        // Check if any file is missing
        const missingFiles = filesToUpload.filter((fileObj: any) => !fileObj.file).map((fileObj: any) => fileObj.name);
        if (missingFiles.length > 0) {


          this.toast.showToast('warning', `Missing files: ${missingFiles.join(', ')}`, '');
          return;


        }

        const fileUploadObservables = filesToUpload.map((fileObj: any) => this.uploadFiles(fileObj.file));



        forkJoin(fileUploadObservables).subscribe(
          // (filePaths: string[]) => {
          (filePaths: any) => {

            const data = this.prepareApplicationData(filePaths);

            this.salesService.createCustomerApplication(data).subscribe(
              (response) => {
                // this.handleApplicationResponse(response.responseObject.id);
                // this.toast.showToast('success', 'Application submitted successfully', '');
                // this.router.navigate(['/customer/application-history']);





                const data = [{
                  "amount": this.feeForm.get('amountPaid')?.value,
                  "unitId": this.unitNId,
                  "schemeId": this.schemeId,
                  "paymentType": "Initial Deposit",
                  "description": "Booking Saved",
                  "unitAccountNumber": this.populateData.unitAccountNumber,
                  "applicationId": response.responseObject.id,
                  "createdDateTime": new Date().toLocaleString()
                }, {
                  "amount": this.feeForm.get('applicationFee')?.value,
                  "unitId": this.unitNId,
                  "schemeId": this.schemeId,
                  "paymentType": "Application Fee",
                  "description": "Booking Saved",
                  "unitAccountNumber": this.populateData.unitAccountNumber,
                  "applicationId": response.responseObject.id,
                  "createdDateTime": new Date().toLocaleString()
                },
                {
                  "amount": this.feeForm.get('registrationFee')?.value,
                  "unitId": this.unitNId,
                  "schemeId": this.schemeId,
                  "paymentType": "Registration Fee",
                  "description": "Booking Saved",
                  "unitAccountNumber": this.populateData.unitAccountNumber,
                  "applicationId": response.responseObject.id,
                  "createdDateTime": new Date().toLocaleString()
                }]




                this.salesService.bookingSave(data).subscribe(res => {
                  if (res) {
                    sessionStorage.setItem('minutes', JSON.stringify(this.minutes))
                    sessionStorage.setItem('seconds', JSON.stringify(this.seconds))
                    // this.router.navigate(['customer/selectbank'], { queryParams: { bookingId: this.populateData.unitAccountNumber } });
                    this.router.navigate(['/selectbank'], { queryParams: { bookingId: this.populateData.unitAccountNumber } });

                  }
                })
              },
              (error) => {
                console.error(error);
                this.toast.showToast('error', 'Application submission failed', '');
              }
            );
          },
          (error) => {
            console.error(error);
            this.toast.showToast('error', 'File upload failed', '');
          }
        );
      } else {
        this.toast.showToast('warning', "Selected Unit is already booked please choose another Unit", '');
      }
    },
      (error: any) => {
        if (error.status == 0 || error.status == 401) {
          sessionStorage.clear();
          this.router.navigate([''])
          this.toast.showToast(error, "You have again logged in another tab. Hence, this session is hereby logged out ", "")

        }

      })
  }

  prepareApplicationData(filePaths: string[]): any {

    if (this.modeOfAllotement == 'FCFS') {
      const date = new Date();

      const formattedDate = date.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      });

      return {
        "applicantName": this.applicantForm.get('applicantName')?.value,
        "dateOfBirth": this.applicantForm.get('dateOfBirth')?.value,
        "age": this.applicantForm.get('age')?.value,
        "martialStatus": this.applicantForm.get('maritalStatus')?.value,
        "aadhaaarNumber": this.applicantForm.get('aadhaarNumber')?.value,
        "panNumber": this.applicantForm.get('panNumber')?.value,
        "fathersName": this.applicantForm.get('applicantFathersName')?.value,


        "jointApplicantName": this.applicantForm.get('jointApplicantName')?.value,
        "jointApplicantDateOfBirth": this.applicantForm.get('jointApplicantDateOfBirth')?.value,
        "jointApplicantAge": this.applicantForm.get('jointApplicantAge')?.value,
        "jointApplicantAadharNumber": this.applicantForm.get('jointApplicantAadhaarNumber')?.value,
        "relationWithApplicant": this.applicantForm.get('relationWithApplicant')?.value,

        "jointApplicantFathername": this.applicantForm.get('jointApplicantFathername')?.value,

        "mobileNumber": this.applicantForm.get('mobileNumber')?.value,
        "emailId": this.applicantForm.get('emailId')?.value,
        "address1": this.applicantForm.get('address1')?.value,
        "address2": this.applicantForm.get('address2')?.value,
        "pincode": this.applicantForm.get('pincode')?.value,
        "district": this.applicantForm.get('district')?.value,
        "state": this.applicantForm.get('state')?.value,

        "applicantMonthlyIncome": this.applicantForm.get('applicantMonthlyIncome')?.value,
        "jointApplicantMonthlyIncome": this.applicantForm.get('jointApplicantMonthlyIncome')?.value,
        "totalMonthlyIncome": this.removeCommas(this.applicantForm.get('totalMonthlyIncome')?.value),


        "applicantHusbandOrWifeName": '',
        "jointApplicantSpouseName": '',


        "nameOfTheBank": this.bankDetailsForm.get('bankName')?.value,
        "accountNumber": this.bankDetailsForm.get('accountNumber')?.value,
        "accountHolderName": this.bankDetailsForm.get('accountHolderName')?.value,
        "ifscCode": this.bankDetailsForm.get('ifscCode')?.value,
        "branchName": this.bankDetailsForm.get('branchName')?.value,
        "nativeCertificatePath": filePaths[0],
        "aadhaarPath": filePaths[1],
        "incomeCertificatePath": filePaths[2],
        "proofOfReservationSubCategoryPath": '',
        "jointApplicantSignaturePath": filePaths[3],
        // "birthCertificatePath": filePaths[5],
        "panPath": filePaths[4],
        "reservationMainCategoryPath": '',
        "primaryApplicantSignaturePath": filePaths[5],
        "primaryApplicantPhotoPath": filePaths[6],

        "schemeId": parseInt(this.schemeId),
        // "customerId": parseInt(this.customerId),
        "userId": parseInt(this.customerId),


        "unitDataId": parseInt(this.unitNId),
        "applicationStatus": "Pending",
        "creationDate": "",
        "carParkingSlot1": this.carParkingSlot1,
        "carParkingSlot2": this.carParkingSlot2,
        "allotedStatus": "No",
        // "reservationId": this.modeOfAllotement == 'FCFS' ? '' : parseInt(this.reservationId),
        "registrationFees": this.feeForm.get('registrationFee')?.value,
        "initialPayment": this.feeForm.get('amountPaid')?.value,
        "applicationFees": this.feeForm.get('applicationFee')?.value,
        "totalFees": this.feeForm.get('grandTotal')?.value,
        "remainingBalance": this.calculateRemainingBalance(),
        "modeOfAllotment": this.populateData.schemeData.projectStatus,
        "createdDateTime": formattedDate
      };

    } else {
      return {
        "applicantName": this.applicantForm.get('applicantName')?.value,
        "dateOfBirth": this.applicantForm.get('dateOfBirth')?.value,
        "age": this.applicantForm.get('age')?.value,
        "maritalStatus": this.applicantForm.get('maritalStatus')?.value,
        "aadhaaarNumber": this.applicantForm.get('aadhaarNumber')?.value,
        "panNumber": this.applicantForm.get('panNumber')?.value,
        "applicantFathersName": this.applicantForm.get('applicantFathersName')?.value,


        "jointApplicantName": this.applicantForm.get('jointApplicantName')?.value,
        "jointApplicantDateOfBirth": this.applicantForm.get('jointApplicantDateOfBirth')?.value,
        "jointApplicantAge": this.applicantForm.get('jointApplicantAge')?.value,
        "jointApplicantAadhaarNumber": this.applicantForm.get('jointApplicantAadhaarNumber')?.value,
        "relationWithApplicant": this.applicantForm.get('relationWithApplicant')?.value,

        "jointApplicantFathername": this.applicantForm.get('jointApplicantFathername')?.value,

        "mobileNumber": this.applicantForm.get('mobileNumber')?.value,
        "emailId": this.applicantForm.get('emailId')?.value,
        "address1": this.applicantForm.get('address1')?.value,
        "address2": this.applicantForm.get('address2')?.value,
        "pincode": this.applicantForm.get('pincode')?.value,
        "district": this.applicantForm.get('district')?.value,
        "state": this.applicantForm.get('state')?.value,

        "applicantMonthlyIncome": this.applicantForm.get('applicantMonthlyIncome')?.value,
        "jointApplicantMonthlyIncome": this.applicantForm.get('jointApplicantMonthlyIncome')?.value,
        "totalMonthlyIncome": this.removeCommas(this.applicantForm.get('totalMonthlyIncome')?.value),


        "applicantHusbandOrWifeName": '',
        "jointApplicantSpouseName": '',


        "nameOfTheBank": this.bankDetailsForm.get('bankName')?.value,
        "accountNumber": this.bankDetailsForm.get('accountNumber')?.value,
        "accountHolderName": this.bankDetailsForm.get('accountHolderName')?.value,
        "ifscCode": this.bankDetailsForm.get('ifscCode')?.value,
        "branchName": this.bankDetailsForm.get('branchName')?.value,
        "nativeCertificatePath": filePaths[0],
        "aadhaarPath": filePaths[1],
        "incomeCertificatePath": filePaths[2],
        "proofOfReservationSubCategoryPath": '',
        "jointApplicantSignaturePath": filePaths[3],
        // "birthCertificatePath": filePaths[4],
        "panPath": filePaths[5],
        "reservationMainCategoryPath": filePaths[6],
        "primaryApplicantSignaturePath": filePaths[7],
        "primaryApplicantPhotoPath": filePaths[8],
        "schemeId": parseInt(this.schemeId),
        "customerId": parseInt(this.customerId),
        "unitDataId": parseInt(this.unitNId),
        "applicationStatus": "Pending",
        "creationDate": "",
        "carParkingSlot1": this.carParkingSlot1,
        "carParkingSlot2": this.carParkingSlot2,
        "allotedStatus": "No",
        "reservationId": this.modeOfAllotement == 'FCFS' ? '' : parseInt(this.reservationId),
        "registrationFees": this.feeForm.get('registrationFee')?.value,
        "initialPayment": this.feeForm.get('amountPaid')?.value,
        "applicationFees": this.feeForm.get('applicationFee')?.value,
        "totalFees": this.feeForm.get('grandTotal')?.value,
        "remainingBalance": this.calculateRemainingBalance(),
        "modeOfAllotment": this.populateData.schemeData.projectStatus,

      };
    }
  }

  handleApplicationResponse(applicationId: number) {





    const payments = [
      {
        "paymentType": "Initial Deposit",
        "cost": this.feeForm.get('amountPaid')?.value,
        "paymentDateAndTime": new Date().toLocaleString(),
        "description": "Initial Deposit",
        "schemeDataId": this.schemeId,
        "unitDataId": this.unitNId,
        "applicationId": applicationId
      },
      {
        "paymentType": "Application Fee",
        "cost": this.feeForm.get('applicationFee')?.value,
        "paymentDateAndTime": new Date().toLocaleString(),
        "description": "Application Fee",
        "schemeDataId": this.schemeId,
        "unitDataId": this.unitNId,
        "applicationId": applicationId
      },
      {
        "paymentType": "Registration Fee",
        "cost": this.feeForm.get('registrationFee')?.value,
        "paymentDateAndTime": new Date().toLocaleString(),
        "description": "Registration Fee",
        "schemeDataId": this.schemeId,
        "unitDataId": this.unitNId,
        "applicationId": applicationId
      },
    ];



    payments.forEach(payment => {
      this.salesService.createPayment(payment).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error(error);
          this.toast.showToast('error', 'Payment submission failed', '');
        }
      );
    });
  }


  uploadFiles(file: File): Observable<string> {
    const formData = new FormData();


    formData.append('file', file);

    return new Observable(observer => {
      this.salesService.fileUpload(formData).subscribe(
        (response: any) => {
          observer.next(response.body.responseObject);
          observer.complete();
        },
        (error: any) => {
          console.error(error);
          observer.error(error);
        }
      );
    });


  }

  calculateRemainingBalance() {
    // Get the initial payment amount from the form
    const initialPayment = parseFloat(this.feeForm.get('amountPaid')?.value) || 0;

    // Parse unit cost and other costs from populateData, ensuring they default to 0 if not a number
    const unitCost = parseFloat(this.populateData.unitCost) || 0;
    const carParkingCost = parseFloat(this.populateData.carDemand) || 0;
    const mcCost = parseFloat(this.populateData.mcDemand) || 0;
    const gstCost = parseFloat(this.populateData.gst) || 0;

    // Calculate the balance unit cost after the initial payment
    const balanceUnitCost = unitCost - initialPayment;

    // Calculate the remaining balance by summing up the balance unit cost, car parking cost, mc cost, and GST cost
    const remainingBalance = balanceUnitCost + carParkingCost + mcCost + gstCost;

    // Return the remaining balance
    return remainingBalance;
  }

  getAllIncome() {
    this.salesService.getAllIncome().subscribe(
      (response: any) => {
        console.log(response);
        this.incomeData = response.responseObject[0];
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  //Income Calculation
  private removeCommas(value: string): string {
    return value.replace(/,/g, '');
  }
  private calculateTotalMonthlyIncome() {
    this.applicantForm.get('applicantMonthlyIncome')?.valueChanges.subscribe(() => this.updateTotalMonthlyIncome());
    this.applicantForm.get('jointApplicantMonthlyIncome')?.valueChanges.subscribe(() => this.updateTotalMonthlyIncome());
  }

  private updateTotalMonthlyIncome() {
    debugger
    const applicantIncome = parseFloat(this.removeCommas(this.applicantForm.get('applicantMonthlyIncome')?.value || '0'));
    const spouseIncome = parseFloat(this.removeCommas(this.applicantForm.get('jointApplicantMonthlyIncome')?.value || '0'));
    const totalIncome = applicantIncome + spouseIncome;

    this.applicantForm.get('totalMonthlyIncome')?.setValue(totalIncome.toLocaleString('en-IN'), { emitEvent: false });

    if (this.populateData.schemeData.schemeType === 'HIG') {
      const higFrom = parseFloat(this.removeCommas(this.incomeData.higFrom || '0'));
      const higTo = parseFloat(this.removeCommas(this.incomeData.higTo || '0'));
      // if (totalIncome >= higFrom && totalIncome <= higTo) {
      if (totalIncome >= higFrom) {

        this.incomeNotMatched = false;
      } else {
        this.incomeNotMatched = true;
        this.toast.showToast('warning', 'Income Not Matched', '');
      }
    } else if (this.populateData.schemeData.schemeType === 'LIG') {
      const ligFrom = parseFloat(this.removeCommas(this.incomeData.ligFrom || '0'));
      const ligTo = parseFloat(this.removeCommas(this.incomeData.ligTo || '0'));
      if (totalIncome >= ligFrom && totalIncome <= ligTo) {
        this.incomeNotMatched = false;
      } else {
        this.incomeNotMatched = true;
        this.toast.showToast('warning', 'Income Not Matched', '');
      }
    } else if (this.populateData.schemeData.schemeType === 'MIG') {
      const migFrom = parseFloat(this.removeCommas(this.incomeData.migFrom || '0'));
      const migTo = parseFloat(this.removeCommas(this.incomeData.migTo || '0'));
      if (totalIncome >= migFrom && totalIncome <= migTo) {
        this.incomeNotMatched = false;
      } else {
        this.incomeNotMatched = true;
        this.toast.showToast('warning', 'Income Not Matched', '');
      }
    } else if (this.populateData.schemeData.schemeType === 'EWS') {
      const ewsFrom = parseFloat(this.removeCommas(this.incomeData.ewsFrom || '0'));
      const ewsTo = parseFloat(this.removeCommas(this.incomeData.ewsTo || '0'));
      if (totalIncome >= ewsFrom && totalIncome <= ewsTo) {
        this.incomeNotMatched = false;
      } else {
        this.incomeNotMatched = true;
        this.toast.showToast('warning', 'Income Not Matched', '');
      }
    }
  }

  checkAllSelfDeclaration(event: any) {

    this.selfDeclaration = !this.selfDeclaration;
    debugger

    if (this.selfDeclaration) {
      this.reservationDeclarationForm.controls['check1'].setValue(true)
      this.reservationDeclarationForm.controls['check2'].setValue(true)

      this.reservationDeclarationForm.controls['check3'].setValue(true)
      this.reservationDeclarationForm.controls['check4'].setValue(true)
      this.reservationDeclarationForm.controls['check5'].setValue(true)
      this.reservationDeclarationForm.controls['check6'].setValue(true)


    } else {
      this.reservationDeclarationForm.controls['check1'].setValue(false)
      this.reservationDeclarationForm.controls['check2'].setValue(false)

      this.reservationDeclarationForm.controls['check3'].setValue(false)
      this.reservationDeclarationForm.controls['check4'].setValue(false)
      this.reservationDeclarationForm.controls['check5'].setValue(false)
      this.reservationDeclarationForm.controls['check6'].setValue(false)
    }
  }

  calculateAge(event: any) {
    debugger
    const dob = new Date(event);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    let getAge = age ? JSON.stringify(age) : '0';

    this.applicantForm.controls['jointApplicantAge'].setValue(getAge);
    // return age;
  }

  next1() {
    if (this.applicantForm.valid && this.reservationDeclarationForm.valid && this.selfDeclaration && this.imgUrl && this.bankDetailsForm.valid) {
      this.stepper.next();

    } else {
      this.toast.showToast('error', "Please Fill All the Required Fields.", '')
    }


  }
  next2() {
    if (this.modeOfAllotement == 'FCFS') {
      if (this.nativeOfTamilnaduFile && this.aadhaarProofFile && this.incomeCertificateFile && this.panProofFile && this.signatureFile && this.jointSignatureFile) {
        this.stepper.next();

      } else {
        this.toast.showToast('error', "Please Upload All the Documents.", '')

      }

    } else {
      if (this.nativeOfTamilnaduFile && this.aadhaarProofFile && this.incomeCertificateFile && this.reservationCategoryProofFile && this.reservationSubCategoryProofFile && this.panProofFile && this.signatureFile && this.jointSignatureFile) {
        this.stepper.next();

      } else {
        this.toast.showToast('error', "Please Upload All the Documents.", '')

      }
    }


  }
  logout() {


    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   data: {
    //     title: 'Confirm Logout',
    //     message: `Are you sure you want to Logout?`
    //   },
    //   panelClass: 'custom-dialog-container'
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    // sessionStorage.clear();
    let customerId = sessionStorage.getItem('customerId');
    debugger
    sessionStorage.clear();
    this.authService.customerLogout(customerId).subscribe((res: any) => {
      if (res.message) {
        sessionStorage.clear();

        this.router.navigate(['']);
        alert("Session Expired Logout Successfully.")

        window.location.reload();
        // this.router.navigateByUrl('all-schemes');
        // this.toast.showToast('warning', "Session Expired Logout Successfully.", "")

      }
    })
    //   }
    // })

  }


  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
      console.log('Interval cleared');
    }

    if (this.logoutinterval) {
      clearInterval(this.logoutinterval);
      console.log('Interval cleared');
    }


    console.log('clear interval', this.interval);

    // if (this.interval) {
    //   this.interval.forEach((element: any) => {
    //     clearInterval(this.interval[element.id]);
    //     // clearInterval(element.id);

    //   });

    //   this.interval = [];
    // }



  }
  back() {
    // this.location.back();
    this.router.navigate(['/booking-status'], { queryParams: { schemeId: this.schemeId } });

  }

}