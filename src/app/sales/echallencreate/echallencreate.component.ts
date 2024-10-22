import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PropertyService } from '../../services/property.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import { SharedModule } from '../../shared/shared.module';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


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
  constructor(
    private fb: FormBuilder,
    private title: Title,
    private propertyService: PropertyService,
    private dialog: MatDialog,
    private toast: ToastService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router

  ) {


    const navigation = this.router.getCurrentNavigation();
    this.selectedData = navigation?.extras?.state?.['selectedData'] || [];
    debugger
    console.log(this.selectedData); // Access the passed data here
    // Add value change listeners to format the values
    this.challanFun(this.selectedData)

  }

  ngOnInit(): void {

    this.applicationForm = this.fb.group({
      "unitAccountNumber": ['', Validators.required],
      "unitNo": ['', Validators.required],
      "schemeName": ['', Validators.required],
      "type": ['', Validators.required],
      "nameOfTheDivision": ['', Validators.required],
      "email": ['', Validators.required],
      "contactNumber": ['', Validators.required],
      "receiptType": ['', Validators.required],
      "challanAmount": ['', Validators.required],
      "bankName": ['', Validators.required],
      "ifscCode": ['', Validators.required],
      "paymentType": ['', Validators.required],
      "instrumentNumber": ['', Validators.required],
      "instrumentDate": ['', Validators.required],
      "drawnBank": ['', Validators.required],
      "chellanCreatedTime": ['', Validators.required],
      "chellanExpiryDateTime": ['', Validators.required],
      "chellanStatus": ['', Validators.required],
      "applicationId": [this.applicationId, Validators.required],
      "paymentMethod": ['OFFLINE', Validators.required],
      "nameOfTheAllottee": ['', Validators.required]

    });


    this.route.queryParams.subscribe(params => {
      console.log(params, "params")
      this.demandName = params['demands']
      console.log(this.demandName, "demand name")
      this.applicationId = params['applicationId'];
      this.unitAccountNo = params['unitaccountno'];
      this.propertyService.getApplicationById(this.applicationId).subscribe(res => {
        if (res) {
          this.applicationForm.controls['unitAccountNumber'].setValue(res.unitData.unitAccountNumber)
          this.applicationForm.controls['unitNo'].setValue(res.unitData.unitNo)
          this.applicationForm.controls['nameOfTheAllottee'].setValue(res.applicantName)
          this.applicationForm.controls['type'].setValue(res.schemeData.schemeType)
          this.applicationForm.controls['nameOfTheDivision'].setValue(res.schemeData.nameOfTheDivision)
          this.applicationForm.controls['email'].setValue(res.emailId)
          this.applicationForm.controls['contactNumber'].setValue(res.mobileNumber)
          this.applicationForm.controls['schemeName'].setValue(res.schemeData.schemeName);
        }
      })

    })
    this.title.setTitle('Income Category');

    const navigation = this.router.getCurrentNavigation();
    this.selectedData = navigation?.extras?.state?.['selectedData'] || [];
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
    }

  }

  Submit() {

    const now = new Date();
    const nextDay = new Date(now);
    nextDay.setDate(nextDay.getDate() + 1); // Add one day


    this.applicationForm.value.chellanCreatedTime = now.toISOString();
    this.applicationForm.value.chellanExpiryDateTime = nextDay.toISOString();
    this.applicationForm.value.applicationId = this.applicationId;
    // this.applicationForm.value.paymentMethod = "OFFLINE";
    let formData = this.applicationForm.value;
    debugger
    this.propertyService.createChallan(formData).subscribe(res => {
      if (res.responseStatus == true) {
        this.toast.showToast('success', "E - Challan Created Successfully", '');
        this.back();

      }
    })
  }
  Submit1() {
    // Create a new jsPDF instance
    const doc = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size

    // Load watermark background image
    const imageUrl = '../../../assets/housingboard_outline.png'; // Path to your watermark image
    const headerImageUrl = '../../../assets/images/tnhb_logo12.png';

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      // Add watermark image to PDF with transparency

      doc.addImage(headerImageUrl, 'png', 30, 5, 20, 20);
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
      doc.text('06222000012222', 55, 50);
      doc.setFontSize(12);
      doc.text('Challan Date:', 140, 50); // Header for the label column
      doc.setFontSize(10);
      doc.text('14-09-2024', 170, 50);


      doc.text('Unit Account No.', 15, 60); // Header for the label column
      doc.text('Unit No.', 90, 60); // Header for the value column
      doc.text('Name of the Allottee', 140, 60);
      // Add a separator line for clarity
      // doc.line(10, 35, 200, 35); // Draw a line to separate the header from data
      doc.setFontSize(10);
      // First column: Labels
      doc.text('020305025555', 15, 65);
      doc.text(`B0305`, 90, 65);
      doc.text(`Shan`, 140, 65);

      doc.setFontSize(12);
      doc.text('Scheme Name', 15, 75); // Header for the label column
      doc.text('Type', 90, 75); // Header for the value column
      doc.text('Name of the Division', 140, 75);
      // Add a separator line for clarity
      // doc.line(10, 35, 200, 35); // Draw a line to separate the header from data
      doc.setFontSize(10);
      // First column: Labels
      doc.text('JJ nagar Scheme', 15, 80);
      doc.text(`HIG`, 90, 80);
      doc.text(`JJ Nagar`, 140, 80);


      doc.setFontSize(12);
      doc.text('Email', 15, 95); // Header for the label column
      // doc.text('Type.', 60, 45); // Header for the value column
      doc.text('Contact No.', 140, 95);

      doc.setFontSize(10);
      // First column: Labels
      doc.text('shan@gmail.com', 15, 100);
      // doc.text(`HIG`, 60, 65);
      doc.text(`9845225525`, 140, 100);


      doc.setFontSize(12);
      doc.text('Receipt Type', 15, 115); // Header for the label column
      doc.text('Account Code', 90, 115); // Header for the value column
      doc.text('Amount', 140, 115);

      // doc.line(10, 73, 200, 73); // Draw a line to separate the header from data

      doc.setFontSize(10);
      // First column: Labels
      doc.text('offline', 15, 120);
      doc.text(`020305025555`, 90, 120);
      doc.text(`100.0`, 140, 120);


      doc.setFontSize(12);
      doc.text('Payment Type', 15, 135); // Header for the label column
      doc.text('InstrumentNo', 60, 135); // Header for the value column
      doc.text('Instrument Date', 110, 135);
      doc.text('Drawn Bank', 160, 135);


      doc.setFontSize(10);
      // First column: Labels
      doc.text('TEST', 15, 140);
      doc.text(`020305025555`, 60, 140);
      doc.text(`14-09-2024`, 110, 140);
      doc.text(`SBI`, 160, 145);

      doc.setFontSize(12);
      doc.text('Payment Mode:', 15, 155); // Header for the label column
      doc.setFontSize(10);
      doc.text('Offline', 50, 155);
      doc.setFontSize(12);
      doc.text('Payment Type:', 80, 155); // Header for the label column
      doc.setFontSize(10);
      doc.text('Cheque', 115, 155);
      doc.setFontSize(12);
      doc.text('Payment Status:', 140, 155); // Header for the label column
      doc.setFontSize(10);
      doc.text('Pending', 180, 155);


      doc.setFontSize(12);
      doc.text('Challan Amount:', 15, 165); // Header for the label column
      doc.setFontSize(10);
      doc.text('1000.00', 50, 165);
      doc.setFontSize(12);
      doc.text('Bank Name:', 140, 165); // Header for the label column
      doc.setFontSize(10);
      doc.text('SBI', 170, 165);

      doc.setFontSize(12);
      doc.text('Amount (in words):', 15, 175); // Header for the label column
      doc.setFontSize(10);
      doc.text('One Thousand Only', 65, 175);
      doc.setFontSize(12);
      doc.text('Bank Ref No.:', 140, 175); // Header for the label column
      doc.setFontSize(10);
      doc.text('112255555', 175, 175);

      doc.setFontSize(12);
      doc.text('Remitter Signature', 10, 200);

      doc.setFontSize(12);
      doc.text('For Bank use', 10, 220);

      doc.line(10, 225, 200, 225); // Draw a line to separate the header from data



      doc.setFontSize(12);
      doc.text('Bank Branch Stamp and Signature of Cashier', 10, 245);
      doc.setFontSize(12);
      doc.text('Manager / Accountant', 130, 245);

      doc.setFontSize(12);
      doc.text('Please Note* This is a system generated challan and does not require signature', 30, 265);

      // Save the generated PDF
      doc.save('form-with-watermark.pdf');
    };
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
    this.location.back();
  }

  payAmount() {
    console.log(this.unitAccountNo, "this.unitAccountNo")
    this.router.navigate(['/customer/all-payments'], { queryParams: { applicationNo: this.unitAccountNo, routeLink: "challanRoute" } });

  }
}
