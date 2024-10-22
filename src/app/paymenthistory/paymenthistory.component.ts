import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { PropertyService } from '../services/property.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesService } from '../services/sales.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { Location } from '@angular/common';
import { PaymentRefundService } from '../services/payment-refund.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../services/toast.service';
import { Banks } from '../bank_enum';

@Component({
  selector: 'app-paymenthistory',
  standalone: true,
  imports: [SharedModule, MatTabsModule],
  templateUrl: './paymenthistory.component.html',
  styleUrl: './paymenthistory.component.scss'
})
export class PaymenthistoryComponent implements OnInit {
  // , 'remainingBalance', 'firstname'
  displayedColumns: string[] = ['sno', 'paymentType', 'unitAccountNumber', 'transactionId', 'bankName', 'paymentMode', 'cost', 'paymentDateAndTime', 'action'];
  allPaymentDataSource = new MatTableDataSource<any>([]);
  displayedColumnsRefund: string[] = ['sno', 'paymentType', 'unitAccountNumber', 'transactionId', 'bankName', 'cost', 'paymentDateAndTime'];
  allPaymentDataSourceRefund = new MatTableDataSource<any>([]);
  applicationId: any = '';

  unitAccountNo: any = '';

  role: any = '';

  schemeCode: any = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isRefunded: boolean = false;
  totalAmount: any = 0;
  refundReason: any = '';


  referenceId: any;
  checkSumValue: any;
  encryptKey: any;
  applicationData: any;

  schemeData: any = '';
  unitData: any = '';
  refundBankName: any = '';
  banks = Banks;
  hdfcAlphaNumeric32Code: any;
  encryptResHDFC: any;

  constructor(private propertyService: PropertyService,
    private route: ActivatedRoute, private router: Router,
    private salesService: SalesService, private location: Location,
    private paymentRefundService: PaymentRefundService,
    private dialog: MatDialog,
    private toast: ToastService,

  ) {

  }
  ngAfterViewInit() {
    this.allPaymentDataSource.paginator = this.paginator;
    this.allPaymentDataSource.sort = this.sort;
  }
  ngOnInit() {



    this.role = sessionStorage.getItem('role');

    this.route.queryParams.subscribe(params => {
      this.unitAccountNo = params['id'];
      if (this.unitAccountNo) {
        this.selectApplication(this.unitAccountNo);
      }
      // if (this.role == 'Customer') {
      //   this.unitAccountNo = params['id'];
      //   if (this.unitAccountNo) {
      //     this.selectApplication(this.unitAccountNo);
      //   }
      // } else {
      //   // this.schemeCode = params['schemeCode'];
      //   // if (this.schemeCode) {
      //   //   this.getPaymentHistoryBySchemeCode(this.schemeCode);


      //   // }


      // }


    })

  }






  applyFilter(event: Event) {
    debugger
    const filterValue = (event.target as HTMLInputElement).value;
    this.allPaymentDataSource.filter = filterValue.trim().toLowerCase();

    if (this.allPaymentDataSource.paginator) {
      this.allPaymentDataSource.paginator.firstPage();
    }
  }

  selectApplication(event: any) {
    debugger
    let id = event;
    this.salesService.getAllPaymentsByApplicationId(id).subscribe((res: any) => {
      if (res && res.responseObject) {
        // this.allPaymentDataSource.data = res.responseObject;

        console.log('this.allPaymentDataSource.data', this.allPaymentDataSource.data);


        let paymentDetails = res.responseObject;
        this.applicationData = paymentDetails[0].application;
        this.schemeData = paymentDetails[0].application.schemeData;
        this.unitData = paymentDetails[0].application.unitData;
        //initial bank name choosed for refund
        this.refundBankName = paymentDetails[0].bankName;
        this.allPaymentDataSource.data = paymentDetails.filter((x: any) => x.paymentType != 'Refund');
        this.allPaymentDataSourceRefund.data = paymentDetails.filter((x: any) => x.paymentType == 'Refund');
        // this.generateHDFCAlphaNumeric();
        switch (this.allPaymentDataSourceRefund.data[0]?.bankName) {
          case this.banks.AxisBank:
            this.getReferenceId();
            break;
          case this.banks.CanaraBank:
            // this.canaraBank();
            break;
          case this.banks.UnionBank:
            // this.unionBank();
            break;
          case this.banks.HDFCBank:
            this.generateHDFCAlphaNumeric();

            break;
          default:
            break;
        }

        let checkIsRefunded = paymentDetails.filter((x: any) => x.paymentType == 'Refund');
        // let checkIsRefunded: any = [];

        if (checkIsRefunded && checkIsRefunded.length > 0) {
          this.isRefunded = true;
          // this.allPaymentDataSource.data = paymentDetails.filter((x: any) => x.paymentType != 'Application Fee' && x.paymentType != 'Registration Fee');

        } else {
          this.isRefunded = false;
          let getRefundAmount = paymentDetails.filter((x: any) => x.paymentType != 'Application Fee' && x.paymentType != 'Registration Fee' && x.paymentType != 'Refund');
          // this.totalAmount = _.sumBy(this.paymentDetails, 'amount');
          let amount = getRefundAmount
            .map((value: any) => parseInt(value.amount, 10)) // Step 1: Convert string to number
            .reduce((acc: any, current: any) => acc + current, 0);
          this.totalAmount = amount * (10 / 100) * (2 / 100);
          console.log('this.totalAmount', this.totalAmount);


        }

      }
    })
  }

