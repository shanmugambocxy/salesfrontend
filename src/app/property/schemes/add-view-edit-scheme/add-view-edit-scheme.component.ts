import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ToastService } from '../../../services/toast.service';
import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PropertyService } from '../../../services/property.service';
import { Title } from '@angular/platform-browser';
import { Observable, catchError, tap } from 'rxjs';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

interface Reservation {
  id: number;
  ccCode: string;
  priorityCode: string;
  reservationName: string;
  percentage: string;
  units?: number;
}

interface CategorizedReservation {
  head: Reservation;
  subcategories: Reservation[];
}

@Component({
  selector: 'app-add-view-edit-scheme',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-view-edit-scheme.component.html',
  styleUrl: './add-view-edit-scheme.component.scss'
})
export class AddViewEditSchemeComponent {

  divisionCode: any;
  division: any;
  divisionCodeReadOnly: boolean = true;
  schemeFormGroup!: FormGroup;
  schemeForm!: FormGroup;
  percentagesfsForm!: FormGroup;

  unitFormGroup!: FormGroup;

  id!: number;
  schemeDataById: any;
  mode: any;
  readOnly: boolean = false;
  schemeHeading: any;
  schemeId: any;
  createSchemeBtn: boolean = false;

  // totalUnits: number = 100;
  totalUnits: number = 0;

  categorizedReservations: any;

