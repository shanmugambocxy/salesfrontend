import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import autoTable from 'jspdf-autotable'
import { jsPDF } from 'jspdf';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Location } from '@angular/common';
import { PaymentService } from '../services/payment.service';
import { SalesService } from '../services/sales.service';
import { ActivatedRoute } from '@angular/router';
import { Banks, PaymentType } from '../bank_enum';
import { PaymentRefundService } from '../services/payment-refund.service';
import { SharedModule } from '../shared/shared.module';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-payment-view',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './payment-view.component.html',
  styleUrl: './payment-view.component.scss'
})
export class PaymentViewComponent implements OnInit {
  @ViewChild('tabletype1', { static: false }) tabletype1: any = ElementRef;
  paymentSessionId: any = '';
  unitAccountNo: any = '';
  paymentDetails: any = '';
  banks = Banks;
  refundReason: any = '';
  remarks: any;
  isRefunded: boolean = false;
  paymentId: any = '';

  role: any;
  unitCostData: any;
  paymentTypes = PaymentType;
  applicationData: any = '';
  accountHolder: any = '';
  schemeName: any = '';
  constructor(private dialog: MatDialog,
    private location: Location,
    private paymentService: PaymentService,
    private salesService: SalesService,
    private route: ActivatedRoute,
    private paymentRefundService: PaymentRefundService,
    private toast: ToastService) {

  }
  ngOnInit() {

    this.role = sessionStorage.getItem('role');

    this.route.queryParams.subscribe(params => {
      this.unitAccountNo = params['unitAccountNo'];
      this.paymentId = params['id'];
      this.getPaymentDetails(this.paymentId);
      // this.getUnitCostByUnitAccountNo();

      console.log('getUnitcost', this.unitCostData);

    })




  }

  getPaymentDetails(id: any) {
    this.salesService.getAllPaymentsByApplicationId(this.unitAccountNo).subscribe((res: any) => {
      if (res && res.responseObject) {
        debugger
        let getPaymentList = res.responseObject;
        let checkPaymentById = getPaymentList.filter((x: any) => x.id == id);
        if (checkPaymentById && checkPaymentById.length > 0) {
          this.paymentDetails = checkPaymentById[0];
          this.getUnitCostByUnitAccountNo();
          // if (this.paymentDetails.bankName == this.banks.ICICIBank) {
          //   this.verifyPaymentForICICIBank()
          // }

        }

      }
    })
  }

  getUnitCostByUnitAccountNo() {
    this.salesService.getAllApplicationDetails(this.unitAccountNo).subscribe((res: any) => {
      if (res) {
        let applicationData = res.responseObject.filter((x: any) => x.id == this.paymentDetails?.application?.id);
        this.applicationData = applicationData.length > 0 ? applicationData[0] : '';
        this.accountHolder = this.applicationData.accountHolderName;
        this.schemeName = this.applicationData?.schemeData?.schemeName
        debugger
        console.log('applicationData', this.applicationData);

        this.unitCostData = res?.responseObject[0]?.unitData;

        console.log('this.unitCostData', this.unitCostData);

      }
    })
  }


  verifyPaymentForICICIBank() {
    debugger
    // let gID = "paymentlink-a494944ab32a42fb802c8cdf6ede6df1";
    this.paymentRefundService.getAllRefundDetails().subscribe((res: any) => {

      if (res) {
        console.log('res________');

        let getAllRefunds = res?.entity?.content;
        let checkISIdExist = getAllRefunds.filter((x: any) => x.paymentSession.gid == this.paymentDetails.reference);

        if (checkISIdExist && checkISIdExist.length > 0) {
          let refundId = checkISIdExist[0].gid
          this.isRefunded = true;
          this.paymentRefundService.getRefundById(refundId).subscribe((res: any) => {
            if (res && res.status == 'SUCCESS') {
              alert(refundId);
              this.toast.showToast('success', 'Refund Initiated SuccessFully', '');
              this.location.back();
            }
          })
        } else {
          this.isRefunded = false;

        }
      }
    })
  }



