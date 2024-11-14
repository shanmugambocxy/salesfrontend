import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { SharedModule } from '../shared/shared.module';
import { SalesService } from '../services/sales.service';
import { ToastService } from '../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Banks } from '../bank_enum';
import { DatePipe, Location } from '@angular/common';
import { PropertyService } from '../services/property.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent implements OnInit {
  currentStep = 1;
  numSteps = 4;
  loader: boolean = false;
  bank: any = '';
  schemeId: any;
  unitId: any = '';
  applicationId: any = '';
  amount: any = 0;
  paymentType: any;
  bookingDetail: any;
  banks = Banks;
  tranId: any;
  todaysDate: any;
  merchantID: any;
  referenceID: any;
  isInititalDeposit = 'false';
  schemeData: any;
  unitData: any;
  indianBankResponse: any;
  sbiOrderID: any;
  sbiPaymentMethod: any;
  projectStatus: any = '';
  sfsList: any = [];
  unitAccountNo: any;
  logoutminutes = 21;
  logoutseconds = 0;
  logoutinterval: any;
  constructor(private paymentService: PaymentService,
    private salesService: SalesService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private propertyService: PropertyService,
    private datePipe: DatePipe,
    private authService: AuthService

  ) {
    this.projectStatus = localStorage.getItem('projectStatus');


    this.location.subscribe((event) => {
      if (event.pop) {
        // Redirect to home page
        this.router.navigate(['/customer/home']);
        this.removeMinutesAndSeconds();

      }
    });


  }
  ngOnInit() {
    debugger
    // const timestamp: number = 1723108590;
    // const date: Date = new Date(timestamp * 1000);

    // const formattedDate: string = date.toISOString().slice(0, 19);
    // console.log(formattedDate);



    this.bank = sessionStorage.getItem('bank');
    // this.schemeId = sessionStorage.getItem('schemeId');
    // this.unitId = sessionStorage.getItem('unitId');
    // this.applicationId = sessionStorage.getItem('applicationId');
    this.route.queryParams.subscribe(params => {
      let merchantOrderNo = params['merchantOrderNo'];
      let paymentType = params['paymentType'];

    })

    if (this.bank == this.banks.AxisBank || this.bank == this.banks.CanaraBank || this.bank == this.banks.INDUSINDBank || this.bank == this.banks.HDFCBank) {
      setTimeout(() => {
        console.log('nextstep_____2');

        this.nextStep();
      }, 1000);
      setTimeout(() => {
        console.log('nextstep_____2');

        this.nextStep();
      }, 2000);

      setTimeout(() => {
        console.log('nextstep_____2');

        this.nextStep();
      }, 2500);
    }
    let unitAccountNo = sessionStorage.getItem('unitAccountNo');
    this.unitAccountNo = unitAccountNo;
    this.salesService.getBookingDetails(unitAccountNo).subscribe(async res => {
      if (res) {
        debugger
        this.bookingDetail = res.responseObject;
        let applicationData: any = await this.propertyService.getApplicationById(this.bookingDetail[0]?.applicationId).toPromise();
        this.schemeData = applicationData.schemeData;
        this.unitData = applicationData.unitData;
        this.schemeId = this.schemeData.id;
        this.unitId = this.unitData.id;
        let checkBookingDetails = this.bookingDetail.filter((x: any) => x.paymentType == 'Initial Deposit' || x.paymentType == 'Application Fee' || x.paymentType == 'Registration Fee');
        if (checkBookingDetails && checkBookingDetails.length > 0) {
          this.applicationId = this.bookingDetail[0].applicationId;
          this.paymentType = "Initial Deposit";
          let amount = this.bookingDetail
            .map((value: any) => parseInt(value.amount, 10)) // Step 1: Convert string to number
            .reduce((acc: any, current: any) => acc + current, 0);
          this.amount = amount;
          this.isInititalDeposit = 'true';

          this.salesService.getUpdatedTimeByUnit(this.schemeId, 1).subscribe(getRes => {
            if (getRes && getRes.responseObject) {

              let checkUnit = getRes.responseObject.filter((x: any) => x.id == this.unitId);
              debugger
              if (checkUnit && checkUnit.length > 0) {
                let curreDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy, hh:mm:ss a');


                let logOutMinutesSeconds = this.getTimeDifference(curreDate, checkUnit[0]?.logoutEndTime);
                this.logoutminutes = logOutMinutesSeconds.minutes && logOutMinutesSeconds.minutes > 21 ? 0 : logOutMinutesSeconds.minutes;
                this.logoutseconds = logOutMinutesSeconds.seconds;
                this.startTimerLogout();
              }


            }

          })

        } else {

          if (this.projectStatus != 'Self Finance') {
            this.isInititalDeposit = 'false';
            this.paymentType = this.bookingDetail[0].paymentType;

            this.applicationId = this.bookingDetail[0].applicationId;
            this.amount = this.bookingDetail[0].amount ? parseInt(this.bookingDetail[0].amount) : 0;
          } else {
            this.isInititalDeposit = 'false';
            let SfsList: any = sessionStorage.getItem('sfsList');
            let getSfsList = JSON.parse(SfsList);
            this.sfsList = getSfsList;
            let amount = getSfsList
              .map((value: any) => value.partPayment ? (value.isPartInterestCollected + value.isPartCollected) : value.totalDueAmount) // Step 1: Convert string to number
              .reduce((acc: any, current: any) => acc + current, 0);
            this.amount = amount;
            this.applicationId = getSfsList[0].applicationId;
          }


        }

        // this.propertyService.getApplicationById(this.applicationId).subscribe((response: any) => {
        //   console.log(response);
        //   this.schemeData = response.schemeData;
        //   this.unitData = response.unitData;
        //   this.schemeId = this.schemeData.id;
        //   this.unitId = this.unitData.id;

        // },
        //   (error: any) => {
        //   }
        // );


        // this.paymentType = res.paymentType;
        // this.amount = res.amount ? parseInt(res.amount) : 0;
        // this.applicationId = res.applicationId;
        // this.schemeId = res.schemeId;
        // this.unitId = res.unitId;

        // setTimeout(() => {
        //   console.log('nextstep_____1');

        //   this.nextStep();
        // }, 1000);
        // setTimeout(() => {
        //   console.log('nextstep_____2');

        //   this.nextStep();
        // }, 2000);
        setTimeout(() => {
          console.log('nextstep_____2');

          // this.nextStep();

          if (this.bank == this.banks.IndianBank) {

            this.route.queryParams.subscribe(params => {
              this.tranId = params['generatedId'];

              this.getByTransID();
            })

          }

          if (this.bank == this.banks.SBIBank) {
            this.route.queryParams.subscribe(params => {
              let merchantOrderNo = params['merchantOrderNo'];
              let paymentType = params['paymentType'];
              this.getSbiTransaction(merchantOrderNo, paymentType, this.amount)
            })
          }
          this.removeMinutesAndSeconds();

        }, 2500);

        if (this.bank == this.banks.ICICIBank) {
          let getGID = sessionStorage.getItem('gid');
          // this.route.queryParams.subscribe(async params => {
          //   if (params) {
          //     let getGid = params['sp-payment-link']
          //   }

          // })
          console.log('getGID', getGID);

          if (getGID) {
            this.paymentService.verifyPaymentLink(getGID).subscribe((res: any) => {
              if (res && res.entity) {
                sessionStorage.removeItem('gid');
                this.amount = (res.entity.amount) / 100;
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
                let data: any = [];
                if (this.isInititalDeposit == 'false') {

                  if (this.projectStatus != 'Self Finance') {
                    data = [{
                      "paymentType": this.paymentType,
                      "cost": JSON.stringify((res.entity.amount) / 100),
                      "paymentDateAndTime": formattedDate,
                      "description": res.entity.description,
                      "schemeDataId": this.schemeId,
                      "unitDataId": this.unitId,
                      "applicationId": this.applicationId,
                      "unitAccountNumber": this.unitData.unitAccountNumber,
                      "paymentId": res.entity.gid,
                      "bankName": this.bank,
                      "reference": res?.entity?.paymentSession?.gid,
                      "paymentMethod": res?.entity?.paymentMethodType.length > 0 ? (res?.entity?.paymentMethodType[0])?.toUpperCase() : '',
                      "orderId": '',
                      "refundDescription": "",
                      "refundId": "",
                      "refundAmount": "",
                      "refundDate": "",
                      "refundBank": "",
                    }]

                    this.salesService.createTransaction(data).subscribe(
                      (response: any) => {
                        if (response) {
                          console.log(response);
                          let payments = [{
                            "paymentType": data[0].paymentType,
                            "unitAccountNumber": data[0].unitAccountNumber,
                            "paymentId": data[0].paymentId,
                            "code": "777",
                            "amount": data[0].cost,
                            "modeOfPayment": data[0].paymentMethod,
                            "bankName": data[0].bankName,
                            "orderId": data[0].orderId,
                            "applicationId": this.applicationId,
                            "dateOfPayment": formattedDate,
                            "refundDescription": "",
                            "refundId": "",
                            "refundAmount": "",
                            "refundDate": "",
                            "refundBank": "",
                          }]
                          this.salesService.createPayment(payments).subscribe(res => {
                            if (res) {


                              const myPromise = new Promise(async (resolve, reject) => {
                                // await this.demandUpdateDetails(data[0].paymentType, data[0].cost, "No");

                                if (this.projectStatus == 'Self Finance') {
                                  this.updateSFSlistInterestAndAmount();
                                } else {
                                  this.demandUpdateDetails(data[0].paymentType, data[0].cost, "No");

                                }
                                this.toast.showToast('success', 'Payment Successfull', '');

                                setTimeout(() => {
                                  console.log('nextstep_____2');

                                  this.nextStep();
                                }, 1000);
                                setTimeout(() => {
                                  console.log('nextstep_____2');

                                  this.nextStep();
                                }, 2000);

                                setTimeout(() => {
                                  console.log('nextstep_____2');

                                  this.nextStep();


                                }, 2500);

                              })
                              myPromise.then((value: any) => {

                              })




                            }
                          })
                        }
                      },
                      (error: any) => {
                        console.error(error);
                        this.toast.showToast('error', 'Payment Failed', '');
                      }
                    );

                  } else {
                    let paymentList: any = [];
                    this.sfsList.forEach((element: any) => {
                      data = {
                        "paymentType": element.Description,
                        "cost": element.partPayment ? (element.isPartInterestCollected + element.isPartCollected) : element.totalDueAmount,
                        "paymentDateAndTime": formattedDate,
                        "description": res.entity.description,
                        "schemeDataId": this.schemeId,
                        "unitDataId": this.unitId,
                        "applicationId": this.applicationId,
                        "unitAccountNumber": this.unitData.unitAccountNumber,
                        "paymentId": res.entity.gid,
                        "bankName": this.bank,
                        "reference": res?.entity?.paymentSession?.gid,
                        "paymentMethod": res?.entity?.paymentMethodType.length > 0 ? (res?.entity?.paymentMethodType[0])?.toUpperCase() : '',
                        "orderId": '',
                        "refundDescription": "",
                        "refundId": "",
                        "refundAmount": "",
                        "refundDate": "",
                        "refundBank": "",
                      }
                      paymentList.push(data)

                    })
                    this.salesService.createTransaction(paymentList).subscribe(
                      (response: any) => {
                        if (response) {
                          console.log(response);
                          let payments = [{
                            "paymentType": paymentList[0].paymentType,
                            "unitAccountNumber": paymentList[0].unitAccountNumber,
                            "paymentId": paymentList[0].paymentId,
                            "code": "777",
                            "amount": paymentList[0].cost,
                            "modeOfPayment": paymentList[0].paymentMethod,
                            "bankName": paymentList[0].bankName,
                            "orderId": paymentList[0].orderId,
                            "applicationId": this.applicationId,
                            "dateOfPayment": formattedDate,
                            "refundDescription": "",
                            "refundId": "",
                            "refundAmount": "",
                            "refundDate": "",
                            "refundBank": "",
                          }]
                          this.salesService.createPayment(payments).subscribe(res => {
                            if (res) {


                              const myPromise = new Promise(async (resolve, reject) => {
                                // await this.demandUpdateDetails(data[0].paymentType, data[0].cost, "No");

                                if (this.projectStatus == 'Self Finance') {
                                  this.updateSFSlistInterestAndAmount();
                                } else {
                                  this.demandUpdateDetails(data[0].paymentType, data[0].cost, "No");

                                }
                                this.toast.showToast('success', 'Payment Successfull', '');

                                setTimeout(() => {
                                  console.log('nextstep_____2');

                                  this.nextStep();
                                }, 1000);
                                setTimeout(() => {
                                  console.log('nextstep_____2');

                                  this.nextStep();
                                }, 2000);

                                setTimeout(() => {
                                  console.log('nextstep_____2');

                                  this.nextStep();


                                }, 2500);

                              })
                              myPromise.then((value: any) => {

                              })




                            }
                          })
                        }
                      },
                      (error: any) => {
                        console.error(error);
                        this.toast.showToast('error', 'Payment Failed', '');
                      }
                    );

                  }

                } else {
                  data = [{
                    "paymentType": this.bookingDetail[0].paymentType,
                    // "paymentMode": res.entity.paymentType,
                    "cost": this.bookingDetail[0].amount,
                    "paymentDateAndTime": formattedDate,
                    "description": res.entity.description,
                    "schemeDataId": this.schemeId,
                    "unitDataId": this.unitId,
                    "applicationId": this.applicationId,
                    "unitAccountNumber": this.bookingDetail[0].unitAccountNumber,
                    "paymentId": res.entity.gid,
                    "bankName": this.bank,
                    "reference": res?.entity?.paymentSession?.gid,
                    "paymentMethod": res?.entity?.paymentMethodType.length > 0 ? (res?.entity?.paymentMethodType[0])?.toUpperCase() : '',
                    "orderId": '',
                    "refundDescription": "",
                    "refundId": "",
                    "refundAmount": "",
                    "refundDate": "",
                    "refundBank": "",
                  },
                  {
                    "paymentType": this.bookingDetail[1].paymentType,
                    // "paymentMode": res.entity.paymentType,
                    "cost": this.bookingDetail[1].amount,
                    "paymentDateAndTime": formattedDate,
                    "description": res.entity.description,
                    "schemeDataId": this.schemeId,
                    "unitDataId": this.unitId,
                    "applicationId": this.applicationId,
                    "unitAccountNumber": this.bookingDetail[1].unitAccountNumber,
                    "paymentId": res.entity.gid,
                    "bankName": this.bank,
                    "reference": res?.entity?.paymentSession?.gid,
                    "paymentMethod": res?.entity?.paymentMethodType.length > 0 ? (res?.entity?.paymentMethodType[0])?.toUpperCase() : '',
                    "orderId": '',
                    "refundDescription": "",
                    "refundId": "",
                    "refundAmount": "",
                    "refundDate": "",
                    "refundBank": "",
                  },
                  {
                    "paymentType": this.bookingDetail[2].paymentType,
                    // "paymentMode": res.entity.paymentType,
                    "cost": this.bookingDetail[2].amount,
                    "paymentDateAndTime": formattedDate,
                    "description": res.entity.description,
                    "schemeDataId": this.schemeId,
                    "unitDataId": this.unitId,
                    "applicationId": this.applicationId,
                    "unitAccountNumber": this.bookingDetail[2].unitAccountNumber,
                    "paymentId": res.entity.gid,
                    "bankName": this.bank,
                    "reference": res?.entity?.paymentSession?.gid,
                    "paymentMethod": res?.entity?.paymentMethodType.length > 0 ? (res?.entity?.paymentMethodType[0])?.toUpperCase() : '',
                    "orderId": '',
                    "refundDescription": "",
                    "refundId": "",
                    "refundAmount": "",
                    "refundDate": "",
                    "refundBank": "",
                  }


                  ]

                  this.salesService.createTransaction(data).subscribe(
                    (response: any) => {
                      if (response) {
                        console.log(response);
                        let payments = [{
                          "paymentType": data[0].paymentType,
                          "unitAccountNumber": data[0].unitAccountNumber,
                          "paymentId": data[0].paymentId,
                          "code": "777",
                          "amount": data[0].cost,
                          "modeOfPayment": data[0].paymentMethod,
                          "bankName": data[0].bankName,
                          "orderId": data[0].orderId,
                          "applicationId": this.applicationId,
                          "dateOfPayment": formattedDate,
                          "refundDescription": "",
                          "refundId": "",
                          "refundAmount": "",
                          "refundDate": "",
                          "refundBank": "",
                        },
                        {
                          "paymentType": data[1].paymentType,
                          "unitAccountNumber": data[1].unitAccountNumber,
                          "paymentId": data[1].paymentId,
                          "code": "777",
                          "amount": data[1].cost,
                          "modeOfPayment": data[1].paymentMethod,
                          "bankName": data[1].bankName,
                          "orderId": data[1].orderId,
                          "applicationId": this.applicationId,
                          "dateOfPayment": formattedDate,
                          "refundDescription": "",
                          "refundId": "",
                          "refundAmount": "",
                          "refundDate": "",
                          "refundBank": "",
                        },
                        {
                          "paymentType": data[2].paymentType,

                          "unitAccountNumber": data[2].unitAccountNumber,
                          "paymentId": data[2].paymentId,
                          "code": "777",
                          "amount": data[2].cost,
                          "modeOfPayment": data[2].paymentMethod,
                          "bankName": data[2].bankName,
                          "orderId": data[2].orderId,
                          "applicationId": this.applicationId,
                          "dateOfPayment": formattedDate,
                          "refundDescription": "",
                          "refundId": "",
                          "refundAmount": "",
                          "refundDate": "",
                          "refundBank": "",
                        }

                        ]

                        this.salesService.createPayment(payments).subscribe(res => {
                          if (res) {
                            this.salesService.allotePermitStatusChange(this.applicationId).subscribe(res => {
                              if (res) {
                                const myPromise = new Promise(async (resolve, reject) => {
                                  // await this.updateUnitBooking();
                                  // await this.demandUpdateDetails("Unit Cost", data[0].cost, "Yes")

                                  if (this.projectStatus != 'Self Finance') {
                                    await this.demandUpdateDetails("Unit Cost", data[0].cost, "Yes");

                                  }
                                  if (this.projectStatus == 'Self Finance') {
                                    await this.updateSfsInitialDeposit(data[0].cost);


                                  }
                                  setTimeout(() => {
                                    console.log('nextstep_____2');

                                    this.nextStep();
                                  }, 1000);
                                  setTimeout(() => {
                                    console.log('nextstep_____2');

                                    this.nextStep();
                                  }, 2000);

                                  setTimeout(() => {
                                    console.log('nextstep_____2');

                                    this.nextStep();

                                  }, 2500);
                                  this.toast.showToast('success', 'Payment Successfull', '');

                                })
                                myPromise.then((value: any) => {


                                })






                              }
                            })

                          }
                        })
                        // this.toast.showToast('success', 'Payment Successfull', '');
                      }

                      // this.getAllPaymentsByApplicationId();
                    },
                    (error: any) => {
                      console.error(error);
                      this.toast.showToast('error', 'Payment Failed', '');
                    }
                  );



                }

              }
            })
          }
        }


        if (this.bank == this.banks.UnionBank) {
          this.route.queryParams.subscribe(async params => {
            let txn = params['txn'];
            debugger

            console.log('txn', txn);
            let getSecureHashData: any = sessionStorage.getItem('unionBankSecureHash');
            let secureHashData = JSON.parse(getSecureHashData);
            let makeSecureHash = secureHashData.merchantId + secureHashData.merchantTxnNo + secureHashData.merchantTxnNo + secureHashData.transactionType
            await this.paymentService.UBIHashcode(secureHashData).subscribe(async (response: any) => {

              if (response) {
                makeSecureHash.secureHash = response.secureHash;
                this.paymentService.unionBankStatusCheck(makeSecureHash).subscribe((res: any) => {

                  if (res && res.txnRespDescription == 'Transaction successful') {
                    this.paymentService.getUnionBankDataById(txn).subscribe((unionres: any) => {
                      if (unionres) {
                        let data: any = [];

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
                        if (this.isInititalDeposit == 'false') {
                          if (this.projectStatus != 'Self Finance') {
                            let payments = {
                              "paymentType": this.paymentType,
                              "unitAccountNumber": this.unitData.unitAccountNumber,
                              "paymentId": unionres.paymentId,
                              "code": "777",
                              "amount": unionres.cost,
                              "modeOfPayment": unionres.paymentMethod,
                              "bankName": this.bank,
                              "orderId": unionres.orderId,
                              "applicationId": this.applicationId,
                              "dateOfPayment": formattedDate,
                              "refundDescription": "",
                              "refundId": "",
                              "refundAmount": "",
                              "refundDate": "",
                              "refundBank": "",
                            }
                            this.salesService.createPayment(payments).subscribe(res => {
                              if (res) {
                                const myPromise = new Promise(async (resolve, reject) => {
                                  // this.demandUpdateDetails(this.bookingDetail[0].paymentType, unionres.cost, "No")
                                  if (this.projectStatus == 'Self Finance') {
                                    this.updateSFSlistInterestAndAmount();
                                  } else {
                                    this.demandUpdateDetails(payments.paymentType, payments.amount, "No");

                                  }

                                  this.toast.showToast('success', 'Payment Successfull', '');

                                  setTimeout(() => {
                                    console.log('nextstep_____2');

                                    this.nextStep();
                                  }, 1000);
                                  setTimeout(() => {
                                    console.log('nextstep_____2');

                                    this.nextStep();
                                  }, 2000);

                                  setTimeout(() => {
                                    console.log('nextstep_____2');

                                    this.nextStep();

                                  }, 2500);


                                })
                                myPromise.then((value: any) => {


                                })




                              }
                            }),
                              (error: any) => {
                                console.error(error);
                                this.toast.showToast('error', 'Payment Failed', '');
                              }

                          } else {
                            let paymentList: any = [];
                            this.sfsList.forEach((element: any) => {
                              let payments = {
                                "paymentType": this.paymentType,
                                "unitAccountNumber": this.unitData.unitAccountNumber,
                                "paymentId": unionres.paymentId,
                                "code": "777",
                                "amount": element.partPayment ? (element.isPartInterestCollected + element.isPartCollected) : element.totalDueAmount,
                                "modeOfPayment": unionres.paymentMethod,
                                "bankName": this.bank,
                                "orderId": unionres.orderId,
                                "applicationId": this.applicationId,
                                "dateOfPayment": formattedDate,
                                "refundDescription": "",
                                "refundId": "",
                                "refundAmount": "",
                                "refundDate": "",
                                "refundBank": "",
                              }
                              paymentList.push(payments)
                            })

                            this.salesService.createPayment(paymentList).subscribe(res => {
                              if (res) {
                                const myPromise = new Promise(async (resolve, reject) => {
                                  // this.demandUpdateDetails(this.bookingDetail[0].paymentType, unionres.cost, "No")
                                  if (this.projectStatus == 'Self Finance') {
                                    this.updateSFSlistInterestAndAmount();
                                  } else {
                                    this.demandUpdateDetails(paymentList.paymentType, paymentList.amount, "No");

                                  }

                                  this.toast.showToast('success', 'Payment Successfull', '');

                                  setTimeout(() => {
                                    console.log('nextstep_____2');

                                    this.nextStep();
                                  }, 1000);
                                  setTimeout(() => {
                                    console.log('nextstep_____2');

                                    this.nextStep();
                                  }, 2000);

                                  setTimeout(() => {
                                    console.log('nextstep_____2');

                                    this.nextStep();

                                  }, 2500);


                                })
                                myPromise.then((value: any) => {


                                })




                              }
                            }),
                              (error: any) => {
                                console.error(error);
                                this.toast.showToast('error', 'Payment Failed', '');
                              }
                          }

                        } else {


                          let payments = [{
                            "paymentType": this.bookingDetail[0].paymentType,
                            "unitAccountNumber": this.bookingDetail[0].unitAccountNumber,
                            "paymentId": unionres.paymentId,
                            "code": "777",
                            "amount": this.bookingDetail[0].cost,
                            "modeOfPayment": unionres.paymentMethod,
                            "bankName": unionres.bankName,
                            "orderId": unionres.orderId,
                            "applicationId": this.applicationId,
                            "dateOfPayment": formattedDate,
                            "refundDescription": "",
                            "refundId": "",
                            "refundAmount": "",
                            "refundDate": "",
                            "refundBank": "",
                          },
                          {
                            "paymentType": this.bookingDetail[1].paymentType,
                            "unitAccountNumber": this.bookingDetail[1].unitAccountNumber,
                            "paymentId": unionres.paymentId,
                            "code": "777",
                            "amount": this.bookingDetail[1].cost,
                            "modeOfPayment": unionres.paymentMethod,
                            "bankName": unionres.bankName,
                            "orderId": unionres.orderId,
                            "applicationId": this.applicationId,
                            "dateOfPayment": formattedDate,
                            "refundDescription": "",
                            "refundId": "",
                            "refundAmount": "",
                            "refundDate": "",
                            "refundBank": "",
                          },
                          {
                            "paymentType": this.bookingDetail[2].paymentType,

                            "unitAccountNumber": this.bookingDetail[2].unitAccountNumber,
                            "paymentId": unionres.paymentId,
                            "code": "777",
                            "amount": this.bookingDetail[2].cost,
                            "modeOfPayment": unionres.paymentMethod,
                            "bankName": unionres.bankName,
                            "orderId": unionres.orderId,
                            "applicationId": this.applicationId,
                            "dateOfPayment": formattedDate,
                            "refundDescription": "",
                            "refundId": "",
                            "refundAmount": "",
                            "refundDate": "",
                            "refundBank": "",
                          }

                          ]

                          this.salesService.createPayment(payments).subscribe(res => {
                            if (res) {
                              this.salesService.allotePermitStatusChange(this.applicationId).subscribe(res => {
                                if (res) {
                                  const myPromise = new Promise(async (resolve, reject) => {
                                    // await this.updateUnitBooking();
                                    await this.demandUpdateDetails("Unit Cost", this.bookingDetail[0].cost, "Yes")

                                    setTimeout(() => {
                                      console.log('nextstep_____2');

                                      this.nextStep();
                                    }, 1000);
                                    setTimeout(() => {
                                      console.log('nextstep_____2');

                                      this.nextStep();
                                    }, 2000);

                                    setTimeout(() => {
                                      console.log('nextstep_____2');

                                      this.nextStep();


                                    }, 2500);
                                    this.toast.showToast('success', 'Payment Successfull', '');

                                  })
                                  myPromise.then((value: any) => {

                                  })






                                }
                              })

                            }
                          }),
                            (error: any) => {
                              console.error(error);
                              this.toast.showToast('error', 'Payment Failed', '');
                            }




                        }
                      }
                    })
                  }

                })


              }
            })




          })
        }


      }
    })



    // else if (this.bank == 'Axis Bank') {
    //   this.amount = sessionStorage.getItem('amount');
    // } else if (this.bank == 'HDFC Bank') {
    //   this.amount = sessionStorage.getItem('amount');

    // } else if (this.bank == 'INDUSIND Bank') {
    //   this.amount = sessionStorage.getItem('amount');

    // }
    // else if (this.bank == 'Canara Bank') {
    //   this.amount = sessionStorage.getItem('amount');

    // } else {
    //   this.toast.showToast('error', "please select the bank and amount", "");
    //   this.router.navigateByUrl('customer/application-history')
    // }


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

  startTimerLogout() {
    this.logoutinterval = setInterval(() => {
      if (this.logoutseconds === 0) {
        if (this.logoutminutes === 0) {
          clearInterval(this.logoutinterval);
          // this.router.navigate(['']);
          this.logout()
        } else {
          this.logoutminutes--;
          this.logoutseconds = 59;
        }
      } else {
        this.logoutseconds--;
      }
    }, 1000);
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
        this.toast.showToast('warning', "Session Expired Logout Successfully.", "")

      }
    })
    //   }
    // })

  }


  ngAfterViewInit() {

  }

  //indianbank

  formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    this.todaysDate = `${day}-${month}-${year}`
    console.log(this.todaysDate);
  }

  getByTransID() {
    this.paymentService.getApiByTransID(this.tranId).subscribe(
      (response: any) => {


        if (response.description === "success") {
          this.indianBankResponse = response;
          console.log(response);
          this.merchantID = response.unitAccountNumber;
          this.referenceID = response.reference;
          console.log(this.merchantID, '---merchantID');

          this.oRequestEncrypted(this.referenceID);
        } else {
          this.router.navigateByUrl('customer/payment-failed')
        }

      },
      (error) => {
        console.error(error);
      });

  }

  oRequestEncrypted(transactionReference: string) {

    let iv = '1823779448RNEMLJ'
    let key = '6341474154GUPEPX'
    let payload = {
      "merchant": {
        "identifier": "T1037273"
      },
      "transaction": {
        "identifier": transactionReference,
        "dateTime": this.todaysDate,
        "requestType": "O",
        "token": "",
        "reference": transactionReference
      }
    }
    this.paymentService.oRequestIndianBankPaymentGateWay(payload, iv, key).subscribe(
      (response) => {
        console.log(response);
        this.decryptedORequest(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  decryptedORequest(payload: any) {
    let iv = '1823779448RNEMLJ';
    let key = '6341474154GUPEPX';
    this.paymentService.oRequestDecryptedIndianBankPaymentGateway(payload, iv, key).subscribe(
      (response) => {
        console.log(response);

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
        //indian bank
        if (this.isInititalDeposit == 'false') {

          let payments = [{
            "paymentType": this.bookingDetail[0].paymentType,
            "unitAccountNumber": this.bookingDetail[0].unitAccountNumber,
            "paymentId": this.indianBankResponse.paymentId,
            "code": "777",
            "amount": this.bookingDetail[0].cost,
            "modeOfPayment": this.indianBankResponse.paymentMethod,
            "bankName": this.bank,
            "orderId": this.indianBankResponse.orderId,
            "applicationId": this.applicationId,
            "dateOfPayment": formattedDate,
            "reference": '',
            "refundDescription": "",
            "refundId": "",
            "refundAmount": "",
            "refundDate": "",
            "refundBank": "",
          },



          ]

          this.salesService.createPayment(payments).subscribe(res => {
            if (res) {

              const myPromise = new Promise(async (resolve, reject) => {
                await this.demandUpdateDetails(this.bookingDetail[0].paymentType, this.bookingDetail[0].cost, "No")

                setTimeout(() => {
                  console.log('nextstep_____1');

                  this.nextStep();
                }, 1000);
                setTimeout(() => {
                  console.log('nextstep_____2');

                  this.nextStep();
                }, 2000);
                setTimeout(() => {
                  console.log('nextstep_____2');

                  this.nextStep();


                }, 2500);


                this.toast.showToast('success', 'Payment Successfull', '');

              })

              myPromise.then((value: any) => {


              })




            }
          })

        } else {


          let payments = [{
            "paymentType": this.bookingDetail[0].paymentType,
            "unitAccountNumber": this.bookingDetail[0].unitAccountNumber,
            "paymentId": this.indianBankResponse.paymentId,
            "code": "777",
            "amount": this.bookingDetail[0].cost,
            "modeOfPayment": this.indianBankResponse.paymentMethod,
            "bankName": this.bank,
            "orderId": this.indianBankResponse.orderId,
            "applicationId": this.applicationId,
            "dateOfPayment": formattedDate,
            "reference": '',
            "refundDescription": "",
            "refundId": "",
            "refundAmount": "",
            "refundDate": "",
            "refundBank": "",
          },
          {
            "paymentType": this.bookingDetail[1].paymentType,
            "unitAccountNumber": this.bookingDetail[1].unitAccountNumber,
            "paymentId": this.indianBankResponse.paymentId,
            "code": "777",
            "amount": this.bookingDetail[1].cost,
            "modeOfPayment": this.indianBankResponse.paymentMethod,
            "bankName": this.bank,
            "orderId": this.indianBankResponse.orderId,
            "applicationId": this.applicationId,
            "dateOfPayment": formattedDate,
            "reference": '',
            "refundDescription": "",
            "refundId": "",
            "refundAmount": "",
            "refundDate": "",
            "refundBank": "",
          },
          {
            "paymentType": this.bookingDetail[2].paymentType,
            "unitAccountNumber": this.bookingDetail[2].unitAccountNumber,
            "paymentId": this.indianBankResponse.paymentId,
            "code": "777",
            "amount": this.bookingDetail[2].cost,
            "modeOfPayment": this.indianBankResponse.paymentMethod,
            "bankName": this.bank,
            "orderId": this.indianBankResponse.orderId,
            "applicationId": this.applicationId,
            "dateOfPayment": formattedDate,
            "reference": '',
            "refundDescription": "",
            "refundId": "",
            "refundAmount": "",
            "refundDate": "",
            "refundBank": "",
          }

          ]



          this.salesService.createPayment(payments).subscribe(res => {
            if (res) {

              const myPromise = new Promise(async (resolve, reject) => {
                this.salesService.allotePermitStatusChange(this.applicationId).subscribe(async res => {
                  if (res) {
                    // await this.updateUnitBooking();
                    await this.demandUpdateDetails("Unit Cost", this.bookingDetail[0].cost, "Yes")

                    this.toast.showToast('success', 'Payment Successfull', '');


                    setTimeout(() => {
                      console.log('nextstep_____2');

                      this.nextStep();
                    }, 1000);
                    setTimeout(() => {
                      console.log('nextstep_____2');

                      this.nextStep();
                    }, 2000);

                    setTimeout(() => {
                      console.log('nextstep_____2');

                      this.nextStep();


                    }, 2500);


                  }
                })
              })

              myPromise.then((value: any) => {



              })


            }
          })
        }




      },
      (error) => {
        console.log(error);
      });
  }

  getSbiTransaction(orderId: any, paymentMethod: any, amount: any) {
    let merchantId = '1000605';
    let queryRequest = `|1000605|${orderId}|${amount}`;
    let aggregatorId = 'SBIEPAY';

    this.paymentService.paymentStatusCheckSBI(merchantId, queryRequest, aggregatorId).subscribe(res => {
      if (res) {
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
        //indian bank
        if (this.isInititalDeposit == 'false') {

          let payments = [{
            "paymentType": this.bookingDetail[0].paymentType,
            "unitAccountNumber": this.bookingDetail[0].unitAccountNumber,
            "paymentId": orderId,
            "code": "777",
            "amount": this.bookingDetail[0].cost,
            "modeOfPayment": paymentMethod,
            "bankName": this.bank,
            "orderId": "1000605",
            "applicationId": this.applicationId,
            "dateOfPayment": formattedDate,
            "reference": '',
            "refundDescription": "",
            "refundId": "",
            "refundAmount": "",
            "refundDate": "",
            "refundBank": "",
          },



          ]

          this.salesService.createPayment(payments).subscribe(res => {
            if (res) {

              const myPromise = new Promise(async (resolve, reject) => {
                await this.demandUpdateDetails(this.bookingDetail[0].paymentType, this.bookingDetail[0].cost, "No")

                setTimeout(() => {
                  console.log('nextstep_____1');

                  this.nextStep();
                }, 1000);
                setTimeout(() => {
                  console.log('nextstep_____2');

                  this.nextStep();
                }, 2000);
                setTimeout(() => {
                  console.log('nextstep_____2');

                  this.nextStep();


                }, 2500);


                this.toast.showToast('success', 'Payment Successfull', '');

              })

              myPromise.then((value: any) => {


              })




            }
          })

        } else {


          let payments = [{
            "paymentType": this.bookingDetail[0].paymentType,
            "unitAccountNumber": this.bookingDetail[0].unitAccountNumber,
            "paymentId": orderId,
            "code": "777",
            "amount": this.bookingDetail[0].cost,
            "modeOfPayment": paymentMethod,
            "bankName": this.bank,
            "orderId": "1000605",
            "applicationId": this.applicationId,
            "dateOfPayment": formattedDate,
            "reference": '',
            "refundDescription": "",
            "refundId": "",
            "refundAmount": "",
            "refundDate": "",
            "refundBank": "",
          },
          {
            "paymentType": this.bookingDetail[1].paymentType,
            "unitAccountNumber": this.bookingDetail[1].unitAccountNumber,
            "paymentId": orderId,
            "code": "777",
            "amount": this.bookingDetail[1].cost,
            "modeOfPayment": paymentMethod,
            "bankName": this.bank,
            "orderId": "1000605",
            "applicationId": this.applicationId,
            "dateOfPayment": formattedDate,
            "reference": '',
            "refundDescription": "",
            "refundId": "",
            "refundAmount": "",
            "refundDate": "",
            "refundBank": "",
          },
          {
            "paymentType": this.bookingDetail[2].paymentType,
            "unitAccountNumber": this.bookingDetail[2].unitAccountNumber,
            "paymentId": orderId,
            "code": "777",
            "amount": this.bookingDetail[2].cost,
            "modeOfPayment": paymentMethod,
            "bankName": this.bank,
            "orderId": "1000605",
            "applicationId": this.applicationId,
            "dateOfPayment": formattedDate,
            "reference": '',
            "refundDescription": "",
            "refundId": "",
            "refundAmount": "",
            "refundDate": "",
            "refundBank": "",
          }

          ]



          this.salesService.createPayment(payments).subscribe(res => {
            if (res) {

              const myPromise = new Promise(async (resolve, reject) => {
                this.salesService.allotePermitStatusChange(this.applicationId).subscribe(async res => {
                  if (res) {
                    // await this.updateUnitBooking();
                    await this.demandUpdateDetails("Unit Cost", this.bookingDetail[0].cost, "Yes")

                    this.toast.showToast('success', 'Payment Successfull', '');


                    setTimeout(() => {
                      console.log('nextstep_____2');

                      this.nextStep();
                    }, 1000);
                    setTimeout(() => {
                      console.log('nextstep_____2');

                      this.nextStep();
                    }, 2000);

                    setTimeout(() => {
                      console.log('nextstep_____2');

                      this.nextStep();


                    }, 2500);


                  }
                })
              })

              myPromise.then((value: any) => {



              })


            }
          })
        }
      }
    })
  }

  demandUpdateDetails(demandType: any, amount: any, iscompleted: any) {
    const getamount = amount ? parseFloat(amount) : 0
    if (demandType == "Unit Cost") {

      let unitData = {
        "id": this.unitId,
        "unitCostPaid": getamount,
        // "unitStatus": iscompleted
        "bookingStatus": "Completed"

      }
      this.propertyService.updateUnitCostDemand(unitData).subscribe(res => {
        if (res) {

        }

      })
    } else if (demandType == "GST") {

      let gstData = {
        "id": this.unitId,
        "gstPaidCost": getamount
      }
      this.propertyService.updateGstPaidCost(gstData).subscribe(res => {
        if (res) {

        }

      })

    } else if (demandType == "Maintenance Charges") {
      let mcDemandData = {
        "id": this.unitId,
        "mcCost": getamount
      }

      this.propertyService.updatemcCostDetails(mcDemandData).subscribe(res => {
        if (res) {

        }

      })
    } else if (demandType == "Difference in cost" || demandType == "DifferentCostDueInterest") {
      let differenceCost = {
        "id": this.unitId,
        "differentCostPaidDetails": getamount
      }

      this.propertyService.updateDifferentCostDetails(differenceCost).subscribe(res => {
        if (res) {

        }

      })

    } else if (demandType == "Car Parking Demand") {
      let carParkingDemand = {
        "id": this.unitId,
        "carParkingPaid": getamount
      }

      this.propertyService.updateCarParkingCostDetails(carParkingDemand).subscribe(res => {
        if (res) {

        }

      })
    } else if (demandType == "Scrunity Fee") {
      let scrunityDemand = {
        "id": this.unitId,
        "paidAmount": getamount
      }

      this.propertyService.updateScrunityFeesCostDetails(scrunityDemand).subscribe(res => {
        if (res) {

        }

      })

    }
  }

  updateSFSlistInterestAndAmount() {
    debugger
    let intererst: any = [];
    let dueAmount: any = [];
    let isPartlyDataInterest: any = '';
    let isPartlyDataAmount: any = '';

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    // let checkDifferenceCost = this.sfsList.filter((x: any) => x.Description == 'DifferentCostDueInterest' || x.Description == 'GST' || x.Description == 'Maintenance Charges' || x.Description == 'Car Parking Demand');
    let checkDifferenceCost = this.sfsList.filter((x: any) => x.Description == 'DifferentCostDueInterest');
    let checkOtherDemans = this.sfsList.filter((x: any) => x.Description == 'GST' || x.Description == 'Maintenance Charges' || x.Description == 'Car Parking Demand' || x.Description == 'Scrunity Fee');

    intererst = this.sfsList.map((x: any) => {
      //check partly half amount
      if (x.partPayment) {
        isPartlyDataInterest = (x.Interest != (x.InterestCollected + x.isPartInterestCollected)) ? x.Description : ''
      }

      return {
        "term": x.Description,
        // "paidAmount": x.interestBalance > 0 ? (x.partPayment ? x.isPartInterestCollected : x.Interest) : 0
        "paidAmount": (x.partPayment ? x.isPartInterestCollected : x.interestBalance)

      }
    })
    dueAmount = this.sfsList.map((x: any) => {
      //check partly half amount
      let dueAmount = parseInt(x.Dueamount) ? parseInt(x.Dueamount) : 0;
      if (x.partPayment) {
        isPartlyDataAmount = (dueAmount != (x.dueCollected + x.isPartCollected)) ? x.Description : ''
      }
      return {
        "dueTerm": x.Description,
        "paidAmount": (x.partPayment ? x.isPartCollected : x.dueBalance)
      }
    })
    let InterestDatas = {
      "id": this.unitId,
      "dueInterest": intererst,
      "dueStatus": isPartlyDataInterest,
      "updatedDate": tomorrow
    }
    //interest



    if (checkOtherDemans.length == 0) {
      this.propertyService.updateInterestSFS(InterestDatas).subscribe(res => {

        if (res) {
          if (checkDifferenceCost.length == 0 && checkOtherDemans.length == 0) {
            let dueAmounts = {
              "id": this.unitId,
              "duePayments": dueAmount,
              "dueStatus": isPartlyDataAmount,
              "updatedDate": tomorrow,
              "bookingStatus": "Completed",
              "firstDueInterest": this.unitData.firstDueInterest,
              "secondDueInterest": this.unitData.secondDueInterest

            }
            //unit amount
            this.propertyService.updateDueAmountSFS(dueAmounts).subscribe(res => {
              if (res) {

              }
            }, error => {
              console.log('error_updateDue amount', error);

            })
          } else {
            // let differenceCost = {
            //   "id": this.unitId,
            //   "differentCostPaidDetails": this.sfsList[0].Dueamount ? parseInt(this.sfsList[0].Dueamount) : 0
            // }

            // this.propertyService.updateDifferentCostDetails(differenceCost).subscribe(res => {
            //   if (res) {

            //   }

            // })
            let amount = this.sfsList[0].partPayment ? this.sfsList[0].isPartCollected : this.sfsList[0].dueBalance;
            this.demandUpdateDetails(this.sfsList[0].Description, amount, "No");

          }



        }
      }, error => {
        console.log('error_interest', error);

      })
    } else {
      let amount = this.sfsList[0].partPayment ? this.sfsList[0].isPartCollected : this.sfsList[0].dueBalance;
      this.demandUpdateDetails(this.sfsList[0].Description, amount, "No");
    }


  }

  updateSfsInitialDeposit(amount: any) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    let dueAmount: any = [];
    let totalAmountInitial = amount ? parseInt(amount) : 0;

    debugger
    let data = [{
      "startDate": this.schemeData.firstDueDate ? this.datePipe.transform(new Date(this.schemeData.firstDueDate), 'dd-MM-yyyy') : '',

      "amount": (totalAmountInitial / 2).toString(),
      // "amount": (x.dueBalance).toString(),
      "due": "firstAmountDue"
    },
    {
      "startDate": this.schemeData.secondDueDate ? this.datePipe.transform(new Date(this.schemeData.secondDueDate), 'dd-MM-yyyy') : '',

      "amount": (totalAmountInitial / 2).toString(),
      // "amount": (x.dueBalance).toString(),
      "due": "secondAmountDue"
    }

    ]
    let interestData = {
      "entries": data
    }
    this.propertyService.findInterestForSfs(interestData).subscribe(res => {


      if (res) {


        let InterestData: any = res;
        let getFirstInterest: any = [];
        let getSecondInterest: any = [];

        getFirstInterest = InterestData.filter((x: any) => x.description == "firstAmountDue");
        getSecondInterest = InterestData.filter((x: any) => x.description == "secondAmountDue");
        dueAmount = [{
          "dueTerm": "firstAmountDue",
          "paidAmount": totalAmountInitial / 2,
        },
        {
          "dueTerm": "secondAmountDue",
          "paidAmount": totalAmountInitial / 2,


        }]
        let dueAmounts = {
          "id": this.unitId,
          "duePayments": dueAmount,
          "dueStatus": "secondAmountDue",
          "updatedDate": tomorrow,
          "bookingStatus": "Completed",
          "firstDueInterest": getFirstInterest.length > 0 ? getFirstInterest[0].amount : 0,
          "secondDueInterest": getSecondInterest.length > 0 ? getSecondInterest[0].amount : 0
        }



        this.propertyService.updateDueAmountSFS(dueAmounts).subscribe(res => {
          if (res) {

          }
        }, error => {
          console.log('error', error);

        })
      }

    })





  }
  nextStep() {
    this.currentStep++;
    if (this.currentStep > this.numSteps) {
      this.currentStep = 3;
    }
    var stepper: any = document.getElementById("stepper1");
    var steps = stepper.getElementsByClassName("step");

    Array.from(steps).forEach((step, index) => {
      let stepNum = index + 1;
      if (stepNum === this.currentStep) {
        this.addClass(step, "editing");
      } else {
        this.removeClass(step, "editing");
      }
      if (stepNum < this.currentStep) {
        this.addClass(step, "done");
      } else {
        this.removeClass(step, "done");
      }
    });
  }
  hasClass(elem: any, className: any) {
    return new RegExp(" " + className + " ").test(" " + elem.className + " ");
  }

  addClass(elem: any, className: any) {
    if (!this.hasClass(elem, className)) {
      elem.className += " " + className;
    }
  }

  removeClass(elem: any, className: any) {
    var newClass = " " + elem.className.replace(/[\t\r\n]/g, " ") + " ";
    if (this.hasClass(elem, className)) {
      while (newClass.indexOf(" " + className + " ") >= 0) {
        newClass = newClass.replace(" " + className + " ", " ");
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, "");
    }
  }

  updateUnitBooking() {

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

    let data = {
      "id": this.unitId,
      "bookingStatus": "Completed",
      "bookingTime": formattedDate
    }
    this.salesService.updateBookingStatus(data).subscribe(res => {
      if (res) {

      }
    })
  }

  viewApplication() {
    debugger
    this.router.navigate(['/customer/view-application'], { queryParams: { applicationId: this.applicationId } });

  }

  ngOnDestroy() {
    console.log("destroying child...")
    sessionStorage.removeItem('amount');
    sessionStorage.removeItem('state');
    sessionStorage.removeItem('bank');
    sessionStorage.removeItem('schemeId');
    sessionStorage.removeItem('unitId');

    clearInterval(this.logoutinterval)


  }


  removeMinutesAndSeconds() {
    sessionStorage.removeItem('minutes');
    sessionStorage.removeItem('seconds');
  }
}