  getReferenceId() {
    debugger
    let payload = {}
    this.paymentRefundService.getReferenceId(payload).subscribe((response: any) => {
      console.log(response, "response")

      if (response) {
        this.referenceId = response;
        console.log(this.referenceId, "referenceId");
        this.refundAmount();

      }



      // this.getCustomerReferenceId()
    })
  }

  refundAmount() {
    debugger
    console.log("refund amonut");
    let additionalProp1 = {
      "GetStatusRequest": {
        "SubHeader": {
          "requestUUID": "ABC123",
          "serviceRequestId": "OpenAPI",
          "serviceRequestVersion": "1.0",
          "channelId": "TXB"
        },
        "GetStatusRequestBody": {
          "channelId": "TXB",
          "corpCode": "DEMOCORP87",
          "crn": "9088788343UUQ",
          "checksum": this.referenceId
        }
      }
    };

    console.log(additionalProp1, "additionalProp1");
    this.paymentRefundService.refundAmonutData(additionalProp1).subscribe(
      (response: any) => {

        if (response) {
          console.log(response, "response");
          this.checkSumValue = response;
          console.log(this.checkSumValue, "checkSumValue");
          console.log("dbdfbsbrtbrt");
          this.encryptFun(); // Add a  here if needed.
        }

      },
      (error) => {
        console.error("Error during refundAmontData call", error);
      }
    );
  }


