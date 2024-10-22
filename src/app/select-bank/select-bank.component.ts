import { Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PaymentService } from '../services/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PropertyService } from '../services/property.service';
import { environment } from '../../environments/environment';
import { SalesService } from '../services/sales.service';
import { ToastService } from '../services/toast.service';
import { Banks } from '../bank_enum';
import * as _ from 'lodash';
import { DatePipe, Location, PlatformLocation } from '@angular/common';

declare var Razorpay: any;

@Component({
  selector: 'app-select-bank',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './select-bank.component.html',
  styleUrl: './select-bank.component.scss'
})

export class SelectBankComponent implements OnInit {
  selectBank: any = '';
  paymentMethod: any = '';
  userName: any = '';
  emailId: any = '';
  customerDetails: any;
  loader: boolean = false;
  amount: any = 0;

  // loader: boolean = true;
  applicationId: any = '';
  bookingId: any = '';

  applicationDetails: any = '';
  unitData: any = '';
  schemeData: any = '';
  customerData: any = '';


  //axisbank
  orderID: any = '';
  currentStep = 1;
  numSteps = 3;


  bank: any = '';
  schemeId: any;
  unitId: any = '';
  bookingDetail: any = '';
  paymentType: any;
  merchantTxnNo: any;
  secureHash: any;
  today: any;
  todaysDate: any;
  encryptedResponse: any;
  banks = Banks;
  minutes = 30;
  seconds = 0;
  interval: any;
  unitAccountNo: any;
  isInititalDeposit = 'false';
  Single_Paramresponse: any = '';
  merchantID: any = ''
  projectStatus: any = '';
  sfsList: any = [];
  @ViewChild('redirectForm', { static: false }) redirectForm!: ElementRef;

  constructor(private paymentService: PaymentService,
    private router: Router,
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private zone: NgZone,
    private http: HttpClient,
    private salesService: SalesService,
    private toast: ToastService, private location: Location,
    private datePipe: DatePipe,
  ) {
    this.projectStatus = localStorage.getItem('projectStatus');
    // this.location.subscribe((event) => {
    //   if (event.pop) {
    //     // Redirect to home page
    //     this.router.navigate(['/customer/home']);
    //     this.removeMinutesAndSeconds();

    //   }
    // });


    // this.location.replaceState('/customer/home'); // Replace current history with home page

    // // Listen to PopStateEvent (browser back button press)
    // window.onpopstate = () => {
    //   this.router.navigate(['/customer/home']);
    // };



  }
  ngOnInit() {
    debugger
    let minutes = sessionStorage.getItem('minutes');
    let seconds = sessionStorage.getItem('seconds')
    this.minutes = minutes ? parseInt(minutes) : 0;
    this.seconds = seconds ? parseInt(seconds) : 0;
    this.today = this.formatDate(new Date());

    this.getFormattedDate();
    this.route.queryParams.subscribe(params => {
      // this.applicationId = params['applicationId'];
      this.unitAccountNo = params['bookingId'];
      sessionStorage.setItem('unitAccountNo', this.unitAccountNo);
      this.salesService.getBookingDetails(this.unitAccountNo).subscribe(res => {
        if (res) {
          this.bookingDetail = res.responseObject;

          let checkBookingDetails = this.bookingDetail.filter((x: any) => x.paymentType == 'Initial Deposit' || x.paymentType == 'Application Fee' || x.paymentType == 'Registration Fee');
          if (checkBookingDetails && checkBookingDetails.length > 0) {
            this.paymentType = "Initial Deposit"
            this.applicationId = this.bookingDetail[0].applicationId;
            this.isInititalDeposit = 'true';
            this.startTimer();

            // let amount = _.sumBy(this.bookingDetail, "amount");

            let amount = this.bookingDetail
              .map((value: any) => parseInt(value.amount, 10)) // Step 1: Convert string to number
              .reduce((acc: any, current: any) => acc + current, 0);
            this.amount = amount;

          } else {

            if (this.projectStatus != 'Self Finance') {


              this.isInititalDeposit = 'false';

              this.paymentType = this.bookingDetail[0].paymentType;
              this.amount = this.bookingDetail[0].amount ? parseInt(this.bookingDetail[0].amount) : 0;
              this.applicationId = this.bookingDetail[0].applicationId;
            } else {

              this.isInititalDeposit = 'false';
              let SfsList: any = sessionStorage.getItem('sfsList');
              let getSfsList = JSON.parse(SfsList);
              let checkIsDuePayment = getSfsList.filter((x: any) => x.Description == 'DifferentCostDueInterest' || x.Description == 'GST' || x.Description == 'Maintenance Charges' || x.Description == 'Car Parking Demand' || x.Description == 'Scrunity Fee');
              if (checkIsDuePayment.length > 0) {
                this.paymentType = checkIsDuePayment[0].Description
              } else {
                this.paymentType = "Due Amount"
              }

              this.sfsList = getSfsList;
              let amount = getSfsList
                .map((value: any) => value.partPayment ? (value.isPartInterestCollected + value.isPartCollected) : value.totalDueAmount) // Step 1: Convert string to number
                .reduce((acc: any, current: any) => acc + current, 0);
              this.amount = amount;
              this.applicationId = getSfsList[0].applicationId;
            }
          }
          // this.paymentType = res.paymentType;
          // this.amount = res.amount ? parseInt(res.amount) : 0;
          // this.applicationId = res.applicationId;
          // this.schemeId = res.schemeId;
          // this.unitId = res.unitId;
          // this.propertyService.getApplicationById(res.applicationId).subscribe(
          this.propertyService.getApplicationById(this.applicationId).subscribe(

            (response: any) => {
              console.log(response);
              this.applicationDetails = response;
              this.customerData = response.customer;
              this.schemeData = response.schemeData;
              this.unitData = response.unitData;
              this.schemeId = this.schemeData.id;
              this.unitId = this.unitData.id;

            },
            (error: any) => {
            }
          );

        }
      })

    });



    // this.applicationId = sessionStorage.getItem('applicationId');

    debugger


  }

  // @HostListener('window:load', ['$event'])
  // onLoad(event: Event) {
  //   this.router.navigate(['/customer/home']);
  // }


