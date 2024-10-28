import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';
import { PropertyService } from '../../../services/property.service';
import { ToastService } from '../../../services/toast.service';
import { Observable, forkJoin, of } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { SalesService } from '../../../services/sales.service';
import { DatePipe, Location } from '@angular/common';
import { initial } from 'lodash';

@Component({
  selector: 'app-add-view-edit-unit',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-view-edit-unit.component.html',
  styleUrl: './add-view-edit-unit.component.scss'
})
export class AddViewEditUnitComponent {
  displayedColumns: string[] = ['sno', 'paymentType', 'unitAccountNumber', 'transactionId', 'bankName', 'paymentMode', 'cost', 'paymentDateAndTime', 'action'];
  allPaymentDataSource = new MatTableDataSource<any>([]);

  UnitDataFormGroup!: FormGroup;
  sfsDataFormGroup!: FormGroup;
  PropertyDataFormGroup!: FormGroup;
  AllotteeDataFormGroup!: FormGroup;
  unitData: any;
  schemeId: any
  id!: number;
  selectedTab: string = 'Unit';
  mode: any;
  schemeData: any = {};
  unitId: any;
  readOnly: boolean = false;

  fieldMeasurementBook: File | null = null;
  layout: File | null = null;

  totalunits: any;
  createdUnits: any;
  remainingUnits: any;