  encryptFun() {
    this.paymentRefundService.getCustomerReferenceId().subscribe(res => {
      if (res) {
        let customerRefId = res
        let currentdate = new Date();
        let formaateDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
          + "-" + currentdate.getDate().toString().padStart(2, '0');
        console.log("encrypt function");
        // var EncryptPayload = {
        //   "GetStatusRequest": {
        //     "SubHeader": {
        //       "requestUUID": "ABC123",
        //       "serviceRequestId": "OpenAPI",
        //       "serviceRequestVersion": "1.0",
        //       "channelId": "TXB"
        //     },
        //     "GetStatusRequestBodyEncrypted":
        //       "yWvEDTCWcA8mhpUxaoRUZods7jz+7uXoiFv7FWJMFp1gHmwDfXS5VI0LYIiaI62R3xvMzULKNM8fU1099RKI2CGQ6qHKkx5w4ApoFo4wPSK14HwQFXXR0LB5BI8Hq9DY"
        //   }
        // };

        var EncryptPayload = {
          "TransferPaymentRequest": {
            "SubHeader": {
              "requestUUID": "ABC123",
              "serviceRequestId": "OpenAPI",
              "serviceRequestVersion": "1.0",
              "channelId": "TXB"
            },
            "TransferPaymentRequestBody": {
              "channelId": "TXB",
              "corpCode": "DEMOCORP11",
              "paymentDetails": [{
                "txnPaymode": "NE",
                "custUniqRef": customerRefId,
                "corpAccNum": "248012910169",//tnhb account number
                // "valueDate": "2020-03-06", //current date
                // "txnAmount": "500.00",// get value from refund
                "valueDate": formaateDate, //current date
                // "txnAmount": "500.00",// get value from refund
                "txnAmount": this.totalAmount,
                "beneLEI": "12dfkj",
                "beneName": this.applicationData.accountHolderName, //applicant name
                "beneCode": "RAI15235",
                // "beneAccNum": "914020013977038", // applicant account number
                "beneAccNum": this.applicationData.accountNumber, // applicant account number

                "beneAcType": "",
                "beneAddr1": "",
                "beneAddr2": "",
                "beneAddr3": "",
                "beneCity": this.applicationData.district,  //applicant city
                "beneState": this.applicationData.state,  // applicant state
                "benePincode": this.applicationData.pincode,   //  applicant pincode
                "beneIfscCode": this.applicationData.ifscCode,//applicant ifsc code
                "beneBankName": this.applicationData.nameOfTheBank,//applicant bank name
                "baseCode": "",
                "chequeNumber": "",
                "chequeDate": "",
                "payableLocation": "",
                "printLocation": "",
                "beneEmailAddr1": this.applicationData?.customer?.email,  //applicant email address
                "beneMobileNo": this.applicationData?.customer?.contactNumber,//applicant mobile no.
                "productCode": "",
                "txnType": "",
                "invoiceDetails": [
                  {
                    "invoiceAmount": "1888.00",
                    "invoiceNumber": "M713-DN",
                    "invoiceDate": "2018-11-21",
                    "cashDiscount": "0.00",

                    "tax": "0.00",
                    "netAmount": "0.00",
                    "invoiceInfo1": "slfj13",
                    "invoiceInfo2": "20384lskdjf",
                    "invoiceInfo3": "lsdjf2903",
                    "invoiceInfo4": "0234sjdlf",
                    "invoiceInfo5": "ls0w392sdfk"
                  }
                ],
                "enrichment1": "",
                "enrichment2": "",
                "enrichment3": "",
                "enrichment4": "",
                "enrichment5": "",
                "senderToReceiverInfo": ""
              }], "checksum": this.checkSumValue
            }
          }
        }

        console.log(EncryptPayload, "EncryptPayload");

        this.paymentRefundService.encryptData(EncryptPayload).subscribe(
          (response: any) => {
            if (response) {
              console.log(response, "response");
              this.encryptKey = response;
              console.log(this.encryptKey, "encryptKey")
            }

            // this.axisApi()
          },
          (error) => {
            console.error("Error during encryptData call", error);
          }
        );
      }
    })

  }

  axisApi() {
    console.log("axisApi")
    let Payload = {
      "TransferPaymentRequest": {
        "SubHeader": {
          "requestUUID": "ABC123",
          "serviceRequestId": "OpenAPI",
          "serviceRequestVersion": "1.0",
          "channelId": "TXB"
        },
        "TransferPaymentRequestBodyEncrypted": this.encryptKey
      }
    }

    this.paymentRefundService.getLiveApiAxis(Payload).subscribe((response: any) => {
      console.log(response, "response")
    })
  }


  unionBank() {
    let payload = {
      // beneficiaryAccNo: this.applicationData.accountNumber,
      // beneficiaryAccName: this.applicationData.accountHolderName,
      // beneficiaryBankIFSCCode: this.applicationData.ifscCode,
      // beneficiaryEmailId: this.applicationData?.customer?.email,
      // transactionAmount: JSON.stringify(this.totalAmount),
      // beneficiaryMobileNumber: this.applicationData?.customer?.contactNumber


      beneficiaryAccNo: '1224457898909',
      beneficiaryAccName: 'HALAPPA C',
      beneficiaryBankIFSCCode: 'KARB0000145',
      beneficiaryEmailId: 'exsel3@rediffmail.com',
      transactionAmount: '10.00',
      beneficiaryMobileNumber: '8122886443'
    }

    this.paymentRefundService.ubiTokenRegistration(payload).subscribe((data: any) => {
      if (data && data.data) {
        let trans = {
          "refundId": data?.data?.transactionId,
          "orderId": data?.data?.bankTxnId
        }
        this.createTransactionRefund(trans);
      }
      console.log(data);
    },
      (error) => {
        console.error(error);

      });
  }