  getRufundAmount(Cost: any) {
    debugger
    let refundAmount: any;
    let paidAmount = Cost ? parseFloat(Cost) : 0;

    if (this.applicationData.modeOfAllotment == 'Yet to be Started') {


      if (this.paymentDetails.paymentType == this.paymentTypes.MaintenanceCharges) {
        let MCCost = this.unitCostData.mcDemand ? parseFloat(this.unitCostData.mcDemand) : 0;
        let getRefundAmount = MCCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.GST) {
        let GSTCost = this.unitCostData.gst ? parseFloat(this.unitCostData.gst) : 0;
        let getRefundAmount = GSTCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.CarParkingDemand) {
        let carParkingCost = this.unitCostData.carParkingDemand ? parseFloat(this.unitCostData.carParkingDemand) : 0;
        let getRefundAmount = carParkingCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      }
      return refundAmount;

    } else if (this.applicationData.modeOfAllotment == 'Self Finance') {
      if (this.paymentDetails.paymentType == this.paymentTypes.FIRSTAMOUNTDUE) {
        let firstAmountCost = this.unitCostData.firstAmountDue ? parseFloat(this.unitCostData.firstAmountDue) : 0;
        let getRefundAmount = firstAmountCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.SECONDAMOUNTDUE) {
        let secondAmountCost = this.unitCostData.secondAmountDue ? parseFloat(this.unitCostData.secondAmountDue) : 0;
        let getRefundAmount = secondAmountCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.THIRDAMOUNTDUE) {
        let thirdAmountCost = this.unitCostData.thirdAmountDue ? parseFloat(this.unitCostData.thirdAmountDue) : 0;
        let getRefundAmount = thirdAmountCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.FOURTHAMOUNTDUE) {
        let fourthAmountCost = this.unitCostData.fourthAmountDue ? parseFloat(this.unitCostData.fourthAmountDue) : 0;
        let getRefundAmount = fourthAmountCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.FIFTHAMOUNTDUE) {
        let fourthAmountCost = this.unitCostData.fifthAmountDue ? parseFloat(this.unitCostData.fifthAmountDue) : 0;
        let getRefundAmount = fourthAmountCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.SIXTHAMOUNTDUE) {
        let sixthAmountCost = this.unitCostData.sixthAmountDue ? parseFloat(this.unitCostData.sixthAmountDue) : 0;
        let getRefundAmount = sixthAmountCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.SEVENTHAMOUNTDUE) {
        let seventhAmountCost = this.unitCostData.seventhAmountDue ? parseFloat(this.unitCostData.seventhAmountDue) : 0;
        let getRefundAmount = seventhAmountCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.EIGHTAMOUNTDUE) {
        let eightAmountCost = this.unitCostData.eighthAmountDue ? parseFloat(this.unitCostData.eighthAmountDue) : 0;
        let getRefundAmount = eightAmountCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.NINTHAMOUNTDUE) {
        let ninthAmountCost = this.unitCostData.ninthAmountDue ? parseFloat(this.unitCostData.ninthAmountDue) : 0;
        let getRefundAmount = ninthAmountCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      }
      else if (this.paymentDetails.paymentType == this.paymentTypes.TENTHAMOUNTDUE) {
        let tenthAmountCost = this.unitCostData.tenthAmountDue ? parseFloat(this.unitCostData.tenthAmountDue) : 0;
        let getRefundAmount = tenthAmountCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.ELEVENTHAMOUNTDUE) {
        let eleventhAmountCost = this.unitCostData.eleventhAmountDue ? parseFloat(this.unitCostData.eleventhAmountDue) : 0;
        let getRefundAmount = eleventhAmountCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.TWELTHAMOUNTDUE) {
        let twelthAmountCost = this.unitCostData.twelfthAmountDue ? parseFloat(this.unitCostData.twelfthAmountDue) : 0;
        let getRefundAmount = twelthAmountCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.THIRTEENTHAMOUNTDUE) {
        let thirteenthAmountCost = this.unitCostData.thirteenthAmountDue ? parseFloat(this.unitCostData.thirteenthAmountDue) : 0;
        let getRefundAmount = thirteenthAmountCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.BELATEDINTEREST) {
        let belatedInterestAmountCost = this.unitCostData.belatedInterest ? parseFloat(this.unitCostData.belatedInterest) : 0;
        let getRefundAmount = belatedInterestAmountCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.DifferenceIncost) {
        let differenceCost = this.unitCostData.differenceCost ? parseFloat(this.unitCostData.differenceCost) : 0;
        let getRefundAmount = differenceCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.MaintenanceCharges) {
        let MCCost = this.unitCostData.mcDemand ? parseFloat(this.unitCostData.mcDemand) : 0;
        let getRefundAmount = MCCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.GST) {
        let GSTCost = this.unitCostData.gst ? parseFloat(this.unitCostData.gst) : 0;
        let getRefundAmount = GSTCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.CarParkingDemand) {
        let carParkingCost = this.unitCostData.carParkingDemand ? parseFloat(this.unitCostData.carParkingDemand) : 0;
        let getRefundAmount = carParkingCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      }
      return refundAmount;

    } else if (this.applicationData.modeOfAllotment == 'Outright Purchase') {


      if (this.paymentDetails.paymentType == this.paymentTypes.UnitPayment) {
        let unitCost = this.unitCostData.unitCost ? parseFloat(this.unitCostData.unitCost) : 0;
        let getRefundAmount = unitCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.MaintenanceCharges) {
        let MCCost = this.unitCostData.mcDemand ? parseFloat(this.unitCostData.mcDemand) : 0;
        let getRefundAmount = MCCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.GST) {
        let GSTCost = this.unitCostData.gst ? parseFloat(this.unitCostData.gst) : 0;
        let getRefundAmount = GSTCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.CarParkingDemand) {
        let carParkingCost = this.unitCostData.carParkingDemand ? parseFloat(this.unitCostData.carParkingDemand) : 0;
        let getRefundAmount = carParkingCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      }
      return refundAmount;

    } else {
      if (this.paymentDetails.paymentType == this.paymentTypes.EMI) {
        let EMICost = this.unitCostData.emi ? parseFloat(this.unitCostData.emi) : 0;
        let getRefundAmount = EMICost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.PENALINTEREST) {
        let penalInterestCost = this.unitCostData.penalIndus ? parseFloat(this.unitCostData.penalIndus) : 0;
        let getRefundAmount = penalInterestCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.LUMPSUM) {
        let lumpsumCost = this.unitCostData.lumsum ? parseFloat(this.unitCostData.lumsum) : 0;
        let getRefundAmount = lumpsumCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.LUMPSUM) {
        let foreclosureCost = this.unitCostData.foreclosure ? parseFloat(this.unitCostData.foreclosure) : 0;
        let getRefundAmount = foreclosureCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.MaintenanceCharges) {
        let MCCost = this.unitCostData.mcDemand ? parseFloat(this.unitCostData.mcDemand) : 0;
        let getRefundAmount = MCCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.GST) {
        let GSTCost = this.unitCostData.gst ? parseFloat(this.unitCostData.gst) : 0;
        let getRefundAmount = GSTCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      } else if (this.paymentDetails.paymentType == this.paymentTypes.CarParkingDemand) {
        let carParkingCost = this.unitCostData.carParkingDemand ? parseFloat(this.unitCostData.carParkingDemand) : 0;
        let getRefundAmount = carParkingCost * (10 / 100) * 2 / 100;
        refundAmount = Math.abs(getRefundAmount - paidAmount);

      }
      return refundAmount;
    }
  }


