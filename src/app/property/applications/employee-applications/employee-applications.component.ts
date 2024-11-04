import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PropertyService } from '../../../services/property.service';
import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../services/toast.service';
import { PaymentRefundService } from '../../../services/payment-refund.service';
import { SalesService } from '../../../services/sales.service';
import { Banks } from '../../../bank_enum';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { WordToPdfService } from '../../../services/word-to-pdf.service';
@Component({
  selector: 'app-employee-applications',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './employee-applications.component.html',
  styleUrl: './employee-applications.component.scss'
})
export class EmployeeApplicationsComponent implements OnInit, AfterViewInit {

  // displayedColumns: string[] = ['sno', 'crCode', 'ccCode', 'dCode', 'schemeCode', 'schemeName', 'schemePlace', 'district', 'unitType', 'schemeType', 'application'];
  // displayedColumns: string[] = ['sno', 'schemeCode', 'schemeName', 'schemePlace', 'district', 'unitType', 'schemeType', 'application'];
  displayedColumns: string[] = ['sno', 'applicationNumber', 'createdDateTime', 'unitAccountNumber', 'schemeName', 'schemeType', 'unitNo', 'applicantName', 'action'];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  paymentDetails: any = [];
  totalAmount: any;
  banks = Banks;
  applicationData: any;
  selectDivision: any;
  divisionList: any = [];
  selectSchemeType: any;
  originalDataList: any = [];
  selectScheme: any;
  selectedDate: any;
  schemeNameList: any = [];


  referenceId: any;
  checkSumValue: any;
  encryptKey: any;
  loader: boolean = false;
  constructor(
    private router: Router,
    private title: Title,
    private propertyService: PropertyService,
    private dialog: MatDialog,
    private toast: ToastService,
    private paymentRefundService: PaymentRefundService,
    private salesService: SalesService,
    private http: HttpClient,
    private datePipe: DatePipe,
    private wordToPdfService: WordToPdfService,
  ) {
    this.title.setTitle('All Schemes');
  }
  ngOnInit() {
    this.getAllApplicationData();
    this.getDivisionList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    debugger
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
    if (filterValue) {
      this.dataSource.data = this.originalDataList.filter((element: any) => {
        return JSON.stringify(element?.applicationNumber)?.toLowerCase().includes(filterValue.toLowerCase()) || element?.unitData?.unitAccountNumber.toLowerCase().includes(filterValue.toLowerCase()) || element?.schemeData?.schemeName.toLowerCase().includes(filterValue.toLowerCase()) || element?.schemeData?.schemeType.toLowerCase().includes(filterValue.toLowerCase()) || element?.applicantName?.toLowerCase().includes(filterValue.toLowerCase())

        // && element?.schemeData?.schemeType.toLowerCase().includes(filterValue.toLowerCase()) && element?.applicantName?.toLowerCase().includes(filterValue.toLowerCase())
      })
    } else {
      this.dataSource.data = this.originalDataList;
    }


  }

  applyFilterByOptions() {
    debugger
    // if (this.selectDivision && this.selectScheme && this.selectSchemeType && this.selectedDate) {
    //   this.dataSource.data = this.originalDataList.filter((x: any) => x.schemeData.divisionCode == this.selectDivision && x.schemeData.schemeName == this.selectScheme && x.schemeData.schemeType == this.selectSchemeType && x.creationDate)
    // }
    let filteredData = this.originalDataList;
    if (this.selectDivision == "ALL" || !this.selectDivision) {
      filteredData = this.originalDataList;
    } else {
      filteredData = filteredData.filter((x: any) => x.schemeData.divisionCode == this.selectDivision)

    }
    if (this.selectScheme) {
      filteredData = filteredData.filter((x: any) => x.schemeData?.schemeName == this.selectScheme)
    }
    if (this.selectSchemeType) {
      filteredData = filteredData.filter((x: any) => x.schemeData?.schemeType == this.selectSchemeType)
    }

    if (this.selectedDate) {
      console.log('datepipe', this.datePipe.transform(new Date('9/3/2024, 1:14:02 PM'), 'yyyy-MM-dd'));

      filteredData = filteredData.filter((x: any) => {
        const formattedDate = x?.createdDateTime ? this.datePipe.transform(new Date(x?.createdDateTime), 'yyyy-MM-dd') : x?.createdDateTime;
        return formattedDate === this.selectedDate;
      })
    }
    this.dataSource.data = filteredData;
  }

