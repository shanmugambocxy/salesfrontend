import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PropertyService } from '../../services/property.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import { SharedModule } from '../../shared/shared.module';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import autoTable from 'jspdf-autotable'
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-echallencreate',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './echallencreate.component.html',
  styleUrl: './echallencreate.component.scss'
})
export class EchallencreateComponent {

  applicationForm!: FormGroup;
  receiptType: any = '';
  receiptList: any = ["SFS-Installment", "Balance Cost(90%)", "EMI", "Difference Cost", "MC", "Car Parking", "GST", "Interest", "Penal Interest"]
  branchList: any = '';
  paymentType: any = '';
  drawnBank: any = '';
  applicationId: any;
  unitAccountNo: any;

  selectedData: any[] = [];
  demandName: any;

  totalDueAmount: any = 0;
  totalInterest: any = 0;

  receiptInfo: boolean = false;
  bankList: any = [];
  totalAmount: any = 0;

  applicationDetails: any = '';
  unitData: any = '';
  schemeData: any = '';
  customerData: any = '';
  schemeId: any;
  unitId: any = '';
  projectStatus: any = '';
  getInterestData: any = [];
  getInstallmentData: any = [];
  constructor(
    private fb: FormBuilder,
    private title: Title,
    private propertyService: PropertyService,
    private dialog: MatDialog,
    private toast: ToastService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private salesService: SalesService,

  ) {


    const navigation = this.router.getCurrentNavigation();
    // this.selectedData = navigation?.extras?.state?.['selectedData'] || [];
    let selectedData = navigation?.extras?.state?.['selectedData'] || [];

    debugger

    let projectStatus = navigation?.extras?.state?.['projectStatus'] || [];
    this.projectStatus = projectStatus;
    if (projectStatus == "Self Finance") {
      this.getInterestData = [];
      this.getInstallmentData = [];
      let accountCodeList: any = [];
      this.propertyService.getAllUnitCode().subscribe(res => {
        if (res) {

          //interest code
          let accountCode = res.responseObject.filter((x: any) => x.code == "129");
          let accountDescription = accountCode.length > 0 ? accountCode[0].payType : "";

          //cgst
          let accountCodeCGST = res.responseObject.filter((x: any) => x.code == "751");
          let accountCodeCGSTDesc = accountCodeCGST.length > 0 ? accountCodeCGST[0].payType : "";

          //sgst

          let accountCodeSGST = res.responseObject.filter((x: any) => x.code == "752");
          let accountCodeSGSTDesc = accountCodeSGST.length > 0 ? accountCodeSGST[0].payType : "";
          selectedData.forEach((element: any) => {

            if (element.label == "GST") {
              let gstSplitAmount = parseInt(element.Dueamount) ? parseInt(element.Dueamount) : 0;
              let Splitamount = (gstSplitAmount / 2).toString();
              let data = [{
                Date: element.Date,
                Description: element.Description,
                Dueamount: element.Dueamount,
                Interest: element.Interest,
                InterestCollected: element.InterestCollected,
                applicationId: element.applicationId,
                checked: element.checked,
                dueBalance: element.dueBalance,
                dueCollected: element.dueCollected,
                interestBalance: element.interestBalance,
                isAvailable: element.isAvailable,
                isPartCollected: element.isPartCollected,
                isPartInterestCollected: element.isPartInterestCollected,
                partPayment: element.partPayment,
                status: element.status,
                totalDueAmount: element.totalDueAmount,
                type: "GST",
                label: "CGST",
                totalAmount: Splitamount,
                code: "751",
                // codeDescription: element.codeDescription
                codeDescription: accountCodeCGSTDesc

              },
              {
                Date: element.Date,
                Description: element.Description,
                Dueamount: element.Dueamount,
                Interest: element.Interest,
                InterestCollected: element.InterestCollected,
                applicationId: element.applicationId,
                checked: element.checked,
                dueBalance: element.dueBalance,
                dueCollected: element.dueCollected,
                interestBalance: element.interestBalance,
                isAvailable: element.isAvailable,
                isPartCollected: element.isPartCollected,
                isPartInterestCollected: element.isPartInterestCollected,
                partPayment: element.partPayment,
                status: element.status,
                totalDueAmount: element.totalDueAmount,
                type: "GST",
                label: "SGST",
                totalAmount: Splitamount,
                code: "752",
                // codeDescription: element.codeDescription
                codeDescription: accountCodeSGSTDesc

              }]
              this.selectedData = [];
              this.selectedData = data;

            } else {
              if (element.dueBalance > 0) {
                // element.type = "Installment - SFS";
                // element.totalAmount = element.Dueamount;


                let data = {
                  Date: element.Date,
                  Description: element.Description,
                  Dueamount: element.Dueamount,
                  Interest: element.Interest,
                  InterestCollected: element.InterestCollected,
                  applicationId: element.applicationId,
                  checked: element.checked,
                  dueBalance: element.dueBalance,
                  dueCollected: element.dueCollected,
                  interestBalance: element.interestBalance,
                  isAvailable: element.isAvailable,
                  isPartCollected: element.isPartCollected,
                  isPartInterestCollected: element.isPartInterestCollected,
                  partPayment: element.partPayment,
                  status: element.status,
                  totalDueAmount: element.totalDueAmount,
                  type: "Installment - SFS",
                  label: element.label,
                  totalAmount: element.Dueamount,
                  code: element.code,
                  // codeDescription: element.codeDescription
                  codeDescription: element.codeDescription

                }
                this.getInstallmentData.push(data);
              }

              if (element.interestBalance > 0) {
                let data = {
                  Date: element.Date,
                  Description: element.Description,
                  Dueamount: element.Dueamount,
                  Interest: element.Interest,
                  InterestCollected: element.InterestCollected,
                  applicationId: element.applicationId,
                  checked: element.checked,
                  dueBalance: element.dueBalance,
                  dueCollected: element.dueCollected,
                  interestBalance: element.interestBalance,
                  isAvailable: element.isAvailable,
                  isPartCollected: element.isPartCollected,
                  isPartInterestCollected: element.isPartInterestCollected,
                  partPayment: element.partPayment,
                  status: element.status,
                  totalDueAmount: element.totalDueAmount,
                  type: "Interest - SFS",
                  label: element.label,
                  totalAmount: element.Interest,
                  code: "129",
                  // codeDescription: element.codeDescription
                  codeDescription: accountDescription

                }
                this.getInterestData.push(data);
              }
              this.selectedData = this.getInstallmentData.concat(this.getInterestData);

            }


          });
          // this.selectedData = selectedData.concat(getInterestData);
          // this.selectedData = this.getInstallmentData.concat(this.getInterestData);


          if (this.selectedData.length > 0) {
            this.receiptInfo = true;
          }
          this.totalAmount = this.selectedData
            .map((value: any) => value.totalAmount ? parseFloat(value.totalAmount) : 0) // Step 1: Convert string to number
            .reduce((acc: any, current: any) => acc + current, 0);
        }
      });

    } else {
      this.selectedData = selectedData;
      this.totalAmount = this.selectedData
        .map((value: any) => value.totalAmount ? parseFloat(value.totalAmount) : 0) // Step 1: Convert string to number
        .reduce((acc: any, current: any) => acc + current, 0);

      if (this.selectedData.length > 0) {
        this.receiptInfo = true;
      }
    }



    console.log(this.selectedData, 'this.selectedData'); // Access the passed data here
    // Add value change listeners to format the values
    // this.challanFun(this.selectedData)

  }