  canaraBank() {
    debugger

    let amount = this.totalAmount;
    const data = {
      // destAcctNumber: this.applicationData.accountNumber,
      // // txnAmount: 10.00,
      // txnAmount: amount ? amount.toFixed(2) : '1.00',
      // benefName: this.applicationData.accountHolderName,
      // ifscCode: this.applicationData.ifscCode,
      // narration: '96389290863'


      "destAcctNumber": "112233445566",
      // "txnAmount": amount ? amount.toFixed(2) : '60090.00',
      "txnAmount": amount ? amount.toFixed(2) : '0.00',

      "benefName": "Aktar",
      "ifscCode": "HDFC0000792",
      "narration": "96389290863"
    };

    this.paymentRefundService.initiateRefundCanarabank(data).subscribe(
      (response) => {
        console.log('Fund transfer successful:', response);
        if (response.responseStatus) {
          const encryptedData = response.responseObject;
          console.log("encrypted____", encryptedData)
          this.paymentRefundService.decryptcanarabank(encryptedData).subscribe(
            (decryptedresponse) => {
              console.log('Decrypted response:', decryptedresponse);
              const userRefNo = decryptedresponse.userRefNo;
              if (userRefNo) {

                const payload = {
                  "Authorization": "Basic U1lFREFQSUFVVEg6MmE4OGE5MWE5MmE2NGEx",
                  "UTR": "",
                  "UserRefno": userRefNo,
                  "TransactionType": "NEFT",
                  "CustomerID": "13961989"
                };
                this.paymentRefundService.checkRefundStatusCanarabank(payload).subscribe(
                  (response) => {

                    console.log('Payload sent successfully:', response);
                    if (response.responseStatus) {
                      const encryptedData1 = response.responseObject;
                      console.log("encrypted1____", encryptedData1)
                      this.paymentRefundService.decryptcanarabank(encryptedData1).subscribe(
                        (decryptedresponse) => {
                          if (decryptedresponse && decryptedresponse.PaymentStatusInquiryDTO) {
                            console.log('Decrypted response2______:', decryptedresponse);
                            // this.toast.showToast('success', "Refund Processed Successfull", '')

                            let trans = {
                              "refundId": decryptedresponse?.PaymentStatusInquiryDTO?.TransactionRefNo,
                              "orderId": decryptedresponse?.PaymentStatusInquiryDTO?.ExtUniqueRefId
                            }
                            this.createTransactionRefund(trans);
                          }

                        })
                    }


                  },
                  (error) => {

                    console.error('Failed to send payload:', error);
                  }
                );
              } else {
                console.error('UserRefNo not found in the decrypted response.');
              }

            },
            (error) => {
              console.error('Decryption failed:', error);
            }
          );
        } else {
          console.error('Fund transfer failed:', response.responseMessage);
        }

      },
      (error) => {
        console.error('Fund transfer failed:', error);
      }
    );
  }
  createTransactionRefund(data: any) {

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
    let transaction = [{
      "paymentType": 'Refund',
      "paymentMethod": '',
      "cost": '',
      "paymentDateAndTime": formattedDate,
      "description": 'Refund',
      "schemeDataId": this.schemeData.id,
      "unitDataId": this.unitData.id,
      "applicationId": this.applicationId,
      "unitAccountNumber": this.unitData.unitAccountNumber,
      "paymentId": '',
      "bankName": '',
      "orderId": data.orderId,
      "reference": '',
      "refundDescription": this.refundReason,
      "refundId": data.refundId,
      "refundAmount": this.totalAmount,
      "refundDate": formattedDate,
      "refundBank": this.refundBankName,
    }
    ]

    this.salesService.createTransaction(transaction).subscribe(res => {

      if (res) {
        let payments = [{
          "paymentType": transaction[0].paymentType,

          "unitAccountNumber": this.unitData.unitAccountNumber,
          "paymentId": '',
          "code": "777",
          "amount": '',
          "modeOfPayment": '',
          "bankName": '',
          "orderId": transaction[0].orderId,
          "applicationId": this.applicationId,
          "dateOfPayment": formattedDate,
          "refundId": transaction[0].refundId,
          "refundAmount": transaction[0].refundAmount,
          "refundDate": transaction[0].refundDate,
          "refundBank": transaction[0].refundBank,
        }]

        this.salesService.createPayment(payments).subscribe(res => {

          if (res) {
            this.toast.showToast('success', 'Refund In Progress', '');
            this.selectApplication(this.unitAccountNo);
          }
        })
      }

    })
  }