  clearFilter() {
    this.selectDivision = 'ALL';
    this.selectScheme = '';
    this.selectSchemeType = '';
    this.selectedDate = '';
    this.getAllApplicationData();
  }

  getAllApplicationData() {
    debugger
    this.propertyService.getAlloteApplication("pending").subscribe(
      (response: any) => {
        console.log(response.responseObject);
        this.dataSource.data = response.responseObject;
        this.originalDataList = this.dataSource.data;
        let schemeNameList = this.dataSource.data.map(x => x.schemeData?.schemeName);
        this.schemeNameList = schemeNameList.filter(this.onlyUnique);
        console.log('this.schemeNameList', this.schemeNameList);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  onlyUnique(value: any, index: any, array: any) {
    return array.indexOf(value) === index;
  }

  viewAllApplicationsBySchemeId(applicationId: any) {
    // this.router.navigate(['/employee/scheme/applications'], { queryParams: { schemeId: schemeId } });

    this.router.navigate(['/employee/view-application'], { queryParams: { applicationId: applicationId } });

  }

  allotApplication(applicationId: any) {

    // let docxUrl: any = '';
    debugger

    // const docxUrl = '../../../../assets/allottementorder_new1 - converted.docx';
    // this.propertyService.getTemplateByName("Allotment").subscribe((res: any) => {
    //   if (res) {
    //     docxUrl = res.path;

    //   }
    // })
    const docxUrl = '../../../../assets/allottementorder_new3 - converted.docx';
    const d = new Date();
    let year = d.getFullYear();
    let allotmentOrder = this.datePipe.transform(new Date(), 'dd-MM-yyyy')


    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Allotment',
        message: 'Are you sure you want to allot this application?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loader = true;
        let data = {
          "id": applicationId.id,
          "applicationStatus": "Accept",

        }
        const pdfdata = {
          Name: applicationId.applicantName,
          AddressLine1: applicationId.address1,
          AddressLine2: applicationId.address2,
          Pincode: applicationId.pincode,
          ApplNo: applicationId.id,
          CurrentYear: year,
          DateofAllotment: allotmentOrder,
          unitID: applicationId.unitData.unitAccountNumber,
          UnitType: applicationId.schemeData.unitType,
          Type: applicationId.schemeData.schemeType,
          UnitNo: applicationId.unitData.unitNo,
          Scheme: applicationId.schemeData.schemeName,
          ModeofAllotment: applicationId.schemeData.modeOfAllotment,
          BN: applicationId.unitData.blockNo,
          FlrNo: applicationId.unitData.floorNo,
          FN: applicationId.unitData.flatNo,
          PA: applicationId.unitData.plinthArea,
          UDS: applicationId.unitData.uds,
          projectstatus: applicationId.schemeData.projectStatus,
          unitcost: applicationId.unitData.unitCost,
          executedStatus: "Not Issued"
        };

        this.wordToPdfService.fetchAndProcessWordFile(docxUrl, pdfdata, "Allotment Order", applicationId.id);



        this.propertyService.allotApplicationByAccept(data).subscribe(
          async (responseData: any) => {
            console.log(responseData);
            if (responseData) {
              let applicationData = responseData.responseObject;
              let allotmentOrder = this.datePipe.transform(new Date(applicationData.allotedTime), 'dd-MM-yyyy')

              // const data = {
              //   Name: applicationData.applicantName,
              //   AddressLine1: applicationData.address1,
              //   AddressLine2: applicationData.address2,
              //   Pincode: applicationData.pincode,
              //   ApplNo: applicationData.id,
              //   CurrentYear: year,
              //   DateofAllotment: allotmentOrder,
              //   unitID: applicationData.unitData.unitAccountNumber,
              //   UnitType: applicationData.schemeData.unitType,
              //   Type: applicationData.schemeData.schemeType,
              //   UnitNo: applicationData.unitData.unitNo,
              //   scheme: applicationData.schemeData.schemeName,
              //   ModeofAllotment: applicationData.schemeData.modeOfAllotment,
              //   BN: applicationData.unitData.blockNo,
              //   FlrNo: applicationData.unitData.floorNo,
              //   FN: applicationData.unitData.flatNo,

              //   PA: applicationData.unitData.plinthArea,
              //   UDS: applicationData.unitData.uds,
              //   projectstatus: applicationData.schemeData.projectStatus,
              //   unitcost: applicationData.unitData.unitCost,
              // };
              // await this.wordToPdfService.fetchAndProcessWordFile(docxUrl, data).then((res) => {
              //   // this.loader = false;
              // });
              // if (pdf) {
              //   this.loader = false;
              // } else {
              //   this.loader = true;
              // }
              let getApplication = responseData.responseObject
              let alloteApplication = {
                "id": getApplication.unitData.allotteeDetails.id,
                "applicantPhotoPath": getApplication.primaryApplicantPhotoPath,
                "applicantName": getApplication.applicantName,
                "dateOfBirth": getApplication.dateOfBirth,
                "age": getApplication.age,
                "martialStatus": getApplication.martialStatus,
                "applicantAadhaarNumber": getApplication.aadhaaarNumber,
                "applicantPanNumber": getApplication.panNumber,
                "applicantFatherName": getApplication.fathersName,
                "jointApplicantName": getApplication.jointApplicantName,
                "jointApplicantDateOfBirth": getApplication.jointApplicantDateOfBirth,
                "jointApplicantAge": getApplication.jointApplicantAge,
                "jointApplicantAadhaarNumber": getApplication.jointApplicantAadharNumber,
                "relationshipWithApplicant": getApplication.relationWithApplicant,
                "joinApplicantFatherName": getApplication.jointApplicantFatherName,
                "mobileNumber": getApplication.mobileNumber,
                "emailId": getApplication.emailId,
                "addressLine1": getApplication.address1,
                "addressLine2": getApplication.address2,
                "pincode": getApplication.pincode,
                "district": getApplication.district,
                "state": getApplication.state,
                "applicantMonthlyIncome": getApplication.applicantMonthlyIncome,
                "jointApplicantMonthlyIncome": getApplication.jointApplicantMonthlyIncome,
                "totalMonthlyIncome": getApplication.totalMonthlyIncome,
                "nameOfTheBank": getApplication.nameOfTheBank,
                "branch": getApplication.branchName,
                "ifscCode": getApplication.ifscCode,
                "accountNumber": getApplication.accountNumber,
                "accountHolderName": getApplication.accountHolderName,
                "nativeCertificatePath": getApplication.nativeCertificatePath,
                "aadhaarPath": getApplication.aadhaarPath,
                "incomeCertificatePath": getApplication.incomeCertificatePath,
                "proofOfReservationMainCategory": getApplication.reservationMainCategoryPath,
                "proofOfReservationSubCategory": getApplication.proofOfReservationSubCategoryPath,
                "primaryApplicantSignature": getApplication.primaryApplicantSignaturePath,
                "jointApplicantSignature": getApplication.jointApplicantSignaturePath
              }
              this.propertyService.saveAlloteApplicationForUnit(alloteApplication).subscribe(res => {
                if (res) {
                  // let updateAlloment = {
                  //   "id": getApplication.id,
                  //   "sighnedAllotmentOrderPath": "AllotmentPath",
                  //   "description": "Allotment Order",
                  //   "lcsStatus": "Ready"
                  // }
                  // this.propertyService.updateAllotmentOrder(updateAlloment).subscribe(updateAllotmentOrder => {
                  //   if (updateAllotmentOrder) {

                  //   }

                  // })


                  this.toast.showToast('success', 'Application allotted successfully', '');
                  this.getAllApplicationData();
                }
              })

            }

            // this.propertyService.allot(applicationId).subscribe(res => {
            //   if (res) {


            //   }
            // })

            // this.router.navigate(['/employee/pending-applications']);
          },
          (error: any) => {
            console.error(error);
            this.toast.showToast('error', 'Failed to allot application', '');
          }
        );
      }
    });
  }