  async getAccountList() {
    let getCode = await this.propertyService.getAllUnitCode().toPromise();
    return { getCode };
  }

  ngOnInit(): void {
    debugger
    this.applicationForm = this.fb.group({
      "unitAccountNumber": ['', Validators.required],
      "unitNo": ['', Validators.required],
      "schemeName": ['', Validators.required],
      "type": ['', Validators.required],
      "nameOfTheDivision": ['', Validators.required],
      "email": ['', Validators.required],
      "contactNumber": ['', Validators.required],
      "receiptType": [''],
      "challanAmount": ['', Validators.required],
      "bankName": ['', Validators.required],
      "ifscCode": ['', Validators.required],
      "paymentType": ['', Validators.required],
      "instrumentNumber": [''],
      "instrumentDate": [''],
      "drawnBank": [''],
      "chellanCreatedTime": ['', Validators.required],
      "chellanExpiryDateTime": ['', Validators.required],
      "chellanStatus": [''],
      "applicationId": ['', Validators.required],
      "paymentMethod": ['OFFLINE', Validators.required],
      "nameOfTheAllottee": ['', Validators.required],
      "virtualCode": [''],
      "virtualAccountNumber": [''],
    });


    this.route.queryParams.subscribe(params => {
      console.log(params, "params")
      this.demandName = params['demands']
      console.log(this.demandName, "demand name")
      this.applicationId = params['applicationId'];
      this.unitAccountNo = params['unitaccountno'];
      this.propertyService.getApplicationById(this.applicationId).subscribe(res => {
        if (res) {
          this.applicationDetails = res;
          this.customerData = res.customer;
          this.schemeData = res.schemeData;
          this.unitData = res.unitData;
          this.schemeId = this.schemeData.id;
          this.unitId = this.unitData.id;
          this.applicationForm.controls['applicationId'].setValue(this.applicationId)
          this.applicationForm.controls['unitAccountNumber'].setValue(res.unitData.unitAccountNumber)
          this.applicationForm.controls['unitNo'].setValue(res.unitData.unitNo)
          this.applicationForm.controls['nameOfTheAllottee'].setValue(res.applicantName)
          this.applicationForm.controls['type'].setValue(res.schemeData.schemeType)
          this.applicationForm.controls['nameOfTheDivision'].setValue(res.schemeData.nameOfTheDivision)
          this.applicationForm.controls['email'].setValue(res.emailId)
          this.applicationForm.controls['contactNumber'].setValue(res.mobileNumber)
          this.applicationForm.controls['schemeName'].setValue(res.schemeData.schemeName);
          this.applicationForm.controls['challanAmount'].setValue(this.totalAmount.toFixed(2));
          this.applicationForm.controls['chellanStatus'].setValue("Pending");
        }
      })

      // const navigation = this.router.getCurrentNavigation();
      // // this.selectedData = navigation?.extras?.state?.['selectedData'] || [];
      // let selectedData = navigation?.extras?.state?.['selectedData'] || [];

      // debugger

      // let projectStatus = navigation?.extras?.state?.['projectStatus'] || [];
      // if (projectStatus == 'Self Finance') {


      //   let getInterestData: any = [];
      //   selectedData.forEach((element: any) => {
      //     element.type = "Installment";
      //     element.TotalAmount = element.Dueamount;
      //     let data = {
      //       Date: element.Date,
      //       Description: element.Description,
      //       Dueamount: element.Dueamount,
      //       Interest: element.Interest,
      //       InterestCollected: element.InterestCollected,
      //       applicationId: element.applicationId,
      //       checked: element.checked,
      //       dueBalance: element.dueBalance,
      //       dueCollected: element.dueCollected,
      //       interestBalance: element.interestBalance,
      //       isAvailable: element.isAvailable,
      //       isPartCollected: element.isPartCollected,
      //       isPartInterestCollected: element.isPartInterestCollected,
      //       partPayment: element.partPayment,
      //       status: element.status,
      //       totalDueAmount: element.totalDueAmount,
      //       type: "Interest",
      //       TotalAmount: element.Interest
      //     }
      //     getInterestData.push(data);
      //   });
      //   this.selectedData = selectedData.concat(getInterestData);

      // }
      // if (this.selectedData.length > 0) {
      //   this.receiptInfo = true;
      // }

    })
    this.title.setTitle('Income Category');

    // const navigation = this.router.getCurrentNavigation();
    // this.selectedData = navigation?.extras?.state?.['selectedData'] || [];
    // let selectedData = navigation?.extras?.state?.['selectedData'] || [];


    console.log(this.selectedData); // Access the passed data here
    // Add value change listeners to format the values
    this.getBankWithIFSCcode();
  }
  getBankWithIFSCcode() {
    this.propertyService.getAllBankIFSC().subscribe(res => {
      if (res) {
        this.bankList = res.responseObject
      }
    })
  }