  refundInitiate(amount: any) {
    debugger
    // if(this.paymentDetails.paymentType=='')
    // let unitCost=unitCost?parseFloat(unitCost):0;
    let refundAmount: any;
    refundAmount = this.getRufundAmount(amount);
    debugger
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Refund',
        message: `Are you sure you want to Cancel And Refund Amount ₹${refundAmount}?`
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        if (this.paymentDetails.bankName == this.banks.ICICIBank) {
          // let data = {
          //   "description": "Refund",
          //   "refundReason": this.refundReason,
          //   "amountRefunded": amount ? parseFloat(amount) : 0,
          //   // "amountRefunded": 100,

          //   "refundNote": this.remarks
          // }


          let data = {
            "description": "full Refund For Charge({{invoiceno}})",
            "refundReason": "REQUESTED_BY_CUSTOMER",
            "amountRefunded": amount ? parseFloat(amount) : 0,
            "refundNote": "full Refund For Charge({{invoiceno}})"
          }
          if (this.paymentDetails.reference) {
            this.paymentRefundService.initiateRefundICICI(this.paymentDetails.reference, data).subscribe((res: any) => {

              if (res && res.status == 'SUCCESS') {
                this.verifyPaymentForICICIBank();


              }

            })
          }

        } else if (this.paymentDetails.bankName == this.banks.CanaraBank) {
          const data = {
            destAcctNumber: this.applicationData.accountNumber,
            txnAmount: refundAmount,
            benefName: this.applicationData.accountHolderName,
            ifscCode: this.applicationData.ifscCode,
            narration: '96389290863'
            // narration: ''
          };

          this.paymentRefundService.initiateRefundCanarabank(data).subscribe(
            (response) => {
              console.log('Fund transfer successful:', response);
              if (response.responseStatus) {
                const encryptedData = response.responseObject;
                console.log
                  ("encrypted____", encryptedData)
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
                            console.log
                              ("encrypted1____", encryptedData1)

                            this.paymentRefundService.decryptcanarabank(encryptedData1).subscribe(
                              (decryptedresponse) => {
                                if (decryptedresponse && decryptedresponse.PaymentStatusInquiryDTO) {
                                  console.log('Decrypted response2______:', decryptedresponse);
                                  this.toast.showToast('success', "Refund Processed Successfull", '')
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


      }

    })


  }
  back() {
    this.location.back();
  }

  convertHtmlData() {
    debugger
    let margin = { top: 45 };

    let table: any = '';
    let title: any = '';
    try {

      table = this.tabletype1.nativeElement;
      title = 'View Payments';






      let currentdate = new Date();
      let formaateDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0')
        + "-" + currentdate.getDate().toString().padStart(2, '0') + ' ' + currentdate.getHours().toString().padStart(2, '0') + ":" + currentdate.getMinutes().toString().padStart(2, '0');
      console.log('formate', formaateDate);
      let getExportdata = [];
      var fileName: any = '';

      // getDataList.push(['Total', '', '', '', this.totalSanctioned, this.totalPresent, this.totalVacant])

      // const arrayOfArrays = getExportdata.map(obj => Object.values(obj));
      const doc = new jsPDF();
      // const imageUrl = '../../../../assets/Tnhbnew1.png'; // Replace with the path to your image
      const imageUrl = 'assets/Tnhbnew.jpg'; // Replace with the path to your image

      // doc.addImage(imageUrl, 'png', 70, 10, 40, 40);
      const imageWidth = 25; // Adjust the image width as needed
      const pdfWidth = doc.internal.pageSize.getWidth();

      // const imageX = (pdfWidth - imageWidth) / 2;
      const imageX = 10;
      // doc.addImage(imageUrl, 'JPG', 50, 50, 100, 100, '', 'NONE', 0.5);


      const imageY = 5; // Adjust the top margin as needed
      doc.setFontSize(14);
      doc.setTextColor(14, 31, 83);


      // doc.text(title, 95, 35, { align: 'center' });


      doc.setFontSize(10);


      autoTable(doc, {
        // theme: 'plain',
        theme: 'grid',

        html: table,
        // rowPageBreak: 'avoid',
        // styles: {},
        // styles: { overflow: 'linebreak', cellWidth: 'auto' },

        styles: {
          overflow: 'linebreak', cellWidth: 'auto',
          // fillColor: [255, 255, 255]
        },
        headStyles: {
          fillColor: [14, 31, 83],
          // fillColor: [255, 255, 255],

          // Header background color
          textColor: 255, // Header text color
          // textColor: '#0E1F5',
          fontSize: 10, // Header font size

        },
        bodyStyles: {
          textColor: 0, // Body text color
          fontSize: 10, // Body font size

        },
        alternateRowStyles: {
          fillColor: [255, 255, 255] // Alternate row background color
        },

        columnStyles: {
          // 0: { halign: "center" },
          // 1: { halign: "center" },
          // 4: { halign: "right" },
          // 5: { halign: "right" },
          // 6: { halign: "right" },
          // 0: { cellWidth: 60 },
          // 1: { cellWidth: 5 },

          // 2: {cellWidth: 80},

        },
        // margin: { top: 45 },
        margin: margin,

        pageBreak: 'auto',

        didDrawPage: (data) => {

          const x = data.settings.margin.left + (data.settings.margin.right - data.settings.margin.left) / 2;
          const y = data.settings.margin.top;
          doc.addImage(imageUrl, 'png', 0, 0, 200, 30);


          doc.setTextColor(14, 31, 83);


          doc.setFontSize(10);


          // doc.text(imageUrl, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2, {
          //   angle: 45,
          //   align: 'center'
          // });

          // doc.addImage(imageUrl, 'PNG', 50, 100, 100, 100, undefined, 'SLOW');

          // // Optional: Add transparency to the watermark
          // doc.setGState(doc.GState({ opacity: 0.1 }));

          doc.text('Page:' + ' ' + data.pageNumber + ', ' + 'Generated on: ' + formaateDate, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

        },


      },)




      if (getExportdata.length > 0) {
        setTimeout(() => {
          doc.save(fileName + '.pdf');
        }, 100);

      } else {
        doc.save(fileName + '.pdf');
      }

    } catch (error) {
      console.log('error', error);


    }

  }
}