  getPaymentHistoryBySchemeCode(schemeCode: any) {
    this.salesService.getPaymentHistoryBySchemeCode(schemeCode).subscribe((res: any) => {
      if (res && res.responseObject) {
        this.allPaymentDataSource.data = res.responseObject;

        console.log('this.allPaymentDataSource.data', this.allPaymentDataSource.data);

      }
    })
  }

  goToPaymentView(unitaccountNo: any, id: any) {

    // this.router.navigateByUrl('customer/view-payment')
    if (this.role == 'Customer') {
      this.router.navigate(['customer/view-payment'], { queryParams: { unitAccountNo: unitaccountNo, id: id } });

    } else {
      this.router.navigate(['employee/view-payment'], { queryParams: { unitAccountNo: unitaccountNo, id: id } });

    }

  }

  generateHDFCAlphaNumeric() {
    debugger
    this.paymentRefundService.generateHDFCAlphaNumeric().subscribe((res: any) => {
      if (res) {
        this.hdfcAlphaNumeric32Code = res;
        this.encryptPayloadHDFC();

      }
    })
  }

  encryptPayloadHDFC() {
    debugger
    let currentdate = new Date();
    let formateDate = currentdate.getDate().toString().padStart(2, '0') + '/' + (currentdate.getMonth() + 1).toString().padStart(2, '0') + '/' + currentdate.getFullYear();
    let data = {
      "LOGIN_ID": "APIUSER@CBXMGRT3",
      "INPUT_GCIF": "CBXMGRT3",
      "INPUT_DEBIT_ORG_ACC_NO": "00040350004239",
      "TRANSACTION_TYPE": "SINGLE",
      "INPUT_BUSINESS_PROD": "VENDBUS01",
      "PAYMENT_REF_NO": "TGNEFT113",
      "INPUT_VALUE_DATE": formateDate,
      "TRANSFER_TYPE_DESC": "NEFT",
      "BENE_ID": "",
      "BENE_ACC_NAME": this.applicationData.accountHolderName,
      "BENE_ACC_NO": "50100114490584",
      "BENE_IDN_CODE": "PUNB0753800",
      "INPUT_DEBIT_AMOUNT": this.totalAmount,
      "BENE_TYPE": "",
      "BENE_BANK": "",
      "BENE_BRANCH": "",
      "ADDL_EMAIL": "priya.keekan@uat.com",
      "PYMNT_CAT": ""
    }

    this.paymentRefundService.encryptPayloadHDFC(data).subscribe(encryptRes => {
      if (encryptRes) {
        this.encryptResHDFC = encryptRes;

        this.paymentRefundService.generateHDFCSignature(this.hdfcAlphaNumeric32Code, this.encryptResHDFC).subscribe(signatureRes => {
          if (signatureRes) {
            var getsignatureRes = signatureRes;
            this.paymentRefundService.generateHDFCSymetric(this.hdfcAlphaNumeric32Code).subscribe(symetricRes => {
              if (symetricRes) {
                this.paymentRefundService.getOauthValueHDFC().subscribe(oAuthRes => {
                  if (oAuthRes) {
                    let LiveHDFCData = {
                      "RequestSignatureEncryptedValue": getsignatureRes,
                      "SymmetricKeyEncryptedValue": symetricRes,
                      "Scope": "CBXMGRT3",
                      "TransactionId": "01",
                      "OAuthTokenValue": "XZmYdPUaGQHl0Fbs72Gjx23mRdr1"
                    }
                    this.paymentRefundService.liveHDFCEncrypt(LiveHDFCData).subscribe(liveHDFCData => {
                      if (liveHDFCData) {

                      }
                    })
                  }

                }

                )

              }
            })

          }
        })
      }
    })
  }

  rejectApplication() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Allotment',
        message: 'Are you sure you want to reject this application?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.axisApi();
        this.canaraBank();
        // switch (this.allPaymentDataSourceRefund.data[0]?.bankName) {
        //   case this.banks.AxisBank:
        //     this.axisApi();
        //     break;
        //   case this.banks.CanaraBank:
        //     this.canaraBank();
        //     break;
        //   case this.banks.UnionBank:
        //     this.unionBank();
        //     break;
        //   default:
        //     break;
        // }

      }
    })
  }

  back() {
    this.location.back();

  }
}
