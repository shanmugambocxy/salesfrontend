import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DatePipe, Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { SalesService } from '../../services/sales.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { PaymentService } from '../../services/payment.service';
import { PropertyService } from '../../services/property.service';
import { PaymentType } from '../../bank_enum';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { forkJoin, of } from 'rxjs';
export interface SfsDue {
  firstAmountDue: string;
  firstAmountDueDate: string;
  secondAmountDue: string;
  secondAmountDueDate: string;
  thirdAmountDue: string;
  thirdAmountDueDate: string;
  fourthAmountDue: string;
  fourthAmountDueDate: string;
  fifthAmountDue: string;
  fifthAmountDueDate: string;
  sixthAmountDue: string;
  sixthAmountDueDate: string;
  seventhAmountDue: string;
  seventhAmountDueDate: string;
  eighthAmountDue: string;
  eighthAmountDueDate: string;
  ninthAmountDue: string;
  ninthAmountDueDate: string;
  tenthAmountDue: string;
  tenthAmountDueDate: string;
  eleventhAmountDue: string;
  eleventhAmountDueDate: string;
  twelfthAmountDue: string;
  twelfthAmountDueDate: string;
  thirteenthAmountDue: string;
  thirteenthAmountDueDate: string;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [SharedModule, DatePipe],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent {

  selectedOption: string = 'no';
  inputValue: string = '';
  inputValuePart: string = '';
  otherinputValuePart: string = '';
  applicationId: any;
  unitAccountNo: any;
  payments: any;
  schemeId: any;
  unitId: any;

  allPayments: any;
  totalUnitAmountPaidSoFar: any;
  carParkingDemand: any;
  carParkingAmountPaidSoFar: any;
  unitReadyDate: any;
  unitReadyDateEnd: any;
  maintenanceDate: any;
  mcDemand: any;
  mcDemandAmountPaidSoFar: any;
  gst: any;

  gstAmountPaidSoFar: any;
  scrunity: any;
  scrunityPaidSoFar: any;
  modeOfAllotment: any;
  projectStatus: any = '';
  EMI: any;
  totalEMIAmountPaidSoFar: any;
  penalInterestbalance: any;
  penalInterest: any;

  idPaymentDate: any;
  idCost: any;

  isValueExceeded: boolean = false;
  payDisable: boolean = false;
  unitCostBalance: any;
  carParkingBalance: any;
  gstBalance: any;
  maintananceChargesBalance: any;
  differenceCostBalance: any;
  EMIbalance: any;
  totalPenalInrerestPaidSoFar: any;


  sfsDue: SfsDue | undefined;
  paymentType: any = '';
  paymentTypes = PaymentType;
  paymentTypeList: any = ["Unit Payment Schedule", "Maintenance Charges", "Difference in cost", "GST"];
  unitData: any = '';
  differenceInCostPaidAmount: any;
  partPaymentList: any = [];
  lumpsumbalance: any;
  totalLumpsumPaidSoFar: any;
  lumpsumInterest: any;
  totalForeclosurePaidSoFar: any;
  lumpsum: any;
  foreclosure: any;
  foreClosurebalance: any;
  firstAmountDue: any;
  totalfirstAmountDuePaidSoFar: any;
  firstAmountDuebalance: any;
  secondAmountDue: any;
  secondAmountDuebalance: any;
  totalsecondAmountDuePaidSoFar: any;
  thirdAmountDue: any;
  totalThirdAmountDuePaidSoFar: any;
  thirdAmountDuebalance: any;
  fourthAmountDue: any;
  totalfourthAmountDuePaidSoFar: any;
  fourthAmountDuebalance: any;
  fifthAmountDue: any;
  totalfifthAmountDuePaidSoFar: any;
  fifthAmountDuebalance: any;
  sixthAmountDue: any;
  totalsixthAmountDuePaidSoFar: any;
  sixthAmountDuebalance: any;
  seventhAmountDue: any;
  totalseventhAmountDuePaidSoFar: any;
  seventhAmountDuebalance: any;
  eightAmountDue: any;
  totalightAmountDuePaidSoFar: any;
  ightAmountDuebalance: any;
  ninthAmountDue: any;
  totalninthAmountDuePaidSoFar: any;
  ninthAmountDuebalance: any;
  tenthAmountDue: any;
  totaltenthAmountDuePaidSoFar: any;
  tenthAmountDuebalance: any;
  eleventhAmountDue: any;
  totaleleventhAmountDuePaidSoFar: any;
  eleventhAmountDuebalance: any;
  twelthAmountDue: any;
  totaltwelthAmountDuePaidSoFar: any;
  twelthAmountDuebalance: any;
  thirteenthAmountDue: any;
  totalthirteenthAmountDuePaidSoFar: any;
  thirteenthAmountDuebalance: any;
  belatedInterest: any;
  belatedInterestPaidSoFar: any;
  belatedInterestAmountDuebalance: any;
  totaleightAmountDuePaidSoFar: any;
  eightAmountDuebalance: any;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['sno', 'PaymentDate', 'PaymentType', 'Amount', 'PaymentID', 'PaymentMethod', 'action'];
  isEdit: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalDemandCost: any = 0;
  totalPaidSoFar: any = 0;
  totalAmountBalance: any = 0;
  selffinanceData: any = [];
  otherDemands: any = [];

  totalDueAmount: any = 0;
  totalInterest = 0;
  totalDueCollected = 0;
  totalInterestCollected = 0;
  totaldDueBalance = 0;
  totalInterestBalance = 0;
  rateofInterestList: any = [];
  interestList: any = [];
  loader: boolean = false;
  totalSelectedAmount: any = 0;
  totalSelectedAmountOther: any = 0;
  isPartPayment: boolean = true;
  isPartPaymentOther: boolean = true;
  paymentDiscription: any = '';
  dueAmountExceed: boolean = false;
  dueAmountExceedOther: boolean = false;

  routeWay: any
  pathRoute: boolean = false;

  @ViewChild('myInput') myInputElement!: ElementRef;
  @ViewChild('myInput2') myInputElement2!: ElementRef;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private salesService: SalesService,
    private toast: ToastService,
    private dialog: MatDialog,
    private title: Title,
    private datePipe: DatePipe,
    private paymentService: PaymentService,
    private propertyService: PropertyService,
    private location: Location,

  ) {
    this.title.setTitle('Customer | Payments');

    // this.location.replaceState('/customer/home'); // Replace current history with home page

    // Listen to PopStateEvent (browser back button press)
    // window.onpopstate = () => {
    //   this.router.navigate(['/customer/home']);
    // };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.applicationId = params['applicationId'];
      this.unitAccountNo = params['applicationNo'];
      this.routeWay = params['routeLink']
      if (this.routeWay == 'challanRoute') {
        this.pathRoute = true;
      } else {
        this.pathRoute = false;
      }
      let isEdit = params['isedit']
      this.isEdit = isEdit ? isEdit : 0;
      this.getAllPaymentsByApplicationId();
      this.getUnitDemand();
      this.deleteBookingList();
      this.getAllRateOfInterest();

    });


    sessionStorage.setItem('applicationId', this.applicationId);
  }

  deleteBookingList() {
    this.salesService.deleteALLBookingDetailsList().subscribe(res => {
      if (res) {

      }


    })
  }

  getUnitDemand() {
    // this.propertyService.getApplicationById(this.applicationId).subscribe(res => {
    //   if (res) {
    //     this.unitData = res.unitData;

    //   }
    // })
  }
  getAllRateOfInterest() {
    this.propertyService.getAllRateOfInterest().subscribe(
      (response: any) => {
        if (response) {
          this.rateofInterestList = response.responseObject;
        }
      })
  }
  formatDate(dateString: string): string {


    const date = dateString ? new Date(dateString) : '';

    let getFormatedDate = date ? this.datePipe.transform(date, 'dd-MM-yyyy') : '';
    return getFormatedDate ? getFormatedDate : ''




  }

  calculateDueEndDate(dateString: string, daysToAdd: number): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + daysToAdd);
    return this.datePipe.transform(date, 'dd-MM-yyyy')!;
  }

  calculateDaysLeft(dateString: string, daysToAdd: number): string {
    const dueEndDate = new Date(dateString);
    dueEndDate.setDate(dueEndDate.getDate() + daysToAdd);
    const today = new Date();
    const diffTime = dueEndDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 0 ? 'overdue' : diffDays.toString();
  }

  getAllPaymentsByApplicationId() {
    debugger
    // this.salesService.getAllPaymentsByApplicationId(this.applicationId).subscribe(
    // let unitAccountNo = this.unitAccountNo ? parseInt(this.unitAccountNo) : 0;
    this.salesService.getAllPaymentsByApplicationId(this.unitAccountNo).subscribe(

      (response: any) => {
        console.log(response);
        debugger
        if (Array.isArray(response.responseObject)) {

          this.allPayments = response.responseObject;
          this.dataSource.data = this.allPayments;
          this.salesService.getAllApplicationDetails(this.unitAccountNo).subscribe(resApplication => {



            this.payments = resApplication.responseObject[0];
            this.schemeId = this.payments.schemeData.id;
            this.projectStatus = this.payments.schemeData.projectStatus;
            this.modeOfAllotment = this.payments.modeOfAllotment;
            localStorage.setItem('projectStatus', this.projectStatus);
            this.unitId = this.payments.unitData.id;
            this.applicationId = this.payments.id;
            if (this.projectStatus == 'Outright Purchase') {
              if (this.payments.schemeData.unitType == 'Flat' || this.payments.schemeData.unitType == 'House') {
                this.partPaymentList = ["Unit Cost", "Difference in cost", "Maintenance Charges", "Car Parking Demand"]
              } else {
                this.partPaymentList = ["Unit Cost", "Difference in cost", "Maintenance Charges"]

              }

            } else if (this.projectStatus == 'Higher Purchase') {
              if (this.payments.schemeData.unitType == 'Flat' || this.payments.schemeData.unitType == 'House') {
                this.partPaymentList = ["EMI", "Penal Interest", "Lumpsum", "Foreclosure", "GST", "Maintenance Charges", "Car Parking Demand"]
              } else {
                this.partPaymentList = ["EMI", "Penal Interest", "Lumpsum", "Foreclosure", "GST", "Maintenance Charges"]

              }
            } else if (this.projectStatus == 'Yet to be Started') {
              if (this.payments.schemeData.unitType == 'Flat' || this.payments.schemeData.unitType == 'House') {
                this.partPaymentList = ["GST", "Maintenance Charges", "Car Parking Demand"]
              } else {
                this.partPaymentList = ["GST", "Maintenance Charges"]

              }
            }


            else {
              this.partPaymentList = ["Installment", "Difference Cost", "GST", "Maintenance Charges", "Car Parking Demand"]

            }
            if (this.modeOfAllotment === 'Self Finance') {
              this.sfs(this.payments.unitData);
            }




            //Unit Payment  ---completed
            if (Array.isArray(this.allPayments)) {
              this.totalUnitAmountPaidSoFar = this.allPayments
                .filter((record: { paymentType: string; }) => record.paymentType === 'Initial Deposit' || record.paymentType === 'Unit Cost')
                .reduce((sum: number, record: { amount: any; }) => sum + parseFloat(record.amount), 0);
            }
            this.unitCostBalance = this.payments?.unitData?.unitCost - this.totalUnitAmountPaidSoFar;
            console.log(this.unitCostBalance);

            //Car Parking
            this.carParkingDemand = this.payments.unitData.carParkingDemand;
            this.carParkingAmountPaidSoFar = this.allPayments
              .filter((record: { paymentType: string; }) => record.paymentType === 'Car Parking Demand')
              .reduce((sum: number, record: { amount: any; }) => sum + parseFloat(record.amount), 0);

            this.carParkingBalance = this.carParkingDemand - this.carParkingAmountPaidSoFar;

            //Maintenance Demand
            this.unitReadyDate = this.payments.unitData.mcDemandFrom;
            this.unitReadyDateEnd = this.payments.unitData.mcDemandUpTo;
            this.maintenanceDate = this.payments.unitData.maintenanceDate;
            this.mcDemand = this.payments.unitData.mcDemand ? this.payments.unitData.mcDemand : 0;
            this.mcDemandAmountPaidSoFar = this.allPayments
              .filter((record: { paymentType: string; }) => record.paymentType === 'Maintenance Charges')
              .reduce((sum: number, record: { amount: any; }) => sum + parseFloat(record.amount), 0);
            this.maintananceChargesBalance = this.mcDemand - this.mcDemandAmountPaidSoFar;

            //difference Cost
            this.differenceInCostPaidAmount = this.allPayments
              .filter((record: { paymentType: string; }) => record.paymentType === 'Difference in cost' || record.paymentType === 'DifferentCostDueInterest')
              .reduce((sum: number, record: { amount: any; }) => sum + parseFloat(record.amount), 0);
            this.differenceCostBalance = (this.payments?.unitData?.differenceCost) - this.differenceInCostPaidAmount;

            //GST
            this.gst = this.payments.unitData.gst;
            this.gstAmountPaidSoFar = this.allPayments
              .filter((record: { paymentType: string; }) => record.paymentType === 'GST')
              .reduce((sum: number, record: { amount: any; }) => sum + parseFloat(record.amount), 0);
            this.gstBalance = this.gst - this.gstAmountPaidSoFar

            this.scrunity = this.payments.unitData.scrunityFees;
            this.scrunityPaidSoFar = this.allPayments.filter((record: { paymentType: string; }) => record.paymentType === 'Scrunity')
              .reduce((sum: number, record: { amount: any; }) => sum + parseFloat(record.amount), 0);

            //EMI  ---------higher purchase
            this.EMI = this.payments.unitData.emi;
            this.totalEMIAmountPaidSoFar = this.allPayments
              .filter((record: { paymentType: string; }) => record.paymentType === 'EMI')
              .reduce((sum: number, record: { amount: any; }) => sum + parseFloat(record.amount), 0);
            this.EMIbalance = this.EMI - this.totalEMIAmountPaidSoFar;


            //penalInterest 
            this.penalInterest = this.payments.unitData.penalIndus;
            this.totalPenalInrerestPaidSoFar = this.allPayments
              .filter((record: { paymentType: string; }) => record.paymentType === 'Penal Interest')
              .reduce((sum: number, record: { amount: any; }) => sum + parseFloat(record.amount), 0);
            this.penalInterestbalance = this.EMI - this.totalPenalInrerestPaidSoFar;


            //Lumpsum
            this.lumpsum = this.payments.unitData.lumsum;
            this.totalLumpsumPaidSoFar = this.allPayments
              .filter((record: { paymentType: string; }) => record.paymentType === 'Lumpsum')
              .reduce((sum: number, record: { amount: any; }) => sum + parseFloat(record.amount), 0);
            this.lumpsumbalance = this.lumpsum - this.totalLumpsumPaidSoFar;


            //Foreclosure
            this.foreclosure = this.payments.unitData.foreclosure;
            this.totalForeclosurePaidSoFar = this.allPayments
              .filter((record: { paymentType: string; }) => record.paymentType === 'Foreclosure')
              .reduce((sum: number, record: { amount: any; }) => sum + parseFloat(record.amount), 0);
            this.foreClosurebalance = this.foreclosure - this.totalForeclosurePaidSoFar;



            //Payment Data
            this.idPaymentDate = this.allPayments.find((item: { paymentType: string; }) => item.paymentType === 'Initial Deposit')?.paymentDateAndTime;
            this.idCost = this.allPayments.find((item: { paymentType: string; }) => item.paymentType === 'Initial Deposit')?.cost;

            if (this.modeOfAllotment == 'Self Finance') {

              this.sfsDetails();
            } else {
              this.totalDemandDetails();
            }


            // let DifferenceCost = (parseInt(this.payments?.unitData?.differenceCost) ? parseInt(this.payments?.unitData?.differenceCost) : 0) - this.differenceInCostPaidAmount ? this.differenceInCostPaidAmount : 0;



            debugger
          })
        }


      },
      (error: any) => {
        console.error(error);
      }



    );
  }

  selectedData: any[] = [];

  // checkPay(element: any, i: any, checked: any) {
  //   console.log(element, "element")

  //   this.selectedData.push({ ...element }); // Push a copy of the selected object into the array
  //   console.log(this.selectedData, "555")

  //   // element.checked = !element.checked
  //   // for (let i = 0; i < index; i++) {
  //   //   if (this.selffinanceData[i].totalDueAmount > 0) {
  //   //     this.selffinanceData[i].checked = true
  //   //   } else {
  //   //     this.selffinanceData[i].checked = false
  //   //   }
  //   // }

  //   let counter = 0;
  //   if (checked == true) {
  //     Swal.fire({
  //       title: "Do you want pay partly?",
  //       showDenyButton: true,
  //       // showCancelButton: true,
  //       confirmButtonText: "Yes",
  //       customClass: {
  //         title: 'swal2-title-custom', // Custom class for title
  //         popup: 'swal2-popup-custom', // Custom class for popup
  //         htmlContainer: 'swal2-html-custom' // Custom class for content text
  //       }
  //       // denyButtonText: `Don't save`
  //     }).then((result) => {


  //       if (result.isConfirmed) {
  //         element.checked = false;
  //         element.partPayment = true;
  //         let checkPartPayment = this.selffinanceData.filter((x: any) => x.partPayment);
  //         if (checkPartPayment && checkPartPayment.length > 0) {
  //           this.isPartPayment = false;
  //           setTimeout(() => {
  //             this.myInputElement.nativeElement.focus();
  //           }, 1000);


  //         }

  //         // this.selffinanceData.forEach((element: any, index: any) => {
  //         //   if (counter < i) {
  //         //     if (index > 0) {
  //         //       this.toast.showToast('warning', "Please Clear the Above demand", '')
  //         //     }
  //         //     if (element.totalDueAmount > 0) {
  //         //       element.checked = true;
  //         //     } else {
  //         //       element.checked = false;
  //         //     }
  //         //     counter++
  //         //   }
  //         // });
  //         let checkedSfsData: any = [];
  //         checkedSfsData = this.selffinanceData.filter((x: any) => x.checked == true)
  //         if (checkedSfsData.length > 0) {
  //           this.totalSelectedAmount = checkedSfsData
  //             .map((value: any) => parseInt(value.totalDueAmount)) // Step 1: Convert string to number
  //             .reduce((acc: any, current: any) => acc + current, 0);
  //         } else {
  //           this.totalSelectedAmount = 0;
  //         }

  //         this.partPaymentInput();
  //       } else {
  //         element.partPayment = false;

  //         // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //         //   data: {
  //         //     title: 'Confirm',
  //         //     message: `Do you want to pay more?`
  //         //   },
  //         //   panelClass: 'custom-dialog-container'
  //         // });

  //         // dialogRef.afterClosed().subscribe(result => {
  //         //   if (result) {

  //         Swal.fire({
  //           title: "Do you want to pay more?",
  //           showDenyButton: true,
  //           // showCancelButton: true,
  //           confirmButtonText: "Yes",
  //           customClass: {
  //             title: 'swal2-title-custom', // Custom class for title
  //             popup: 'swal2-popup-custom', // Custom class for popup
  //             htmlContainer: 'swal2-html-custom' // Custom class for content text
  //           }
  //           // denyButtonText: `Don't save`
  //         }).then((result) => {


  //           if (result.isConfirmed) {


  //             for (let j = i + 1; j < this.selffinanceData.length; j++) {


  //               if (this.selffinanceData[j].status == "Pending") {
  //                 // If condition is met, exit the loop
  //                 this.selffinanceData[j].isAvailable = true;
  //                 break;
  //               }

  //             }
  //             let checkedSfsData: any = [];
  //             checkedSfsData = this.selffinanceData.filter((x: any) => x.checked == true)
  //             if (checkedSfsData.length > 0) {
  //               this.totalSelectedAmount = checkedSfsData
  //                 .map((value: any) => parseInt(value.totalDueAmount)) // Step 1: Convert string to number
  //                 .reduce((acc: any, current: any) => acc + current, 0);
  //             } else {
  //               this.totalSelectedAmount = 0;
  //             }
  //           } else {
  //             let checkedSfsData: any = [];
  //             checkedSfsData = this.selffinanceData.filter((x: any) => x.checked == true)
  //             if (checkedSfsData.length > 0) {
  //               this.totalSelectedAmount = checkedSfsData
  //                 .map((value: any) => parseInt(value.totalDueAmount)) // Step 1: Convert string to number
  //                 .reduce((acc: any, current: any) => acc + current, 0);
  //             } else {
  //               this.totalSelectedAmount = 0;
  //             }
  //           }

  //         })
  //         // this.selffinanceData.forEach((element: any, index: any) => {
  //         //   if (counter < i) {
  //         //     if (index > 0) {
  //         //       this.toast.showToast('warning', "Please Clear the Above demand", '')
  //         //     }
  //         //     if (element.totalDueAmount > 0) {
  //         //       element.checked = true;
  //         //     } else {
  //         //       element.checked = false;
  //         //     }
  //         //     counter++
  //         //   }

  //         // });
  //         // let checkedSfsData: any = [];
  //         // checkedSfsData = this.selffinanceData.filter((x: any) => x.checked == true)
  //         // if (checkedSfsData.length > 0) {
  //         //   this.totalSelectedAmount = checkedSfsData
  //         //     .map((value: any) => parseInt(value.totalDueAmount)) // Step 1: Convert string to number
  //         //     .reduce((acc: any, current: any) => acc + current, 0);
  //         // } else {
  //         //   this.totalSelectedAmount = 0;
  //         // }
  //       }
  //     })
  //   } else {
  //     this.isPartPayment = true;
  //     this.selffinanceData.forEach((element: any, index: any) => {
  //       if (index > i) {
  //         element.checked = false;
  //         element.partPayment = false;
  //         element.isAvailable = false;
  //         // if (element.totalDueAmount > 0) {
  //         //   element.checked = true;
  //         // } else {
  //         //   element.checked = false;
  //         // }
  //         counter++
  //       }
  //     });

  //     for (let i = 0; i < this.selffinanceData.length; i++) {
  //       if (this.selffinanceData[i].status == "Pending") {
  //         // If condition is met, exit the loop
  //         // this.selffinanceData[j].checked = true;
  //         this.selffinanceData[i].isAvailable = true;
  //         break;
  //       }
  //     }
  //     let checkedSfsData: any = [];
  //     checkedSfsData = this.selffinanceData.filter((x: any) => x.checked == true)
  //     if (checkedSfsData.length > 0) {
  //       this.totalSelectedAmount = checkedSfsData
  //         .map((value: any) => parseInt(value.totalDueAmount)) // Step 1: Convert string to number
  //         .reduce((acc: any, current: any) => acc + current, 0);
  //     } else {
  //       this.totalSelectedAmount = 0;
  //     }

  //   }


  // }

  checkPay(element: any, i: any, checked: any) {
    console.log(element, "element")

    // this.selectedData.push({ ...element }); // Push a copy of the selected object into the array
    console.log(this.selectedData, "555")



    let counter = 0;
    if (checked == true) {
      // Swal.fire({
      //   title: "Do you want pay partly?",
      //   showDenyButton: true,
      //   // showCancelButton: true,
      //   confirmButtonText: "Yes",
      //   customClass: {
      //     title: 'swal2-title-custom', // Custom class for title
      //     popup: 'swal2-popup-custom', // Custom class for popup
      //     htmlContainer: 'swal2-html-custom' // Custom class for content text
      //   }
      //   // denyButtonText: `Don't save`
      // }).then((result) => {


      //   if (result.isConfirmed) {
      //     element.checked = false;
      //     element.partPayment = true;
      //     let checkPartPayment = this.selffinanceData.filter((x: any) => x.partPayment);
      //     if (checkPartPayment && checkPartPayment.length > 0) {
      //       this.isPartPayment = false;
      //       setTimeout(() => {
      //         this.myInputElement.nativeElement.focus();
      //       }, 1000);


      //     }


      //     let checkedSfsData: any = [];
      //     checkedSfsData = this.selffinanceData.filter((x: any) => x.checked == true)
      //     if (checkedSfsData.length > 0) {
      //       this.totalSelectedAmount = checkedSfsData
      //         .map((value: any) => parseInt(value.totalDueAmount)) // Step 1: Convert string to number
      //         .reduce((acc: any, current: any) => acc + current, 0);
      //     } else {
      //       this.totalSelectedAmount = 0;
      //     }

      //     this.partPaymentInput();
      //   } else {
      //     element.partPayment = false;

      //     Swal.fire({
      //       title: "Do you want to pay more?",
      //       showDenyButton: true,
      //       // showCancelButton: true,
      //       confirmButtonText: "Yes",
      //       customClass: {
      //         title: 'swal2-title-custom', // Custom class for title
      //         popup: 'swal2-popup-custom', // Custom class for popup
      //         htmlContainer: 'swal2-html-custom' // Custom class for content text
      //       }
      //       // denyButtonText: `Don't save`
      //     }).then((result) => {


      //       if (result.isConfirmed) {


      //         for (let j = i + 1; j < this.selffinanceData.length; j++) {


      //           if (this.selffinanceData[j].status == "Pending") {
      //             // If condition is met, exit the loop
      //             this.selffinanceData[j].isAvailable = true;
      //             break;
      //           }

      //         }
      //         let checkedSfsData: any = [];
      //         checkedSfsData = this.selffinanceData.filter((x: any) => x.checked == true)
      //         if (checkedSfsData.length > 0) {
      //           this.totalSelectedAmount = checkedSfsData
      //             .map((value: any) => parseInt(value.totalDueAmount)) // Step 1: Convert string to number
      //             .reduce((acc: any, current: any) => acc + current, 0);
      //         } else {
      //           this.totalSelectedAmount = 0;
      //         }
      //       } else {
      //         let checkedSfsData: any = [];
      //         checkedSfsData = this.selffinanceData.filter((x: any) => x.checked == true)
      //         if (checkedSfsData.length > 0) {
      //           this.totalSelectedAmount = checkedSfsData
      //             .map((value: any) => parseInt(value.totalDueAmount)) // Step 1: Convert string to number
      //             .reduce((acc: any, current: any) => acc + current, 0);
      //         } else {
      //           this.totalSelectedAmount = 0;
      //         }
      //       }

      //     })

      //   }
      // })


      element.partPayment = false;

      Swal.fire({
        title: "Do you want to pay more?",
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonText: "Yes",
        customClass: {
          title: 'swal2-title-custom', // Custom class for title
          popup: 'swal2-popup-custom', // Custom class for popup
          htmlContainer: 'swal2-html-custom' // Custom class for content text
        }
        // denyButtonText: `Don't save`
      }).then((result) => {


        if (result.isConfirmed) {


          for (let j = i + 1; j < this.selffinanceData.length; j++) {


            if (this.selffinanceData[j].status == "Pending") {
              // If condition is met, exit the loop
              this.selffinanceData[j].isAvailable = true;
              break;
            }

          }
          let checkedSfsData: any = [];
          checkedSfsData = this.selffinanceData.filter((x: any) => x.checked == true)
          if (checkedSfsData.length > 0) {
            this.totalSelectedAmount = checkedSfsData
              .map((value: any) => parseInt(value.totalDueAmount)) // Step 1: Convert string to number
              .reduce((acc: any, current: any) => acc + current, 0);
          } else {
            this.totalSelectedAmount = 0;
          }
        } else {
          let checkedSfsData: any = [];
          checkedSfsData = this.selffinanceData.filter((x: any) => x.checked == true)
          if (checkedSfsData.length > 0) {
            this.totalSelectedAmount = checkedSfsData
              .map((value: any) => parseInt(value.totalDueAmount)) // Step 1: Convert string to number
              .reduce((acc: any, current: any) => acc + current, 0);
          } else {
            this.totalSelectedAmount = 0;
          }
        }

      })
    } else {
      this.isPartPayment = true;
      this.selffinanceData.forEach((element: any, index: any) => {
        if (index > i) {
          element.checked = false;
          element.partPayment = false;
          element.isAvailable = false;
          // if (element.totalDueAmount > 0) {
          //   element.checked = true;
          // } else {
          //   element.checked = false;
          // }
          counter++
        }
      });

      for (let i = 0; i < this.selffinanceData.length; i++) {
        if (this.selffinanceData[i].status == "Pending") {
          // If condition is met, exit the loop
          // this.selffinanceData[j].checked = true;
          this.selffinanceData[i].isAvailable = true;
          break;
        }
      }
      let checkedSfsData: any = [];
      checkedSfsData = this.selffinanceData.filter((x: any) => x.checked == true)
      if (checkedSfsData.length > 0) {
        this.totalSelectedAmount = checkedSfsData
          .map((value: any) => parseInt(value.totalDueAmount)) // Step 1: Convert string to number
          .reduce((acc: any, current: any) => acc + current, 0);
      } else {
        this.totalSelectedAmount = 0;
      }

    }


  }

  partPaymentInput() {
    debugger
    let partPaymentInput = (parseInt(this.inputValuePart) ? parseInt(this.inputValuePart) : 0)
    let checkedSfsData: any = [];
    checkedSfsData = this.selffinanceData.filter((x: any) => x.checked == true)
    if (checkedSfsData.length > 0) {
      this.totalSelectedAmount = checkedSfsData
        .map((value: any) => parseInt(value.totalDueAmount)) // Step 1: Convert string to number
        .reduce((acc: any, current: any) => acc + current, 0);
    } else {
      this.totalSelectedAmount = 0;
    }
    let checkAmountExceed = this.selffinanceData.filter((x: any) => x.partPayment == true);
    let totalPartPayment: any = 0;

    if (checkAmountExceed && checkAmountExceed.length > 0) {
      totalPartPayment = checkAmountExceed
        .map((value: any) => parseInt(value.totalDueAmount)) // Step 1: Convert string to number
        .reduce((acc: any, current: any) => acc + current, 0);
    }
    if (partPaymentInput == 0) {
      this.toast.showToast('warning', "Part Payment Should Be Greater Than zero", "")

    }
    if (partPaymentInput >= totalPartPayment) {
      this.toast.showToast('warning', "Amount Excceed the Part Payment", "");
      this.dueAmountExceed = true;
    } else {
      this.totalSelectedAmount = partPaymentInput + this.totalSelectedAmount;
      this.dueAmountExceed = false;
    }
    let totalInputPayment: any = 0
    totalInputPayment = partPaymentInput;
    this.selffinanceData.forEach((element: any) => {
      if (element.partPayment) {

        if (element.Interest < totalInputPayment) {
          element.isPartInterestCollected = element.interestBalance;
          totalInputPayment = (totalInputPayment - element.isPartInterestCollected) > 0 ? (totalInputPayment - element.isPartInterestCollected) : 0;

        } else if (element.Interest > totalInputPayment) {
          element.isPartInterestCollected = element.interestBalance > totalInputPayment ? totalInputPayment : element.interestBalance;
          totalInputPayment = (totalInputPayment - element.isPartInterestCollected) > 0 ? (totalInputPayment - element.isPartInterestCollected) : 0;

        }
        let dueAmounts = parseInt(element.Dueamount) ? parseInt(element.Dueamount) : 0
        if (dueAmounts < totalInputPayment) {
          element.isPartCollected = element.dueBalance;
          totalInputPayment = (totalInputPayment - element.isPartCollected) > 0 ? (totalInputPayment - element.isPartCollected) : 0
        } else if (dueAmounts > totalInputPayment) {
          element.isPartCollected = element.dueBalance > totalInputPayment ? totalInputPayment : element.dueBalance;
          totalInputPayment = (totalInputPayment - element.isPartCollected) > 0 ? (totalInputPayment - element.isPartCollected) : 0

        }

        // } else if (totalInputPayment < element.Interest) {
        //   // element.isPartInterestCollected = element.Interest - element.InterestCollected
        //   // totalInputPayment -= element.isPartInterestCollected
        // }
        // let dueAmount = parseInt(element.Dueamount) ? parseInt(element.Dueamount) : 0
        // if (element.dueCollected < totalInputPayment) {
        //   element.isPartCollected = totalInputPayment;
        //   totalInputPayment -= element.isPartCollected
        // } else {

        // }

      }

    });

    console.log('selffinanceData', this.selffinanceData);


  }



  checkAnotherPaymentAsking(index: any) {

  }

  totalDemandDetails() {
    debugger
    let unitCostPaidSoFar = this.payments.unitData.unitCostPaidSoFar ? this.payments.unitData.unitCostPaidSoFar : 0;
    let gstCostPaidSoFar = this.payments.unitData.gstCostPaidSoFar ? this.payments.unitData.gstCostPaidSoFar : 0;
    let mcDemandPaidSoFar = this.payments.unitData.mcDemandPaidSoFar ? this.payments.unitData.mcDemandPaidSoFar : 0;
    let differentCostPaidSoFar = this.payments.unitData.differentCostPaidSoFar ? this.payments.unitData.differentCostPaidSoFar : 0;
    let carParkingPaidSoFar = this.payments.unitData.carParkingPaidSoFar ? this.payments.unitData.carParkingPaidSoFar : 0;
    this.totalPaidSoFar = unitCostPaidSoFar + gstCostPaidSoFar + mcDemandPaidSoFar + differentCostPaidSoFar + carParkingPaidSoFar;

    let unitCost = parseInt(this.payments?.unitData?.unitCost) ? parseInt(this.payments?.unitData?.unitCost) : 0;
    let mcDemand = parseInt(this.mcDemand) ? parseInt(this.mcDemand) : 0;
    let differenceCost = parseInt(this.payments?.unitData?.differenceCost) ? parseInt(this.payments?.unitData?.differenceCost) : 0;
    let carParkingDemand = parseInt(this.carParkingDemand) ? parseInt(this.carParkingDemand) : 0;
    let Gst = parseInt(this.gst) ? parseInt(this.gst) : 0;
    this.totalDemandCost = unitCost + mcDemand + differenceCost + carParkingDemand + Gst;
    this.totalAmountBalance = this.totalDemandCost - this.totalPaidSoFar;
  }

  totalDemandDetailsSFS() {
    debugger
    let unitCostPaidSoFar = this.payments.unitData.unitCostPaidSoFar ? this.payments.unitData.unitCostPaidSoFar : 0;
    let gstCostPaidSoFar = this.payments.unitData.gstCostPaidSoFar ? this.payments.unitData.gstCostPaidSoFar : 0;
    let mcDemandPaidSoFar = this.payments.unitData.mcDemandPaidSoFar ? this.payments.unitData.mcDemandPaidSoFar : 0;
    let differentCostPaidSoFar = this.payments.unitData.differentCostPaidSoFar ? this.payments.unitData.differentCostPaidSoFar : 0;
    let carParkingPaidSoFar = this.payments.unitData.carParkingPaidSoFar ? this.payments.unitData.carParkingPaidSoFar : 0;
    this.totalPaidSoFar = this.totalUnitAmountPaidSoFar + gstCostPaidSoFar + mcDemandPaidSoFar + differentCostPaidSoFar + carParkingPaidSoFar + this.totalInterestCollected;


    let getMcMonth = this.unitReadyDate ? this.getTotalMonths(this.unitReadyDate) : 0;
    // this.mcDemand = (parseInt(this.mcDemand) ? parseInt(this.mcDemand) : 0) * getMcMonth;
    this.mcDemand = (parseInt(this.mcDemand) ? parseInt(this.mcDemand) : 0);
    let unitCost = parseInt(this.payments?.unitData?.unitCost) ? parseInt(this.payments?.unitData?.unitCost) : 0;
    let mcDemand = parseInt(this.mcDemand) ? parseInt(this.mcDemand) : 0;
    let differenceCost = parseInt(this.payments?.unitData?.differenceCost) ? parseInt(this.payments?.unitData?.differenceCost) : 0;
    let carParkingDemand = parseInt(this.carParkingDemand) ? parseInt(this.carParkingDemand) : 0;
    let Gst = parseInt(this.gst) ? parseInt(this.gst) : 0;
    this.totalDemandCost = unitCost + mcDemand + differenceCost + carParkingDemand + Gst + this.totalInterest;
    this.totalAmountBalance = this.totalDemandCost - this.totalPaidSoFar;

    debugger
  }
  sfsDetails() {
    this.loader = true;

    let selffinanceData = [{ sno: 1, label: "1st", Description: "firstAmountDue", Date: this.payments.schemeData.firstDueDate, Dueamount: this.payments.unitData.firstAmountDue, Interest: 0, dueCollected: this.payments.unitData.firstDuePaidSoFar ? this.payments.unitData.firstDuePaidSoFar : 0, InterestCollected: this.payments.unitData.firstDueInterestPaidSoFar ? this.payments.unitData.firstDueInterestPaidSoFar : 0, dueBalance: (parseInt(this.payments.unitData.firstAmountDue) ? parseInt(this.payments.unitData.firstAmountDue) : 0) - (this.payments.unitData.firstDuePaidSoFar ? this.payments.unitData.firstDuePaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, status: 'Pending', applicationId: this.applicationId, checked: false, isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false },
    { sno: 2, label: "2nd", Description: "secondAmountDue", Date: this.payments.schemeData.secondDueDate, Dueamount: this.payments.unitData.secondAmountDue, Interest: 0, dueCollected: this.payments.unitData.secondDuePaidSoFar ? this.payments.unitData.secondDuePaidSoFar : 0, InterestCollected: this.payments.unitData.secondDueInterestPaidSoFar ? this.payments.unitData.secondDueInterestPaidSoFar : 0, dueBalance: (parseInt(this.payments.unitData.secondAmountDue) ? parseInt(this.payments.unitData.secondAmountDue) : 0) - (this.payments.unitData.secondDuePaidSoFar ? this.payments.unitData.secondDuePaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, status: 'Pending', applicationId: this.applicationId, checked: false, isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false },
    { sno: 3, label: "3rd", Description: "thirdAmountDue", Date: this.payments.schemeData.thirdDueDate, Dueamount: this.payments.unitData.thirdAmountDue, Interest: 0, dueCollected: this.payments.unitData.thirdDuePaidSoFar ? this.payments.unitData.thirdDuePaidSoFar : 0, InterestCollected: this.payments.unitData.thirdDueInterestPaidSoFar ? this.payments.unitData.thirdDueInterestPaidSoFar : 0, dueBalance: (parseInt(this.payments.unitData.thirdAmountDue) ? parseInt(this.payments.unitData.thirdAmountDue) : 0) - (this.payments.unitData.thirdDuePaidSoFar ? this.payments.unitData.thirdDuePaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, status: 'Pending', applicationId: this.applicationId, checked: false, isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false },
    { sno: 4, label: "4th", Description: "fourthAmountDue", Date: this.payments.schemeData.fourthDueDate, Dueamount: this.payments.unitData.fourthAmountDue, Interest: 0, dueCollected: this.payments.unitData.fourthDuePaidSoFar ? this.payments.unitData.fourthDuePaidSoFar : 0, InterestCollected: this.payments.unitData.fourthDueInterestPaidSoFar ? this.payments.unitData.fourthDueInterestPaidSoFar : 0, dueBalance: (parseInt(this.payments.unitData.fourthAmountDue) ? parseInt(this.payments.unitData.fourthAmountDue) : 0) - (this.payments.unitData.fourthDuePaidSoFar ? this.payments.unitData.fourthDuePaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, status: 'Pending', applicationId: this.applicationId, checked: false, isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false },
    { sno: 5, label: "5th", Description: "fifthAmountDue", Date: this.payments.schemeData.fifthDueDate, Dueamount: this.payments.unitData.fifthAmountDue, Interest: 0, dueCollected: this.payments.unitData.fifthDuePaidSoFar ? this.payments.unitData.fifthDuePaidSoFar : 0, InterestCollected: this.payments.unitData.fifthDueInterestPaidSoFar ? this.payments.unitData.fifthDueInterestPaidSoFar : 0, dueBalance: (parseInt(this.payments.unitData.fifthAmountDue) ? parseInt(this.payments.unitData.fifthAmountDue) : 0) - (this.payments.unitData.fifthDuePaidSoFar ? this.payments.unitData.fifthDuePaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, status: 'Pending', applicationId: this.applicationId, checked: false, isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false },
    { sno: 6, label: "6th", Description: "sixthAmountDue", Date: this.payments.schemeData.sixthDueDate, Dueamount: this.payments.unitData.sixthAmountDue, Interest: 0, dueCollected: this.payments.unitData.sixthDuePaidSoFar ? this.payments.unitData.sixthDuePaidSoFar : 0, InterestCollected: this.payments.unitData.sixthDueInterestPaidSoFar ? this.payments.unitData.sixthDueInterestPaidSoFar : 0, dueBalance: (parseInt(this.payments.unitData.sixthAmountDue) ? parseInt(this.payments.unitData.sixthAmountDue) : 0) - (this.payments.unitData.sixthDuePaidSoFar ? this.payments.unitData.sixthDuePaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, status: 'Pending', applicationId: this.applicationId, checked: false, isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false },
    { sno: 7, label: "7th", Description: "seventhAmountDue", Date: this.payments.schemeData.seventhDueDate, Dueamount: this.payments.unitData.seventhAmountDue, Interest: 0, dueCollected: this.payments.unitData.seventhDuePaidSoFar ? this.payments.unitData.seventhDuePaidSoFar : 0, InterestCollected: this.payments.unitData.seventhDueInterestPaidSoFar ? this.payments.unitData.seventhDueInterestPaidSoFar : 0, dueBalance: (parseInt(this.payments.unitData.seventhAmountDue) ? parseInt(this.payments.unitData.seventhAmountDue) : 0) - (this.payments.unitData.seventhDuePaidSoFar ? this.payments.unitData.seventhDuePaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, status: 'Pending', applicationId: this.applicationId, checked: false, isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false },
    { sno: 8, label: "8th", Description: "eighthAmountDue", Date: this.payments.schemeData.eighthDueDate, Dueamount: this.payments.unitData.eighthAmountDue, Interest: 0, dueCollected: this.payments.unitData.eighthDuePaidSoFar ? this.payments.unitData.eighthDuePaidSoFar : 0, InterestCollected: this.payments.unitData.eighthDueInterestPaidSoFar ? this.payments.unitData.eighthDueInterestPaidSoFar : 0, dueBalance: (parseInt(this.payments.unitData.eighthAmountDue) ? parseInt(this.payments.unitData.eighthAmountDue) : 0) - (this.payments.unitData.eighthDuePaidSoFar ? this.payments.unitData.eighthDuePaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, status: 'Pending', applicationId: this.applicationId, checked: false, isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false },
    { sno: 9, label: "9th", Description: "ninthAmountDue", Date: this.payments.schemeData.ninthDueDate, Dueamount: this.payments.unitData.ninthAmountDue, Interest: 0, dueCollected: this.payments.unitData.ninthDuePaidSoFar ? this.payments.unitData.ninthDuePaidSoFar : 0, InterestCollected: this.payments.unitData.ninthDueInterestPaidSoFar ? this.payments.unitData.ninthDueInterestPaidSoFar : 0, dueBalance: (parseInt(this.payments.unitData.ninthAmountDue) ? parseInt(this.payments.unitData.ninthAmountDue) : 0) - (this.payments.unitData.ninthDuePaidSoFar ? this.payments.unitData.ninthDuePaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, status: 'Pending', applicationId: this.applicationId, checked: false, isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false },
    { sno: 10, label: "10th", Description: "tenthAmountDue", Date: this.payments.schemeData.tenthDueDate, Dueamount: this.payments.unitData.tenthAmountDue, Interest: 0, dueCollected: this.payments.unitData.tenthDuePaidSoFar ? this.payments.unitData.tenthDuePaidSoFar : 0, InterestCollected: this.payments.unitData.tenthDueInterestPaidSoFar ? this.payments.unitData.tenthDueInterestPaidSoFar : 0, dueBalance: (parseInt(this.payments.unitData.tenthAmountDue) ? parseInt(this.payments.unitData.tenthAmountDue) : 0) - (this.payments.unitData.tenthDuePaidSoFar ? this.payments.unitData.tenthDuePaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, status: 'Pending', applicationId: this.applicationId, checked: false, isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false },
    { sno: 11, label: "11th", Description: "eleventhAmountDue", Date: this.payments.schemeData.eleventhDueDate, Dueamount: this.payments.unitData.eleventhAmountDue, Interest: 0, dueCollected: this.payments.unitData.eleventhDuePaidSoFar ? this.payments.unitData.eleventhDuePaidSoFar : 0, InterestCollected: this.payments.unitData.eleventhDueInterestPaidSoFar ? this.payments.unitData.eleventhDueInterestPaidSoFar : 0, dueBalance: (parseInt(this.payments.unitData.eleventhAmountDue) ? parseInt(this.payments.unitData.eleventhAmountDue) : 0) - (this.payments.unitData.eleventhDuePaidSoFar ? this.payments.unitData.eleventhDuePaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, status: 'Pending', applicationId: this.applicationId, checked: false, isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false },
    { sno: 12, label: "12th", Description: "twelfthAmountDue", Date: this.payments.schemeData.twelfthDueDate, Dueamount: this.payments.unitData.twelfthAmountDue, Interest: 0, dueCollected: this.payments.unitData.twelfthDuePaidSoFar ? this.payments.unitData.twelfthDuePaidSoFar : 0, InterestCollected: this.payments.unitData.twelfthDueInterestPaidSoFar ? this.payments.unitData.twelfthDueInterestPaidSoFar : 0, dueBalance: (parseInt(this.payments.unitData.twelfthAmountDue) ? parseInt(this.payments.unitData.twelfthAmountDue) : 0) - (this.payments.unitData.twelfthDuePaidSoFar ? this.payments.unitData.twelfthDuePaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, status: 'Pending', applicationId: this.applicationId, checked: false, isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false },
    { sno: 13, label: "13th", Description: "thirteenthAmountDue", Date: this.payments.schemeData.thirteenthDueDate, Dueamount: this.payments.unitData.thirteenthAmountDue, Interest: 0, dueCollected: this.payments.unitData.thirteenthDuePaidSoFar ? this.payments.unitData.thirteenthDuePaidSoFar : 0, InterestCollected: this.payments.unitData.thirteenthDueInterestPaidSoFar ? this.payments.unitData.thirteenthDueInterestPaidSoFar : 0, dueBalance: (parseInt(this.payments.unitData.thirteenthAmountDue) ? parseInt(this.payments.unitData.thirteenthAmountDue) : 0) - (this.payments.unitData.thirteenthDuePaidSoFar ? this.payments.unitData.thirteenthDuePaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, status: 'Pending', applicationId: this.applicationId, checked: false, isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false }]
    this.selffinanceData = [];
    // selffinanceData.forEach((element: any, index: any) => {
    //   if (this.payments.unitData.dueStatus == element.Description) {
    //     element.Date = this.payments.unitData.updatedDate
    //   }
    // })


    this.selffinanceData = selffinanceData.filter((x: any) => x.Date);
    console.log('this.selffinanceData', this.selffinanceData);

    debugger

    let sfsList = this.selffinanceData.map((x: any) => {
      let date: any = new Date(x.Date);

      // Add one day to the date
      date.setDate(date.getDate() + 1);
      return {
        // "startDate": this.datePipe.transform(new Date(x.Date), 'dd-MM-yyyy'),


        "startDate": x.Date ? this.datePipe.transform(new Date(date), 'dd-MM-yyyy') : '',

        // "amount": x.Dueamount,
        "amount": (x.dueBalance).toString(),
        "due": x.Description
      }

    })
    console.log('sfsList', sfsList);

    let data = {
      "entries": sfsList.filter((x: any) => x.startDate != '' && x.amount != '0')
    }
    this.propertyService.findInterestForSfs(data).subscribe(res => {
      if (res) {
        this.loader = false;
        this.interestList = res;
        let remainingTotalPaidsofar = this.totalUnitAmountPaidSoFar;
        this.selffinanceData.forEach((element: any, index: any) => {

          let Dueamount = (parseInt(element.Dueamount) ? parseInt(element.Dueamount) : 0)


          let getInterest: any = [];
          getInterest = this.interestList.filter((x: any) => x.description == element.Description)
          // element.Interest = this.interestList[index] ? this.interestList[index] : 0;
          if (index == 0) {
            element.Interest = this.payments.unitData.firstDueInterest;

          } else if (index == 1) {
            element.Interest = this.payments.unitData.secondDueInterest;

          } else {
            element.Interest = getInterest.length > 0 ? getInterest[0].amount : 0;
            if (element.Interest == 0) {
              element.Interest = element.InterestCollected
            }

          }

          let interestBalance = element.Interest - element.InterestCollected;
          element.interestBalance = interestBalance;

          // element.Interest = element.InterestCollected + element.interestBalance;

          // let interestBalance = element.Interest - element.InterestCollected;
          // element.interestBalance = interestBalance;

          let totalDueAmount = element.dueBalance + element.interestBalance;
          element.totalDueAmount = totalDueAmount;
          debugger
          if (element.Dueamount > 0 && element.totalDueAmount == 0) {
            element.status = "Paid"
            // element.Interest = element.InterestCollected;
          } else if (element.Dueamount == 0 && element.totalDueAmount == 0) {
            element.status = "Nil"
          }



        });

        for (let i = 0; i < this.selffinanceData.length; i++) {
          if (this.selffinanceData[i].status == "Pending") {
            // If condition is met, exit the loop
            // this.selffinanceData[j].checked = true;
            this.selffinanceData[i].isAvailable = true;
            break;
          }
        }

        this.totalDueAmount = this.selffinanceData
          .map((value: any) => parseInt(value.Dueamount)) // Step 1: Convert string to number
          .reduce((acc: any, current: any) => acc + current, 0);

        this.totalInterest = this.selffinanceData
          .map((value: any) => value.Interest) // Step 1: Convert string to number
          .reduce((acc: any, current: any) => acc + current, 0);


        this.totalDueCollected = this.selffinanceData
          .map((value: any) => value.dueCollected) // Step 1: Convert string to number
          .reduce((acc: any, current: any) => acc + current, 0);

        this.totalInterestCollected = this.selffinanceData
          .map((value: any) => value.InterestCollected) // Step 1: Convert string to number
          .reduce((acc: any, current: any) => acc + current, 0);


        this.totaldDueBalance = this.selffinanceData
          .map((value: any) => parseInt(value.dueBalance)) // Step 1: Convert string to number
          .reduce((acc: any, current: any) => acc + current, 0);


        this.totalInterestBalance = this.selffinanceData
          .map((value: any) => value.interestBalance) // Step 1: Convert string to number
          .reduce((acc: any, current: any) => acc + current, 0);
        this.totalDemandDetailsSFS();


        //other demand
        let DifferenceCost = (parseInt(this.payments?.unitData?.differenceCost) ? parseInt(this.payments?.unitData?.differenceCost) : 0);

        let mcDemandCost = (parseInt(this.mcDemand) ? parseInt(this.mcDemand) : 0);
        debugger
        let gst = (parseInt(this.gst) ? parseInt(this.gst) : 0);
        let carParkingDemand = (parseInt(this.carParkingDemand) ? parseInt(this.carParkingDemand) : 0);
        let scrunityFees = (parseInt(this.payments?.unitData?.scrunityFees) ? parseInt(this.payments?.unitData?.scrunityFees) : 0);
        this.otherDemands = [
          { sno: 2, label: "Different Cost Due Interest", Description: "DifferentCostDueInterest", Date: this.payments?.unitData?.dueDateOfDifferenceCost, Dueamount: DifferenceCost ? DifferenceCost : '0', Interest: 0, dueCollected: this.payments.unitData.differentCostPaidSoFar, InterestCollected: this.payments.unitData.differentinCostInterestPaidSoFar, dueBalance: DifferenceCost - (this.payments.unitData.differentCostPaidSoFar ? this.payments.unitData.differentCostPaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, applicationId: this.applicationId, Status: "Pending", isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false },
          { sno: 3, label: "GST", Description: "GST", Date: '', Dueamount: gst ? gst : '0', Interest: 0, dueCollected: this.payments.unitData.gstCostPaidSoFar, InterestCollected: 0, dueBalance: gst - (this.payments.unitData.gstCostPaidSoFar ? this.payments.unitData.gstCostPaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, applicationId: this.applicationId, Status: "Pending", isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false },
          { sno: 4, label: "Maintenance Charges", Description: "Maintenance Charges", Date: this.payments?.unitData?.mcDemandUpTo, Dueamount: this.mcDemand ? this.mcDemand : '0', Interest: 0, dueCollected: this.payments.unitData.mcDemandPaidSoFar, InterestCollected: 0, dueBalance: mcDemandCost - (this.payments.unitData.mcDemandPaidSoFar ? this.payments.unitData.mcDemandPaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, applicationId: this.applicationId, Status: "Pending", isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false },
          { sno: 5, label: "Car Parking Demand", Description: "Car Parking Demand", Date: '', Dueamount: carParkingDemand ? carParkingDemand : '0', Interest: 0, dueCollected: this.payments.unitData.carParkingPaidSoFar, InterestCollected: 0, dueBalance: carParkingDemand - (this.payments.unitData.carParkingPaidSoFar ? this.payments.unitData.carParkingPaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, applicationId: this.applicationId, Status: "Pending", isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false },
          { sno: 6, label: "Scrunity Fee", Description: "Scrunity Fee", Date: '', Dueamount: scrunityFees ? scrunityFees : '0', Interest: 0, dueCollected: this.payments.unitData.scrunityFeesPaidSoFar ? this.payments.unitData.scrunityFeesPaidSoFar : 0, InterestCollected: 0, dueBalance: scrunityFees - (this.payments.unitData.scrunityFeesPaidSoFar ? this.payments.unitData.scrunityFeesPaidSoFar : 0), interestBalance: 0, totalDueAmount: 0, applicationId: this.applicationId, Status: "Pending", isPartCollected: 0, isPartInterestCollected: 0, partPayment: false, isAvailable: false }

        ]


        console.log('otherDemands', this.otherDemands);
        let getDifferenceCost = this.otherDemands.filter((x: any) => x.Description == 'DifferentCostDueInterest');
        debugger
        let getOtherDemands = getDifferenceCost.map((x: any) => {
          let date: any;
          if (x.Date) {
            date = new Date(x.Date);
            // Add one day to the date
            date.setDate(date.getDate() + 1);
          }
          return {
            "startDate": x.Date ? this.datePipe.transform(new Date(date), 'dd-MM-yyyy') : this.datePipe.transform(new Date(), 'dd-MM-yyyy'),
            "amount": x.Dueamount,
            "due": x.Description
          }
        })
        debugger
        console.log('getOtherDemands', getOtherDemands);

        let otherDemandData = {
          "entries": getOtherDemands.filter((x: any) => x.dueDate != '' && x.Dueamount != '0')
        }
        this.propertyService.findInterestForSfs(otherDemandData).subscribe((resOtherDemand: any) => {
          if (resOtherDemand) {
            debugger

            this.otherDemands.forEach((element: any) => {
              let dueBalance = (element.Dueamount ? element.Dueamount : 0) - element.dueCollected;
              if (element.Description == 'DifferentCostDueInterest') {
                let getInterest: any = [];
                getInterest = resOtherDemand.filter((x: any) => x.description == element.Description)
                element.Interest = getInterest.length > 0 ? getInterest[0].amount : 0;
                this.totalPaidSoFar += element.InterestCollected;

                this.totalDemandCost += element.Interest;
                this.totalAmountBalance = this.totalDemandCost - this.totalPaidSoFar;

              }
              let interestBalance = element.Interest - element.InterestCollected;

              // element.dueBalance = dueBalance;
              element.interestBalance = interestBalance;
              let totalDueAmount = element.dueBalance + element.interestBalance;
              element.totalDueAmount = totalDueAmount;
              if (element.Dueamount > 0 && element.totalDueAmount == 0) {
                element.Status = "Paid";
              } else if (element.Dueamount == 0 && element.totalDueAmount == 0) {
                element.Status = "Nil"
              }
            });
          }
        })

        // forkJoin([observable]).subscribe((res=>{

        // })
        //   // next: ([result1]) => {
        //     console.log(result1); // Logs "Task 1" after 3 seconds
        //     // Logs "Task 3" after 3 seconds

        //     this.otherDemands.forEach((element: any) => {
        //       let dueBalance = (element.Dueamount ? element.Dueamount : 0) - element.dueCollected;
        //       if (element.Description == 'DifferentCostDueInterest') {
        //         element.Interest = result1[0];
        //         this.totalPaidSoFar += element.InterestCollected;

        //         this.totalDemandCost += element.Interest;
        //         this.totalAmountBalance = this.totalDemandCost - this.totalPaidSoFar;

        //       }
        //       let interestBalance = element.Interest - element.InterestCollected;

        //       // element.dueBalance = dueBalance;
        //       element.interestBalance = interestBalance;
        //       let totalDueAmount = element.dueBalance + element.interestBalance;
        //       element.totalDueAmount = totalDueAmount;
        //       if (element.Dueamount > 0 && element.totalDueAmount == 0) {
        //         element.Status = "Paid";
        //       } else if (element.Dueamount == 0 && element.totalDueAmount == 0) {
        //         element.Status = "Nil"
        //       }
        //     });
        //   // },
        // );





      }
    })








  }

  payPart() {
    let totalAmount = this.inputValuePart;

    let selfFinanceData = this.selffinanceData;
    selfFinanceData.forEach((element: any) => {
      let tallyInterest = element.Interest;

    });

  }

  checkPartOrFull(element: any, i: any, checked: any) {
    Swal.fire({
      title: "Do you want pay fully?",
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: "Yes",
      customClass: {
        title: 'swal2-title-custom', // Custom class for title
        popup: 'swal2-popup-custom', // Custom class for popup
        htmlContainer: 'swal2-html-custom' // Custom class for content text
      }
      // denyButtonText: `Don't save`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        element.checked = false;
        element.partPayment = true;
        let checkPartPayment = this.selffinanceData.filter((x: any) => x.partPayment);
        if (checkPartPayment && checkPartPayment.length > 0) {
          this.isPartPayment = false;
          this.myInputElement.nativeElement.focus();

        }
        // this.totalSelectedAmount = 0;
      } else {
        element.checked = true;
        this.checkPay(element, i, true)
      }

    })
  }

  getTotalMonths(startDate: string | Date): number {
    // Convert the startDate to a Date object
    const start = new Date(startDate);
    const currentDate = new Date();

    // Get the years and months for start and current date
    const startYear = start.getFullYear();
    const startMonth = start.getMonth(); // Months are zero-indexed
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed

    // Calculate the difference in months
    const totalMonths = (currentYear - startYear) * 12 + (currentMonth - startMonth);

    return totalMonths;
  }
  checkDateInRange(inputDate: Date, element: any): boolean {
    // Iterate through each date range
    let totalInterest: any = 0;
    let index = 0
    for (const range of this.rateofInterestList) {
      let startDate: any = '';
      let endDate: any = '';
      let currentDate = new Date();
      let InputDate = new Date(inputDate);

      // if (index == 0) {
      //   startDate = new Date(inputDate);
      //   // startDate = new Date(startingDate);
      //   // startDate.setDate(startDate.getDate() + 1)
      //   endDate = new Date();
      // } else {
      //   startDate = new Date(range.startDate);
      //   endDate = new Date();
      // }


      if (totalInterest == 0) {

        startDate = new Date(inputDate);

        endDate = new Date(range.endDate);
        if (endDate <= currentDate) {
          endDate = new Date(range.endDate);

        } else {
          endDate = new Date();

        }


      } else {
        startDate = new Date(range.startDate);
        // startDate.setDate(startDate.getDate() + 1);
        //   // startDate.setDate(startDate.getDate() + 1)
        endDate = new Date();

        endDate.setDate(endDate.getDate() + 1)
      }

      // Check if the inputDate is between startDate and endDate


      const timeDifference = endDate.getTime() - startDate.getTime();
      let daysCount = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      if (daysCount > 0 && InputDate <= currentDate) {


        if (totalInterest == 0) {
          if (InputDate >= startDate && InputDate <= endDate) {
            let dueAmount = element.dueBalance;
            let rateOfinterest: any = parseFloat(range.interest);
            let interest = dueAmount * (rateOfinterest / 100) * (daysCount / 365);
            let getInterest = Math.round(interest);
            totalInterest += getInterest;

          }
        } else {
          if (InputDate >= startDate || InputDate <= endDate) {
            let dueAmount = element.dueBalance;
            let rateOfinterest: any = parseFloat(range.interest);
            let interest = dueAmount * (rateOfinterest / 100) * (daysCount / 365);
            let getInterest = Math.round(interest);
            totalInterest += getInterest;

          }
        }
      }

      index++
    }
    return totalInterest
  }

  unitDemand(value: any) {
    console.log(this.selectedData)
    console.log(value, "value")
    this.selectedData = this.selffinanceData.filter((X: any) => X.checked);
    this.router.navigate(['/customer/allottee_echallan_create'], {
      queryParams: {
        demands: value,
        applicationId: this.applicationId,
        unitaccountno: this.unitAccountNo,
        routeLink: "challanRoute"
      },
      state: {
        selectedData: this.selectedData,
        projectStatus: this.projectStatus
      }
    });


  }

  // checkDateInRange(inputDate: Date, element: any, days: any): boolean {
  //   // Iterate through each date range
  //   let totalInterest: any = 0;
  //   let index = 0
  //   for (const range of this.rateofInterestList) {
  //     let startDate: any = '';
  //     let endDate: any = '';
  //     let currentDate = new Date();
  //     // if (index == 0) {
  //     //   startDate = new Date(inputDate);
  //     //   // startDate = new Date(startingDate);
  //     //   // startDate.setDate(startDate.getDate() + 1)
  //     //   endDate = new Date();
  //     // } else {
  //     //   startDate = new Date(range.startDate);
  //     //   endDate = new Date();
  //     // }
  //     if (totalInterest == 0) {

  //       startDate = new Date(inputDate);

  //       endDate = new Date(range.endDate);
  //       if (startDate <= endDate) {
  //         endDate = new Date(range.endDate);

  //       } else {
  //         endDate = new Date();

  //       }


  //     } else {
  //       startDate = new Date(range.startDate);
  //       // startDate.setDate(startDate.getDate() + 1);
  //       //   // startDate.setDate(startDate.getDate() + 1)
  //       endDate = new Date();

  //       endDate.setDate(endDate.getDate() + 1)
  //     }
  //     let InputDate = new Date(inputDate);

  //     // Check if the inputDate is between startDate and endDate


  //     const timeDifference = endDate.getTime() - startDate.getTime();
  //     let daysCount = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  //     if (daysCount > 0 && InputDate <= currentDate) {


  //       if (totalInterest == 0) {
  //         if (InputDate >= startDate && InputDate <= endDate) {
  //           let dueAmount = element.dueBalance;
  //           let rateOfinterest: any = parseFloat(range.interest);
  //           let interest = dueAmount * (rateOfinterest / 100) * (daysCount / 365);
  //           let getInterest = Math.round(interest);
  //           totalInterest += getInterest;

  //         }
  //       } else {
  //         if (InputDate >= startDate || InputDate <= endDate) {
  //           let dueAmount = element.dueBalance;
  //           let rateOfinterest: any = parseFloat(range.interest);
  //           let interest = dueAmount * (rateOfinterest / 100) * (daysCount / 365);
  //           let getInterest = Math.round(interest);
  //           totalInterest += getInterest;

  //         }
  //       }
  //     }

  //     index++
  //   }
  //   return totalInterest

  //   // Return false if no match was found
  //   return false;
  // }
  payCombined() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Payment',
        message: `Are you sure you want to pay ?`
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        let ListData = this.selffinanceData.filter((x: any) => x.checked == true || x.partPayment);
        sessionStorage.setItem('sfsList', JSON.stringify(ListData))
        console.log('ListData', ListData);
        debugger
        this.router.navigate(['customer/selectbank'], { queryParams: { bookingId: this.unitAccountNo } });

      }


    })

  }
  partPaymentInputOther() {

    debugger
    let partPaymentInput = (parseInt(this.otherinputValuePart) ? parseInt(this.otherinputValuePart) : 0)
    let totalPartPayment: any = 0;
    let checkedSfsData: any = [];

    if (this.paymentDiscription == "DifferentCostDueInterest") {
      this.totalSelectedAmountOther = this.otherDemands[0].totalDueAmount;
      totalPartPayment = this.otherDemands[0].totalDueAmount;
    } else if (this.paymentDiscription == "GST") {
      this.totalSelectedAmountOther = this.otherDemands[1].totalDueAmount;
      totalPartPayment = this.otherDemands[1].totalDueAmount;
    } else if (this.paymentDiscription == "Maintenance Charges") {
      this.totalSelectedAmountOther = this.otherDemands[2].totalDueAmount;
      totalPartPayment = this.otherDemands[2].totalDueAmount;
    } else if (this.paymentDiscription == "Car Parking Demand") {
      this.totalSelectedAmountOther = this.otherDemands[3].totalDueAmount;
      totalPartPayment = this.otherDemands[3].totalDueAmount;
    }





    // if (checkAmountExceed && checkAmountExceed.length > 0) {
    //   totalPartPayment = checkAmountExceed
    //     .map((value: any) => parseInt(value.totalDueAmount)) // Step 1: Convert string to number
    //     .reduce((acc: any, current: any) => acc + current, 0);
    // }
    if (partPaymentInput == 0) {
      this.toast.showToast('warning', "Part Payment Should Be Greater Than zero", "")

    }
    if (partPaymentInput >= totalPartPayment) {
      this.toast.showToast('warning', "Amount Excceed the Part Payment", "");
      this.dueAmountExceedOther = true;

    } else {
      this.totalSelectedAmountOther = partPaymentInput;
      this.dueAmountExceedOther = false;

    }
    let totalInputPayment: any = 0
    totalInputPayment = partPaymentInput;

    let otherDemands = this.otherDemands.filter((x: any) => x.Description == "DifferentCostDueInterest")

    if (this.paymentDiscription == "DifferentCostDueInterest") {

      otherDemands.forEach((element: any) => {
        if (element.partPayment) {

          if (element.Interest < totalInputPayment) {
            element.isPartInterestCollected = element.interestBalance;
            totalInputPayment = (totalInputPayment - element.isPartInterestCollected) > 0 ? (totalInputPayment - element.isPartInterestCollected) : 0;

          } else if (element.Interest > totalInputPayment) {
            element.isPartInterestCollected = element.interestBalance > totalInputPayment ? totalInputPayment : element.interestBalance;
            totalInputPayment = (totalInputPayment - element.isPartInterestCollected) > 0 ? (totalInputPayment - element.isPartInterestCollected) : 0;

          }
          let dueAmounts = parseInt(element.Dueamount) ? parseInt(element.Dueamount) : 0
          if (dueAmounts < totalInputPayment) {
            element.isPartCollected = element.dueBalance;
            totalInputPayment = (totalInputPayment - element.isPartCollected) > 0 ? (totalInputPayment - element.isPartCollected) : 0
          } else if (dueAmounts > totalInputPayment) {
            element.isPartCollected = element.dueBalance > totalInputPayment ? totalInputPayment : element.dueBalance;
            totalInputPayment = (totalInputPayment - element.isPartCollected) > 0 ? (totalInputPayment - element.isPartCollected) : 0

          }


        }

      });
    }


    console.log('otherDemands', otherDemands);

  }

  // payIndividual(element: any) {
  //   let ListData: any = [];
  //   if (element.Description != "Scrunity Fee") {
  //     Swal.fire({
  //       title: "Do you want pay partly?",
  //       showDenyButton: true,
  //       // showCancelButton: true,
  //       confirmButtonText: "Yes",
  //       customClass: {
  //         title: 'swal2-title-custom', // Custom class for title
  //         popup: 'swal2-popup-custom', // Custom class for popup
  //         htmlContainer: 'swal2-html-custom' // Custom class for content text
  //       }
  //       // denyButtonText: `Don't save`
  //     }).then((result) => {

  //       this.paymentDiscription = element.Description;

  //       if (result.isConfirmed) {
  //         element.partPayment = true;
  //         setTimeout(() => {
  //           this.myInputElement2.nativeElement.focus();
  //         }, 1000);
  //         this.isPartPaymentOther = false;
  //         // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //         //   data: {
  //         //     title: 'Confirm Payment',
  //         //     message: `Are you sure you want to pay ?`
  //         //   },
  //         //   panelClass: 'custom-dialog-container'
  //         // });

  //         // dialogRef.afterClosed().subscribe(result => {
  //         //   if (result) {
  //         //     ListData.push(element);
  //         //     sessionStorage.setItem('sfsList', JSON.stringify(ListData))
  //         //     this.router.navigate(['customer/selectbank'], { queryParams: { bookingId: this.unitAccountNo } });
  //         //   }
  //         // })


  //       } else {
  //         element.partPayment = false;

  //         const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //           data: {
  //             title: 'Confirm Payment',
  //             message: `Are you sure you want to pay ?`
  //           },
  //           panelClass: 'custom-dialog-container'
  //         });

  //         dialogRef.afterClosed().subscribe(result => {
  //           if (result) {
  //             ListData.push(element);
  //             sessionStorage.setItem('sfsList', JSON.stringify(ListData))
  //             this.router.navigate(['customer/selectbank'], { queryParams: { bookingId: this.unitAccountNo } });
  //           }
  //         })
  //       }

  //     })
  //   } else {
  //     element.partPayment = false;

  //     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //       data: {
  //         title: 'Confirm Payment',
  //         message: `Are you sure you want to pay ?`
  //       },
  //       panelClass: 'custom-dialog-container'
  //     });

  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //         ListData.push(element);
  //         sessionStorage.setItem('sfsList', JSON.stringify(ListData))
  //         this.router.navigate(['customer/selectbank'], { queryParams: { bookingId: this.unitAccountNo } });
  //       }
  //     })
  //   }







  // }
  payIndividual(element: any) {
    let ListData: any = [];

    debugger
    element.partPayment = false;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Payment',
        message: `Are you sure you want to pay ?`
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        if (!this.pathRoute) {
          ListData.push(element);
          sessionStorage.setItem('sfsList', JSON.stringify(ListData))
          this.router.navigate(['customer/selectbank'], { queryParams: { bookingId: this.unitAccountNo } });
        } else {
          this.selectedData = [];
          this.selectedData.push(element);
          this.router.navigate(['/customer/allottee_echallan_create'], {
            queryParams: {
              demands: "Demand",
              applicationId: this.applicationId,
              unitaccountno: this.unitAccountNo,
              routeLink: "challanRoute"
            },
            state: {
              selectedData: this.selectedData
            }
          });
        }

      }
    })








  }
  payOther() {
    debugger
    let ListData: any;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Payment',
        message: `Are you sure you want to pay ?`
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {



        if (this.paymentDiscription == "DifferentCostDueInterest") {
          this.totalSelectedAmountOther = this.otherDemands[0].totalDueAmount;
          this.otherDemands[0].partPayment = true;
          ListData = this.otherDemands[0]
        } else if (this.paymentDiscription == "GST") {
          this.totalSelectedAmountOther = this.otherDemands[1].totalDueAmount;
          this.otherDemands[1].partPayment = true;
          ListData = this.otherDemands[1]

        } else if (this.paymentDiscription == "Maintenance Charges") {
          this.totalSelectedAmountOther = this.otherDemands[2].totalDueAmount;
          this.otherDemands[2].partPayment = true;
          ListData = this.otherDemands[2]

        } else if (this.paymentDiscription == "Car Parking Demand") {
          this.totalSelectedAmountOther = this.otherDemands[3].totalDueAmount;
          this.otherDemands[3].partPayment = true;

          ListData = this.otherDemands[3]

        }
        let getListData = [];
        getListData.push(ListData)

        sessionStorage.setItem('sfsList', JSON.stringify(getListData))
        this.router.navigate(['customer/selectbank'], { queryParams: { bookingId: this.unitAccountNo } });
      }
    })
  }


  validateInput(): void {
    debugger
    const regex = /^\d*\.?\d+$/;
    if (regex.test(this.inputValue)) {
      const inputNumber = parseFloat(this.inputValue);
      console.log(parseFloat(this.unitCostBalance));
      if (this.paymentType == 'Unit Cost') {
        this.isValueExceeded = inputNumber > parseFloat(this.unitCostBalance);
        this.payDisable = this.isValueExceeded || inputNumber <= 0;
      } else if (this.paymentType == 'Difference in cost') {
        this.isValueExceeded = inputNumber > parseFloat(this.differenceCostBalance);
        this.payDisable = this.isValueExceeded || inputNumber <= 0;
      } else if (this.paymentType == 'Maintenance Charges') {
        this.isValueExceeded = inputNumber > parseFloat(this.maintananceChargesBalance);
        this.payDisable = this.isValueExceeded || inputNumber <= 0;
      } else if (this.paymentType == 'GST') {
        this.isValueExceeded = inputNumber > parseFloat(this.gstBalance);
        this.payDisable = this.isValueExceeded || inputNumber <= 0;
      } else {
        this.isValueExceeded = inputNumber > parseFloat(this.carParkingBalance);
        this.payDisable = this.isValueExceeded || inputNumber <= 0;
      }



    } else {
      this.isValueExceeded = true;
      this.payDisable = true;
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

  pay(paymentType: any, cost: any) {
    debugger
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Payment',
        message: `Are you sure you want to pay ₹${cost}?`
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // const data = {
        //   paymentType: paymentType,
        //   cost: cost,
        //   paymentDateAndTime: new Date().toLocaleString(),
        //   description: '',
        //   schemeDataId: parseInt(this.schemeId),
        //   unitDataId: parseInt(this.unitId),
        //   applicationId: this.applicationId
        // };
        if (!this.pathRoute) {


          const data = [{
            "amount": cost ? cost : 0,
            "unitId": this.unitId,
            "schemeId": this.schemeId,
            "paymentType": paymentType,
            "description": "Booking Saved",
            "unitAccountNumber": this.unitAccountNo,
            "applicationId": this.applicationId,
            "createdDateTime": new Date().toLocaleString()
          }]

          // this.paymentService.amount = cost;
          sessionStorage.setItem('amount', cost);

          this.salesService.bookingSave(data).subscribe(res => {
            if (res) {
              // this.router.navigate(['customer/selectbank'], { queryParams: { bookingId: res.responseObject.id } });
              this.router.navigate(['customer/selectbank'], { queryParams: { bookingId: this.unitAccountNo } });



            }
          })
        } else {

          let data = {
            sno: 1,
            Description: paymentType,
            Dueamount: cost,
            label: paymentType,
            totalAmount: cost,
            type: "Installment"


          }
          this.selectedData = [];
          this.selectedData.push(data);
          this.router.navigate(['/customer/allottee_echallan_create'], {
            queryParams: {
              demands: "Demand",
              applicationId: this.applicationId,
              unitaccountno: this.unitAccountNo,
              routeLink: "challanRoute"
            },
            state: {
              selectedData: this.selectedData,
              projectStatus: this.projectStatus
            }
          });

        }



        // this.salesService.createPayment(data).subscribe(
        //   (response: any) => {
        //     console.log(response);
        //     this.toast.showToast('success', 'Payment Successfull', '');
        //     this.getAllPaymentsByApplicationId();
        //   },
        //   (error: any) => {
        //     console.error(error);
        //     this.toast.showToast('error', 'Payment Failed', '');
        //   }
        // );
      }
    });

  }

  selectedPaymentType(event: any) {
    debugger
    console.log('event', event);

  }
  sfs(data: any) {
    this.sfsDue = {
      firstAmountDue: data.firstAmountDue || "",
      firstAmountDueDate: data.firstAmountDueDate || "",
      secondAmountDue: data.secondAmountDue || "",
      secondAmountDueDate: data.secondAmountDueDate || "",
      thirdAmountDue: data.thirdAmountDue || "",
      thirdAmountDueDate: data.thirdAmountDueDate || "",
      fourthAmountDue: data.fourthAmountDue || "",
      fourthAmountDueDate: data.fourthAmountDueDate || "",
      fifthAmountDue: data.fifthAmountDue || "",
      fifthAmountDueDate: data.fifthAmountDueDate || "",
      sixthAmountDue: data.sixthAmountDue || "",
      sixthAmountDueDate: data.sixthAmountDueDate || "",
      seventhAmountDue: data.seventhAmountDue || "",
      seventhAmountDueDate: data.seventhAmountDueDate || "",
      eighthAmountDue: data.eighthAmountDue || "",
      eighthAmountDueDate: data.eighthAmountDueDate || "",
      ninthAmountDue: data.ninthAmountDue || "",
      ninthAmountDueDate: data.ninthAmountDueDate || "",
      tenthAmountDue: data.tenthAmountDue || "",
      tenthAmountDueDate: data.tenthAmountDueDate || "",
      eleventhAmountDue: data.eleventhAmountDue || "",
      eleventhAmountDueDate: data.eleventhAmountDueDate || "",
      twelfthAmountDue: data.twelfthAmountDue || "",
      twelfthAmountDueDate: data.twelfthAmountDueDate || "",
      thirteenthAmountDue: data.thirteenthAmountDue || "",
      thirteenthAmountDueDate: data.thirteenthAmountDueDate || ""
    };
  }

  checkIfTransactionExists(paymentType: string): boolean {
    return this.allPayments.some((transaction: { paymentType: string; }) => transaction.paymentType === paymentType);
  }

  goToPaymentHistory() {


    // this.router.navigate(['customer/payment-history'], { queryParams: { applicationId: this.applicationId } });
    this.router.navigate(['customer/payment-history'], { queryParams: { unitAccountNo: this.unitAccountNo } });



  }

}