  removeMinutesAndSeconds() {
    sessionStorage.removeItem('minutes');
    sessionStorage.removeItem('seconds');
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          clearInterval(this.interval);
          this.router.navigate(['/customer/home']);
        } else {
          this.minutes--;
          this.seconds = 59;
        }
      } else {
        this.seconds--;
      }
    }, 1000);
  }

  async selectedBank(event: any) {
    debugger
    let bank: any = event.value;
    sessionStorage.setItem('bank', bank);
    if (bank == this.banks.ICICIBank) {
      let data = {

        "name": this.customerData.firstname,
        "email": this.customerData.email,
        // "phoneNumber": "9014556652"
      }

      this.paymentService.createCustomer(data).subscribe((res: any) => {
        if (res) {
          this.customerDetails = res.entity;

          this.userName = res.entity.name;
          this.emailId = res.entity.email;

        }
      })
    }
    else if (bank == this.banks.AxisBank) {

      let data = {
        'amount': this.amount * 100,
        "unitAcccountNumber": this.unitAccountNo
      }
      this.paymentService.AXIScreateOrder(data).subscribe((res: any) => {
        if (res) {
          this.orderID = res.id;
        }
      })
    } else if (bank == this.banks.HDFCBank) {
      let data = {
        'amount': this.amount * 100,
        "unitAcccountNumber": this.unitAccountNo
      }
      debugger
      this.paymentService.hdfcCreateOrder(data).subscribe((res: any) => {
        if (res) {
          this.orderID = res.id;
        }
      })
    } else if (bank == this.banks.INDUSINDBank) {
      // this.paymentService.initiatePayment('https://test.payu.in/_payment').subscribe(res => {
      //   if (res) {
      //     console.log('res', res);

      //   }

      // })
      let data = {
        'amount': this.amount * 100,
        "unitAcccountNumber": this.unitAccountNo
      }
      debugger
      this.paymentService.indusIndCreateOrder(data).subscribe((res: any) => {
        if (res) {
          this.orderID = res.id;
        }
      })

      // this.paymentService.initiatePayment('https://test.payu.in/_payment').subscribe(res => {
      //   if (res) {
      //     console.log('res', res);

      //   }

      // })
    } else if (bank == this.banks.CanaraBank) {
      let data = {
        'amount': this.amount * 100,
        "unitAcccountNumber": this.unitAccountNo
      }
      debugger
      this.paymentService.canaraBankCreateOrder(data).subscribe((res: any) => {
        if (res) {
          this.orderID = res.id;
        }
      })
    } else if (bank == this.banks.UnionBank) {
      await this.paymentService.UBIPaymentgateway().subscribe(async (response: any) => {
        console.log('response:', response);

        if (response) {
          this.merchantTxnNo = response.merchantTxnNo;
          console.log('Merchant Transaction No:', this.merchantTxnNo);

          let data = {
            merchantId: 'T_00773',
            merchantTxnNo: this.merchantTxnNo,
            amount: this.amount,
            currencyCode: '356',
            payType: '0',
            customerEmailID: this.customerData.email,
            transactionType: 'SALE',
            // returnURL: 'http://localhost:8085/api/ubi/getSuccessorYes',
            returnURL: 'https://propertyapi.tnhb.in/api/ubi/getSuccessorYes',


            txnDate: this.getFormattedDate(),
            secureHash: '',
          };

          let getData = data.amount +
            data.currencyCode +
            data.customerEmailID +
            data.merchantId +
            data.merchantTxnNo +
            data.payType +
            data.returnURL +
            data.transactionType +
            data.txnDate;
          let hashText = getData;
          console.log('hash text', hashText);

          let secureHash = {
            'merchantId': data.merchantId,
            'merchantTxnNo': data.merchantTxnNo,
            'transactionType': data.transactionType
          }
          sessionStorage.setItem('unionBankSecureHash', JSON.stringify(secureHash));
          await this.paymentService.UBIHashcode(hashText).subscribe(async (response: any) => {
            console.log('Response for hashcode:', response);

            if (response) {
              this.secureHash = response.secureHash;

              data.secureHash = this.secureHash;

              console.log('Updated data with secureHash:', data);
            } else {
              console.error(
                'secureHash not found in the response:',
                response
              );
            }

            console.log('data:::', data);
            await this.paymentService.dataStore(data).subscribe((response: any) => {
              console.log('response:++++++++++++', response);
              if (response) {
                let url =
                  response.redirectURI + '?tranCtx=' + response.tranCtx;
                console.log('url:::::::::::::::::::::::::::::::::::::::::::::::::', url);

                window.open(url, '_self');
              }
            });
          });
        }
      });
    } else if (bank == this.banks.IndianBank) {
      this.paymentService.createOrderIdIndianBank().subscribe((res: any) => {
        if (res) {
          this.orderID = res;
          this.t_RequestPaymentGateway(this.orderID);


        }
      })
    } else if (bank == this.banks.SBIBank) {
      debugger
      // let sbiBank = {
      //   "data": `1000605|DOM|IN|INR|1|Other|https://test.sbiepay.sbi/secure/sucess3.jsp|https://test.sbiepay.sbi/secure/fail3.jsp|SBIEPAY|HFmpj|HFmpj|NB|ONLINE|ONLINE`,
      //   "key": "pWhMnIEMc4q6hKdi2Fx50Ii8CKAoSIqv9ScSpwuMHM4="
      // }


      this.paymentService.getSBIGenearteId().subscribe((res: any) => {
        if (res) {
          this.orderID = 'TXN' + res;
        }
      })
    }
  }

  paymentModeSelected(event: any) {
    debugger
    let paymentMethod = event.value;
    // this.loader = true;
    if (this.selectBank == this.banks.ICICIBank) {

      // let amount = 1000 * 100;
      let amount = 100;
      let redirectPayment = '';
      let redirectUrl = environment.apiURL + "/customer/paymentSuccess";
      let serverCallBackUrl = environment.apiURL + '/api/customer/getSuccessorPending';
      let data = {
        "amount": this.amount * 100, // Amount in Paise
        // "redirectUri": "http://www.example.com", // Where to redirect user
        "redirectUri": "http://localhost:4200/customer/paymentSuccess", // Where to redirect user
        // "redirectUri": `https://property.tnhb.in/customer/paymentSuccess`,
        // once payment is done (HTTP GET)
        // "redirectUri": redirectUrl, // Where to redirect user

        "description": "Sample Payment Link",
        "currencyCode": "INR",

        "paymentMethodType": [
          paymentMethod
        ],
        // "paymentMethodType": [
        //   "CARD",
        //   "NET_BANKING",
        //   "UPI",
        //   "CHALLAN"
        // ], // Can support one or payment types such as CARD, UPI, NET_BANKING
        // and CHALLAN
        "customer": {
          "email": this.customerData.email,
          "name": this.customerData.firstname,
          // "phoneNumber": "+919554875422"
          "phoneNumber": "+91" + this.customerData.contactNumber

        },

        // "serverCallbackUrl": serverCallBackUrl,

        "meta": {
          "unitAccountNo": this.bookingDetail.unitAcccountNumber
        },

        // "applicationFee": 200, // optional application fee Cents
        // "serverCallbackUrl":
        //   "https://74e5-183-82-206-194.ngrok.io/paymentWebhook",
        // "serverCallbackUrl": 'https://webhook.site/6e48dcf0-489c-4d2c-bd30-6e441dc833c4',
        "serverCallbackUrl": 'https://propertyapi.tnhb.in/api/customer/getSuccessorPending',

        // "http://localhost:8086/api/customer/getSuccessorPending/ " + `${redirectPayment}`,
        // "http://localhost:8086/api/customer/getSuccessorPending/",
        // `http://localhost:8086/api/customer/getSuccessorPending`,
        // `https://propertyapi.tnhb.in/api/customer/getSuccessorPending`,


        // this.getSuccessorPending(),


        // POST Callback
        // url with encrypted response


      }


      this.paymentService.paymentLink(data).subscribe((res: any) => {
        if (res && res.status == 'SUCCESS') {

          // this.router.navigateByUrl('customer/paymentSuccess')
          console.log('success______________________');
          let paymentRedirectUrl = res.entity.link;
          sessionStorage.setItem('gid', res.entity.gid)
          this.paymentService.gid = res.entity.gid;
          window.open(paymentRedirectUrl, "_self");
          debugger



        }
      })
    } else if (this.selectBank == this.banks.SBIBank) {
      // this.amount = 1000;
      let sbiBank = {


        // "data": `1000605|DOM|IN|INR|${this.amount}|Other|https://property.tnhb.in/customer/paymentSuccess|https://property.tnhb.in/customer/payment-failed|SBIEPAY|${this.orderID}|${this.orderID}|${paymentMethod}|ONLINE|ONLINE`,
        // "data": `1000605|DOM|IN|INR|${this.amount}|Other|https://property.tnhb.in/customer/paymentSuccess|https://property.tnhb.in/customer/payment-failed|SBIEPAY|TXN${this.orderID}|2|${paymentMethod}|ONLINE|ONLINE`,
        // "data": `1000605|DOM|IN|INR|${this.amount}|Other|https://property.tnhb.in/customer/paymentSuccess|https://property.tnhb.in/customer/payment-failed|SBIEPAY|${this.orderID}|2|${paymentMethod}|ONLINE|ONLINE`,
        // "data": `1000605|DOM|IN|INR|${this.amount}|Other|http://localhost:8085/api/sbi/successPage|https://property.tnhb.in/customer/payment-failed|SBIEPAY|${this.orderID}|2|${paymentMethod}|ONLINE|ONLINE`,
        "data": `1000605|DOM|IN|INR|${this.amount}|Other|https://propertyapi.tnhb.in/api/sbi/successPage|https://property.tnhb.in/customer/payment-failed|SBIEPAY|${this.orderID}|2|${paymentMethod}|ONLINE|ONLINE`,

        "key": "pWhMnIEMc4q6hKdi2Fx50Ii8CKAoSIqv9ScSpwuMHM4="
      }
      debugger
      this.paymentService.paymentInitiateSBI(sbiBank).subscribe((res: any) => {
        if (res) {
          this.Single_Paramresponse = res;
          // this.Single_Paramresponse = "8fZAhpLh/uVLV2p6kbnCyQsSC4PvCyZLvh/3Hms/1HHYRK3V1G14OvllJtz4MlQlE1hKNg/Q0gknj+5OR5hJ1qI/BhKaits4jI+WpCmCma820cV7YunfQOYubzXshgs+PhtK7UZ8tj88Arc4Q+8FAGMD/fc+R3ZH8G0g7X2XlTknrkq6nd8JWuw5H3NuBSHtGKqENkk6kZxWy0VMBTquVPzB+ilWHHJdub1lmPw/uLY="
          this.merchantID = 1000605;
          let merchantID = 1000605;
          let queryRequest = `|1000605|${this.orderID}|${this.amount}`;
          let aggregator = 'SBIEPAY';
          // this.redirectForm.nativeElement.submit();

          const formElement = document.createElement('form');
          formElement.setAttribute('method', 'post');
          formElement.setAttribute('action', 'https://test.sbiepay.sbi/secure/AggregatorHostedListener');

          // Create hidden input fields for encRequest and accessCode
          const encRequestInput = document.createElement('input');
          encRequestInput.setAttribute('type', 'hidden');
          encRequestInput.setAttribute('name', 'EncryptTrans');
          encRequestInput.setAttribute('value', this.Single_Paramresponse);

          const accessCodeInput = document.createElement('input');
          accessCodeInput.setAttribute('type', 'hidden');
          accessCodeInput.setAttribute('name', 'merchIdVal');
          accessCodeInput.setAttribute('value', this.merchantID);

          // Append inputs to the form
          formElement.appendChild(encRequestInput);
          formElement.appendChild(accessCodeInput);

          // Append the form to the body and submit it
          document.body.appendChild(formElement);
          formElement.submit();
          // this.paymentService.paymentStatusCheckSBI(merchantID, queryRequest, aggregator).subscribe((res: any) => {
          //   if (res) {

          //   }
          // })
        }
      })


      debugger





      // / api / sbi / encrypt
    }


  }

  axisBankPayNow() {



    var options = {
      "key": "rzp_test_4wtT06cFrJZ5V2", // Enter the Key ID generated from the Dashboard
      "amount": this.amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "TNHB",
      "description": "Sales And Marketing",
      "image": "https://propertyapi.tnhb.in/var/uploads/property/tnhb/tnhb_logo.jpeg",
      // "order_id": "order_IluGWxBm9U8zJ8", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "order_id": this.orderID, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1

      "handler": (Response: any) => {
        // alert(Response.razorpay_payment_id);
        // alert(Response.razorpay_order_id);
        // alert(Response.razorpay_signature)

        // this.router.navigateByUrl('customer/paymentSuccess');
        this.zone.run(() => {
          debugger
          if (Response.razorpay_payment_id) {

            this.paymentService.getAxisPaymentMethod(Response.razorpay_payment_id).subscribe((res: any) => {
              if (res) {
                // const timestamp = 1723108590;
                // const timestamp = res.created_at;

                // const date = new Date(timestamp * 1000);
                // const getDate = date.toLocaleString().slice(0, 19);
                const getDate = this.convertTimestampToISO(res.created_at);
                debugger
                let data = [];
                if (this.isInititalDeposit == 'false') {
                  if (this.projectStatus != 'Self Finance') {
                    data = [{

                      "paymentType": this.paymentType,
                      "paymentMethod": res.method,
                      "cost": (res.amount) / 100,
                      "paymentDateAndTime": getDate,
                      "description": res.description,
                      "schemeDataId": this.schemeId,
                      "unitDataId": this.unitId,
                      "applicationId": this.applicationId,
                      "unitAccountNumber": this.unitData.unitAccountNumber,
                      "paymentId": Response.razorpay_payment_id,
                      "bankName": this.selectBank,
                      "orderId": this.orderID,
                      "reference": '',
                      "refundDescription": "",
                      "refundId": "",
                      "refundAmount": "",
                      "refundDate": "",
                      "refundBank": "",

                    }]
                    this.loader = true;
                    console.log('response _axis', JSON.stringify(Response));

                    this.createPayment(data);
                  } else {
                    let paymentList: any = [];

                    this.sfsList.forEach((element: any) => {
                      let data = {

                        "paymentType": element.Description,
                        "paymentMethod": res.method,
                        "cost": element.partPayment ? (element.isPartInterestCollected + element.isPartCollected) : element.totalDueAmount,
                        "paymentDateAndTime": getDate,
                        "description": res.description,
                        "schemeDataId": this.schemeId,
                        "unitDataId": this.unitId,
                        "applicationId": this.applicationId,
                        "unitAccountNumber": this.unitData.unitAccountNumber,
                        "paymentId": Response.razorpay_payment_id,
                        "bankName": this.selectBank,
                        "orderId": this.orderID,
                        "reference": '',
                        "refundDescription": "",
                        "refundId": "",
                        "refundAmount": "",
                        "refundDate": "",
                        "refundBank": "",

                      }
                      paymentList.push(data)
                    });

                    this.loader = true;
                    console.log('response _axis', JSON.stringify(Response));

                    this.createPayment(paymentList);
                  }

                } else {
                  data = [{
                    "paymentType": this.bookingDetail[0].paymentType,
                    "paymentMethod": res.method,
                    "cost": this.bookingDetail[0].amount,
                    "paymentDateAndTime": getDate,
                    "description": res.description,
                    "schemeDataId": this.schemeId,
                    "unitDataId": this.unitId,
                    "applicationId": this.applicationId,
                    "unitAccountNumber": this.unitData.unitAccountNumber,
                    "paymentId": Response.razorpay_payment_id,
                    "bankName": this.selectBank,
                    "orderId": this.orderID,
                    "reference": '',
                    "refundDescription": "",
                    "refundId": "",
                    "refundAmount": "",
                    "refundDate": "",
                    "refundBank": "",

                  },
                  {
                    "paymentType": this.bookingDetail[1].paymentType,
                    "paymentMethod": res.method,
                    "cost": this.bookingDetail[1].amount,
                    "paymentDateAndTime": getDate,
                    "description": res.description,
                    "schemeDataId": this.schemeId,
                    "unitDataId": this.unitId,
                    "applicationId": this.applicationId,
                    "unitAccountNumber": this.unitData.unitAccountNumber,
                    "paymentId": Response.razorpay_payment_id,
                    "bankName": this.selectBank,
                    "orderId": this.orderID,
                    "reference": '',
                    "refundDescription": "",
                    "refundId": "",
                    "refundAmount": "",
                    "refundDate": "",
                    "refundBank": "",

                  }, {
                    "paymentType": this.bookingDetail[2].paymentType,
                    "paymentMethod": res.method,
                    "cost": this.bookingDetail[2].amount,
                    "paymentDateAndTime": getDate,
                    "description": res.description,
                    "schemeDataId": this.schemeId,
                    "unitDataId": this.unitId,
                    "applicationId": this.applicationId,
                    "unitAccountNumber": this.unitData.unitAccountNumber,
                    "paymentId": Response.razorpay_payment_id,
                    "bankName": this.selectBank,
                    "orderId": this.orderID,
                    "reference": '',
                    "refundDescription": "",
                    "refundId": "",
                    "refundAmount": "",
                    "refundDate": "",
                    "refundBank": "",

                  }]
                  this.createPayment(data);



                }


                // this.router.navigateByUrl('customer/paymentSuccess');
              }
            })

            // let data = {
            //   "paymentType": '',
            //   "paymentMode": res.entity.paymentType,
            //   "cost": (res.entity.amount) / 100,
            //   "paymentDateAndTime": res.entity.createdAt,
            //   "description": res.entity.description,
            //   "schemeDataId": this.schemeId,
            //   "unitDataId": this.unitId,
            //   "applicationId": this.applicationId,
            //   "unitAccountNumber": res.entity.meta.unitAccountNo,
            //   "paymentId": res.entity.gid,
            //   "bankName": this.bank
            // }

            // this.salesService.createPayment(data).subscribe(
            //   (response: any) => {
            //     console.log(response);
            //     this.toast.showToast('success', 'Payment Successfull', '');

            //     this.router.navigateByUrl('customer/paymentSuccess');

            //     // this.getAllPaymentsByApplicationId();
            //   },
            //   (error: any) => {
            //     console.error(error);
            //     this.toast.showToast('error', 'Payment Failed', '');
            //   }
            // );

          }
        })


        // this.router.navigateByUrl('customer/common');

        // this.router.navigate(['customer/paymentSuccess']);

      },
      "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9000090000"
      },
      "notes": {
        "address": "Razorpay Corporate Office"
      },
      "theme": {
        "color": "#3399cc"
      },
      // "callback_url": ' localhost:4200/customer/paymentSuccess'
    };
    var rzp1 = new Razorpay(options);

    // document.getElementById('rzp-button1').onclick = function(e){
    rzp1.open();

    rzp1.on('payment.failed', (response: any) => {

      console.log('failed');

      // alert(response.error.code);
      // alert(response.error.description);
      // alert(response.error.source);
      // alert(response.error.step);
      // alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);

      this.zone.run(() => {
        this.router.navigateByUrl('customer/payment-failed')
      })



    });
    // e.preventDefault();
    // }
  }

  hdfcBankPayNow() {



    var options = {
      "key": "rzp_test_SMOwjnuoFLaYLa", // Enter the Key ID generated from the Dashboard
      "amount": this.amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "TNHB",
      "description": "Sales And Marketing",
      // "image": "https://example.com/your_logo",
      "image": "https://propertyapi.tnhb.in/var/uploads/property/tnhb/tnhb_logo.jpeg",

      // "order_id": "order_IluGWxBm9U8zJ8", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "order_id": this.orderID, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1

      "handler": (Response: any) => {
        // alert(Response.razorpay_payment_id);
        // alert(Response.razorpay_order_id);
        // alert(Response.razorpay_signature)

        // this.router.navigateByUrl('customer/paymentSuccess');
        this.zone.run(() => {


          if (Response.razorpay_payment_id) {

            this.paymentService.getHdfcPaymentMethod(Response.razorpay_payment_id).subscribe((res: any) => {
              if (res) {
                // const timestamp = 1723108590;
                // const timestamp = res.created_at;

                // const date = new Date(timestamp * 1000);
                // const getDate = date.toLocaleString().slice(0, 19);
                // const getDate = this.convertTimestampToISO(res.created_at);

                // debugger
                // let data = {
                //   "paymentType": this.paymentType,
                //   // "paymentMode": res.method,
                //   "cost": (res.amount) / 100,
                //   "paymentDateAndTime": getDate,
                //   "description": res.description,
                //   "schemeDataId": this.schemeId,
                //   "unitDataId": this.unitId,
                //   "applicationId": this.applicationId,
                //   "unitAccountNumber": this.unitData.unitAccountNumber,
                //   "paymentId": Response.razorpay_payment_id,
                //   "bankName": this.selectBank,
                //   "reference": '',
                //   "paymentMethod": res.method,
                //   "orderId": this.orderID
                // }
                // this.loader = true;
                // console.log('response_hdfc', JSON.stringify(Response));


                // this.createPayment(data);




                const getDate = this.convertTimestampToISO(res.created_at);
                debugger
                let data = [];
                if (this.isInititalDeposit == 'false') {
                  if (this.projectStatus != 'Self Finance') {
                    data = [{
                      "paymentType": this.paymentType,
                      "paymentMethod": res.method,
                      "cost": (res.amount) / 100,
                      "paymentDateAndTime": getDate,
                      "description": res.description,
                      "schemeDataId": this.schemeId,
                      "unitDataId": this.unitId,
                      "applicationId": this.applicationId,
                      "unitAccountNumber": this.unitData.unitAccountNumber,
                      "paymentId": Response.razorpay_payment_id,
                      "bankName": this.selectBank,
                      "orderId": this.orderID,
                      "reference": '',
                      "refundDescription": "",
                      "refundId": "",
                      "refundAmount": "",
                      "refundDate": "",
                      "refundBank": "",

                    }]
                    this.loader = true;
                    console.log('response _axis', JSON.stringify(Response));

                    this.createPayment(data);

                  } else {
                    let paymentList: any = [];
                    this.sfsList.forEach((element: any) => {
                      let data = {

                        "paymentType": element.Description,
                        "paymentMethod": res.method,
                        "cost": element.partPayment ? (element.isPartInterestCollected + element.isPartCollected) : element.totalDueAmount,
                        "paymentDateAndTime": getDate,
                        "description": res.description,
                        "schemeDataId": this.schemeId,
                        "unitDataId": this.unitId,
                        "applicationId": this.applicationId,
                        "unitAccountNumber": this.unitData.unitAccountNumber,
                        "paymentId": Response.razorpay_payment_id,
                        "bankName": this.selectBank,
                        "orderId": this.orderID,
                        "reference": '',
                        "refundDescription": "",
                        "refundId": "",
                        "refundAmount": "",
                        "refundDate": "",
                        "refundBank": "",

                      }
                      paymentList.push(data)
                    });

                    this.loader = true;
                    console.log('response _axis', JSON.stringify(Response));

                    this.createPayment(paymentList);
                  }
                } else {
                  data = [{
                    "paymentType": this.bookingDetail[0].paymentType,
                    "paymentMethod": res.method,
                    "cost": this.bookingDetail[0].amount,
                    "paymentDateAndTime": getDate,
                    "description": res.description,
                    "schemeDataId": this.schemeId,
                    "unitDataId": this.unitId,
                    "applicationId": this.applicationId,
                    "unitAccountNumber": this.unitData.unitAccountNumber,
                    "paymentId": Response.razorpay_payment_id,
                    "bankName": this.selectBank,
                    "orderId": this.orderID,
                    "reference": '',
                    "refundDescription": "",
                    "refundId": "",
                    "refundAmount": "",
                    "refundDate": "",
                    "refundBank": "",

                  },
                  {
                    "paymentType": this.bookingDetail[1].paymentType,
                    "paymentMethod": res.method,
                    "cost": this.bookingDetail[1].amount,
                    "paymentDateAndTime": getDate,
                    "description": res.description,
                    "schemeDataId": this.schemeId,
                    "unitDataId": this.unitId,
                    "applicationId": this.applicationId,
                    "unitAccountNumber": this.unitData.unitAccountNumber,
                    "paymentId": Response.razorpay_payment_id,
                    "bankName": this.selectBank,
                    "orderId": this.orderID,
                    "reference": '',
                    "refundDescription": "",
                    "refundId": "",
                    "refundAmount": "",
                    "refundDate": "",
                    "refundBank": "",

                  }, {
                    "paymentType": this.bookingDetail[2].paymentType,
                    "paymentMethod": res.method,
                    "cost": this.bookingDetail[2].amount,
                    "paymentDateAndTime": getDate,
                    "description": res.description,
                    "schemeDataId": this.schemeId,
                    "unitDataId": this.unitId,
                    "applicationId": this.applicationId,
                    "unitAccountNumber": this.unitData.unitAccountNumber,
                    "paymentId": Response.razorpay_payment_id,
                    "bankName": this.selectBank,
                    "orderId": this.orderID,
                    "reference": '',
                    "refundDescription": "",
                    "refundId": "",
                    "refundAmount": "",
                    "refundDate": "",
                    "refundBank": "",

                  }]
                  this.createPayment(data);



                }
              }

            })

            // this.router.navigateByUrl('customer/paymentSuccess');
          }
        })


        // this.router.navigateByUrl('customer/common');

        // this.router.navigate(['customer/paymentSuccess']);

      },
      "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9000090000"
      },
      "notes": {
        "address": "Razorpay Corporate Office"
      },
      "theme": {
        "color": "#3399cc"
      },
      // "callback_url": ' localhost:4200/customer/paymentSuccess'
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', (response: any) => {
      // alert(response.error.code);
      // alert(response.error.description);
      // alert(response.error.source);
      // alert(response.error.step);
      // alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);
      // this.loader = false;

      this.zone.run(() => {
        this.router.navigateByUrl('customer/payment-failed')
      })

    });
    // document.getElementById('rzp-button1').onclick = function(e){
    rzp1.open();
    // e.preventDefault();
    // }
  }

  indusIndBankPayNow() {
    var options = {
      "key": "rzp_test_R2TyAXIgVNhIWK", // Enter the Key ID generated from the Dashboard
      "amount": this.amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "TNHB",
      "description": "Sales And Marketing",
      // "image": "https://example.com/your_logo",
      "image": "https://propertyapi.tnhb.in/var/uploads/property/tnhb/tnhb_logo.jpeg",

      // "order_id": "order_IluGWxBm9U8zJ8", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "order_id": this.orderID, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1

      "handler": (Response: any) => {
        // alert(Response.razorpay_payment_id);
        // alert(Response.razorpay_order_id);
        // alert(Response.razorpay_signature)

        // this.router.navigateByUrl('customer/paymentSuccess');
        this.zone.run(() => {


          if (Response.razorpay_payment_id) {

            this.paymentService.getindusIndPaymentMethod(Response.razorpay_payment_id).subscribe((res: any) => {
              if (res) {
                // const timestamp = 1723108590;
                // const timestamp = res.created_at;

                // const date = new Date(timestamp * 1000);
                // const getDate = date.toLocaleString().slice(0, 19);
                const getDate = this.convertTimestampToISO(res.created_at);
                debugger
                let data = [];
                if (this.isInititalDeposit == 'false') {

                  if (this.projectStatus != 'Self Finance') {
                    data = [{
                      "paymentType": this.paymentType,
                      "paymentMethod": res.method,
                      "cost": (res.amount) / 100,
                      "paymentDateAndTime": getDate,
                      "description": res.description,
                      "schemeDataId": this.schemeId,
                      "unitDataId": this.unitId,
                      "applicationId": this.applicationId,
                      "unitAccountNumber": this.unitData.unitAccountNumber,
                      "paymentId": Response.razorpay_payment_id,
                      "bankName": this.selectBank,
                      "orderId": this.orderID,
                      "reference": '',
                      "refundDescription": "",
                      "refundId": "",
                      "refundAmount": "",
                      "refundDate": "",
                      "refundBank": "",

                    }]
                    this.loader = true;
                    console.log('response _axis', JSON.stringify(Response));

                    this.createPayment(data);

                  } else {
                    let paymentList: any = [];

                    this.sfsList.forEach((element: any) => {
                      let data = {

                        "paymentType": element.Description,
                        "paymentMethod": res.method,
                        "cost": element.partPayment ? (element.isPartInterestCollected + element.isPartCollected) : element.totalDueAmount,
                        "paymentDateAndTime": getDate,
                        "description": res.description,
                        "schemeDataId": this.schemeId,
                        "unitDataId": this.unitId,
                        "applicationId": this.applicationId,
                        "unitAccountNumber": this.unitData.unitAccountNumber,
                        "paymentId": Response.razorpay_payment_id,
                        "bankName": this.selectBank,
                        "orderId": this.orderID,
                        "reference": '',
                        "refundDescription": "",
                        "refundId": "",
                        "refundAmount": "",
                        "refundDate": "",
                        "refundBank": "",

                      }
                      paymentList.push(data)
                    });

                    this.loader = true;
                    console.log('response _axis', JSON.stringify(Response));

                    this.createPayment(paymentList);

                  }
                } else {
                  data = [{
                    "paymentType": this.bookingDetail[0].paymentType,
                    "paymentMethod": res.method,
                    "cost": this.bookingDetail[0].amount,
                    "paymentDateAndTime": getDate,
                    "description": res.description,
                    "schemeDataId": this.schemeId,
                    "unitDataId": this.unitId,
                    "applicationId": this.applicationId,
                    "unitAccountNumber": this.unitData.unitAccountNumber,
                    "paymentId": Response.razorpay_payment_id,
                    "bankName": this.selectBank,
                    "orderId": this.orderID,
                    "reference": '',
                    "refundDescription": "",
                    "refundId": "",
                    "refundAmount": "",
                    "refundDate": "",
                    "refundBank": "",

                  },
                  {
                    "paymentType": this.bookingDetail[1].paymentType,
                    "paymentMethod": res.method,
                    "cost": this.bookingDetail[1].amount,
                    "paymentDateAndTime": getDate,
                    "description": res.description,
                    "schemeDataId": this.schemeId,
                    "unitDataId": this.unitId,
                    "applicationId": this.applicationId,
                    "unitAccountNumber": this.unitData.unitAccountNumber,
                    "paymentId": Response.razorpay_payment_id,
                    "bankName": this.selectBank,
                    "orderId": this.orderID,
                    "reference": '',
                    "refundDescription": "",
                    "refundId": "",
                    "refundAmount": "",
                    "refundDate": "",
                    "refundBank": "",

                  }, {
                    "paymentType": this.bookingDetail[2].paymentType,
                    "paymentMethod": res.method,
                    "cost": this.bookingDetail[2].amount,
                    "paymentDateAndTime": getDate,
                    "description": res.description,
                    "schemeDataId": this.schemeId,
                    "unitDataId": this.unitId,
                    "applicationId": this.applicationId,
                    "unitAccountNumber": this.unitData.unitAccountNumber,
                    "paymentId": Response.razorpay_payment_id,
                    "bankName": this.selectBank,
                    "orderId": this.orderID,
                    "reference": '',
                    "refundDescription": "",
                    "refundId": "",
                    "refundAmount": "",
                    "refundDate": "",
                    "refundBank": "",

                  }]
                  this.createPayment(data);



                }
              }

            })

            // this.router.navigateByUrl('customer/paymentSuccess');
          }
        })


        // this.router.navigateByUrl('customer/common');

        // this.router.navigate(['customer/paymentSuccess']);

      },
      "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9000090000"
      },
      "notes": {
        "address": "Razorpay Corporate Office"
      },
      "theme": {
        "color": "#3399cc"
      },
      // "callback_url": ' localhost:4200/customer/paymentSuccess'
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', (response: any) => {
      // alert(response.error.code);
      // alert(response.error.description);
      // alert(response.error.source);
      // alert(response.error.step);
      // alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);
      // this.loader = false;

      this.zone.run(() => {
        this.router.navigateByUrl('customer/payment-failed')
      })

    });
    // document.getElementById('rzp-button1').onclick = function(e){
    rzp1.open();
    // e.preventDefault();
    // }
  }

  canaraBankPayNow() {

    var options = {
      "key": "rzp_test_5vagdY3DPaPgaE", // Enter the Key ID generated from the Dashboard
      "amount": this.amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "TNHB",
      "description": "Sales And Marketing",
      // "image": "https://example.com/your_logo",
      "image": "https://propertyapi.tnhb.in/var/uploads/property/tnhb/tnhb_logo.jpeg",

      // "order_id": "order_IluGWxBm9U8zJ8", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "order_id": this.orderID, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1

      "handler": (Response: any) => {
        // alert(Response.razorpay_payment_id);
        // alert(Response.razorpay_order_id);
        // alert(Response.razorpay_signature)

        // this.router.navigateByUrl('customer/paymentSuccess');
        this.zone.run(() => {


          if (Response.razorpay_payment_id) {

            this.paymentService.getcanaraBankPaymentMethod(Response.razorpay_payment_id).subscribe((res: any) => {
              if (res) {
                // const timestamp = 1723108590;
                // const timestamp = res.created_at;

                // const date = new Date(timestamp * 1000);
                // const getDate = date.toLocaleString().slice(0, 19);
                const getDate = this.convertTimestampToISO(res.created_at);
                debugger
                let data = [];
                if (this.isInititalDeposit == 'false') {

                  if (this.projectStatus != 'Self Finance') {

                    data = [{
                      "paymentType": this.paymentType,
                      "paymentMethod": res.method,
                      "cost": (res.amount) / 100,
                      "paymentDateAndTime": getDate,
                      "description": res.description,
                      "schemeDataId": this.schemeId,
                      "unitDataId": this.unitId,
                      "applicationId": this.applicationId,
                      "unitAccountNumber": this.unitData.unitAccountNumber,
                      "paymentId": Response.razorpay_payment_id,
                      "bankName": this.selectBank,
                      "orderId": this.orderID,
                      "reference": '',
                      "refundDescription": "",
                      "refundId": "",
                      "refundAmount": "",
                      "refundDate": "",
                      "refundBank": "",

                    }]
                    this.loader = true;
                    console.log('response _axis', JSON.stringify(Response));

                    this.createPayment(data);

                  } else {
                    let paymentList: any = [];

                    this.sfsList.forEach((element: any) => {
                      let data = {

                        "paymentType": element.Description,
                        "paymentMethod": res.method,
                        "cost": element.partPayment ? (element.isPartInterestCollected + element.isPartCollected) : element.totalDueAmount,
                        "paymentDateAndTime": getDate,
                        "description": res.description,
                        "schemeDataId": this.schemeId,
                        "unitDataId": this.unitId,
                        "applicationId": this.applicationId,
                        "unitAccountNumber": this.unitData.unitAccountNumber,
                        "paymentId": Response.razorpay_payment_id,
                        "bankName": this.selectBank,
                        "orderId": this.orderID,
                        "reference": '',
                        "refundDescription": "",
                        "refundId": "",
                        "refundAmount": "",
                        "refundDate": "",
                        "refundBank": "",

                      }
                      paymentList.push(data)
                    });

                    this.loader = true;
                    console.log('response _axis', JSON.stringify(Response));

                    this.createPayment(paymentList);
                  }
                } else {
                  data = [{
                    "paymentType": this.bookingDetail[0].paymentType,
                    "paymentMethod": res.method,
                    "cost": this.bookingDetail[0].amount,
                    "paymentDateAndTime": getDate,
                    "description": res.description,
                    "schemeDataId": this.schemeId,
                    "unitDataId": this.unitId,
                    "applicationId": this.applicationId,
                    "unitAccountNumber": this.unitData.unitAccountNumber,
                    "paymentId": Response.razorpay_payment_id,
                    "bankName": this.selectBank,
                    "orderId": this.orderID,
                    "reference": '',
                    "refundDescription": "",
                    "refundId": "",
                    "refundAmount": "",
                    "refundDate": "",
                    "refundBank": "",

                  },
                  {
                    "paymentType": this.bookingDetail[1].paymentType,
                    "paymentMethod": res.method,
                    "cost": this.bookingDetail[1].amount,
                    "paymentDateAndTime": getDate,
                    "description": res.description,
                    "schemeDataId": this.schemeId,
                    "unitDataId": this.unitId,
                    "applicationId": this.applicationId,
                    "unitAccountNumber": this.unitData.unitAccountNumber,
                    "paymentId": Response.razorpay_payment_id,
                    "bankName": this.selectBank,
                    "orderId": this.orderID,
                    "reference": '',
                    "refundDescription": "",
                    "refundId": "",
                    "refundAmount": "",
                    "refundDate": "",
                    "refundBank": "",

                  }, {
                    "paymentType": this.bookingDetail[2].paymentType,
                    "paymentMethod": res.method,
                    "cost": this.bookingDetail[2].amount,
                    "paymentDateAndTime": getDate,
                    "description": res.description,
                    "schemeDataId": this.schemeId,
                    "unitDataId": this.unitId,
                    "applicationId": this.applicationId,
                    "unitAccountNumber": this.unitData.unitAccountNumber,
                    "paymentId": Response.razorpay_payment_id,
                    "bankName": this.selectBank,
                    "orderId": this.orderID,
                    "reference": '',
                    "refundDescription": "",
                    "refundId": "",
                    "refundAmount": "",
                    "refundDate": "",
                    "refundBank": "",

                  }]
                  this.createPayment(data);



                }
              }

            })

            // this.router.navigateByUrl('customer/paymentSuccess');
          }
        })


        // this.router.navigateByUrl('customer/common');

        // this.router.navigate(['customer/paymentSuccess']);

      },
      "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9000090000"
      },
      "notes": {
        "address": "Razorpay Corporate Office"
      },
      "theme": {
        "color": "#3399cc"
      },
      // "callback_url": ' localhost:4200/customer/paymentSuccess'
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', (response: any) => {
      // alert(response.error.code);
      // alert(response.error.description);
      // alert(response.error.source);
      // alert(response.error.step);
      // alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);
      // this.loader = false;

      this.zone.run(() => {
        this.router.navigateByUrl('customer/payment-failed')
      })

    });
    // document.getElementById('rzp-button1').onclick = function(e){
    rzp1.open();
    // e.preventDefault();
    // }
  }

  createPayment(data: any) {


    debugger
    this.salesService.createTransaction(data).subscribe(
      (response: any) => {
        if (response) {
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
          let payments = [];


          if (this.isInititalDeposit == 'false') {

            payments = [{
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
              "refundId": "",
              "refundAmount": "",
              "refundDate": "",
              "refundBank": "",
            }]

            this.salesService.createPayment(payments).subscribe(res => {
              if (res) {
                this.toast.showToast('success', 'Payment Successfull', '');

                if (this.projectStatus == 'Self Finance') {
                  this.updateSFSlistInterestAndAmount();
                } else {
                  this.demandUpdateDetails(data[0].paymentType, data[0].cost, "No");

                }
                this.router.navigateByUrl('customer/paymentSuccess');
              }
            })

          } else {
            payments = [{
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
              "refundId": "",
              "refundAmount": "",
              "refundDate": "",
              "refundBank": "",
            }, {
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
              "refundId": "",
              "refundAmount": "",
              "refundDate": "",
              "refundBank": "",
            }]


            this.salesService.createPayment(payments).subscribe(res => {
              if (res) {


                this.salesService.allotePermitStatusChange(this.applicationId).subscribe(async res => {
                  if (res) {

                    // const myPromise = new Promise(async (resolve, reject) => {
                    //   // await this.updateUnitBooking();

                    if (this.projectStatus != 'Self Finance') {
                      await this.demandUpdateDetails("Unit Cost", data[0].cost, "Yes");

                    }
                    if (this.projectStatus == 'Self Finance') {
                      await this.updateSfsInitialDeposit(data[0].cost);


                    }

                    this.router.navigateByUrl('customer/paymentSuccess');
                    this.toast.showToast('success', 'Payment Successfull', '');


                    // })
                    // myPromise.then((value: any) => {

                    // })
                  }
                })




              }
            })
          }

        }

        // this.getAllPaymentsByApplicationId();
      },
      (error: any) => {
        console.error(error);
        this.toast.showToast('error', 'Payment Failed', '');
      }
    );
  }
  demandUpdateDetails(demandType: any, amount: any, iscompleted: any) {
    debugger
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
        "gstPaidCost": getamount,

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

    }
    else if (demandType == "Car Parking Demand") {
      let carParkingDemand = {
        "id": this.unitId,
        "carParkingPaid": getamount
      }

      this.propertyService.updateCarParkingCostDetails(carParkingDemand).subscribe(res => {
        if (res) {

        }

      })

    }
    else if (demandType == "Scrunity Fee") {
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



    if (checkDifferenceCost.length > 0) {
      this.propertyService.updateInterestSFS(InterestDatas).subscribe(res => {

        if (res) {
          if (checkDifferenceCost.length == 0) {
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

  convertTimestampToISO(timestamp: number): string {
    // Create a Date object from the timestamp (convert from seconds to milliseconds)
    const date = new Date(timestamp * 1000);
    debugger
    let convertdate = date.toLocaleString();

    // // Adjust the time to the local timezone (if needed)
    // const timezoneOffset = date.getTimezoneOffset() * 60000;
    // const localDate = new Date(date.getTime() - timezoneOffset);

    // // Format the date to the desired ISO string format without the milliseconds and timezone
    // // const formattedDate = localDate.toISOString().slice(0, 19);
    // const formattedDate = localDate.toISOString();

    return convertdate;
  }



  getSuccessorPending() {


    // this.paymentService.getSuccessorPending('test').subscribe(res => {
    //   console.log('test?????????????');

    //   if (res) {

    //   }
    // })


  }



  // post(data: any) {
  //   debugger
  //   this.paymentService.initiatePayment('https://test.payu.in/_payment').subscribe(res => {
  //     if (res) {
  //       console.log('res', res);

  //     }

  //   })
  // }





  getFormattedDate(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);

    console.log(`${year}${month}${day}${hours}${minutes}${seconds}`);

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }


  //indianbank
  formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    this.todaysDate = `${day}-${month}-${year}`
    console.log(this.todaysDate);
  }

  t_RequestPaymentGateway(transactionID: any) {
    debugger
    let iv = '1823779448RNEMLJ'
    let key = '6341474154GUPEPX'
    // let amount = this.amount ? this.amount.toFixed(2) : '0'
    let amount = '10'

    let payload = {

      merchant: {
        identifier: "T1037273",
        // responseEndpointURL: "http://localhost:8085/api/getSuccess"
        responseEndpointURL: "https://propertyapi.tnhb.in/api/getSuccess"

      },

      cart: {
        item: [
          {
            // amount: "6.00",
            amount: amount,

            identifier: "FIRST"
          }
        ]
      },

      payment: {
        method: {
          token: "470"
        },
        instrument: {
          token: ""
        }
      },

      transaction: {
        deviceIdentifier: "web",
        // amount: this.amount ? (this.amount).toString : '0',
        amount: amount,

        type: "SALE",
        description: "",
        currency: "INR",
        isRegistration: "N",
        identifier: String(transactionID),
        dateTime: String(this.todaysDate),
        requestType: "T"
      },

      consumer: {
        accountNo: "110304030704"
      }
    }

    this.paymentService.IndianBankPaymentGateWay(payload, iv, key).subscribe(
      (res) => {
        console.log(res);
        this.encryptedResponse = res
        this.encryptedToDecrypted(res);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  encryptedToDecrypted(payload: any) {
    let iv = '1823779448RNEMLJ'
    let key = '6341474154GUPEPX'
    this.paymentService.redirectUrlIndianBankPaymentGateway(payload, iv, key).subscribe(
      (res) => {
        console.log(res);
        const response = JSON.parse(res);
        const bankAcsUrl = response.paymentMethod.aCS.bankAcsUrl;
        if (bankAcsUrl) {
          console.log(bankAcsUrl, '---------------bankAcsUrl');
          // window.location.href = bankAcsUrl;
          window.open(bankAcsUrl, "_self");
          // this.router.navigate(['customer/paymentSuccess']);
        } else {
          console.error('bankAcsUrl is not available in the response');
        }
      },
      (error) => {
        console.error(error);

      });
  }
  tnhbOpen() {
    window.open('https://tnhb.tn.gov.in/');
  }

  ngOnDestroy(): void {
    clearInterval(this.interval)
    // this.location.onPopState(() => {

    //   this.router.navigate(['/customer/home']);

    //   console.log('back');

    // });

  }
}
