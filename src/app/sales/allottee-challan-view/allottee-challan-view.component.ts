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
import { ActivatedRoute } from '@angular/router';
import { WordToPdfService } from '../../services/word-to-pdf.service';
@Component({
  selector: 'app-allottee-challan-view',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './allottee-challan-view.component.html',
  styleUrl: './allottee-challan-view.component.scss'
})
export class AllotteeChallanViewComponent {
  applicationForm!: FormGroup;
  receiptType: any = '';
  receiptList: any = ["SFS-Installment", "Balance Cost(90%)", "EMI", "Difference Cost", "MC", "Car Parking", "GST", "Interest", "Penal Interest"]
  branchList: any = '';
  paymentType: any = '';
  drawnBank: any = '';
  applicationId: any;
  unitAccountNo: any;
  totalAmount: any = 0;
  constructor(
    private fb: FormBuilder,
    private title: Title,
    private propertyService: PropertyService,
    private dialog: MatDialog,
    private toast: ToastService,
    private location: Location,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private wordToPdfService: WordToPdfService,

  ) { }
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
      "receiptType": ['', Validators.required],
      "challanAmount": ['', Validators.required],
      "bankName": ['', Validators.required],
      "paymentType": ['', Validators.required],
      "instrumentNumber": ['', Validators.required],
      "instrumentDate": ['', Validators.required],
      "drawnBank": ['', Validators.required],
      "chellanCreatedTime": ['', Validators.required],
      "chellanExpiryDateTime": ['', Validators.required],
      "chellanStatus": ['', Validators.required],
      "applicationId": [this.applicationId, Validators.required],
      "paymentMethod": ['OFFLINE', Validators.required],
      "nameOfTheAllottee": ['', Validators.required],
      "paymentStatus": [''],
      "amountInWords": [''],
      "bankref": [''],
      "echallanNumber": ['']
    });


    this.route.queryParams.subscribe(params => {
      let id = params['id'];
      // this.applicationForm.controls['challanNumber'].setValue(id);
      debugger
      this.propertyService.getChallanBYId(id).subscribe((res) => {
        if (res) {
          this.applicationForm.patchValue(res);
          this.totalAmount = this.applicationForm.value.receiptType
            .map((value: any) => value.amount ? parseFloat(value.amount) : 0) // Step 1: Convert string to number
            .reduce((acc: any, current: any) => acc + current, 0);

          let amount = this.applicationForm.value.challanAmount ? parseFloat(this.applicationForm.value.challanAmount) : 0;
          let convertToWords = this.propertyService.convertAmountToWords(amount).toUpperCase();
          this.applicationForm.controls['amountInWords'].setValue(convertToWords);
          // this.applicationForm.controls['unitAccountNumber'].setValue(res.unitData.unitAccountNumber)
          // this.applicationForm.controls['unitNo'].setValue(res.unitData.unitNo)
          // this.applicationForm.controls['nameOfTheAllottee'].setValue(res.applicantName)
          // this.applicationForm.controls['type'].setValue(res.schemeData.schemeType)
          // this.applicationForm.controls['nameOfTheDivision'].setValue(res.schemeData.nameOfTheDivision)
          // this.applicationForm.controls['email'].setValue(res.emailId)
          // this.applicationForm.controls['contactNumber'].setValue(res.mobileNumber)
          // this.applicationForm.controls['schemeName'].setValue(res.schemeData.schemeName);


        }

      })

    })
    this.title.setTitle('Income Category');


    // Add value change listeners to format the values


  }





  Submit() {
    // const docxUrl = '../../../../assets/echallan_receipt.docx';
    // // const docxUrl = 'https://propertyapi.tnhb.in/var/uploads/property/echallan_receipt.docx';
    // let newDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy')
    // const data = {
    //   "unitAccountNumber": this.applicationForm.value.unitAccountNumber,
    //   "unitNo": this.applicationForm.value.unitNo,
    //   "schemeName": this.applicationForm.value.schemeName,
    //   "type": this.applicationForm.value.type,
    //   "nameOfTheDivision": this.applicationForm.value.nameOfTheDivision,
    //   "email": this.applicationForm.value.email,
    //   "contactNumber": this.applicationForm.value.contactNumber,
    //   "receiptType": this.applicationForm.value.receiptType,
    //   "challanAmount": this.applicationForm.value.challanAmount,
    //   "bankName": this.applicationForm.value.bankName,
    //   "paymentType": this.applicationForm.value.paymentType,
    //   "instrumentNumber": this.applicationForm.value.instrumentNumber,
    //   "instrumentDate": this.applicationForm.value.instrumentDate,
    //   "drawnBank": this.applicationForm.value.drawnBank,
    //   "chellanCreatedTime": newDate,
    //   "chellanExpiryDateTime": newDate,
    //   "chellanStatus": this.applicationForm.value.chellanStatus,
    //   "applicationId": this.applicationForm.value.applicationId,
    //   "paymentMethod": this.applicationForm.value.paymentMethod,
    //   "nameOfTheAllottee": this.applicationForm.value.nameOfTheAllottee,
    //   "paymentStatus": this.applicationForm.value.paymentStatus,
    //   "amountInWords": this.applicationForm.value.amountInWords,
    //   "bankref": this.applicationForm.value.bankref,
    //   "challanNumber": this.applicationForm.value.challanNumber,
    //   "challanDate": newDate
    // }


    // this.wordToPdfService.fetchAndProcessWordFile(docxUrl, data, "Echallan", '');

    // Create a new jsPDF instance
    const doc = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
    doc.setDrawColor(0, 0, 0);  // RGB (black)

    // Set the line width for the border (optional, default is 0.2)
    // doc.setLineWidth(1);

    // Draw the border (rectangle around the whole page)
    // rect(x, y, width, height)
    // doc.rect(5, 5, 190, 277);
    doc.rect(5, 5, 200, 277);

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
      let dateFormate: any = this.datePipe.transform(this.applicationForm.value.chellanCreatedTime, 'dd-MM-yyyy')

      // Column headers (labels)
      doc.setFontSize(12);
      doc.text('Challan Number:', 15, 50); // Header for the label column
      doc.setFontSize(10);
      doc.text(this.applicationForm.value.challanNumber, 55, 50);
      doc.setFontSize(12);
      doc.text('Challan Date:', 140, 50); // Header for the label column
      doc.setFontSize(10);
      doc.text(dateFormate, 170, 50);


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


      doc.setFontSize(12);
      doc.text('Receipt Type', 15, 115); // Header for the label column
      doc.text('Account Code', 90, 115); // Header for the value column
      doc.text('Amount', 140, 115);

      // doc.line(10, 73, 200, 73); // Draw a line to separate the header from data

      doc.setFontSize(10);
      // First column: Labels
      doc.text(this.applicationForm.value.receiptType, 15, 120);
      doc.text(this.applicationForm.value.unitAccountNumber, 90, 120);
      doc.text(this.applicationForm.value.challanAmount, 140, 120);


      doc.setFontSize(12);
      doc.text('Payment Type', 15, 135); // Header for the label column
      doc.text('InstrumentNo', 60, 135); // Header for the value column
      doc.text('Instrument Date', 110, 135);
      doc.text('Drawn Bank', 160, 135);


      doc.setFontSize(10);
      // First column: Labels
      doc.text(this.applicationForm.value.paymentType, 15, 140);
      doc.text(this.applicationForm.value.instrumentNumber, 60, 140);
      doc.text(this.applicationForm.value.instrumentDate, 110, 140);
      doc.text(this.applicationForm.value.drawnBank, 160, 145);

      doc.setFontSize(12);
      doc.text('Payment Mode:', 15, 155); // Header for the label column
      doc.setFontSize(10);
      doc.text(this.applicationForm.value.paymentMethod, 50, 155);
      doc.setFontSize(12);
      doc.text('Payment Type:', 80, 155); // Header for the label column
      doc.setFontSize(10);
      doc.text(this.applicationForm.value.paymentType, 115, 155);
      doc.setFontSize(12);
      doc.text('Payment Status:', 140, 155); // Header for the label column
      doc.setFontSize(10);
      doc.text('Pending', 180, 155);


      doc.setFontSize(12);
      doc.text('Challan Amount:', 15, 165); // Header for the label column
      doc.setFontSize(10);
      doc.text(this.applicationForm.value.challanAmount, 50, 165);
      doc.setFontSize(12);
      doc.text('Bank Name:', 140, 165); // Header for the label column
      doc.setFontSize(10);
      doc.text(this.applicationForm.value.drawnBank, 170, 165);

      doc.setFontSize(12);
      doc.text('Amount (in words):', 15, 175); // Header for the label column
      doc.setFontSize(10);
      doc.text(this.applicationForm.value.amountInWords, 65, 175);
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

  Submit1() {

    let date: any = this.datePipe.transform(this.applicationForm.value.chellanCreatedTime, 'dd-MM-yyyy')
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
      doc.text(this.applicationForm.value.echallanNumber, 55, 50);
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






      doc.setFontSize(12);
      doc.text('Payment Type', 15, 115); // Header for the label column

      doc.text('Payment Mode', 60, 115); // Header for the value column
      doc.text('Payment Status', 110, 115);
      doc.text('Virtual Code', 160, 115);

      doc.setFontSize(10);
      // First column: Labels
      doc.text(this.applicationForm.value.paymentType, 20, 120);
      doc.text(this.applicationForm.value.paymentMethod, 65, 120);
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


      doc.setFontSize(12);
      doc.text('Remitter Signature', 10, 190);

      doc.setFontSize(12);
      doc.text('For Bank use:', 10, 200);




      doc.setFontSize(12);
      doc.text('Bank Branch Stamp and Signature of Cashier', 10, 220);
      doc.setFontSize(12);
      doc.text('Manager / Accountant', 130, 220);

      doc.setFontSize(12);
      doc.text('Please Note* This is a system generated challan and does not require signature', 10, 240);
      doc.line(10, 245, 200, 245); // Draw a line to separate the header from data
      doc.text('SOP:', 10, 255);
      doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10); // Draw rectangle as border

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
}