  rejectApplication(applicationData: any) {
    //axis bank
    debugger
    this.applicationData = applicationData;
    this.salesService.getAllPaymentsByApplicationId(applicationData?.unitData?.unitAccountNumber).subscribe(res => {
      if (res) {
        let paymentDetails = res.responseObject;
        this.paymentDetails = paymentDetails;
        let checkIsRefunded = paymentDetails.filter((x: any) => x.paymentType == 'Refund');
        if (checkIsRefunded && checkIsRefunded.length > 0) {
          // this.isRefunded = true;




        } else {
          // this.isRefunded = false;

          // this.paymentDetails = paymentDetails.filter((x: any) => x.paymentType != 'Application Fee' && x.paymentType != 'Registration Fee');
          // // this.totalAmount = _.sumBy(this.paymentDetails, 'amount');
          // let amount = this.paymentDetails
          //   .map((value: any) => parseInt(value.amount, 10)) // Step 1: Convert string to number
          //   .reduce((acc: any, current: any) => acc + current, 0);
          // this.totalAmount = amount * (10 / 100) * (2 / 100);
          // console.log('this.totalAmount', this.totalAmount);
          let unitCost = this.applicationData?.unitData?.unitCost;
          let getUnitCost = unitCost ? parseFloat(unitCost) : 0
          let amount = getUnitCost * (10 / 100) * (2 / 100);
          this.totalAmount = amount;
          debugger
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Allotment',
        message: 'Are you sure you want to Reject this application?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        debugger
        switch (this.paymentDetails[0]?.bankName) {
          case this.banks.AxisBank:
            // this.getReferenceId();
            this.axisApi();
            break;
          case this.banks.CanaraBank:
            this.canaraBank();
            break;
          case this.banks.UnionBank:
            this.unionBank();
            break;
          case this.banks.HDFCBank:
            // this.generateHDFCAlphaNumeric();

            break;
          case this.banks.ICICIBank:
            this.iciciBankRefund()
            break;
          default:
            break;
        }



        // this.canaraBank();
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
    let amount = this.totalAmount;
    let payload = {
      // beneficiaryAccNo: this.applicationData.accountNumber,
      // beneficiaryAccName: this.applicationData.accountHolderName,
      // beneficiaryBankIFSCCode: this.applicationData.ifscCode,
      // beneficiaryEmailId: this.applicationData?.customer?.email,
      // transactionAmount: amount ? amount.toFixed(2) : '0.00',
      // beneficiaryMobileNumber: this.applicationData?.customer?.contactNumber


      beneficiaryAccNo: '1224457898909',
      beneficiaryAccName: 'HALAPPA C',
      beneficiaryBankIFSCCode: 'KARB0000145',
      beneficiaryEmailId: 'exsel3@rediffmail.com',
      transactionAmount: amount ? amount.toFixed(2) : '0.00',
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

  rejectApplicationStatus() {
    let data = {
      "id": this.applicationData.id,
      "applicationStatus": "Reject"
    }


    this.propertyService.allotApplicationByAccept(data).subscribe(
      (responseData: any) => {
        console.log(responseData);
        this.toast.showToast('success', 'Application Rejected successfully', '');
        this.getAllApplicationData();


      },
      (error: any) => {
        console.error(error);
        this.toast.showToast('error', 'Failed to reject application', '');
      }
    );
  }

  canaraBank() {

    let amount = this.totalAmount;
    const data = {
      // destAcctNumber: this.applicationData.accountNumber,
      // // txnAmount: 10.00,
      // txnAmount: amount ? amount.toFixed(2) : '0.00',
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
      "schemeDataId": this.applicationData.schemeData.id,
      "unitDataId": this.applicationData.unitData.id,
      "applicationId": this.applicationData.id,
      "unitAccountNumber": this.applicationData.unitData.unitAccountNumber,
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

          "unitAccountNumber": this.applicationData.unitData.unitAccountNumber,
          "paymentId": '',
          "code": "777",
          "amount": '',
          "modeOfPayment": '',
          "bankName": '',
          "orderId": transaction[0].orderId,
          "applicationId": this.applicationData.id,
          "dateOfPayment": formattedDate,
          "refundId": transaction[0].refundId,
          "refundAmount": transaction[0].refundAmount,
          "refundDate": transaction[0].refundDate,
          "refundBank": transaction[0].refundBank,
        }]

        this.salesService.createPayment(payments).subscribe(res => {

          if (res) {
            this.rejectApplicationStatus()
          }
        })
      }

    })
  }

  changeStatus() {

  }

  getDivisionList() {

    this.http.get('https://personnelapi.tnhb.in/getAllDivisionCode').subscribe((res: any) => {
      if (res && res.data) {
        // let division = ["All"]
        // let divisionList = res.data.filter((x: any) => x != '');
        // this.divisionList = division.concat(divisionList);
        console.log(' this.divisionList', this.divisionList);
        this.divisionList = res.data.filter((x: any) => x != '');
      } else {
        this.divisionList = [];

      }
    })
  }
  iciciBankRefund() {
    let data = {
      "swirepayAccountNumber": "",
      "transferAmount": "10000",
      "transferCurrency": "INR",
      "transferMode": "NEFT",
      "transferDescription": "Refund",
      "fundAccountId": "",
      "fundAccountType": "SAVINGS",
      "fundAccountName": "SHAN",
      "fundAccountIfsc": "SBIN00059",
      "fundAccountNumber": "",
      "contactName": "SHAN",
      "transferReferenceId": "",
      "fundAccountEmail": "shanmugam@bocxy.com",
      "contactType": "VENDOR",
      "contactEmail": "shanmugam@bocxy.com",
      "contactMobile": "",
      "contactReferenceId": ""
    }
    this.paymentRefundService.ICICIBankConvertToCSV(data).subscribe(res => {
      if (res) {

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
        this.customerRef();

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
          this.customerRef(); // Add a  here if needed.
        }

      },
      (error) => {
        console.error("Error during refundAmontData call", error);
      }
    );
  }


  // encryptFun() {
  customerRef() {
    let amount = this.totalAmount;
    this.paymentRefundService.getCustomerReferenceId().subscribe(res => {
      if (res) {
        let customerRefId = res;
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
        // let data = `${this.referenceId}OpenAPI1.0TNHBTNHBDEMOCORP152NE${customerRefId}205010100130318${formaateDate}${amount}12dfkjRANCOINDUSTRIESRAI15235914020013977038MumbaiMaharashtra400101SBIN0007959STATEBANKOFINDIAranco@gmail.com7678429077${amount}M713-DN${formaateDate}0.000.000.00slfj1320384lskdjflsdjf29030234sjdlfls0w392sdfk`
        let data = {
          "channelId": "TNHB",
          "corpCode": "DEMOCORP152",
          "paymentDetails": [
            {
              "txnPaymode": "NE",
              "custUniqRef": customerRefId,
              "corpAccNum": "205010100130318",
              "valueDate": "2024-08-05",
              "txnAmount": amount,
              "beneLEI": "12dfkj",
              "beneName": this.applicationData.accountHolderName,
              "beneCode": "RAI15235",
              "beneAccNum": "914020013977038",
              "beneAcType": "",
              "beneAddr1": "",
              "beneAddr2": "",
              "beneAddr3": "",
              "beneCity": "Mumbai",
              "beneState": "Maharashtra",
              "benePincode": "400101",
              "beneIfscCode": "SBIN0007959",
              "beneBankName": "STATE BANK OF INDIA",
              "baseCode": "",
              "chequeNumber": "",
              "chequeDate": "",
              "payableLocation": "",
              "printLocation": "",
              "beneEmailAddr1": "ranco@gmail.com",
              "beneMobileNo": "7678429077",
              "productCode": "",
              "txnType": "",
              "invoiceDetails": [
                {
                  "invoiceAmount": "1888.00",
                  "invoiceNumber": "M713-DN",
                  "invoiceDate": "2024-03-09",
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
            }
          ]
        }
        this.paymentRefundService.refundAmonutData(data).subscribe(res => {

          if (res) {
            this.checkSumValue = res;
            // var EncryptPayload = {
            //   "TransferPaymentRequest": {
            //     "SubHeader": {
            //       // "requestUUID": "ABC123",
            //       "requestUUID": this.referenceId,

            //       "serviceRequestId": "OpenAPI",
            //       "serviceRequestVersion": "1.0",
            //       "channelId": "TNHB"
            //     },
            //     "TransferPaymentRequestBody": {
            //       "channelId": "TNHB",
            //       "corpCode": "DEMOCORP152",
            //       "paymentDetails": [{
            //         "txnPaymode": "NE",
            //         "custUniqRef": customerRefId,
            //         "corpAccNum": "205010100130318",//tnhb account number
            //         // "valueDate": "2020-03-06", //current date
            //         // "txnAmount": "500.00",// get value from refund
            //         "valueDate": formaateDate, //current date
            //         // "txnAmount": "500.00",// get value from refund
            //         "txnAmount": amount ? amount.toFixed(2) : '0.00',
            //         "beneLEI": "12dfkj",
            //         "beneName": this.applicationData.accountHolderName, //applicant name
            //         "beneCode": "RAI15235",
            //         // "beneAccNum": "914020013977038", // applicant account number
            //         "beneAccNum": "914020013977038", // applicant account number

            //         "beneAcType": "",
            //         "beneAddr1": "",
            //         "beneAddr2": "",
            //         "beneAddr3": "",
            //         "beneCity": this.applicationData.district,  //applicant city
            //         "beneState": this.applicationData.state,  // applicant state
            //         "benePincode": this.applicationData.pincode,   //  applicant pincode
            //         "beneIfscCode": this.applicationData.ifscCode,//applicant ifsc code
            //         "beneBankName": this.applicationData.nameOfTheBank,//applicant bank name
            //         "baseCode": "",
            //         "chequeNumber": "",
            //         "chequeDate": "",
            //         "payableLocation": "",
            //         "printLocation": "",
            //         "beneEmailAddr1": this.applicationData?.customer?.email,  //applicant email address
            //         "beneMobileNo": this.applicationData?.customer?.contactNumber,//applicant mobile no.
            //         "productCode": "",
            //         "txnType": "",
            //         "invoiceDetails": [
            //           {
            //             "invoiceAmount": "1888.00",
            //             "invoiceNumber": "M713-DN",
            //             "invoiceDate": "2018-11-21",
            //             "cashDiscount": "0.00",

            //             "tax": "0.00",
            //             "netAmount": "0.00",
            //             "invoiceInfo1": "slfj13",
            //             "invoiceInfo2": "20384lskdjf",
            //             "invoiceInfo3": "lsdjf2903",
            //             "invoiceInfo4": "0234sjdlf",
            //             "invoiceInfo5": "ls0w392sdfk"
            //           }
            //         ],
            //         "enrichment1": "",
            //         "enrichment2": "",
            //         "enrichment3": "",
            //         "enrichment4": "",
            //         "enrichment5": "",
            //         "senderToReceiverInfo": ""
            //       }], "checksum": this.checkSumValue
            //     }
            //   }
            // }
            var EncryptPayload = {
              "channelId": "TNHB",
              "corpCode": "DEMOCORP152",
              "paymentDetails": [
                {
                  "txnPaymode": "NE",
                  "custUniqRef": customerRefId,
                  "corpAccNum": "205010100130318",
                  "valueDate": "2024-08-05",
                  "txnAmount": amount,
                  "beneLEI": "12dfkj",
                  "beneName": "RANCO INDUSTRIES",
                  "beneCode": "RAI15235",
                  "beneAccNum": "914020013977038",
                  "beneAcType": "",
                  "beneAddr1": "",
                  "beneAddr2": "",
                  "beneAddr3": "",
                  "beneCity": "Mumbai",
                  "beneState": "Maharashtra",
                  "benePincode": "400101",
                  "beneIfscCode": "SBIN0007959",
                  "beneBankName": "STATE BANK OF INDIA",
                  "baseCode": "",
                  "chequeNumber": "",
                  "chequeDate": "",
                  "payableLocation": "",
                  "printLocation": "",
                  "beneEmailAddr1": "ranco@gmail.com",
                  "beneMobileNo": "7678429077",
                  "productCode": "",
                  "txnType": "",
                  "invoiceDetails": [
                    {
                      "invoiceAmount": amount,
                      "invoiceNumber": "M713-DN",
                      "invoiceDate": "2024-03-09",
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
                }
              ],
              "checksum": this.checkSumValue
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
    })

  }

  axisApi() {
    console.log("axisApi")
    let Payload = {
      "TransferPaymentRequest": {
        "SubHeader": {
          "requestUUID": this.referenceId,
          "serviceRequestId": "OpenAPI",
          "serviceRequestVersion": "1.0",
          "channelId": "TNHB"
        },
        "TransferPaymentRequestBodyEncrypted": this.encryptKey
      }
    }

    this.paymentRefundService.getLiveApiAxis(Payload).subscribe((response: any) => {
      console.log(response, "response")
    })
  }

}