  challanFun(data: any) {
    data.forEach((item: any) => {
      this.totalDueAmount += parseFloat(item.Dueamount); // Convert Dueamount to number and sum
      this.totalInterest += item.Interest; // Sum Interest directly
      this.receiptInfo = true;


    });
  }

  changeBankIFSCcode() {
    debugger
    let bankList = this.bankList.filter((x: any) => x.bankName == this.branchList);
    if (bankList.length > 0) {
      this.applicationForm.controls['ifscCode'].setValue(bankList[0].ifscCode)
      let virtualCode = this.applicationForm.controls['virtualCode'].value
      let unitAccountNo = this.applicationForm.controls['unitAccountNumber'].value;

      this.applicationForm.controls['virtualAccountNumber'].setValue(virtualCode + unitAccountNo);

    }

  }

  Submit() {

    const now = new Date();
    const nextDay = new Date(now);
    nextDay.setDate(nextDay.getDate() + 1); // Add one day


    this.applicationForm.controls['chellanCreatedTime'].setValue(now.toISOString());
    this.applicationForm.controls['chellanExpiryDateTime'].setValue(nextDay.toISOString());
    // this.applicationForm.value.paymentMethod = "OFFLINE";
    let receiptData: any = [];
    this.selectedData.forEach(element => {
      let data = {
        code: element.code,
        // description: element.type,
        description: element.codeDescription,
        installment: element.label,
        amount: element.totalAmount ? element.totalAmount : ''
      }
      receiptData.push(data)

    });
    // ] (x => {
    //   x.code = "",
    //     x.description = x.type,
    //     x.installment = x.label,
    //     x.amount = x.totalAmount
    // }
    // )
    console.log('ReceiptData', receiptData);
    this.applicationForm.value.receiptType = receiptData;
    let formData = this.applicationForm.value;
    debugger

    if (this.applicationForm.valid) {
      this.propertyService.createChallan(formData).subscribe((res: any) => {
        if (res.responseStatus == true) {
          this.toast.showToast('success', "E - Challan Created Successfully", '');
          this.Submit1(res.responseObject.echallanNumber);
          this.back();
          // let paymentList: any = [];
          // const date = new Date();
          // const formattedDate = date.toLocaleString('en-US', {
          //   month: 'numeric',
          //   day: 'numeric',
          //   year: 'numeric',
          //   hour: 'numeric',
          //   minute: 'numeric',
          //   second: 'numeric',
          //   hour12: true
          // });
          // this.selectedData.forEach((element: any) => {
          //   let data = {

          //     "paymentType": element.Description,
          //     "paymentMethod": "Echallan",
          //     "cost": element.partPayment ? (element.isPartInterestCollected + element.isPartCollected) : element.totalDueAmount,
          //     "paymentDateAndTime": formattedDate,
          //     "description": "",
          //     "schemeDataId": this.schemeId,
          //     "unitDataId": this.unitId,
          //     "applicationId": this.applicationId,
          //     "unitAccountNumber": this.unitData.unitAccountNumber,
          //     "paymentId": res.responseObject.echallanNumber,
          //     "bankName": this.applicationForm.value.bankName,
          //     "orderId": '',
          //     "reference": '',
          //     "refundDescription": "",
          //     "refundId": "",
          //     "refundAmount": "",
          //     "refundDate": "",
          //     "refundBank": "",

          //   }
          //   paymentList.push(data)
          // });

          // console.log('response _axis', JSON.stringify(Response));

          // this.createPayment(paymentList);
          // this.back();
          // this.Submit1();
        }
      })
    } else {
      this.toast.showToast('warning', "Please Fill All The Required Fields", '');

    }

  }
  Submit1(challanNumber: any) {
    let installmentList: any = [];
    let interestList: any = [];
    let receiptData: any = [];

    let checkIsInstallment = this.selectedData.filter((x: any) => x.type == 'Installment - SFS' || x.type == 'Interest - SFS')
    if (checkIsInstallment && checkIsInstallment.length > 0) {

      if (this.getInstallmentData && this.getInstallmentData.length > 0) {
        let totalInstallmentAmount: any = 0
        totalInstallmentAmount = this.getInstallmentData
          .map((value: any) => value.totalAmount ? parseInt(value.totalAmount) : 0) // Step 1: Convert string to number
          .reduce((acc: any, current: any) => acc + current, 0);
        let data = {
          "code": this.getInstallmentData[0].code,
          "codeDescription": this.getInstallmentData[0].codeDescription,

          "totalAmount": totalInstallmentAmount
        }
        installmentList.push(data);

      }

      if (this.getInterestData && this.getInterestData.length > 0) {
        let totalInterestAmount: any = 0
        totalInterestAmount = this.getInterestData
          .map((value: any) => value.totalAmount ? parseInt(value.totalAmount) : 0) // Step 1: Convert string to number
          .reduce((acc: any, current: any) => acc + current, 0);
        let data = {
          "code": this.getInterestData[0].code,
          "codeDescription": this.getInterestData[0].codeDescription,

          "totalAmount": totalInterestAmount
        }
        interestList.push(data);

      }

      receiptData = installmentList.concat(interestList);

    } else {
      receiptData = this.selectedData;
    }
    let date: any = this.datePipe.transform(new Date(), 'dd-MM-yyyy')
    // Create a new jsPDF instance
    const doc = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size

    // Load watermark background image
    const imageUrl = '../../../assets/housingboard_outline.png'; // Path to your watermark image
    const headerImageUrl = '../../../assets/images/tnhb_logo12.png';

    const img = new Image();
    img.src = imageUrl;
    let amount = this.totalAmount ? parseFloat(this.totalAmount) : 0
    let convertToWords = this.propertyService.convertAmountToWords(amount).toUpperCase();

    img.onload = () => {
      // Add watermark image to PDF with transparency

      doc.addImage(headerImageUrl, 'png', 30, 5, 20, 20);
      // const addWatermark = () => {
      //   doc.setGState(doc.GState({ opacity: 1 })); // Set opacity to 10%
      //   doc.addImage(imageUrl, 'PNG', 50, 80, 100, 100);
      //   doc.setGState(doc.GState({ opacity: 1 })); // Reset opacity to default
      // };

      doc.text('Tamil Nadu Housing Board', 60, 15); // Header for the label column

      doc.addImage(img, 'PNG', 50, 80, 100, 100, '', 'NONE', 0.1); // Adjust x, y, width, height and opacity

      // Add form data text on top of the watermark
      // Set font and text color
      // doc.setFontSize(14);
      doc.setTextColor(0, 0, 0); // Black text color


      doc.setFontSize(12);
      doc.text('E-challan', 90, 30);
      doc.text('Payable at - Managing Director,Tamil Nadu Housing Board', 60, 35);
      doc.text('Remitter Copy', 90, 40);

      // Column headers (labels)
      doc.setFontSize(12);
      doc.text('Challan Number:', 15, 50); // Header for the label column
      doc.setFontSize(10);
      doc.text(challanNumber, 55, 50);
      doc.setFontSize(12);
      doc.text('Challan Date:', 140, 50); // Header for the label column
      doc.setFontSize(10);
      doc.text(date, 170, 50);
      doc.line(10, 55, 200, 55);

      doc.text('Unit Account No.', 15, 60); // Header for the label column
      doc.text('Unit No.', 90, 60); // Header for the value column
      doc.text('Name of the Allottee', 140, 60);
      // Add a separator line for clarity
      // doc.line(10, 35, 200, 35); // Draw a line to separate the header from data
      doc.setFontSize(10);
      // First column: Labels
      doc.text(this.applicationForm.value.unitAccountNumber, 15, 65);
      doc.text(this.applicationForm.value.unitNo, 90, 65);
      doc.text(this.applicationForm.value.nameOfTheAllottee, 140, 65);

      doc.setFontSize(12);
      doc.text('Scheme Name', 15, 75); // Header for the label column
      doc.text('Type', 90, 75); // Header for the value column
      doc.text('Name of the Division', 140, 75);
      // Add a separator line for clarity
      // doc.line(10, 35, 200, 35); // Draw a line to separate the header from data
      doc.setFontSize(10);
      // First column: Labels
      doc.text(this.applicationForm.value.schemeName, 15, 80);
      doc.text(this.applicationForm.value.type, 90, 80);
      doc.text(this.applicationForm.value.nameOfTheDivision, 140, 80);


      doc.setFontSize(12);
      doc.text('Email', 15, 95); // Header for the label column
      // doc.text('Type.', 60, 45); // Header for the value column
      doc.text('Contact No.', 140, 95);

      doc.setFontSize(10);
      // First column: Labels
      doc.text(this.applicationForm.value.email, 15, 100);
      // doc.text(`HIG`, 60, 65);
      doc.text(this.applicationForm.value.contactNumber, 140, 100);

      doc.line(10, 105, 200, 105);
      // doc.setFontSize(12);
      // doc.text('Receipt Type', 15, 115); // Header for the label column
      // doc.text('Account Code', 140, 115); // Header for the value column
      // // doc.text('Amount', 140, 115);

      // // doc.line(10, 73, 200, 73); // Draw a line to separate the header from data

      // doc.setFontSize(10);
      // // First column: Labels
      // doc.text('offline', 15, 120);
      // doc.text(`020305025555`, 90, 120);
      // doc.text(`100.0`, 140, 120);


      doc.setFontSize(12);
      doc.text('Payment Type', 15, 115); // Header for the label column
      // doc.text('InstrumentNo', 60, 135); // Header for the value column
      // doc.text('Instrument Date', 110, 135);
      // doc.text('Bank Ref No', 160, 135);
      doc.text('Payment Mode', 60, 115); // Header for the value column
      doc.text('Payment Status', 110, 115);
      doc.text('Virtual Code', 160, 115);

      doc.setFontSize(10);
      // First column: Labels
      doc.text(this.paymentType, 20, 120);
      doc.text(`Offline`, 65, 120);
      doc.text(`Pending`, 115, 120);
      doc.text(`TNHBUBI`, 165, 120);


      doc.setFontSize(12);
      doc.text('Challan Amount', 15, 130); // Header for the label column
      doc.setFontSize(10);
      doc.text(this.totalAmount.toString(), 20, 135);
      doc.setFontSize(12);
      doc.text('Bank Name', 90, 130); // Header for the label column
      doc.setFontSize(10);
      doc.text(this.applicationForm.value.bankName, 90, 135);
      doc.setFontSize(12);
      doc.text('IFSC Code', 140, 130);
      doc.setFontSize(10);
      doc.text(this.applicationForm.value.ifscCode, 140, 135);


      doc.setFontSize(12);
      doc.text('Virtual Account Number :', 15, 145); // Header for the label column
      doc.setFontSize(10);
      doc.text("TNHBUBI" + this.applicationForm.value.unitAccountNumber, 65, 145);




      doc.setFontSize(12);
      doc.text('Amount (in words):', 15, 155); // Header for the label column
      doc.setFontSize(10);
      doc.text(convertToWords, 65, 155);
      doc.setFontSize(12);
      doc.line(10, 160, 200, 160);



      let getExportdata: any = [];

      // this.selectedData.forEach((element: any, index: any) => {
      //   let data = [
      //     index + 1,
      //     element.code,
      //     // element.type,
      //     element.codeDescription,

      //     // element.label,
      //     element.totalAmount
      //   ]
      //   getExportdata.push(data);
      // });

      receiptData.forEach((element: any, index: any) => {
        let data = [
          index + 1,
          element.code,
          // element.type,
          element.codeDescription,

          // element.label,
          element.totalAmount
        ]
        getExportdata.push(data);
      });
      let totalAmount = receiptData
        .map((value: any) => value.totalAmount ? parseInt(value.totalAmount) : 0) // Step 1: Convert string to number
        .reduce((acc: any, current: any) => acc + current, 0);
      // addWatermark();
      getExportdata.push(["", "", "Total", totalAmount])
      autoTable(doc, {
        // head: [["sl No.", "Code", "Description", "Installment", "Amount"]],
        head: [["sl No.", "Code", "Description", "Amount"]],

        body: getExportdata,
        theme: 'grid', // 'striped', 'grid', 'plain', or 'css' (default is 'striped')
        headStyles: {
          fillColor: [14, 31, 83],
          // Header background color
          textColor: 255, // Header text color
          // textColor: '#0E1F5',
          fontSize: 10 // Header font size
        },
        bodyStyles: {
          textColor: 0, // Body text color
          fontSize: 10 // Body font size
        },
        alternateRowStyles: {
          // fillColor: [255, 255, 255] // Alternate row background color
        },
        // columnStyles: cellWidth,
        // margin: { top: 30 },
        // margin: { top: 165 },
        startY: 165,
        // startY: 105, // Start after the "Contact No." section

        pageBreak: 'auto',
        didDrawPage: (data: any) => {
          // addWatermark();




          // doc.text('Page:' + ' ' + data.pageNumber, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        },
      },)

      const finalY = (doc as any).lastAutoTable.finalY || 70; // The final Y position of the table

      console.log('finalY', finalY);
      const marginBottom = 20; // Add some margin

      console.log('doc.internal.pageSize.height', doc.internal.pageSize.height);
      console.log('finalY + marginBottom + 10', finalY + marginBottom + 10);
      const content = 'This is additional content after the table.';



      doc.setFontSize(12);
      doc.text('Remitter Signature', 10, finalY + 20);

      doc.setFontSize(12);
      doc.text('For Bank use:', 10, finalY + 30);




      doc.setFontSize(12);
      doc.text('Bank Branch Stamp and Signature of Cashier', 10, finalY + 40);
      doc.setFontSize(12);
      doc.text('Manager / Accountant', 130, finalY + 40);

      doc.setFontSize(12);
      doc.text('Please Note* This is a system generated challan and does not require signature', 10, finalY + 50);
      doc.line(10, finalY + 55, 200, finalY + 55); // Draw a line to separate the header from data
      doc.text('SOP:', 10, finalY + 65);

      doc.text(`Tamilnadu Housing Board (TNHB) has made arrangements with ${this.applicationForm.value.bankName} for making payment through`, 10, finalY + 75);
      doc.text(`this e-Challan facility by their allottees.`, 10, finalY + 80);
      doc.text(`kindly note that allottees can remit the amount due as per this e-Challan vide NEFT/RTGS/IMPS`, 10, finalY + 85);
      doc.text(`from any bank across the country`, 10, finalY + 90);
      if (this.applicationForm.value.bankName == "Union Bank") {
        doc.text(`Tamilnadu Housing Board (TNHB) has made arrangements with ${this.applicationForm.value.bankName} for making payment through`, 10, finalY + 75);
        doc.text(`this e-Challan facility by their allottees.`, 10, finalY + 80);
        doc.text(`kindly note that allottees can remit the amount due as per this e-Challan vide NEFT/RTGS/IMPS`, 10, finalY + 85);
        doc.text(`from any bank across the country`, 10, finalY + 90);
      }

      if (this.applicationForm.value.bankName == "HDFC") {
        doc.text(`HDFC Bank Customers can also use Merchant Payee (Retail Net Banking) or Enet/CBX or issuing`, 10, finalY + 75);
        doc.text(`HDFC Bank cheques which can be peposited in designated HDFC Bank branches.`, 10, finalY + 80);

      }



      doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10); // Draw rectangle as border

      // Save the generated PDF
      doc.save('form-with-watermark.pdf');
    };
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
              this.back();
            }
          })




        }

        // this.getAllPaymentsByApplicationId();
      },
      (error: any) => {
        console.error(error);
        this.toast.showToast('error', 'Payment Failed', '');
      }
    );
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
    let checkDifferenceCost = this.selectedData.filter((x: any) => x.Description == 'DifferentCostDueInterest');
    let checkOtherDemans = this.selectedData.filter((x: any) => x.Description == 'GST' || x.Description == 'Maintenance Charges' || x.Description == 'Car Parking Demand' || x.Description == 'Scrunity Fee');
    let interestData = this.selectedData.filter((x: any) => x.type == "Interest - SFS");
    let installmentData = this.selectedData.filter((x: any) => x.type == "Installment - SFS");
    intererst = interestData.map((x: any) => {
      //check partly half amount
      return {
        "term": x.Description,
        // "paidAmount": x.interestBalance > 0 ? (x.partPayment ? x.isPartInterestCollected : x.Interest) : 0
        "paidAmount": (x.interestBalance)

      }


    })
    dueAmount = installmentData.map((x: any) => {
      //check partly half amount

      return {
        "dueTerm": x.Description,
        "paidAmount": (x.dueBalance)
      }


    })
    let InterestDatas = {
      "id": this.unitId,
      "dueInterest": intererst,
      "dueStatus": "",
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
              "dueStatus": "",
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

            let amount = this.selectedData[0].partPayment ? this.selectedData[0].isPartCollected : this.selectedData[0].dueBalance;
            this.demandUpdateDetails(this.selectedData[0].Description, amount, "No");

          }



        }
      }, error => {
        console.log('error_interest', error);

      })
    } else {
      let amount = this.selectedData[0].partPayment ? this.selectedData[0].isPartCollected : this.selectedData[0].dueBalance;
      this.demandUpdateDetails(this.selectedData[0].Description, amount, "No");
    }


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


  inputValidate(evt: any, field: any) {
    const theEvent = evt || window.event;
    let key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    let regexValue = /[0-9.]/;
    if (field == 'alphabets') {
      regexValue = /^[a-zA-Z ]+$/;
    } else if (field == 'alphaNumeric') {
      regexValue = /[0-9 a-zA-Z]/;
    } else if (field == 'numbersonly') {
      regexValue = /[.0-9 ]/;
    } else if (field == 'caps') {
      regexValue = /^[A-Z]+$/;
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
  back() {
    // this.location.back();
    this.router.navigateByUrl('customer/allottee_echallan_generate')
  }

  payAmount() {
    console.log(this.unitAccountNo, "this.unitAccountNo")
    this.router.navigate(['/customer/all-payments'], { queryParams: { applicationNo: this.unitAccountNo, routeLink: "challanRoute" } });

  }

  generatepdf() {
    const doc = new jsPDF('p', 'mm', 'a4');

    // Add header text
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Tamil Nadu Housing Board', 10, 10);
    doc.setFontSize(12);
    doc.text('Receipt No: NDM2132448', 150, 10);
    doc.text('Date: 29-Jan-2021', 150, 15);

    // Horizontal line
    doc.line(10, 20, 200, 20);

    // Add details section
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text('Received a sum of Rs. 7,82,000 (Seven Lakh Eighty-Two Thousand Only)', 10, 30);
    doc.text('From: Mrs. Deepa Nagaraj & Mr. S. Nagaraj', 10, 35);
    doc.text('Scheme: 7002', 10, 40);
    doc.text('32 HIG Flats Block: Fourth Floor', 10, 45);
    doc.text('Bank: Punjab National Bank', 10, 50);
    doc.text('Door No: 30', 10, 55);

    // Add table headers
    doc.text('Desc:', 10, 65);
    doc.text('ADVANCE FROM APPLICANTS', 10, 70);

    // Add amount
    doc.text('Amount(Rs): 7,82,000', 150, 70);

    // Footer
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(9);
    doc.text('Remittance towards initial 5% deposit: 32 HIG Flats', 10, 110);
    doc.text('Approved by:', 10, 120);

    // Add barcode (optional)
    doc.setFontSize(10);
    doc.text('Bar Code Placeholder', 150, 100);

    // Save PDF
    doc.save('receipt.pdf');
  }
  generatepdf2() {


    const headerImageUrl = '../../../assets/images/tnhb_logo12.png';
    const doc = new jsPDF('p', 'mm', 'a4'); // Portrait, mm, A4 size

    // Add Header

    doc.addImage(headerImageUrl, 'png', 30, 5, 20, 20);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Tamil Nadu Housing Board', 50, 15);
    doc.setFontSize(12);
    doc.text('Receipt No: NDM2132448', 150, 15);
    doc.text('Date: 29-Jan-2021', 150, 20);

    // Add a horizontal line
    doc.line(10, 25, 200, 25);

    // Add details section
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Received a sum of Rs. 7,82,000 (Seven Lakh Eighty-Two Thousand Only)', 10, 35);
    doc.text('From: Mrs. Deepa Nagaraj & Mr. S. Nagaraj', 10, 40);
    doc.text('Scheme: 7002', 10, 45);
    doc.text('32 HIG Flats Block: Fourth Floor', 10, 50);
    doc.text('Bank: Punjab National Bank', 10, 55);
    doc.text('Door No: 30', 10, 60);

    // Add Table using autoTable
    autoTable(doc, {
      startY: 65,
      head: [['A/C Code', 'Description', 'Amount(Rs)']],
      body: [
        ['768', 'ADVANCE FROM APPLICANTS', '7,82,000'], // Row 1
      ],
      styles: { fontSize: 10 }, // Table font size
      theme: 'grid', // Table theme
    });

    // Add Footer
    const finalY = (doc as any).lastAutoTable.finalY || 70; // The final Y position of the table
    doc.setFont('Helvetica', 'italic');
    doc.text('Remittance towards initial 5% deposit amount: 32 HIG Flats', 10, finalY + 10);
    doc.text('Approved by:', 10, finalY + 20);
    doc.text('Cashier', 150, finalY + 20);

    // Add barcode placeholder (can be replaced with a real barcode image)
    doc.setFont('Helvetica', 'normal');
    doc.text('Bar Code Placeholder', 150, finalY + 10);

    // Save PDF
    doc.save('receipt.pdf');
  }
}