  role: any = '';
  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  schemeDataList: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private router: Router,
    private dialog: MatDialog,
    private toast: ToastService,
    private title: Title,
    private salesService: SalesService,
    private datePipe: DatePipe,
    private location: Location
  ) { }

  ngOnInit() {
    debugger
    this.role = sessionStorage.getItem('role');

    let UserName = sessionStorage.getItem('username');
    // this.UnitDataFormGroup = this.formBuilder.group({

    //   schemeCode: [''],
    //   nameOfTheDivision: [''],
    //   schemeName: [''],
    //   type: [''],
    //   unitType: [''],
    //   projectStatus: [''],

    //   unitAccountNumber: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    //   modeOfAllotment: [''],
    //   unitNo: [''],

    //   blockNo: [''],
    //   floorNo: [''],
    //   flatNo: [''],
    //   plinthArea: [''],
    //   uds: [''],

    //   gdq: [''],
    //   reservationCategory: [''],
    //   reservationCategoryCode: [''],
    //   priority: [''],
    //   priorityCode: [''],
    //   allotmentStatus: ['No'],
    //   category: [''],

    //   dateOfAllotment: [''],

    //   unitCost: [''],
    //   freezedRate: [''],
    //   initialDeposit: [''],
    //   // emi: [''],
    //   // penalIndus: [''],
    //   // lumsum: [''],
    //   // foreclosure: [''],
    //   emiStartDate: [''],
    //   unitReadyDate: [''],
    //   paymentDueDate: [''],
    //   hbaFromSg: [''],
    //   sfLoanSg: [''],
    //   abIssuedDate: [''],
    //   loanSancDate: [''],
    //   unitHandingOver: [''],
    //   plotHandingOver: [''],
    //   actualExtent: [''],
    //   roadFacing: [''],
    //   cornerPlotStatus: [''],
    //   doorFacing: [''],
    //   liveStatus: [''],
    //   ripedStatus: [''],
    //   fcPaidStatus: [''],
    //   draftDeedDate: [''],
    //   fcPaidButSaleDeedNotIssued: [''],
    //   maintenanceDate: [''],
    //   carDemand: [''],
    //   carSlot1: [''],
    //   carSlot2: [''],
    //   ripedButCostNotFullyPaid: [''],
    //   saleDeedStatus: [''],
    //   saleDeedDate: [''],
    //   fieldMeasurementBookPath: [''],
    //   layoutPath: [''],

    //   applicationStatus: ['No'],
    //   gst: [],
    //   loanSanctionDate: [''],
    //   differenceCost: [''],
    //   dueDateOfDifferenceCost: [''],
    //   handingOverDate: [''],
    //   mcDemand: [''],
    //   mcDemandFrom: [''],
    //   carParkingDemand: [''],
    //   carParkingSlot1: [''],
    //   carParkingSlot2: [''],
    //   createdBy: [UserName],
    //   createdDateTime: [''],
    //   bookingStatus: [''],
    //   bookingTime: ['']
    // });

    this.sfsDataFormGroup = this.formBuilder.group({
      firstAmountDue: [''],
      firstAmountDueDate: [''],
      secondAmountDue: [''],
      secondAmountDueDate: [''],
      thirdAmountDue: [''],
      thirdAmountDueDate: [''],
      fourthAmountDue: [''],
      fourthAmountDueDate: [''],
      fifthAmountDue: [''],
      fifthAmountDueDate: [''],
      sixthAmountDue: [''],
      sixthAmountDueDate: [''],
      seventhAmountDue: [''],
      seventhAmountDueDate: [''],
      eighthAmountDue: [''],
      eighthAmountDueDate: [''],
      ninthAmountDue: [''],
      ninthAmountDueDate: [''],
      tenthAmountDue: [''],
      tenthAmountDueDate: [''],
      eleventhAmountDue: [''],
      eleventhAmountDueDate: [''],
      twelfthAmountDue: [''],
      twelfthAmountDueDate: [''],
      thirteenthAmountDue: [''],
      thirteenthAmountDueDate: [''],
      belatedInterest: [''],

    });

    this.PropertyDataFormGroup = this.formBuilder.group({
      allotmentFileReference: [''],
      currentFileReference: [''],
      typeDescription: [''],
      schemePlace: [''],
      totalCost: [''],
      totalCostInWords: [''],
      landCost: [''],
      landCostInWords: [''],
      buildingCost: [''],
      buildingCostInWords: [''],
      emdReciptNo: [''],

      emdPaidDate: [''],

      emdPaidAmount: [''],
      dateOfHandingOver: [''],
      boardResolutionNo: [''],
      boardResolutionDate: [''],
      goNo: [''],
      goDate: [''],
      surveyNo: [''],
      northBoundary: [''],
      eastBoundry: [''],
      westBoundry: [''],
      southBoundry: [''],
      northScaling: [''],
      eastScaling: [''],
      westScaling: [''],
      southScaling: [''],
      splay: [''],
      village: [''],
      taluk: [''],
      district: [''],
      subRegisterDesignation: [''],
      suRegisterOfficePlace: [''],
      lcsAgreementDate: [''],
      purposeOfUnit: [''],
    });

    // this.AllotteeDataFormGroup = this.formBuilder.group({
    //   applicantName: ['', Validators.required],
    //   dateOfBirth: ['', Validators.required],
    //   age: [''],
    //   applicantHusbandOrWifeName: [''],
    //   applicantFatherName: [''],
    //   jointApplicantName: [''],
    //   jointApplicantDateOfBirth: [''],
    //   jointApplicantAge: [''],
    //   jointApplicantHusbandOrWifeName: [''],
    //   joinApplicantFatherName: [''],
    //   mobileNumber: ['', Validators.required],
    //   emailId: ['', [Validators.required, Validators.email]],
    //   aadhaarNumber: ['', Validators.required],
    //   panNumber: [''],
    //   correspondenceAddress: ['', Validators.required],
    //   permanentAddress: [''],
    //   applicantMonthlyIncome: [''],
    //   spouseMonthlyIncome: [''],
    //   totalMonthlyIncome: [''],
    //   nameOfTheBank: [''],
    //   ifscCode: [''],
    //   accountNumber: [''],
    //   accountHolderName: [''],
    //   nativeCertificatePath: [''],
    //   birthCertificatePath: [''],
    //   aadhaarPath: [''],
    //   incomeCertificatePath: [''],
    //   proofOfReservationMainCategory: [''],
    //   proofOfReservationSubCategory: [''],
    //   primaryApplicantSignature: [''],
    //   applicantPhotoPath: [''],
    //   jointApplicantSignature: ['']
    // });

    this.route.queryParams.subscribe(params => {
      this.schemeId = params['schemeId'];
      this.mode = params['mode'];
      this.getCommonSchemeData();
    });

    if (this.mode === 'create') {
      this.UnitDataFormGroup = this.formBuilder.group({

        schemeCode: [''],
        nameOfTheDivision: [''],
        schemeName: [''],
        type: [''],
        unitType: [''],
        projectStatus: [''],

        unitAccountNumber: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
        modeOfAllotment: [''],
        unitNo: [''],

        blockNo: [''],
        floorNo: [''],
        flatNo: [''],
        plinthArea: [''],
        uds: [''],

        gdq: [''],
        reservationCategory: [''],
        reservationCategoryCode: [''],
        priority: [''],
        priorityCode: [''],
        allotmentStatus: ['No'],
        category: [''],

        dateOfAllotment: [''],

        unitCost: [''],
        freezedRate: [''],
        initialDeposit: [''],
        // emi: [''],
        // penalIndus: [''],
        // lumsum: [''],
        // foreclosure: [''],
        emiStartDate: [''],
        unitReadyDate: [''],
        paymentDueDate: [''],
        hbaFromSg: [''],
        sfLoanSg: [''],
        abIssuedDate: [''],
        loanSancDate: [''],
        unitHandingOver: [''],
        plotHandingOver: [''],
        actualExtent: [''],
        roadFacing: [''],
        cornerPlotStatus: [''],
        doorFacing: [''],
        liveStatus: [''],
        ripedStatus: [''],
        fcPaidStatus: [''],
        draftDeedDate: [''],
        fcPaidButSaleDeedNotIssued: [''],
        maintenanceDate: [''],
        carDemand: [''],
        carSlot1: [''],
        carSlot2: [''],
        ripedButCostNotFullyPaid: [''],
        saleDeedStatus: [''],
        saleDeedDate: [''],
        fieldMeasurementBookPath: [''],
        layoutPath: [''],

        applicationStatus: ['No'],
        gst: [],
        loanSanctionDate: [''],
        differenceCost: [''],
        dueDateOfDifferenceCost: [''],
        handingOverDate: [''],
        mcDemand: [''],
        mcDemandFrom: [''],
        mcDemandUpTo: [''],
        carParkingDemand: [''],
        carParkingSlot1: [''],
        carParkingSlot2: [''],
        createdBy: [UserName],
        createdDateTime: [''],
        bookingStatus: [''],
        bookingTime: [''],
        emi: [''],
        "unitCostPaidSoFar": [0],
        "unitCostRemainingBalance": [0],
        "gstCostPaidSoFar": [0],
        "gstRemainingBalance": [0],
        "mcDemandPaidSoFar": [0],
        "mcDemandRemainingBalance": [0],
        "carParkingPaidSoFar": [0],
        "carParkingRemainingBalance": [0],
        "differentCostPaidSoFar": [0],
        "differentCostRemainingBalance": [0],
        demandTotalCost: [0],
        firstDueInterestPaidSoFar: [0],
        secondDueInterestPaidSoFar: [0],
        thirdDueInterestPaidSoFar: [0],
        fourthDueInterestPaidSoFar: [0],
        fifthDueInterestPaidSoFar: [0],
        sixthDueInterestPaidSoFar: [0],
        seventhDueInterestPaidSoFar: [0],
        eighthDueInterestPaidSoFar: [0],
        ninthDueInterestPaidSoFar: [0],
        tenthDueInterestPaidSoFar: [0],
        eleventhDueInterestPaidSoFar: [0],
        twelfthDueInterestPaidSoFar: [0],
        thirteenthDueInterestPaidSoFar: [0],

        firstDuePaidSoFar: [0],
        firstDueRemainingBalance: [0],
        secondDuePaidSoFar: [0],
        secondDueRemainingBalance: [0],
        thirdDuePaidSoFar: [0],
        thirdDueRemainingBalance: [0],
        fourthDuePaidSoFar: [0],
        fourthDueRemainingBalance: [0],
        fifthDuePaidSoFar: [0],
        fifthDueRemainingBalance: [0],
        sixthDuePaidSoFar: [0],
        sixthDueRemainingBalance: [0],
        seventhDuePaidSoFar: [0],
        seventhDueRemainingBalance: [0],
        eighthDuePaidSoFar: [0],
        eighthDueRemainingBalance: [0],
        ninthDuePaidSoFar: [0],
        ninthDueRemainingBalance: [0],
        tenthDuePaidSoFar: [0],
        tenthDueRemainingBalance: [0],
        eleventhDuePaidSoFar: [0],
        eleventhDueRemainingBalance: [0],
        twelfthDuePaidSoFar: [0],
        twelfthDueRemainingBalance: [0],
        thirteenthDuePaidSoFar: [0],
        thirteenthDueRemainingBalance: [0],
        totalInterestCollected: [0],

        differentinCostInterestPaidSoFar: [0],
        village: [''],
        taluk: [''],
        scrunityFees: [''],
        "scrunityFeesPaidSoFar": [0],
        "scrunityFeesRemainingBalance": [0],
        "firstDueInterest": [0],
        "secondDueInterest": [0],
        "unitAllottedStatus": ["No"]
      });

      this.AllotteeDataFormGroup = this.formBuilder.group({
        applicantName: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        age: [''],
        martialStatus: [''],
        applicantAadhaarNumber: [''],
        applicantPanNumber: [''],
        applicantFatherName: [''],
        jointApplicantName: [''],
        jointApplicantDateOfBirth: ['', Validators.required],
        jointApplicantAge: ['', [Validators.required, Validators.email]],
        jointApplicantAadhaarNumber: ['', Validators.required],
        relationshipWithApplicant: [''],
        joinApplicantFatherName: ['', Validators.required],
        mobileNumber: [''],
        emailId: [''],
        addressLine1: [''],
        addressLine2: [''],
        pincode: [''],
        district: [''],
        state: [''],
        applicantMonthlyIncome: [''],
        jointApplicantMonthlyIncome: [''],
        totalMonthlyIncome: [''],
        nameOfTheBank: [''],
        branch: [''],
        ifscCode: [''],
        accountNumber: [''],
        accountHolderName: [''],
        nativeCertificatePath: [''],
        // birthCertificatePath: [''],
        aadhaarPath: [''],
        incomeCertificatePath: [''],
        proofOfReservationMainCategory: [''],
        proofOfReservationSubCategory: [''],
        primaryApplicantSignature: [''],
        applicantPhotoPath: [''],
        jointApplicantSignature: ['']
      });
      this.title.setTitle('Create Unit');
    } else if (this.mode === 'edit') {
      this.title.setTitle('Edit Unit');
      this.UnitDataFormGroup = this.formBuilder.group({

        schemeCode: [''],
        nameOfTheDivision: [''],
        schemeName: [''],
        type: [''],
        unitType: [''],
        projectStatus: [''],

        unitAccountNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
        modeOfAllotment: [''],
        unitNo: [''],

        blockNo: [''],
        floorNo: [''],
        flatNo: [''],
        plinthArea: [''],
        uds: [''],

        gdq: [''],
        reservationCategory: [''],
        reservationCategoryCode: [''],
        priority: [''],
        priorityCode: [''],
        allotmentStatus: ['No'],
        category: [''],

        dateOfAllotment: [''],

        unitCost: [''],
        freezedRate: [''],
        initialDeposit: [''],
        // emi: [''],
        // penalIndus: [''],
        // lumsum: [''],
        // foreclosure: [''],
        emiStartDate: [''],
        unitReadyDate: [''],
        paymentDueDate: [''],
        hbaFromSg: [''],
        sfLoanSg: [''],
        abIssuedDate: [''],
        loanSancDate: [''],
        unitHandingOver: [''],
        plotHandingOver: [''],
        actualExtent: [''],
        roadFacing: [''],
        cornerPlotStatus: [''],
        doorFacing: [''],
        liveStatus: [''],
        ripedStatus: [''],
        fcPaidStatus: [''],
        draftDeedDate: [''],
        fcPaidButSaleDeedNotIssued: [''],
        maintenanceDate: [''],
        carDemand: [''],
        carSlot1: [''],
        carSlot2: [''],
        ripedButCostNotFullyPaid: [''],
        saleDeedStatus: [''],
        saleDeedDate: [''],
        fieldMeasurementBookPath: [''],
        layoutPath: [''],

        applicationStatus: ['No'],
        gst: [],
        loanSanctionDate: [''],
        differenceCost: [''],
        dueDateOfDifferenceCost: [''],
        handingOverDate: [''],
        mcDemand: [''],
        mcDemandFrom: [''],
        mcDemandUpTo: [''],
        carParkingDemand: [''],
        carParkingSlot1: [''],
        carParkingSlot2: [''],
        createdBy: [UserName],
        createdDateTime: [''],
        bookingStatus: [''],
        bookingTime: [''],
        emi: [''],
        "unitCostPaidSoFar": [0],
        "unitCostRemainingBalance": [0],
        "gstCostPaidSoFar": [0],
        "gstRemainingBalance": [0],
        "mcDemandPaidSoFar": [0],
        "mcDemandRemainingBalance": [0],
        "carParkingPaidSoFar": [0],
        "carParkingRemainingBalance": [0],
        "differentCostPaidSoFar": [0],
        "differentCostRemainingBalance": [0],
        demandTotalCost: [0],
        firstDueInterestPaidSoFar: [0],
        secondDueInterestPaidSoFar: [0],
        thirdDueInterestPaidSoFar: [0],
        fourthDueInterestPaidSoFar: [0],
        fifthDueInterestPaidSoFar: [0],
        sixthDueInterestPaidSoFar: [0],
        seventhDueInterestPaidSoFar: [0],
        eighthDueInterestPaidSoFar: [0],
        ninthDueInterestPaidSoFar: [0],
        tenthDueInterestPaidSoFar: [0],
        eleventhDueInterestPaidSoFar: [0],
        twelfthDueInterestPaidSoFar: [0],
        thirteenthDueInterestPaidSoFar: [0],

        firstDuePaidSoFar: [0],
        firstDueRemainingBalance: [0],
        secondDuePaidSoFar: [0],
        secondDueRemainingBalance: [0],
        thirdDuePaidSoFar: [0],
        thirdDueRemainingBalance: [0],
        fourthDuePaidSoFar: [0],
        fourthDueRemainingBalance: [0],
        fifthDuePaidSoFar: [0],
        fifthDueRemainingBalance: [0],
        sixthDuePaidSoFar: [0],
        sixthDueRemainingBalance: [0],
        seventhDuePaidSoFar: [0],
        seventhDueRemainingBalance: [0],
        eighthDuePaidSoFar: [0],
        eighthDueRemainingBalance: [0],
        ninthDuePaidSoFar: [0],
        ninthDueRemainingBalance: [0],
        tenthDuePaidSoFar: [0],
        tenthDueRemainingBalance: [0],
        eleventhDuePaidSoFar: [0],
        eleventhDueRemainingBalance: [0],
        twelfthDuePaidSoFar: [0],
        twelfthDueRemainingBalance: [0],
        thirteenthDuePaidSoFar: [0],
        thirteenthDueRemainingBalance: [0],
        totalInterestCollected: [0],
        differentinCostInterestPaidSoFar: [0],
        village: [''],
        taluk: [''],
        scrunityFees: [''],
        "scrunityFeesPaidSoFar": [0],
        "scrunityFeesRemainingBalance": [0],
        "firstDueInterest": [0],
        "secondDueInterest": [0],
        "unitAllottedStatus": ["No"]


      });
      this.AllotteeDataFormGroup = this.formBuilder.group({
        applicantName: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        age: [''],
        martialStatus: [''],
        applicantAadhaarNumber: [''],
        applicantPanNumber: [''],
        applicantFatherName: [''],
        jointApplicantName: [''],
        jointApplicantDateOfBirth: ['', Validators.required],
        jointApplicantAge: ['', [Validators.required, Validators.email]],
        jointApplicantAadhaarNumber: ['', Validators.required],
        relationshipWithApplicant: [''],
        joinApplicantFatherName: ['', Validators.required],
        mobileNumber: [''],
        emailId: [''],
        addressLine1: [''],
        addressLine2: [''],
        pincode: [''],
        district: [''],
        state: [''],
        applicantMonthlyIncome: [''],
        jointApplicantMonthlyIncome: [''],
        totalMonthlyIncome: [''],
        nameOfTheBank: [''],
        branch: [''],
        ifscCode: [''],
        accountNumber: [''],
        accountHolderName: [''],
        nativeCertificatePath: [''],
        // birthCertificatePath: [''],
        aadhaarPath: [''],
        incomeCertificatePath: [''],
        proofOfReservationMainCategory: [''],
        proofOfReservationSubCategory: [''],
        primaryApplicantSignature: [''],
        applicantPhotoPath: [''],
        jointApplicantSignature: ['']
      });
      this.route.queryParams.subscribe(params => {
        this.unitId = params['unitId'];
      });
      debugger
      this.getUnitDataById(this.unitId);
    } else if (this.mode === 'view') {
      this.UnitDataFormGroup = this.formBuilder.group({

        schemeCode: [''],
        nameOfTheDivision: [''],
        schemeName: [''],
        type: [''],
        unitType: [''],
        projectStatus: [''],

        unitAccountNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
        modeOfAllotment: [''],
        unitNo: [''],

        blockNo: [''],
        floorNo: [''],
        flatNo: [''],
        plinthArea: [''],
        uds: [''],

        gdq: [''],
        reservationCategory: [''],
        reservationCategoryCode: [''],
        priority: [''],
        priorityCode: [''],
        allotmentStatus: ['No'],
        category: [''],

        dateOfAllotment: [''],

        unitCost: [''],
        freezedRate: [''],
        initialDeposit: [''],
        // emi: [''],
        // penalIndus: [''],
        // lumsum: [''],
        // foreclosure: [''],
        emiStartDate: [''],
        unitReadyDate: [''],
        paymentDueDate: [''],
        hbaFromSg: [''],
        sfLoanSg: [''],
        abIssuedDate: [''],
        loanSancDate: [''],
        unitHandingOver: [''],
        plotHandingOver: [''],
        actualExtent: [''],
        roadFacing: [''],
        cornerPlotStatus: [''],
        doorFacing: [''],
        liveStatus: [''],
        ripedStatus: [''],
        fcPaidStatus: [''],
        draftDeedDate: [''],
        fcPaidButSaleDeedNotIssued: [''],
        maintenanceDate: [''],
        carDemand: [''],
        carSlot1: [''],
        carSlot2: [''],
        ripedButCostNotFullyPaid: [''],
        saleDeedStatus: [''],
        saleDeedDate: [''],
        fieldMeasurementBookPath: [''],
        layoutPath: [''],

        applicationStatus: ['No'],
        gst: [],
        loanSanctionDate: [''],
        differenceCost: [''],
        dueDateOfDifferenceCost: [''],
        handingOverDate: [''],
        mcDemand: [''],
        mcDemandFrom: [''],
        mcDemandUpTo: [''],
        carParkingDemand: [''],
        carParkingSlot1: [''],
        carParkingSlot2: [''],
        createdBy: [UserName],
        createdDateTime: [''],
        bookingStatus: [''],
        bookingTime: [''],
        emi: [''],
        "unitCostPaidSoFar": [0],
        "unitCostRemainingBalance": [0],
        "gstCostPaidSoFar": [0],
        "gstRemainingBalance": [0],
        "mcDemandPaidSoFar": [0],
        "mcDemandRemainingBalance": [0],
        "carParkingPaidSoFar": [0],
        "carParkingRemainingBalance": [0],
        "differentCostPaidSoFar": [0],
        "differentCostRemainingBalance": [0],
        demandTotalCost: [0],
        firstDueInterestPaidSoFar: [0],
        secondDueInterestPaidSoFar: [0],
        thirdDueInterestPaidSoFar: [0],
        fourthDueInterestPaidSoFar: [0],
        fifthDueInterestPaidSoFar: [0],
        sixthDueInterestPaidSoFar: [0],
        seventhDueInterestPaidSoFar: [0],
        eighthDueInterestPaidSoFar: [0],
        ninthDueInterestPaidSoFar: [0],
        tenthDueInterestPaidSoFar: [0],
        eleventhDueInterestPaidSoFar: [0],
        twelfthDueInterestPaidSoFar: [0],
        thirteenthDueInterestPaidSoFar: [0],

        firstDuePaidSoFar: [0],
        firstDueRemainingBalance: [0],
        secondDuePaidSoFar: [0],
        secondDueRemainingBalance: [0],
        thirdDuePaidSoFar: [0],
        thirdDueRemainingBalance: [0],
        fourthDuePaidSoFar: [0],
        fourthDueRemainingBalance: [0],
        fifthDuePaidSoFar: [0],
        fifthDueRemainingBalance: [0],
        sixthDuePaidSoFar: [0],
        sixthDueRemainingBalance: [0],
        seventhDuePaidSoFar: [0],
        seventhDueRemainingBalance: [0],
        eighthDuePaidSoFar: [0],
        eighthDueRemainingBalance: [0],
        ninthDuePaidSoFar: [0],
        ninthDueRemainingBalance: [0],
        tenthDuePaidSoFar: [0],
        tenthDueRemainingBalance: [0],
        eleventhDuePaidSoFar: [0],
        eleventhDueRemainingBalance: [0],
        twelfthDuePaidSoFar: [0],
        twelfthDueRemainingBalance: [0],
        thirteenthDuePaidSoFar: [0],
        thirteenthDueRemainingBalance: [0],
        totalInterestCollected: [0],
        differentinCostInterestPaidSoFar: [0],
        village: [''],
        taluk: [''],
        scrunityFees: [''],
        "scrunityFeesPaidSoFar": [0],
        "scrunityFeesRemainingBalance": [0],
        "firstDueInterest": [0],
        "secondDueInterest": [0],
        "unitAllottedStatus": ["No"]

      });

      this.AllotteeDataFormGroup = this.formBuilder.group({
        applicantName: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        age: [''],
        martialStatus: [''],
        applicantAadhaarNumber: [''],
        applicantPanNumber: [''],
        applicantFatherName: [''],
        jointApplicantName: [''],
        jointApplicantDateOfBirth: ['', Validators.required],
        jointApplicantAge: ['', [Validators.required, Validators.email]],
        jointApplicantAadhaarNumber: ['', Validators.required],
        relationshipWithApplicant: [''],
        joinApplicantFatherName: ['', Validators.required],
        mobileNumber: [''],
        emailId: [''],
        addressLine1: [''],
        addressLine2: [''],
        pincode: [''],
        district: [''],
        state: [''],
        applicantMonthlyIncome: [''],
        jointApplicantMonthlyIncome: [''],
        totalMonthlyIncome: [''],
        nameOfTheBank: [''],
        branch: [''],
        ifscCode: [''],
        accountNumber: [''],
        accountHolderName: [''],
        nativeCertificatePath: [''],
        // birthCertificatePath: [''],
        aadhaarPath: [''],
        incomeCertificatePath: [''],
        proofOfReservationMainCategory: [''],
        proofOfReservationSubCategory: [''],
        primaryApplicantSignature: [''],
        applicantPhotoPath: [''],
        jointApplicantSignature: ['']
      });
      this.title.setTitle('View Unit');
      this.route.queryParams.subscribe(params => {
        this.unitId = params['unitId'];
      });
      this.getUnitDataById(this.unitId);
      this.readOnly = true;
    }

    this.getCountsBySchemeId();

  }

  unitCostChange(event: any) {
    let ProjectStatus = this.UnitDataFormGroup.controls['projectStatus'].value;

    if (ProjectStatus == 'Self Finance') {
      let value = event.target.value ? parseFloat(event.target.value) : 0;

      let firstDuePercentage = this.schemeDataList.firstDuePercentage ? parseFloat(this.schemeDataList.firstDuePercentage) : 0
      let firstAmountDue = ((value * firstDuePercentage) / 100) > 0 ? ((value * firstDuePercentage) / 100) : 0;
      this.sfsDataFormGroup.controls['firstAmountDue'].setValue(firstAmountDue);
      this.sfsDataFormGroup.controls['firstAmountDueDate'].setValue(this.schemeDataList.firstDueDate)

      let secondDuePercentage = this.schemeDataList.secondDuePercentage ? parseFloat(this.schemeDataList.secondDuePercentage) : 0

      let secondAmountDue = ((value * secondDuePercentage) / 100) > 0 ? ((value * secondDuePercentage) / 100) : 0;
      this.sfsDataFormGroup.controls['secondAmountDue'].setValue(secondAmountDue);
      this.sfsDataFormGroup.controls['secondAmountDueDate'].setValue(this.schemeDataList.secondDueDate)

      let thirdDuePercentage = this.schemeDataList.thirdDuePercentage ? parseFloat(this.schemeDataList.thirdDuePercentage) : 0
      let thirdAmountDue = ((value * thirdDuePercentage) / 100) > 0 ? ((value * thirdDuePercentage) / 100) : 0;
      this.sfsDataFormGroup.controls['thirdAmountDue'].setValue(thirdAmountDue);
      this.sfsDataFormGroup.controls['thirdAmountDueDate'].setValue(this.schemeDataList.thirdDueDate)



      let fourthDuePercentage = this.schemeDataList.fourthDuePercentage ? parseFloat(this.schemeDataList.fourthDuePercentage) : 0
      let fourthAmountDue = ((value * fourthDuePercentage) / 100) > 0 ? ((value * fourthDuePercentage) / 100) : 0;
      this.sfsDataFormGroup.controls['fourthAmountDue'].setValue(fourthAmountDue);

      this.sfsDataFormGroup.controls['fourthAmountDueDate'].setValue(this.schemeDataList.fourthDueDate)



      let fifthDuePercentage = this.schemeDataList.fifthDuePercentage ? parseFloat(this.schemeDataList.fifthDuePercentage) : 0
      let fifthAmountDue = ((value * fifthDuePercentage) / 100) > 0 ? ((value * fifthDuePercentage) / 100) : 0;
      this.sfsDataFormGroup.controls['fifthAmountDue'].setValue(fifthAmountDue);

      this.sfsDataFormGroup.controls['fifthAmountDueDate'].setValue(this.schemeDataList.fifthDueDate)



      let sixthDuePercentage = this.schemeDataList.sixthDuePercentage ? parseFloat(this.schemeDataList.sixthDuePercentage) : 0
      let sixthAmountDue = ((value * sixthDuePercentage) / 100) > 0 ? ((value * sixthDuePercentage) / 100) : 0;
      this.sfsDataFormGroup.controls['sixthAmountDue'].setValue(sixthAmountDue);
      this.sfsDataFormGroup.controls['sixthAmountDueDate'].setValue(this.schemeDataList.sixthDueDate)




      let seventhDuePercentage = this.schemeDataList.seventhDuePercentage ? parseFloat(this.schemeDataList.seventhDuePercentage) : 0
      let seventhAmountDue = ((value * seventhDuePercentage) / 100) > 0 ? ((value * seventhDuePercentage) / 100) : 0;
      this.sfsDataFormGroup.controls['seventhAmountDue'].setValue(seventhAmountDue);

      this.sfsDataFormGroup.controls['seventhAmountDueDate'].setValue(this.schemeDataList.seventhDueDate)

      let eighthDuePercentage = this.schemeDataList.eighthDuePercentage ? parseFloat(this.schemeDataList.eighthDuePercentage) : 0
      let eighthAmountDue = ((value * eighthDuePercentage) / 100) > 0 ? ((value * eighthDuePercentage) / 100) : 0;
      this.sfsDataFormGroup.controls['eighthAmountDue'].setValue(eighthAmountDue);

      this.sfsDataFormGroup.controls['eighthAmountDueDate'].setValue(this.schemeDataList.eighthDueDate)



      let ninthDuePercentage = this.schemeDataList.ninthDuePercentage ? parseFloat(this.schemeDataList.ninthDuePercentage) : 0
      let ninthAmountDue = ((value * ninthDuePercentage) / 100) > 0 ? ((value * ninthDuePercentage) / 100) : 0;
      this.sfsDataFormGroup.controls['ninthAmountDue'].setValue(ninthAmountDue);

      this.sfsDataFormGroup.controls['ninthAmountDueDate'].setValue(this.schemeDataList.ninthDueDate)



      let tenthDuePercentage = this.schemeDataList.tenthDuePercentage ? parseFloat(this.schemeDataList.tenthDuePercentage) : 0
      let tenthAmountDue = ((value * tenthDuePercentage) / 100) > 0 ? ((value * tenthDuePercentage) / 100) : 0;
      this.sfsDataFormGroup.controls['tenthAmountDue'].setValue(tenthAmountDue);

      this.sfsDataFormGroup.controls['tenthAmountDueDate'].setValue(this.schemeDataList.tenthDueDate)



      let eleventhDuePercentage = this.schemeDataList.eleventhDuePercentage ? parseFloat(this.schemeDataList.eleventhDuePercentage) : 0
      let eleventhAmountDue = ((value * eleventhDuePercentage) / 100) > 0 ? ((value * eleventhDuePercentage) / 100) : 0;
      this.sfsDataFormGroup.controls['eleventhAmountDue'].setValue(eleventhAmountDue);

      this.sfsDataFormGroup.controls['eleventhAmountDueDate'].setValue(this.schemeDataList.eleventhDueDate)



      let twelfthDuePercentage = this.schemeDataList.twelfthDuePercentage ? parseFloat(this.schemeDataList.twelfthDuePercentage) : 0
      let twelfthAmountDue = ((value * twelfthDuePercentage) / 100) > 0 ? ((value * twelfthDuePercentage) / 100) : 0;
      this.sfsDataFormGroup.controls['twelfthAmountDue'].setValue(twelfthAmountDue);

      this.sfsDataFormGroup.controls['twelfthAmountDueDate'].setValue(this.schemeDataList.twelfthDueDate)



      let thirteenthDuePercentage = this.schemeDataList.thirteenthDuePercentage ? parseFloat(this.schemeDataList.thirteenthDuePercentage) : 0
      let thirteenthAmountDue = ((value * thirteenthDuePercentage) / 100) > 0 ? ((value * thirteenthDuePercentage) / 100) : 0;
      this.sfsDataFormGroup.controls['thirteenthAmountDue'].setValue(thirteenthAmountDue);
      this.sfsDataFormGroup.controls['thirteenthAmountDueDate'].setValue(this.schemeDataList.thirteenthDueDate)


    }




  }

  onFileSelected(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      switch (fieldName) {
        case 'fieldMeasurementBook':
          this.fieldMeasurementBook = file;
          break;
        case 'layout':
          this.layout = file;
          break;
      }
      console.log(`Selected file for ${fieldName}:`, file);
    }
  }

  fileUpload(file: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.propertyService.fileUpload(formData);
  }

  getCommonSchemeData() {
    this.propertyService.getCommonSchemeData(this.schemeId).subscribe(
      (response: any) => {
        if (response) {


          console.log(response);
          this.schemeDataList = response;
          this.UnitDataFormGroup.patchValue({
            schemeCode: response.schemeCode,
            nameOfTheDivision: response.nameOfTheDivision,
            schemeName: response.schemeName,
            type: response.type,
            unitType: response.unitType,
            projectStatus: response.projectStatus,
            modeOfAllotment: response.modeOfAllotment,
            taluk: response.taluk,
            village: response.village
          })

          this.PropertyDataFormGroup.patchValue(response)
          this.sfsDataFormGroup.patchValue({


            firstAmountDueDate: this.schemeDataList.firstDueDate,
            secondAmountDueDate: this.schemeDataList.secondDueDate,
            thirdAmountDueDate: this.schemeDataList.thirdDueDate,

            fourthAmountDueDate: this.schemeDataList.fourthDueDate,

            fifthAmountDueDate: this.schemeDataList.fifthDueDate,

            sixthAmountDueDate: this.schemeDataList.sixthDueDate,

            seventhAmountDueDate: this.schemeDataList.seventhDueDate,

            eighthAmountDueDate: this.schemeDataList.eighthDueDate,

            ninthAmountDueDate: this.schemeDataList.ninthDueDate,

            tenthAmountDueDate: this.schemeDataList.tenthDueDate,

            eleventhAmountDueDate: this.schemeDataList.eleventhDueDate,

            twelfthAmountDueDate: this.schemeDataList.twelfthDueDate,

            thirteenthAmountDueDate: this.schemeDataList.thirteenthDueDate,

          })
          this.propertyService.getScrunityByType(response.type).subscribe((res: any) => {
            if (res) {
              this.UnitDataFormGroup.controls['scrunityFees'].setValue(res.amouunt);
              this.updateTotalDemand();
            }
          })

          if (response.modeOfAllotment == 'FCFS') {
            this.UnitDataFormGroup.controls['reservationCategory'].setValue("General Public");
            this.UnitDataFormGroup.controls['priority'].setValue("Null");


          }

        }
      },
      (error: any) => {
        console.error(error);
        this.toast.showToast('error', 'Error while fetching Scheme data', '')
      }
    );
  }
  searchUnitAccounntNo(event: any, mode: any) {
    let value = event.target.value;
    debugger
    if (mode == 'create') {
      if (value.length == 6) {
        this.propertyService.getunitAccountNumber().subscribe((res: any) => {
          if (res) {
            let unitCode = this.UnitDataFormGroup.controls['schemeCode'].value + value;
            let checkUnitList = res.filter((x: any) => x.unitAccountNumber == unitCode);
            if (checkUnitList.length > 0 && value.length == 6) {
              this.toast.showToast('warning', 'Unit Account Number Already Exist', '');
              this.UnitDataFormGroup.controls['unitAccountNumber'].setValue('');
            } else {

            }
          }
        })
      }
    } else {
      if (value.length == 12) {
        this.propertyService.getunitAccountNumber().subscribe((res: any) => {
          if (res) {
            let unitCode = this.UnitDataFormGroup.controls['schemeCode'].value + value;
            let checkUnitList = res.filter((x: any) => x.unitAccountNumber == unitCode);
            if (checkUnitList.length > 0 && value.length == 12) {
              this.toast.showToast('warning', 'Unit Account Number Already Exist', '');
              this.UnitDataFormGroup.controls['unitAccountNumber'].setValue('');
            } else {

            }
          }
        })
      }
    }


  }
  updateTotalDemand() {
    debugger
    let unitCost = this.UnitDataFormGroup.controls['unitCost'].value ? parseFloat(this.UnitDataFormGroup.controls['unitCost'].value) : 0
    let GSTCost = this.UnitDataFormGroup.controls['gst'].value ? parseFloat(this.UnitDataFormGroup.controls['gst'].value) : 0
    let MCCost = this.UnitDataFormGroup.controls['mcDemand'].value ? parseFloat(this.UnitDataFormGroup.controls['mcDemand'].value) : 0
    let DCCost = this.UnitDataFormGroup.controls['differenceCost'].value ? parseFloat(this.UnitDataFormGroup.controls['differenceCost'].value) : 0
    let Carparking = this.UnitDataFormGroup.controls['carParkingDemand'].value ? parseFloat(this.UnitDataFormGroup.controls['carParkingDemand'].value) : 0;
    let scrunity = this.UnitDataFormGroup.controls['scrunityFees'].value ? parseFloat(this.UnitDataFormGroup.controls['scrunityFees'].value) : 0;

    let totalDemand = unitCost + GSTCost + MCCost + DCCost + Carparking + scrunity;

    let unitCostPaidSoFar = this.UnitDataFormGroup.controls['unitCostPaidSoFar'].value ? parseFloat(this.UnitDataFormGroup.controls['unitCostPaidSoFar'].value) : 0
    let gstCostPaidSoFar = this.UnitDataFormGroup.controls['gstCostPaidSoFar'].value ? parseFloat(this.UnitDataFormGroup.controls['gstCostPaidSoFar'].value) : 0
    let mcDemandPaidSoFar = this.UnitDataFormGroup.controls['mcDemandPaidSoFar'].value ? parseFloat(this.UnitDataFormGroup.controls['mcDemandPaidSoFar'].value) : 0
    let carParkingPaidSoFar = this.UnitDataFormGroup.controls['carParkingPaidSoFar'].value ? parseFloat(this.UnitDataFormGroup.controls['carParkingPaidSoFar'].value) : 0
    let differentCostPaidSoFar = this.UnitDataFormGroup.controls['differentCostPaidSoFar'].value ? parseFloat(this.UnitDataFormGroup.controls['differentCostPaidSoFar'].value) : 0
    let scrunityPaidSoFar = this.UnitDataFormGroup.controls['scrunityFeesPaidSoFar'].value ? parseFloat(this.UnitDataFormGroup.controls['scrunityFeesPaidSoFar'].value) : 0

    let paidSoFarTotal = unitCostPaidSoFar + gstCostPaidSoFar + mcDemandPaidSoFar + carParkingPaidSoFar + differentCostPaidSoFar + scrunityPaidSoFar

    let totalDemandAll = totalDemand - paidSoFarTotal

    let totalCostForProperty = unitCost + DCCost;
    this.PropertyDataFormGroup.controls['totalCost'].setValue(totalCostForProperty ? JSON.stringify(totalCostForProperty) : '0')
    this.UnitDataFormGroup.controls['demandTotalCost'].setValue(totalDemandAll);
    console.log('total Demand', totalDemand);

  }
  changeNumberToWords(event: any, type: any) {
    let value = event.target.value;
    debugger
    let convertToWords = this.propertyService.convertAmountToWords(value).toUpperCase();
    if (type == "building") {
      this.PropertyDataFormGroup.controls['buildingCostInWords'].setValue(convertToWords);

    }

  }
  createUnitData() {
    debugger


    let modeOfAllotment = this.UnitDataFormGroup.controls['modeOfAllotment'].value;

    if (modeOfAllotment == 'FCFS') {

      this.UnitDataFormGroup.controls['reservationCategory'].setValue('General Public');
      this.UnitDataFormGroup.controls['priority'].setValue(null);
    }
    let checkUnit = this.UnitDataFormGroup.controls['unitAccountNumber'].value;
    if (checkUnit.length != 6) {
      this.toast.showToast('error', 'Please Enter Six Digit Valid Unit Account Number', '');

    } else {

      if (this.UnitDataFormGroup.valid) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Create Unit',
            message: 'Are you sure you want to create the unit?'
          },
          panelClass: 'custom-dialog-container'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            forkJoin({
              fieldMeasurementBookPath: this.fileUpload(this.fieldMeasurementBook)
              // layoutPath: this.fileUpload(this.layout)
            }).subscribe({
              next: (responses: { fieldMeasurementBookPath: any }) => {

                // , layoutPath: any 
                console.log('Successfully uploaded files:', responses);
                let unitAccountNumber = this.UnitDataFormGroup.controls['schemeCode'].value + this.UnitDataFormGroup.controls['unitAccountNumber'].value;
                this.UnitDataFormGroup.controls['unitAccountNumber'].setValue(unitAccountNumber);
                const unitData = {
                  ...this.UnitDataFormGroup.value,
                  "fieldMeasurementBookPath": responses.fieldMeasurementBookPath.body.responseObject,
                  // "layoutPath": responses.layoutPath.body.responseObject,
                  ...this.sfsDataFormGroup.value,
                  ...this.PropertyDataFormGroup.value,
                  allotteeDetails: {
                    ...this.AllotteeDataFormGroup.value
                  },
                  "schemeDataId": this.schemeId
                }
                console.log(unitData);
                this.propertyService.createUnit(unitData).subscribe(
                  (response) => {
                    console.log('Successfully created unit data:', response);
                    this.toast.showToast('success', 'Successfully created unit data', '');
                    this.router.navigate(['/employee/all-units'], { queryParams: { id: this.schemeId } });
                  },
                  (error) => {
                    console.error('Error creating unit data:', error);
                    // this.toast.showToast('error', 'Error while creating unit data', '');
                    this.toast.showToast('error', 'Error while creating because of unit Account No. already Exist', '');

                  }
                );
              },
              error: (error) => {
                console.error('Error uploading files:', error);
                this.toast.showToast('error', 'Error while uploading files', '');
              }
            });
          }
        });
      } else {
        this.toast.showToast('warning', 'Check all the fields', '');
      }
    }
  }

  getUnitDataById(unitId: any) {
    this.propertyService.getUnitById(unitId).subscribe(
      (response) => {
        console.log(response);
        this.unitData = response;
        this.UnitDataFormGroup.patchValue(response);
        this.sfsDataFormGroup.patchValue(response);
        this.PropertyDataFormGroup.patchValue(response);
        this.AllotteeDataFormGroup.patchValue(response.allotteeDetails);
        debugger
        let formateDate = this.datePipe.transform(new Date(response.dateOfAllotment), 'yyyy-MM-dd');
        // let formateDate = new Date(response.dateOfAllotment)?.toISOString().split('T')[0];

        debugger
        this.UnitDataFormGroup.patchValue({ 'dateOfAllotment': formateDate });
        let UserName = sessionStorage.getItem('username');
        this.UnitDataFormGroup.patchValue({ "createdBy": UserName });
        if (this.UnitDataFormGroup.controls['dateOfAllotment'].value) {
          this.UnitDataFormGroup.controls['allotmentStatus'].setValue("Yes");

        } else {
          this.UnitDataFormGroup.controls['allotmentStatus'].setValue("No");

        }

        this.salesService.getAllPaymentsByApplicationId(response.unitAccountNumber).subscribe((res: any) => {
          if (res && res.responseObject) {
            this.allPaymentDataSource.data = res.responseObject;

            console.log('this.allPaymentDataSource.data', this.allPaymentDataSource.data);

          }
        })
      },
      (error) => {
        console.error('Error fetching unit data:', error);
        this.toast.showToast('error', 'Error while fetching unit data', '');
      }
    );
  }

  onchange(event: any) {
    debugger
    console.log('event', event.target.value);

  }

  editUnitData() {
    debugger
    if (this.UnitDataFormGroup.controls['modeOfAllotment'].value != 'LOT') {
      this.UnitDataFormGroup.controls['reservationCategory'].setValue('');
      this.UnitDataFormGroup.controls['priority'].setValue('');


    }
    if (this.UnitDataFormGroup.valid) {

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Edit Unit',
          message: 'Are you sure you want to edit the unit?'
        },
        panelClass: 'custom-dialog-container'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          const uploadObservables: { [key: string]: Observable<any> } = {};

          if (this.fieldMeasurementBook) {
            uploadObservables['fieldMeasurementBookPath'] = this.fileUpload(this.fieldMeasurementBook);
          }

          if (this.layout) {
            uploadObservables['layoutPath'] = this.fileUpload(this.layout);
          }


          const forkJoinObservable = Object.keys(uploadObservables).length > 0 ? forkJoin(uploadObservables) : of({});

          forkJoinObservable.subscribe({
            next: (responses: any) => {
              console.log('Successfully uploaded files:', responses);
              // let unitAccountNumber = this.UnitDataFormGroup.controls['schemeCode'].value + this.UnitDataFormGroup.controls['unitAccountNumber'].value;
              // this.UnitDataFormGroup.controls['unitAccountNumber'].setValue(unitAccountNumber);
              let unitData: any = {
                ...this.UnitDataFormGroup.value,
                ...this.sfsDataFormGroup.value,
                ...this.PropertyDataFormGroup.value,
                allotteeDetails: {
                  ...this.AllotteeDataFormGroup.value
                },
                schemeDataId: parseInt(this.schemeId),
                id: parseInt(this.unitId)
              };

              if (responses.fieldMeasurementBookPath) {
                unitData.fieldMeasurementBookPath = responses.fieldMeasurementBookPath.body.responseObject;
              } else if (this.unitData.fieldMeasurementBookPath) {
                unitData.fieldMeasurementBookPath = this.unitData.fieldMeasurementBookPath;
              }

              if (responses.layoutPath) {
                unitData.layoutPath = responses.layoutPath.body.responseObject;
              } else if (this.unitData.layoutPath) {
                unitData.layoutPath = this.unitData.layoutPath;
              }

              console.log(unitData);
              this.propertyService.editUnit(unitData).subscribe(
                (response) => {
                  console.log('Successfully updated unit data:', response);
                  this.toast.showToast('success', 'Successfully updated unit data', '');
                  this.router.navigate(['/employee/all-units'], { queryParams: { id: this.schemeId } });
                },
                (error) => {
                  console.error('Error updating unit data:', error);
                  this.toast.showToast('error', 'Error while updating unit data', '');
                }
              );
            },
            error: (error: any) => {
              console.error('Error uploading files:', error);
              this.toast.showToast('error', 'Error while uploading files', '');
            }
          });
        }
      });
    } else {
      this.toast.showToast('warning', 'Check all the fields', '');
    }
  }

  getCountsBySchemeId() {
    this.propertyService.getCountsBySchemeId(this.schemeId).subscribe(
      (response: any) => {
        console.log('Response:', response);
        this.totalunits = response.schemeDataTotalUnit;
        this.createdUnits = response.schemeIdCountInUnitData;
        this.remainingUnits = this.totalunits - this.createdUnits;
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }


  // Edit mode flags
  editFMBMode: boolean = false;
  editLayoutMode: boolean = false;

  // Toggle edit mode for Field Measurement Book
  editFMB() {
    this.editFMBMode = !this.editFMBMode;
  }

  // Save changes for Field Measurement Book
  saveFMB() {
    // Implement logic to save the changes
    // You can handle file upload and update the FMBFilePath
    // For example: this.FMBFilePath = 'new/path/to/fmb/file';
    this.editFMBMode = false; // Exit edit mode
  }

  // Toggle edit mode for Layout
  editLayout() {
    this.editLayoutMode = !this.editLayoutMode;
  }

  // Save changes for Layout
  saveLayout() {
    // Implement logic to save the changes
    // You can handle file upload and update the LayoutFilePath
    // For example: this.LayoutFilePath = 'new/path/to/layout/file';
    this.editLayoutMode = false; // Exit edit mode
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
    } else if (field == 'unitcode') {
      regexValue = /[0-9a-zA-Z]/;
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

  // goToPaymentView(unitaccountNo: any, id: any) {

  //   // this.router.navigateByUrl('customer/view-payment')
  //   if (this.role == 'Customer') {
  //     this.router.navigate(['customer/view-payment'], { queryParams: { unitAccountNo: unitaccountNo, id: id } });

  //   } else {
  //     this.router.navigate(['employee/view-payment'], { queryParams: { unitAccountNo: unitaccountNo, id: id } });

  //   }

  // }
  goToPaymentView() {
    let unitAccountNo = this.UnitDataFormGroup.controls['unitAccountNumber'].value;
    this.router.navigate(['/employee/all-payments'], { queryParams: { applicationNo: unitAccountNo, isedit: 1 } });

  }

  updateDataByMonth(event: any) {

    let startDate = this.UnitDataFormGroup.controls['mcDemandFrom'].value;
    let endDate = this.UnitDataFormGroup.controls['mcDemandUpTo'].value;
    if (startDate && endDate) {
      let getMonth = this.calculateMonthDifference(startDate, endDate)
      console.log('getMonth', getMonth);
      let getMCDemand = this.UnitDataFormGroup.controls['mcDemand'].value ? parseInt(this.UnitDataFormGroup.controls['mcDemand'].value) : 0;
      let calculateMonth = (getMCDemand * getMonth).toString();
      this.UnitDataFormGroup.controls['mcDemand'].setValue(calculateMonth)
    }

    debugger

  }
  calculateMonthDifference(startDate: Date, endDate: Date): number {
    // Extract year and month from both dates
    let start = new Date(startDate);
    let end = new Date(endDate)
    const startYear = start.getFullYear();
    const startMonth = start.getMonth(); // getMonth() returns 0 for January, 11 for December
    const endYear = end.getFullYear();
    const endMonth = end.getMonth() + 1;

    // Calculate the total month difference
    const monthDifference = (endYear - startYear) * 12 + (endMonth - startMonth);

    return monthDifference;
  }
  goTo(route: any) {
    if (route) {
      this.router.navigateByUrl(route);

    } else {
      this.location.back();

    }


  }
}