  divisionsList = [
    { code: '11', circle: 'Chennai Circle I', city_n_rural: 'City', name: 'Anna Nagar' },
    { code: '12', circle: 'Chennai Circle I', city_n_rural: 'City', name: 'JJ Nagar' },
    { code: '13', circle: 'Chennai Circle I', city_n_rural: 'City', name: 'KK Nagar' },
    { code: '15', circle: 'Chennai Circle II', city_n_rural: 'City', name: 'Besant Nagar' },
    { code: '16', circle: 'Chennai Circle II', city_n_rural: 'City', name: 'Nandanam' },
    { code: '17', circle: 'Chennai Circle II', city_n_rural: 'City', name: 'Maintenance' },
    { code: '19', circle: 'Project Circle (City)', city_n_rural: 'City', name: 'SPD I' },
    { code: '20', circle: 'Project Circle (City)', city_n_rural: 'City', name: 'SPD II' },
    { code: '21', circle: 'Project Circle (City)', city_n_rural: 'City', name: 'CIT Nagar' },
    { code: '22', circle: 'Project Circle (City)', city_n_rural: 'City', name: 'Foreshore Estate' },
    { code: '23', circle: 'Project Circle (City)', city_n_rural: 'City', name: 'SAF Games Village' },
    { code: '25', circle: 'Project Circle (Rural)', city_n_rural: 'Rural', name: 'Thirumazhisai Satellite Town' },
    { code: '26', circle: 'Project Circle (Rural)', city_n_rural: 'Rural', name: 'SPD III' },
    { code: '27', circle: 'Project Circle (Rural)', city_n_rural: 'Rural', name: 'Uchapatti Thoppur Satellite Town' },
    { code: '29', circle: 'Salem', city_n_rural: 'Rural', name: 'Coimbatore Housing Unit' },
    { code: '30', circle: 'Salem', city_n_rural: 'Rural', name: 'Erode Housing Unit ' },
    { code: '31', circle: 'Salem', city_n_rural: 'Rural', name: 'Salem Housing Unit ' },
    { code: '32', circle: 'Salem', city_n_rural: 'Rural', name: 'Hosur Housing Unit ' },
    { code: '33', circle: 'Salem', city_n_rural: 'Rural', name: 'Vellore Housing Unit ' },
    { code: '35', circle: 'Madurai', city_n_rural: 'Rural', name: 'Madurai Housing Unit ' },
    { code: '36', circle: 'Madurai', city_n_rural: 'Rural', name: 'Tirunelveli Housing Unit' },
    { code: '37', circle: 'Madurai', city_n_rural: 'Rural', name: 'Ramanathapuram Housing Unit' },
    { code: '38', circle: 'Madurai', city_n_rural: 'Rural', name: 'Trichy Housing Unit' },
    { code: '39', circle: 'Madurai', city_n_rural: 'Rural', name: 'Thanjavur Housing Unit' },
    { code: '40', circle: 'Madurai', city_n_rural: 'Rural', name: 'Villupuram Housing Unit' },
  ];

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
  notAGPDataList: any = [];
  notAGPDataSubreservList: any = [];
  reservationStatus: any = '';
  divisionList: any = [];
  totalunits: any;
  allotedunits: any;
  unsoldunits: any;
  createdUnits: any;
  remainingUnits: any;
  modeOfAllotment: any = '';
  role: any = '';
  currentDate: any = new Date();
  startDate: any = "";
  endDate: any = "";
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private dialog: MatDialog,
    private propertyService: PropertyService,
    private title: Title,
    private http: HttpClient,
    private datepipe: DatePipe
  ) {

    this.role = sessionStorage.getItem('role');
    debugger

    let UserName = sessionStorage.getItem('username');
    this.schemeForm = this.formBuilder.group({
      divisionCode: [this.divisionCode],
      schemeCode: [''],  //must 6digit character
      nameOfTheDivision: [''],
      village: [''],
      taluk: [''],
      schemeName: [''],
      schemeType: [''],
      totalCoveredCarParking: [''],
      totalOpenCarParking: [''],
      unitType: [''],
      totalUnit: [''],
      schemePlace: [''],
      district: [''],
      reservationStatus: ['No'],
      reservationFromDate: [''],
      reservationToDate: [''],
      projectStatus: [''],
      cutOffDate: [''],
      sellingPriceDate: [''],
      orginalSellingPrice: [''],
      schemeReadyDate: [''],
      maintenanceHandingOverDate: [''],
      modeOfAllotment: [''],
      schemeInterest: [''],
      repayment: [''],

      tentativeLand: [''],
      finalLand: [''],
      tentativeLandCost: [''],
      finalLandCost: [''],
      flcCutOffDate: [''],
      profit: [''],
      remarks: [''],
      whetherHpNeeded: [''],
      publishedStatus: ['No'],
      reraNo: [''],
      circle: [''],
      cityAndRural: [''],
      creationDate: [''],
      applicationReceieveDate: [''],
      applicationReceieveLastDate: [''],
      createdBy: [UserName],
      dateOfLot: [],
      repaymentPeriod: [],
      rateOfInterest: [],
      boardResolutionNo: [],
      boardResolutionDate: [],
      goNo: [],
      goDate: [],
      subRegisterDesignation: [],
      suRegisterOfficePlace: [],
      purposeOfUnit: [],
      sellingExtent: [''],
      plinthArea: [''],
      uds: [''],
      startDate: [''],
      endDate: ['']
    });

    this.percentagesfsForm = this.formBuilder.group({
      firstDuePercentage: [''],
      firstDueDate: [''],
      secondDuePercentage: [''],
      secondDueDate: [''],
      thirdDuePercentage: [''],
      thirdDueDate: [''],
      fourthDuePercentage: [''],
      fourthDueDate: [''],
      fifthDuePercentage: [''],
      fifthDueDate: [''],
      sixthDuePercentage: [''],
      sixthDueDate: [''],
      seventhDuePercentage: [''],
      seventhDueDate: [''],
      eighthDuePercentage: [''],
      eighthDueDate: [''],
      ninthDuePercentage: [''],
      ninthDueDate: [''],
      tenthDuePercentage: [''],
      tenthDueDate: [''],
      eleventhDuePercentage: [''],
      eleventhDueDate: [''],
      twelfthDuePercentage: [''],
      twelfthDueDate: [''],
      thirteenthDuePercentage: [''],
      thirteenthDueDate: ['']
    })
    this.unitFormGroup = this.formBuilder.group({
      n_TOTAL_ALLOTTED_UNITS: [''],
      n_TOTAL_UNSOLD_UNITS: [''],
      n_TOTAL_ALLOTTED_UNITS_FOR_OUTRIGHT: [''],
      n_TOTAL_ALLOTTED_UNITS_FOR_HIRE_PURCHASE: [''],
      n_TOTAL_ALLOTTED_UNITS_FOR_SFS: [''],
      n_TOTAL_ARREARS_EMI: [''],
      n_TOTAL_CURRENT_EMI: [''],
      n_TOTAL_BALANCE_EMI: [''],
      n_TOTAL_LIVE_CASES_FOR_HIRE: [''],
      n_FULL_COST_PAID: [''],
      n_TOTAL_NO_OF_SALE_DEED_ISSUED: [''],
      n_TOTAL_RIPPED_UNIT: [''],
    });
  }

  ngOnInit() {
    debugger
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'];
    });

    if (this.mode === 'create') {
      this.title.setTitle('Create Scheme');
      this.schemeHeading = "Create Scheme";
    } else if (this.mode === 'edit') {
      this.title.setTitle('Edit Scheme');
      this.schemeHeading = "Edit Scheme";
      this.route.queryParams.subscribe(params => {
        this.schemeId = params['id'];
      });
      this.getSchemeDataById(this.schemeId);
      this.getCountsBySchemeId();
    } else if (this.mode === 'view') {
      this.title.setTitle('View Scheme');
      this.schemeHeading = "View Scheme";
      this.route.queryParams.subscribe(params => {
        this.schemeId = params['id'];
      });
      this.getSchemeDataById(this.schemeId);
      this.readOnly = true;
      this.getCountsBySchemeId();

    }

    if (sessionStorage.getItem('code') !== "All") {
      this.divisionCode = sessionStorage.getItem('code');
      // this.schemeForm.get('divisionCode')?.patchValue(this.divisionCode);
      this.division = sessionStorage.getItem('division');
    } else {
      this.divisionCode = "";
      this.divisionCodeReadOnly = false;
    }
    this.updateDivisionName();
    this.getDivisionList();

    // this.getAllReservation();
  }


  getDivisionList() {

    this.http.get('https://personnelapi.tnhb.in/getAllDivisionCode').subscribe((res: any) => {
      if (res && res.data) {
        this.divisionList = res.data.filter((x: any) => x != '');
        console.log(' this.divisionList', this.divisionList);


      } else {
        this.divisionList = [];

      }
    })
  }

  divisionChange(event: any) {
    console.log('event', event);
    let data = {
      "divisionCode": event
    }
    debugger
    this.http.post('https://personnelapi.tnhb.in/findByOfficeCode', data).subscribe((res: any) => {
      if (res) {
        this.schemeForm.controls['nameOfTheDivision'].setValue(res.data.divisionOffice.v_Division_Name);
        this.schemeForm.controls['circle'].setValue(res.data.divisionOffice.v_Select_Circle);


      }

    })

  }

  selectProject(event: any) {
    let value = event.target.value;
    if (value == 'Self Finance') {
      this.schemeForm.controls['schemeReadyDate'].setValue('')
      this.schemeForm.controls['maintenanceHandingOverDate'].setValue('')



    }


    debugger
  }
  searchSchemeId(event: any) {
    let value = event.target.value;
    debugger
    this.propertyService.getSchemeCode(value).subscribe(res => {
      if (res) {
        let schemeCode = this.schemeForm.controls['divisionCode'].value + value;
        let checkSchemeList = res.filter((x: any) => x.schemeCode == schemeCode);
        if (checkSchemeList.length > 0 && value.length == 4) {
          this.toastService.showToast('warning', 'Scheme Code Already Exist', '');
          this.schemeForm.controls['schemeCode'].setValue('');
        } else {

        }
      }
    })
  }

  updateToDate(event: any) {
    const fromDate: Date = event.target.valueAsDate;
    if (fromDate) {
      let toDate = new Date(fromDate);
      toDate.setDate(toDate.getDate() + 105);
      this.schemeForm.get('reservationToDate')?.setValue(toDate.toISOString().split('T')[0]);
    }
  }

  updateDivisionName() {
    const schemeCode = this.schemeForm.get('divisionCode')?.value;
    if (schemeCode && schemeCode.length >= 2) {
      const firstTwoDigits = schemeCode.substring(0, 2);
      const matchingDivision = this.divisionsList.find(division => division.code === firstTwoDigits);

      if (matchingDivision) {
        this.schemeForm.patchValue({
          nameOfTheDivision: matchingDivision.name,
          circle: matchingDivision.circle,
          cityAndRural: matchingDivision.city_n_rural,
        });
      } else {
        this.schemeForm.patchValue({
          nameOfTheDivision: '',
        });
      }
    } else {
      this.schemeForm.patchValue({
        nameOfTheDivision: '',
      });
    }
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
      regexValue = /[0-9]/;
    } else if (field == 'alphaNumericWithUnderscore') {
      regexValue = /^[a-zA-Z0-9_]+$/;
    } else if (field === 'email') {
      // Email regex pattern
      regexValue = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    } else if (field == 'schemecode') {
      regexValue = /[0-9a-zA-Z]/;

    } else if (field == 'numbersonlywithdecimal') {
      regexValue = /[0-9.]/;
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
  checkDuePercentage() {
    debugger






    let firstDuePercentage = this.percentagesfsForm.controls['firstDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['firstDuePercentage'].value) : 0
    let secondDuePercentage = this.percentagesfsForm.controls['secondDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['secondDuePercentage'].value) : 0

    let thirdDuePercentage = this.percentagesfsForm.controls['thirdDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['thirdDuePercentage'].value) : 0
    let fourthDuePercentage = this.percentagesfsForm.controls['fourthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['fourthDuePercentage'].value) : 0
    let fifthDuePercentage = this.percentagesfsForm.controls['fifthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['fifthDuePercentage'].value) : 0
    let sixthDuePercentage = this.percentagesfsForm.controls['sixthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['sixthDuePercentage'].value) : 0
    let seventhDuePercentage = this.percentagesfsForm.controls['seventhDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['seventhDuePercentage'].value) : 0
    let eighthDuePercentage = this.percentagesfsForm.controls['eighthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['eighthDuePercentage'].value) : 0
    let ninthDuePercentage = this.percentagesfsForm.controls['ninthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['ninthDuePercentage'].value) : 0
    let tenthDuePercentage = this.percentagesfsForm.controls['tenthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['tenthDuePercentage'].value) : 0
    let eleventhDuePercentage = this.percentagesfsForm.controls['eleventhDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['eleventhDuePercentage'].value) : 0
    let twelfthDuePercentage = this.percentagesfsForm.controls['twelfthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['twelfthDuePercentage'].value) : 0
    let thirteenthDuePercentage = this.percentagesfsForm.controls['thirteenthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['thirteenthDuePercentage'].value) : 0
    let totalDue = firstDuePercentage + secondDuePercentage + thirdDuePercentage + fourthDuePercentage + fifthDuePercentage + sixthDuePercentage + seventhDuePercentage + eighthDuePercentage + ninthDuePercentage + tenthDuePercentage + eleventhDuePercentage + twelfthDuePercentage + thirteenthDuePercentage;

    if (totalDue > 100) {
      this.toastService.showToast("warning", "Due Percentage Do not Exceed 100", "")
    }
  }

  createScheme() {
    // let startDate = element.applicationReceieveDate ? new Date(element.applicationReceieveDate) : '';
    //             let endDate = element.applicationReceieveLastDate ? new Date(element.applicationReceieveLastDate) : '';
    //             let currentDate = new Date();
    //             if (startDate && endDate) {
    //               if (currentDate >= startDate && currentDate <= endDate) {
    //                 element.publishedStatus = "Yes"
    //               } else {
    //                 element.publishedStatus = "No"
    //               }
    //             } else {
    //               element.publishedStatus = "No"

    //             }
    this.schemeForm.controls['publishedStatus'].setValue("")
    if (!this.schemeForm.valid) {
      this.toastService.showToast('warning', "Please Fill all the Initial required Fields", "")
      return
    }

    if (this.schemeForm.get('projectStatus')?.value == 'Self Finance') {


      let firstDuePercentage = this.percentagesfsForm.controls['firstDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['firstDuePercentage'].value) : 0
      let secondDuePercentage = this.percentagesfsForm.controls['secondDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['secondDuePercentage'].value) : 0

      let thirdDuePercentage = this.percentagesfsForm.controls['thirdDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['thirdDuePercentage'].value) : 0
      let fourthDuePercentage = this.percentagesfsForm.controls['fourthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['fourthDuePercentage'].value) : 0
      let fifthDuePercentage = this.percentagesfsForm.controls['fifthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['fifthDuePercentage'].value) : 0
      let sixthDuePercentage = this.percentagesfsForm.controls['sixthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['sixthDuePercentage'].value) : 0
      let seventhDuePercentage = this.percentagesfsForm.controls['seventhDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['seventhDuePercentage'].value) : 0
      let eighthDuePercentage = this.percentagesfsForm.controls['eighthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['eighthDuePercentage'].value) : 0
      let ninthDuePercentage = this.percentagesfsForm.controls['ninthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['ninthDuePercentage'].value) : 0
      let tenthDuePercentage = this.percentagesfsForm.controls['tenthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['tenthDuePercentage'].value) : 0
      let eleventhDuePercentage = this.percentagesfsForm.controls['eleventhDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['eleventhDuePercentage'].value) : 0
      let twelfthDuePercentage = this.percentagesfsForm.controls['twelfthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['twelfthDuePercentage'].value) : 0
      let thirteenthDuePercentage = this.percentagesfsForm.controls['thirteenthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['thirteenthDuePercentage'].value) : 0
      let totalDue = firstDuePercentage + secondDuePercentage + thirdDuePercentage + fourthDuePercentage + fifthDuePercentage + sixthDuePercentage + seventhDuePercentage + eighthDuePercentage + ninthDuePercentage + tenthDuePercentage + eleventhDuePercentage + twelfthDuePercentage + thirteenthDuePercentage;

      if (totalDue > 100 || totalDue < 100) {
        this.toastService.showToast('warning', 'Total Due Do not exceed 100 or Lesser than 100', '')
        return

      }
    }

    let getunitType = this.schemeForm.controls['unitType'].value;
    if (getunitType != 'Flat') {
      this.schemeForm.controls['maintenanceHandingOverDate'].setValue('');
    }
    debugger
    let modeOfAllotment = this.schemeForm.controls['modeOfAllotment'].value;
    if (modeOfAllotment != 'LOT') {
      this.schemeForm.controls['dateOfLot'].setValue('');

    }

    let checkSchemeCode = this.schemeForm.controls['schemeCode'].value;
    if (checkSchemeCode.length != 4) {
      this.toastService.showToast('error', 'Please Enter Four Digit Valid Scheme Code', '');

    } else {

      if (this.checkForm()) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Create Scheme',
            message: 'Are you sure you want to create the scheme?'
          },
          panelClass: 'custom-dialog-container'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            const data = {
              ...this.schemeForm.value,
              schemeCode: `${this.schemeForm.get('divisionCode')?.value}${this.schemeForm.get('schemeCode')?.value}`,
              "firstDuePercentage": this.percentagesfsForm.get('firstDuePercentage')?.value,
              "firstDueDate": this.percentagesfsForm.get('firstDueDate')?.value,
              "secondDuePercentage": this.percentagesfsForm.get('secondDuePercentage')?.value,
              "secondDueDate": this.percentagesfsForm.get('secondDueDate')?.value,
              "thirdDuePercentage": this.percentagesfsForm.get('thirdDuePercentage')?.value,
              "thirdDueDate": this.percentagesfsForm.get('thirdDueDate')?.value,
              "fourthDuePercentage": this.percentagesfsForm.get('fourthDuePercentage')?.value,
              "fourthDueDate": this.percentagesfsForm.get('fourthDueDate')?.value,
              "fifthDuePercentage": this.percentagesfsForm.get('fifthDuePercentage')?.value,
              "fifthDueDate": this.percentagesfsForm.get('fifthDueDate')?.value,
              "sixthDuePercentage": this.percentagesfsForm.get('sixthDuePercentage')?.value,
              "sixthDueDate": this.percentagesfsForm.get('sixthDueDate')?.value,
              "seventhDuePercentage": this.percentagesfsForm.get('seventhDuePercentage')?.value,
              "seventhDueDate": this.percentagesfsForm.get('seventhDueDate')?.value,
              "eighthDuePercentage": this.percentagesfsForm.get('eighthDuePercentage')?.value,
              "eighthDueDate": this.percentagesfsForm.get('eighthDueDate')?.value,
              "ninthDuePercentage": this.percentagesfsForm.get('ninthDuePercentage')?.value,
              "ninthDueDate": this.percentagesfsForm.get('ninthDueDate')?.value,
              "tenthDuePercentage": this.percentagesfsForm.get('tenthDuePercentage')?.value,
              "tenthDueDate": this.percentagesfsForm.get('tenthDueDate')?.value,
              "eleventhDuePercentage": this.percentagesfsForm.get('eleventhDuePercentage')?.value,
              "eleventhDueDate": this.percentagesfsForm.get('eleventhDueDate')?.value,
              "twelfthDuePercentage": this.percentagesfsForm.get('twelfthDuePercentage')?.value,
              "twelfthDueDate": this.percentagesfsForm.get('twelfthDueDate')?.value,
              "thirteenthDuePercentage": this.percentagesfsForm.get('thirteenthDuePercentage')?.value,
              "thirteenthDueDate": this.percentagesfsForm.get('thirteenthDueDate')?.value,
            }
            this.propertyService.createScheme(data).subscribe(
              async (response: any) => {
                console.log("Successfully created the scheme", response);
                this.schemeId = response.responseObject.id;
                this.totalUnits = parseInt(response.responseObject.totalUnit) ? parseInt(response.responseObject.totalUnit) : 0;
                this.reservationStatus = response.responseObject.reservationStatus;
                this.modeOfAllotment = response.responseObject.modeOfAllotment;
                // this.toastService.showToast('success', 'Successfully created the scheme', '');
                // this.router.navigate(['/employee/all-schemes']);

                this.getAllReservation().subscribe(() => {
                  this.toastService.showToast('success', 'Successfully created the scheme', '');
                  this.router.navigate(['/employee/all-schemes']);
                });
              },
              (error: any) => {
                console.error("Error adding work details", error);
                this.toastService.showToast('error', 'Error creating the scheme', '');
                this.createSchemeBtn = false;
              }
            );
          }
        });
      }
    }
  }

  async editScheme() {
    debugger
    if (this.schemeForm.get('projectStatus')?.value == 'Self Finance') {

      let firstDuePercentage = this.percentagesfsForm.controls['firstDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['firstDuePercentage'].value) : 0
      let secondDuePercentage = this.percentagesfsForm.controls['secondDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['secondDuePercentage'].value) : 0

      let thirdDuePercentage = this.percentagesfsForm.controls['thirdDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['thirdDuePercentage'].value) : 0
      let fourthDuePercentage = this.percentagesfsForm.controls['fourthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['fourthDuePercentage'].value) : 0
      let fifthDuePercentage = this.percentagesfsForm.controls['fifthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['fifthDuePercentage'].value) : 0
      let sixthDuePercentage = this.percentagesfsForm.controls['sixthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['sixthDuePercentage'].value) : 0
      let seventhDuePercentage = this.percentagesfsForm.controls['seventhDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['seventhDuePercentage'].value) : 0
      let eighthDuePercentage = this.percentagesfsForm.controls['eighthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['eighthDuePercentage'].value) : 0
      let ninthDuePercentage = this.percentagesfsForm.controls['ninthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['ninthDuePercentage'].value) : 0
      let tenthDuePercentage = this.percentagesfsForm.controls['tenthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['tenthDuePercentage'].value) : 0
      let eleventhDuePercentage = this.percentagesfsForm.controls['eleventhDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['eleventhDuePercentage'].value) : 0
      let twelfthDuePercentage = this.percentagesfsForm.controls['twelfthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['twelfthDuePercentage'].value) : 0
      let thirteenthDuePercentage = this.percentagesfsForm.controls['thirteenthDuePercentage'].value ? parseInt(this.percentagesfsForm.controls['thirteenthDuePercentage'].value) : 0
      let totalDue = firstDuePercentage + secondDuePercentage + thirdDuePercentage + fourthDuePercentage + fifthDuePercentage + sixthDuePercentage + seventhDuePercentage + eighthDuePercentage + ninthDuePercentage + tenthDuePercentage + eleventhDuePercentage + twelfthDuePercentage + thirteenthDuePercentage;

      if (totalDue > 100 || totalDue < 100) {
        this.toastService.showToast('warning', 'Total Due Do not exceed 100 or Lesser than 100', '')
        return

      }

    }
    let getunitType = this.schemeForm.controls['unitType'].value;

    if (getunitType != 'Flat') {
      this.schemeForm.controls['maintenanceHandingOverDate'].setValue('');
    }
    if (true) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Edit Scheme',
          message: 'Are you sure you want to edit the scheme?'
        },
        panelClass: 'custom-dialog-container'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // this.schemeForm.value.publishedStatus = 'Yes';
          const data = {
            id: this.schemeId,
            ...this.schemeForm.value,
            "firstDuePercentage": this.percentagesfsForm.get('firstDuePercentage')?.value,
            "firstDueDate": this.percentagesfsForm.get('firstDueDate')?.value,
            "secondDuePercentage": this.percentagesfsForm.get('secondDuePercentage')?.value,
            "secondDueDate": this.percentagesfsForm.get('secondDueDate')?.value,
            "thirdDuePercentage": this.percentagesfsForm.get('thirdDuePercentage')?.value,
            "thirdDueDate": this.percentagesfsForm.get('thirdDueDate')?.value,
            "fourthDuePercentage": this.percentagesfsForm.get('fourthDuePercentage')?.value,
            "fourthDueDate": this.percentagesfsForm.get('fourthDueDate')?.value,
            "fifthDuePercentage": this.percentagesfsForm.get('fifthDuePercentage')?.value,
            "fifthDueDate": this.percentagesfsForm.get('fifthDueDate')?.value,
            "sixthDuePercentage": this.percentagesfsForm.get('sixthDuePercentage')?.value,
            "sixthDueDate": this.percentagesfsForm.get('sixthDueDate')?.value,
            "seventhDuePercentage": this.percentagesfsForm.get('seventhDuePercentage')?.value,
            "seventhDueDate": this.percentagesfsForm.get('seventhDueDate')?.value,
            "eighthDuePercentage": this.percentagesfsForm.get('eighthDuePercentage')?.value,
            "eighthDueDate": this.percentagesfsForm.get('eighthDueDate')?.value,
            "ninthDuePercentage": this.percentagesfsForm.get('ninthDuePercentage')?.value,
            "ninthDueDate": this.percentagesfsForm.get('ninthDueDate')?.value,
            "tenthDuePercentage": this.percentagesfsForm.get('tenthDuePercentage')?.value,
            "tenthDueDate": this.percentagesfsForm.get('tenthDueDate')?.value,
            "eleventhDuePercentage": this.percentagesfsForm.get('eleventhDuePercentage')?.value,
            "eleventhDueDate": this.percentagesfsForm.get('eleventhDueDate')?.value,
            "twelfthDuePercentage": this.percentagesfsForm.get('twelfthDuePercentage')?.value,
            "twelfthDueDate": this.percentagesfsForm.get('twelfthDueDate')?.value,
            "thirteenthDuePercentage": this.percentagesfsForm.get('thirteenthDuePercentage')?.value,
            "thirteenthDueDate": this.percentagesfsForm.get('thirteenthDueDate')?.value,
          }
          debugger
          this.propertyService.editScheme(data).subscribe(
            async (response: any) => {

              console.log("Successfully edited the scheme", response);
              if (response && response.responseObject) {
                this.totalUnits = parseInt(response.responseObject.totalUnit) ? parseInt(response.responseObject.totalUnit) : 0;
                this.schemeId = response.responseObject.id;
                this.reservationStatus = response.responseObject.reservationStatus;
                this.modeOfAllotment = response.responseObject.modeOfAllotment;

                await this.propertyService.deleteSavedReservation(this.schemeId).subscribe(async (res: any) => {
                  if (res && res.body && res.body.responseStatus) {
                    await this.propertyService.getAllReservation().subscribe(async res => {
                      if (res && res.responseObject) {
                        var getReservationList = res.responseObject;
                        let reservationListData: any = [];
                        var subData: any = {};
                        var reservationData: any = {};
                        if (this.modeOfAllotment == 'LOT') {
                          reservationListData = getReservationList.map((item: any, index: any) => {
                            let reservationPercentage = item.percentage && typeof item.percentage == 'string' ? parseInt(item.percentage) : item.percentage;
                            let allocatedUnits = (reservationPercentage / 100) * this.totalUnits;
                            const subReservationList = item.subCategoryReservation.map((subItem: any, index: any) => {
                              let subReservationPercentage = subItem.percentage && typeof subItem.percentage == 'string' ? parseInt(subItem.percentage) : subItem.percentage;
                              let calculateSubreservation = ((reservationPercentage / 100) * (subReservationPercentage / 100)) * this.totalUnits;
                              console.log('calculateSubreservation', calculateSubreservation);
                              if (Math.round(allocatedUnits) > 1 && subItem.subReservationName != 'Handicapped') {
                                subData = {
                                  percentage: subItem.percentage,
                                  priorityCode: subItem.priorityCode,
                                  subReservationName: subItem.subReservationName,
                                  allocatedUnits: Math.round(calculateSubreservation),
                                  soldUnit: subItem.soldUnit

                                }
                                if (item.reservationName != 'General Public') {
                                  this.notAGPDataSubreservList.push(subData);
                                }
                                return subData
                              } else {
                                if (subItem.subReservationName === 'Handicapped') {
                                  if (calculateSubreservation > 1) {
                                    subData = {
                                      percentage: subItem.percentage,
                                      priorityCode: subItem.priorityCode,
                                      subReservationName: subItem.subReservationName,
                                      allocatedUnits: Math.round(allocatedUnits) == 1 ? Math.ceil(calculateSubreservation) :
                                        Math.round(allocatedUnits) > 1 && item.reservationName == 'General Public' ? Math.round(calculateSubreservation) :
                                          Math.round(allocatedUnits) > 1 && item.reservationName != 'General Public' ? Math.round(calculateSubreservation) : 0,
                                      soldUnit: subItem.soldUnit
                                    }
                                  } else {
                                    subData = {
                                      percentage: subItem.percentage,
                                      priorityCode: subItem.priorityCode,
                                      subReservationName: subItem.subReservationName,
                                      allocatedUnits: Math.round(allocatedUnits) > 1 || Math.round(allocatedUnits) == 1 ? Math.ceil(calculateSubreservation) : 0,
                                      soldUnit: subItem.soldUnit

                                    }
                                  }
                                  if (item.reservationName != 'General Public') {
                                    this.notAGPDataSubreservList.push(subData);
                                  }
                                  return subData
                                } else {
                                  subData = {
                                    percentage: subItem.percentage,
                                    priorityCode: subItem.priorityCode,
                                    subReservationName: subItem.subReservationName,
                                    allocatedUnits: Math.round(allocatedUnits) == 1 ? Math.round(calculateSubreservation) : 0,
                                    soldUnit: subItem.soldUnit
                                  }
                                  if (item.reservationName != 'General Public') {
                                    this.notAGPDataSubreservList.push(subData)
                                  }
                                  return subData
                                }


                              }

                            }
                            );

                            if (Math.round(allocatedUnits) > 1 && item.reservationName != 'General Public') {

                              console.log('subReservationList', subReservationList);
                              let subReserTotal = _.sumBy(subReservationList, 'allocatedUnits');
                              let finalAllocation = Math.round(allocatedUnits) - subReserTotal;

                              reservationData = {
                                "ccCode": item.ccCode,
                                "reservationName": item.reservationName,
                                "allocatedUnits": finalAllocation > 0 ? finalAllocation : 0,
                                "soldUnit": item.soldUnit,



                                "schemeId": this.schemeId,
                                "subReservationDTO": subReservationList,
                                "percentage": item.percentage
                              }
                              this.notAGPDataList.push(reservationData);
                              return reservationData;
                            } else {
                              let subReserTotalGP = _.sumBy(subReservationList, 'allocatedUnits');
                              let subReservationDTO = this.notAGPDataSubreservList;
                              let subReservationTotalWithoutGP = _.sumBy(subReservationDTO, 'allocatedUnits');
                              let notAGPDatalist = this.notAGPDataList.filter((x: any) => x.reservationName != 'General Public')
                              let getTotalNonGP = _.sumBy(notAGPDatalist, 'allocatedUnits');
                              let getGPTotal = Math.abs((getTotalNonGP + subReservationTotalWithoutGP) - this.totalUnits);

                              console.log('getGPTotal', getGPTotal);

                              let finalGP = Math.abs(getGPTotal - subReserTotalGP);
                              console.log('finalGP', finalGP);
                              let finalAllocation = item.reservationName == 'General Public' ? finalGP : Math.floor(allocatedUnits) - subReserTotalGP;
                              console.log('getGPTotal________', getGPTotal);
                              reservationData = {
                                "ccCode": item.ccCode,
                                "reservationName": item.reservationName,
                                "allocatedUnits": finalAllocation > 0 ? finalAllocation : 0,
                                "soldUnit": item.soldUnit,
                                "schemeId": this.schemeId,
                                "subReservationDTO": subReservationList,
                                "percentage": item.percentage
                              }
                              if (item.reservationName != 'General Public') {
                                this.notAGPDataList.push(reservationData);
                              }

                              return reservationData;
                            }

                          })
                          console.log('reservationListData', reservationListData);
                          await this.createReservationDataForScheme(reservationListData);
                          this.toastService.showToast('success', 'Successfully edited the scheme', '');
                          this.router.navigate(['/employee/all-schemes']);
                        } else {
                          reservationListData = response.responseObject.map((item: any, index: any) => {
                            const subReservationList = item.subCategoryReservation.map((subItem: any, index: any) => {
                              subData = {
                                percentage: subItem.percentage,
                                priorityCode: subItem.priorityCode,
                                subReservationName: subItem.subReservationName,
                                allocatedUnits: 0,
                                soldUnit: 0
                              }

                              return subData
                            })
                            reservationData = {
                              "ccCode": item.ccCode,
                              "reservationName": item.reservationName,
                              "allocatedUnits": 0,
                              "soldUnit": 0,
                              "schemeId": this.schemeId,
                              "subReservationDTO": subReservationList,
                              "percentage": item.percentage
                            }

                            return reservationData;
                          })
                          console.log('reservationListData', reservationListData);
                          this.createReservationDataForScheme(reservationListData);

                        }
                      }
                    })

                  }
                })

                this.toastService.showToast('success', 'Successfully edited the scheme', '');
                this.router.navigate(['/employee/all-schemes']);


              }


            },
            (error: any) => {
              console.error("Error editing the scheme", error);
              this.toastService.showToast('error', 'Error editing the scheme', '');
              this.createSchemeBtn = false;
            }
          );
        }
      });
    } else {
      this.toastService.showToast('warning', 'Check all the fields', '');
    }
  }

  getSchemeDataById(id: any) {
    debugger
    this.propertyService.getSchemeById(id).subscribe(
      (response: any) => {
        console.log('Response:', response);
        this.schemeForm.patchValue(response);
        this.percentagesfsForm.patchValue(response);
        let firstDueDate = this.percentagesfsForm.controls['firstDueDate'].value ? new Date(this.percentagesfsForm.controls['firstDueDate'].value) : '';
        let secondDueDate = this.percentagesfsForm.controls['secondDueDate'].value ? new Date(this.percentagesfsForm.controls['secondDueDate'].value) : '';
        let thirdDueDate = this.percentagesfsForm.controls['thirdDueDate'].value ? new Date(this.percentagesfsForm.controls['thirdDueDate'].value) : '';
        let fourthDueDate = this.percentagesfsForm.controls['fourthDueDate'].value ? new Date(this.percentagesfsForm.controls['fourthDueDate'].value) : '';
        let fifthDueDate = this.percentagesfsForm.controls['fifthDueDate'].value ? new Date(this.percentagesfsForm.controls['fifthDueDate'].value) : '';
        let sixthDueDate = this.percentagesfsForm.controls['sixthDueDate'].value ? new Date(this.percentagesfsForm.controls['sixthDueDate'].value) : '';
        let seventhDueDate = this.percentagesfsForm.controls['seventhDueDate'].value ? new Date(this.percentagesfsForm.controls['seventhDueDate'].value) : '';
        let eightDueDate = this.percentagesfsForm.controls['eighthDueDate'].value ? new Date(this.percentagesfsForm.controls['eighthDueDate'].value) : '';
        let ninthDueDate = this.percentagesfsForm.controls['ninthDueDate'].value ? new Date(this.percentagesfsForm.controls['ninthDueDate'].value) : '';
        let tenthDueDate = this.percentagesfsForm.controls['tenthDueDate'].value ? new Date(this.percentagesfsForm.controls['tenthDueDate'].value) : '';
        let eleventhDueDate = this.percentagesfsForm.controls['eleventhDueDate'].value ? new Date(this.percentagesfsForm.controls['eleventhDueDate'].value) : '';
        let twelthDueDate = this.percentagesfsForm.controls['twelfthDueDate'].value ? new Date(this.percentagesfsForm.controls['twelfthDueDate'].value) : '';
        let thirteenthDueDate = this.percentagesfsForm.controls['thirteenthDueDate'].value ? new Date(this.percentagesfsForm.controls['thirteenthDueDate'].value) : '';

        if (firstDueDate && firstDueDate < this.currentDate) {
          this.percentagesfsForm.controls['firstDueDate'].disable();
        }
        if (secondDueDate && secondDueDate < this.currentDate) {
          this.percentagesfsForm.controls['secondDueDate'].disable();
        }
        if (thirdDueDate && thirdDueDate < this.currentDate) {
          this.percentagesfsForm.controls['thirdDueDate'].disable();
        }
        if (fourthDueDate && thirdDueDate < this.currentDate) {
          this.percentagesfsForm.controls['fourthDueDate'].disable();
        }
        if (fifthDueDate && fifthDueDate < this.currentDate) {
          this.percentagesfsForm.controls['fifthDueDate'].disable();
        }
        if (sixthDueDate && sixthDueDate < this.currentDate) {
          this.percentagesfsForm.controls['sixthDueDate'].disable();
        }
        if (seventhDueDate && seventhDueDate < this.currentDate) {
          this.percentagesfsForm.controls['seventhDueDate'].disable();
        }

        if (eightDueDate && eightDueDate < this.currentDate) {
          this.percentagesfsForm.controls['eighthDueDate'].disable();
        }
        if (ninthDueDate && ninthDueDate < this.currentDate) {
          this.percentagesfsForm.controls['ninthDueDate'].disable();
        }
        if (tenthDueDate && tenthDueDate < this.currentDate) {
          this.percentagesfsForm.controls['tenthDueDate'].disable();
        }
        if (eleventhDueDate && eleventhDueDate < this.currentDate) {
          this.percentagesfsForm.controls['eleventhDueDate'].disable();
        }
        if (twelthDueDate && twelthDueDate < this.currentDate) {
          this.percentagesfsForm.controls['twelfthDueDate'].disable();
        }

        if (thirteenthDueDate && thirteenthDueDate < this.currentDate) {
          this.percentagesfsForm.controls['thirteenthDueDate'].disable();
        }

        let UserName = sessionStorage.getItem('username');

        this.schemeForm.patchValue({ "createdBy": UserName });

      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  getCountsBySchemeId() {
    this.propertyService.getCountsBySchemeId(this.schemeId).subscribe(
      (response: any) => {
        console.log('Response:', response);
        if (response) {
          this.totalunits = response.schemeDataTotalUnit;
          this.createdUnits = response.schemeIdCountInUnitData;
          this.remainingUnits = this.totalunits - this.createdUnits;
          this.allotedunits = response.unitAllottedStatusYesCount;
          this.unsoldunits = this.totalunits - this.allotedunits;

          this.unitFormGroup.patchValue({
            n_TOTAL_ALLOTTED_UNITS: [response.unitAllottedStatusYesCount],
            n_TOTAL_UNSOLD_UNITS: [response.schemeDataTotalUnit - response.unitAllottedStatusYesCount],
          });

        }


      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  decimalInput() {
    const control = this.schemeForm.get('orginalSellingPrice');
    if (control) {
      let value = control.value;

      // Remove all non-numeric characters except the first decimal point
      value = value.replace(/[^0-9.]/g, '');

      // Handle multiple decimal points
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }

      // Validate with regex for up to 2 decimal places
      const regex = /^\d*\.?\d{0,2}$/;
      if (regex.test(value)) {
        control.setValue(value, { emitEvent: false });
      } else {
        control.setValue('', { emitEvent: false }); // Reset the value if not valid
      }
    }
  }

  formatToTwoDecimals() {
    const control = this.schemeForm.get('orginalSellingPrice');
    if (control) {
      let value = control.value;

      // Parse and format only if the input is valid
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        control.setValue(numericValue.toFixed(2), { emitEvent: false });
      }
    }
  }

  getAllReservation(): Observable<any> {
    debugger
    this.notAGPDataList = [];
    this.notAGPDataSubreservList = [];
    // Return the observable from propertyService.getAllReservation()
    return this.propertyService.getAllReservation().pipe(
      // Handle the response and errors
      tap((response: any) => {
        console.log(response);
        let reservationListData: any = [];
        var subData: any = {};
        var reservationData: any = {};
        // var notAGPDataList: any = [];
        if (this.modeOfAllotment == 'LOT') {
          reservationListData = response.responseObject.map((item: any, index: any) => {
            let reservationPercentage = item.percentage && typeof item.percentage == 'string' ? parseInt(item.percentage) : item.percentage;
            // let allocatedUnits = Math.round((reservationPercentage / 100) * this.totalUnits);
            let allocatedUnits = (reservationPercentage / 100) * this.totalUnits;
            const subReservationList = item.subCategoryReservation.map((subItem: any, index: any) => {
              let subReservationPercentage = subItem.percentage && typeof subItem.percentage == 'string' ? parseInt(subItem.percentage) : subItem.percentage;
              let calculateSubreservation = ((reservationPercentage / 100) * (subReservationPercentage / 100)) * this.totalUnits;
              console.log('calculateSubreservation', calculateSubreservation);
              if (Math.round(allocatedUnits) > 1 && subItem.subReservationName != 'Handicapped') {
                subData = {
                  percentage: subItem.percentage,
                  priorityCode: subItem.priorityCode,
                  subReservationName: subItem.subReservationName,
                  allocatedUnits: Math.round(calculateSubreservation),
                  // soldUnit: Math.round(calculateSubreservation)
                  soldUnit: subItem.soldUnit

                  // allocatedUnits: calculateSubreservation > 1 ? Math.round(calculateSubreservation) : Math.floor(calculateSubreservation)

                }
                if (item.reservationName != 'General Public') {
                  this.notAGPDataSubreservList.push(subData);
                }
                return subData
              } else {
                if (subItem.subReservationName === 'Handicapped') {
                  if (calculateSubreservation > 1) {
                    subData = {
                      percentage: subItem.percentage,
                      priorityCode: subItem.priorityCode,
                      subReservationName: subItem.subReservationName,

                      // allocatedUnits: Math.round(allocatedUnits) == 1 ? Math.ceil(calculateSubreservation) :
                      //   Math.round(allocatedUnits) > 1 && item.reservationName == 'General Public' ? Math.floor(calculateSubreservation) :
                      //     Math.round(allocatedUnits) > 1 && item.reservationName != 'General Public' ? Math.round(calculateSubreservation) : 0
                      allocatedUnits: Math.round(allocatedUnits) == 1 ? Math.ceil(calculateSubreservation) :
                        Math.round(allocatedUnits) > 1 && item.reservationName == 'General Public' ? Math.round(calculateSubreservation) :
                          Math.round(allocatedUnits) > 1 && item.reservationName != 'General Public' ? Math.round(calculateSubreservation) : 0,
                      soldUnit: subItem.soldUnit
                    }
                  } else {
                    subData = {
                      percentage: subItem.percentage,
                      priorityCode: subItem.priorityCode,
                      subReservationName: subItem.subReservationName,
                      // allocatedUnits: Math.round(allocatedUnits) == 1 ? Math.ceil(calculateSubreservation) : Math.round(allocatedUnits) > 1 ? Math.ceil(calculateSubreservation) : 0
                      // allocatedUnits: Math.round(allocatedUnits) == 1 ? Math.ceil(calculateSubreservation) : Math.round(allocatedUnits) > 1 ? Math.floor(calculateSubreservation) : 0
                      allocatedUnits: Math.round(allocatedUnits) > 1 || Math.round(allocatedUnits) == 1 ? Math.ceil(calculateSubreservation) : 0,
                      // soldUnit: Math.round(allocatedUnits) > 1 || Math.round(allocatedUnits) == 1 ? Math.ceil(calculateSubreservation) : 0
                      soldUnit: subItem.soldUnit

                    }
                  }
                  if (item.reservationName != 'General Public') {
                    this.notAGPDataSubreservList.push(subData);
                  }
                  return subData
                } else {
                  subData = {
                    percentage: subItem.percentage,
                    priorityCode: subItem.priorityCode,
                    subReservationName: subItem.subReservationName,
                    // allocatedUnits: Math.round(allocatedUnits) == 1 ? Math.round(calculateSubreservation) : 0
                    allocatedUnits: Math.round(allocatedUnits) == 1 ? Math.round(calculateSubreservation) : 0,
                    // soldUnit: Math.round(allocatedUnits) == 1 ? Math.round(calculateSubreservation) : 0
                    soldUnit: subItem.soldUnit
                  }
                  if (item.reservationName != 'General Public') {
                    this.notAGPDataSubreservList.push(subData)
                  }
                  return subData
                }


              }

            }


            );

            // if (reservationPercentage && reservationPercentage > 1 && item.reservationName != 'General Public') {
            if (Math.round(allocatedUnits) > 1 && item.reservationName != 'General Public') {

              console.log('subReservationList', subReservationList);
              let subReserTotal = _.sumBy(subReservationList, 'allocatedUnits');
              let finalAllocation = Math.round(allocatedUnits) - subReserTotal;
              // let finalAllocation = Math.abs(Math.round(allocatedUnits) - subReserTotal);

              reservationData = {
                "ccCode": item.ccCode,
                "reservationName": item.reservationName,
                // "allocatedUnits": Math.round(allocatedUnits),
                "allocatedUnits": finalAllocation > 0 ? finalAllocation : 0,
                "soldUnit": item.soldUnit,
                // "soldUnit": Math.abs(item.soldUnit - (finalAllocation > 0 ? finalAllocation : 0)),
                // "soldUnit": (finalAllocation > 0 ? finalAllocation : 0),


                "schemeId": this.schemeId,
                "subReservationDTO": subReservationList,
                "percentage": item.percentage
              }
              this.notAGPDataList.push(reservationData);
              return reservationData;
            } else {
              // let subReserTotalGP = _.sumBy(subReservationList, 'allocatedUnits');
              let subReserTotalGP = _.sumBy(subReservationList, 'allocatedUnits');
              let subReservationDTO = this.notAGPDataSubreservList;
              let subReservationTotalWithoutGP = _.sumBy(subReservationDTO, 'allocatedUnits');
              let notAGPDatalist = this.notAGPDataList.filter((x: any) => x.reservationName != 'General Public')
              let getTotalNonGP = _.sumBy(notAGPDatalist, 'allocatedUnits');
              // let getGPTotal = ((Math.abs(getTotalNonGP + subReservationTotalWithoutGP) - this.totalUnits) > 0 ? ((getTotalNonGP + subReservationTotalWithoutGP) - this.totalUnits) : 0);
              let getGPTotal = Math.abs((getTotalNonGP + subReservationTotalWithoutGP) - this.totalUnits);

              console.log('getGPTotal', getGPTotal);

              let finalGP = Math.abs(getGPTotal - subReserTotalGP);
              console.log('finalGP', finalGP);
              // let finalAllocation = item.reservationName == 'General Public' ? Math.round(allocatedUnits) - subReserTotal : Math.floor(allocatedUnits) - subReserTotal;
              // let finalAllocation = item.reservationName == 'General Public' ? Math.floor(allocatedUnits) - subReserTotal : Math.floor(allocatedUnits) - subReserTotal;
              let finalAllocation = item.reservationName == 'General Public' ? finalGP : Math.floor(allocatedUnits) - subReserTotalGP;

              console.log('getGPTotal________', getGPTotal);

              reservationData = {
                "ccCode": item.ccCode,
                "reservationName": item.reservationName,
                // "allocatedUnits": Math.floor(allocatedUnits),
                // "allocatedUnits": reservationPercentage,
                // "allocatedUnits": Math.round(allocatedUnits),
                // "allocatedUnits": Math.round(totalAllotment),
                // "allocatedUnits": getGPTotal,

                // "allocatedUnits": item.reservationName == 'General Public' ? Math.abs(getGPTotal - subReserTotal) : Math.abs(Math.floor(allocatedUnits) - subReserTotal),
                // "allocatedUnits": item.reservationName == 'General Public' ? getGPTotal : Math.round(allocatedUnits),
                // "allocatedUnits": item.reservationName == 'General Public' ? Math.abs(Math.round(allocatedUnits) - subReserTotal) : Math.abs(Math.floor(allocatedUnits) - subReserTotal),
                "allocatedUnits": finalAllocation > 0 ? finalAllocation : 0,

                "soldUnit": item.soldUnit,
                "schemeId": this.schemeId,
                "subReservationDTO": subReservationList,
                "percentage": item.percentage
              }
              if (item.reservationName != 'General Public') {
                this.notAGPDataList.push(reservationData);
              }

              return reservationData;
            }

          })
          console.log('reservationListData', reservationListData);
          this.createReservationDataForScheme(reservationListData);
        } else {
          reservationListData = response.responseObject.map((item: any, index: any) => {

            const subReservationList = item.subCategoryReservation.map((subItem: any, index: any) => {
              subData = {
                percentage: subItem.percentage,
                priorityCode: subItem.priorityCode,
                subReservationName: subItem.subReservationName,
                allocatedUnits: 0,
                soldUnit: 0
              }

              return subData
            })
            reservationData = {
              "ccCode": item.ccCode,
              "reservationName": item.reservationName,
              "allocatedUnits": 0,
              "soldUnit": 0,
              "schemeId": this.schemeId,
              "subReservationDTO": subReservationList,
              "percentage": item.percentage
            }

            return reservationData;
          })
          console.log('reservationListData', reservationListData);
          this.createReservationDataForScheme(reservationListData);

        }


        // const categorizedReservations = this.categorizeReservations(response.responseObject);
        // console.log('Categorized Reservations:', categorizedReservations);
        // const allocatedData = this.calculateAllocatedUnits(categorizedReservations, this.totalUnits);
        // console.log('Alloted Units:', allocatedData);
        // allocatedData.forEach((item) => {
        //   this.createReservationDataForScheme(item, this.schemeId);
        // });
      }),
      catchError((error: any) => {
        console.error(error);
        // Rethrow the error
        throw error;
      })
    );
  }




  categorizeReservations(reservations: Reservation[]): CategorizedReservation[] {
    debugger
    const categorized: CategorizedReservation[] = [];
    const reservationMap: { [key: string]: CategorizedReservation } = {};

    reservations.forEach(reservation => {
      if (reservation.priorityCode === '') {
        const newCategory: CategorizedReservation = { head: reservation, subcategories: [] };
        categorized.push(newCategory);
        reservationMap[reservation.ccCode] = newCategory;
      } else {
        const parentCategory = reservationMap[reservation.ccCode];
        if (parentCategory) {
          parentCategory.subcategories.push(reservation);
        } else {
          console.warn(`Parent category not found for priority code: ${reservation.priorityCode}`);
        }
      }
    });

    return categorized;
  }

  calculateAllocatedUnits(data: any, totalUnits: number): any[] {
    const result: any[] = [];

    data.forEach((category: { head: any; subcategories: any; }) => {
      const head = category.head;
      const subcategories = category.subcategories;

      // Calculate head units based on percentage
      const headUnits = Math.round((parseFloat(head.percentage) / 100) * totalUnits);
      let remainingUnits = headUnits;

      subcategories.forEach((subcategory: { percentage: string; reservationName: string; allocatedUnits: number; ccCode: any; priorityCode: any; }) => {
        const subcategoryPercentage = parseFloat(subcategory.percentage);
        let subcategoryUnits = (subcategoryPercentage / 100) * headUnits;

        if (subcategory.reservationName === 'Differently Abled') {
          if (subcategoryUnits < 0.5) {
            subcategoryUnits = 1;
          } else {
            subcategoryUnits = Math.round(subcategoryUnits);
          }
        } else {
          subcategoryUnits = Math.round(subcategoryUnits);
        }

        subcategory.allocatedUnits = subcategoryUnits;
        remainingUnits -= subcategoryUnits;

        result.push({
          ccCode: subcategory.ccCode,
          priorityCode: subcategory.priorityCode,
          reservationName: subcategory.reservationName,
          allocatedUnits: subcategoryUnits
        });
      });

      head.allocatedUnits = remainingUnits;

      result.push({
        ccCode: head.ccCode,
        priorityCode: head.priorityCode,
        reservationName: head.reservationName,
        allocatedUnits: remainingUnits
      });
    });

    return result;
  }


  // createReservationDataForScheme(data: any, schemeId: number) {
  createReservationDataForScheme(data: any) {

    // const payload = {
    //   ...data,
    //   schemeId
    // };
    const payload = data
    this.propertyService.createReservationDataForScheme(payload).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  checkForm(): boolean {
    const controlsToCheck = [
      { controlName: 'divisionCode', message: 'Fill Division Code' },
      { controlName: 'schemeCode', message: 'Fill Scheme Code' },
      { controlName: 'schemeName', message: 'Fill Scheme Name' },
      { controlName: 'schemeType', message: 'Fill Scheme Type' },
      { controlName: 'unitType', message: 'Fill Unit Type' },
      { controlName: 'totalUnit', message: 'Fill Total Unit' },
      { controlName: 'reservationStatus', message: 'Fill Reservation Status' },
      { controlName: 'projectStatus', message: 'Fill Project Status' }
    ];

    for (let control of controlsToCheck) {
      if (!this.schemeForm.get(control.controlName)?.value) {
        this.toastService.showToast('warning', control.message, '');
        return false;
      }
    }

    // If all required fields are filled
    return true;
  }


  goToScheme(router: any) {
    this.router.navigateByUrl(router);
  }

  isRequiredBookingDate(type: any) {
    debugger
    if (type == 'startDate') {
      let startDate = this.schemeForm.controls['applicationReceieveDate'].value;
      let formateStartDate: any = this.datepipe.transform(new Date(startDate), 'dd-MM-yyyy')
      const convertedStartDate = this.convertToDateTimeStart(formateStartDate);
      this.startDate = convertedStartDate;
      this.schemeForm.controls['startDate'].setValue(convertedStartDate);
      console.log('convertedDate', convertedStartDate);
    } else {
      let endDate = this.schemeForm.controls['applicationReceieveLastDate'].value;
      let formateEndDate: any = this.datepipe.transform(new Date(endDate), 'dd-MM-yyyy')
      const convertedEndDate = this.convertToDateTimeEnd(formateEndDate);
      this.endDate = convertedEndDate;
      this.schemeForm.controls['endDate'].setValue(convertedEndDate);

      console.log('convertedDate', convertedEndDate);
    }


  }

  convertToDateTimeStart(dateString: string): string {
    // Input date string in 'DD-MM-YYYY' format
    const [day, month, year] = dateString.split('-').map(Number);

    // Create a new Date object with 10:00 AM as time
    const date = new Date(year, month - 1, day, 10, 0, 0);

    return date.toString(); // "Sun Oct 27 2024 10:00:00 GMT+0530 (India Standard Time)"
  }
  convertToDateTimeEnd(dateString: string): string {
    // Input date string in 'DD-MM-YYYY' format
    const [day, month, year] = dateString.split('-').map(Number);

    // Create a new Date object with 10:00 AM as time
    const date = new Date(year, month - 1, day, 10, 0, 0);

    return date.toString(); // "Sun Oct 27 2024 10:00:00 GMT+0530 (India Standard Time)"
  }


}