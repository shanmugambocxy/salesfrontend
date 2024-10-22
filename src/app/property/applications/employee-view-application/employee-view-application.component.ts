import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../services/toast.service';
import { SalesService } from '../../../services/sales.service';
import { PaymentRefundService } from '../../../services/payment-refund.service';
import * as _ from 'lodash';
import { Banks } from '../../../bank_enum';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employee-view-application',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './employee-view-application.component.html',
  styleUrl: './employee-view-application.component.scss'
})
export class EmployeeViewApplicationComponent implements OnInit {

  unitDetailsForm: FormGroup;
  applicantForm: FormGroup;
  feeForm: FormGroup;
  bankDetailsForm: FormGroup;

  applicationId: any;
  reservationId: any;

  applicationData: any;
  role: any;
  referenceId: any;
  checkSumValue: any;
  encryptKey: any;
  paymentDetails: any = [];
  totalAmount: any;
  banks = Banks;

  schemeId: any;
  unitId: any;
  unitData: any;
  isRefunded: boolean = false;
  applicantPhotoPath: any = '';

  constructor(
    private title: Title,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private dialog: MatDialog,
    private toast: ToastService,
    private router: Router,
    private salesService: SalesService,
    private paymentRefundService: PaymentRefundService,
    private location: Location
  ) {
    this.role = sessionStorage.getItem('role');

    this.title.setTitle('View Application');
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
      martialStatus: [''],
      aadhaaarNumber: [''],
      panNumber: [''],
      fathersName: [''],


      jointApplicantName: [''],
      jointApplicantDateOfBirth: [''],
      jointApplicantAge: [''],
      jointApplicantAadharNumber: [''],
      relationWithApplicant: [''],
      jointApplicantFatherName: [''],

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
      nameOfTheBank: [''],
      accountNumber: [''],
      ifscCode: [''],
      accountHolderName: [''],
      branchName: ['']
    });
    this.feeForm = this.formBuilder.group({
      applicationFees: [''],
      registrationFees: [''],
      initialPayment: [''],
      totalFees: ['']
    });
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.applicationId = params['applicationId'];
    });
    this.getApplicationById();
  }

  getApplicationById() {
    debugger
    this.propertyService.getApplicationById(this.applicationId).subscribe(
      (response: any) => {
        const responseData: any = response;
        this.applicationData = response;
        this.applicantPhotoPath = this.applicationData.primaryApplicantPhotoPath;
        this.schemeId = this.applicationData.schemeData.id;
        this.unitId = this.applicationData.unitData.id;
        this.unitData = this.applicationData.unitData;
        if (responseData.unitData) {
          console.log(responseData);
          this.applicantForm.patchValue(responseData);
          this.bankDetailsForm.patchValue(responseData);
          this.bankDetailsForm.patchValue(responseData.unitData);
          this.unitDetailsForm.patchValue({

            // unitAccountNo: responseData.unitData.unitAccountNumber,
            // unitType: responseData.schemeData.unitType,
            // cityRural: responseData.schemeData.cityAndRural,
            // circle: responseData.schemeData.circle,
            // scheme: responseData.schemeData.schemeName,
            // type: responseData.schemeData.schemeType,
            // blockNo: responseData.unitData.blockNo,
            // floorNo: responseData.unitData.floorNo,
            // unitNo: responseData.unitData.unitNo,
            // UDS_Area: responseData.unitData.uds,
            // plinthArea: responseData.unitData.plintArea,
            // ccCode: responseData.reservation.ccCode,
            // priorityCode: responseData.reservation.priorityCode,
            // reservationName: responseData.reservation.reservationName,
            // costOfUnit: responseData.unitData.unitCost,

            unitAccountNo: responseData.unitData.unitAccountNumber,
            unitType: responseData.schemeData.unitType,
            cityRural: responseData.schemeData.cityAndRural,
            circle: responseData.schemeData.circle,
            divisionName: responseData.schemeData.nameOfTheDivision,
            scheme: responseData.schemeData.schemeName,
            type: responseData.schemeData.schemeType,
            blockNo: responseData.unitData.blockNo,
            floorNo: responseData.unitData.floorNo,
            unitNo: responseData.unitData.unitNo,
            UDS_Area: responseData.unitData.uds,
            plinthArea: responseData.unitData.plinthArea,

            ccCode: responseData.reservation?.ccCode,
            priorityCode: responseData.reservation?.priorityCode,
            reservationName: responseData.reservation?.reservationName,

            priorityBasis: responseData.reservation?.priorityBasis,
            costOfUnit: responseData.unitData.unitCost
          });
          this.feeForm.patchValue(responseData);

          // this.applicantForm.patchValue({

          // });
          this.salesService.getAllPaymentsByApplicationId(responseData.unitData.unitAccountNumber).subscribe(res => {
            if (res) {
              let paymentDetails = res.responseObject;
              let checkIsRefunded = paymentDetails.filter((x: any) => x.paymentType == 'Refund');
              if (checkIsRefunded && checkIsRefunded.length > 0) {
                this.isRefunded = true;
              } else {
                this.isRefunded = false;

                this.paymentDetails = paymentDetails.filter((x: any) => x.paymentType != 'Application Fee' && x.paymentType != 'Registration Fee');
                // this.totalAmount = _.sumBy(this.paymentDetails, 'amount');
                let amount = this.paymentDetails
                  .map((value: any) => parseInt(value.amount, 10)) // Step 1: Convert string to number
                  .reduce((acc: any, current: any) => acc + current, 0);
                this.totalAmount = amount * (10 / 100) * (2 / 100);
                console.log('this.totalAmount', this.totalAmount);
              }


              switch (this.paymentDetails[0]?.bankName) {
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
                  // this.generateHDFCAlphaNumeric();

                  break;
                default:
                  break;
              }

            }
          })
        }
        console.log(this.unitDetailsForm.value);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  allotApplication() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Allotment',
        message: 'Are you sure you want to allot this application?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.propertyService.allot(this.applicationId).subscribe(
          (responseData: any) => {
            console.log(responseData);
            this.toast.showToast('success', 'Application allotted successfully', '');
            this.router.navigate(['/employee/pending-applications']);
          },
          (error: any) => {
            console.error(error);
            this.toast.showToast('error', 'Failed to allot application', '');
          }
        );
      }
    });
  }


  getReferenceId() {
    let payload = {}
    this.paymentRefundService.getReferenceId(payload).subscribe((response: any) => {
      console.log(response, "response")
      this.referenceId = response;
      console.log(this.referenceId, "referenceId");

      this.refundAmount();

      // this.getCustomerReferenceId()
    })
  }


  refundAmount() {
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
        console.log(response, "response");
        this.checkSumValue = response;
        console.log(this.checkSumValue, "checkSumValue");
        console.log("dbdfbsbrtbrt");
        this.encryptFun(); // Add a  here if needed.
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
  rejectApplication() {
    //axis bank


    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Allotment',
        message: 'Are you sure you want to Reject this application?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        debugger

        this.canaraBank();
        // switch (this.paymentDetails[0]?.bankName) {
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

    let amount = this.totalAmount;
    const data = {
      // destAcctNumber: this.applicationData.accountNumber,
      // // txnAmount: 10.00,
      // txnAmount: JSON.stringify(this.totalAmount),
      // benefName: this.applicationData.accountHolderName,
      // ifscCode: this.applicationData.ifscCode,
      // narration: '96389290863'


      "destAcctNumber": "112233445566",
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
      "schemeDataId": this.schemeId,
      "unitDataId": this.unitId,
      "applicationId": this.applicationId,
      "unitAccountNumber": this.unitData.unitAccountNumber,
      "paymentId": '',
      "bankName": '',
      "orderId": data.orderId,
      "reference": '',
      "refundDescription": "Refund",
      "refundId": data.refundId,
      "refundAmount": this.totalAmount,
      "refundDate": formattedDate,
      "refundBank": this.paymentDetails[0]?.bankName,
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

          }
        })
      }

    })
  }

  createPaymentRefund() {

  }

  goBack() {
    this.location.back()
  }
}
