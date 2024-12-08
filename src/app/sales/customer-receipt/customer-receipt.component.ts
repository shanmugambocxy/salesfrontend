import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { SharedModule } from '../../shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-customer-receipt',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-receipt.component.html',
  styleUrl: './customer-receipt.component.scss'
})
export class CustomerReceiptComponent {
  receiptData: any = "";
  applicationData: any = "";
  currentDate: any = ""
  totalAmount: any = 0;

  public stringQrCode: any = "https://property.tnhb.in/customer-receipt";


  constructor(private router: Router,
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private datePipe: DatePipe,
    private authService: AuthService
  ) {

  }
  ngOnInit() {

    let checkToken = sessionStorage.getItem('token');
    this.route.queryParams.subscribe(params => {
      let receiptNo = params['receiptNo'];
      this.stringQrCode = `${"https://property.tnhb.in/customer-receipt/?receiptNo=" + receiptNo}`;

      this.propertyService.getreceiptByNo(receiptNo).subscribe((res: any) => {
        if (res) {
          this.receiptData = res;
          this.applicationData = res.application;
          let amount = this.receiptData.billDescription
            .map((value: any) => value.amount) // Step 1: Convert string to number
            .reduce((acc: any, current: any) => acc + current, 0);
          this.totalAmount = amount;
          this.currentDate = this.datePipe.transform(new Date(this.receiptData.createdDateTime), 'dd-MM-yyyy')
          debugger
        }
      })



    })
  }

  download() {
    let billDescription: any[];
    billDescription = this.receiptData.billDescription.map((item: any) => [
      item.code,
      item.description,
      item.amount,
    ]);
    billDescription.push(["", "Total", this.totalAmount])
    // const headerImageUrl = '../../../assets/images/tnhb_logo12.png';
    const headerImageUrl = '../../../assets/images/tnhb_logo.png';


    const doc = new jsPDF('p', 'mm', 'a4'); // Portrait, mm, A4 size

    // Add Header

    doc.addImage(headerImageUrl, 'png', 10, 5, 110, 20);
    doc.text("Receipt", 90, 30)
    // doc.setFont('Helvetica', 'bold');
    // doc.setFontSize(16);
    // doc.text('Tamil Nadu Housing Board', 50, 15);
    doc.setFontSize(12);
    doc.text(`Receipt No: ${this.receiptData.receiptNo}`, 130, 15);
    doc.text(`Date: ${this.currentDate}`, 130, 20);

    // Add a horizontal line
    doc.line(10, 35, 200, 35);

    // Add details section
    // doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    // doc.text('Received a sum of Rs. 790.00 ', 10, 45);
    // doc.text('Rupees: SEVEN HUNDRED AND NINETY ONLY', 10, 55);

    // doc.text('From: T.Subramanian', 10, 65);
    // doc.text('By : Cheque', 10, 75);
    // doc.text('No : 569977', 50, 75);
    // doc.text('Dated : 25-Jun-2019', 80, 75);
    // doc.text('Bank : State Bank Of India', 120, 75);

    doc.text(`Unit Account No. : ${this.applicationData.unitData.unitAccountNumber}`, 10, 45)
    // doc.text('Unit No. : F1-1', 80, 45)
    doc.text(`Name of the Allottee : ${this.applicationData.applicantName}`, 100, 45)

    doc.text(`Unit No. : ${this.applicationData.unitData.unitNo}`, 10, 55)
    doc.text(`Type : ${this.applicationData.schemeData.schemeType}`, 60, 55)
    doc.text(`Name of the Division : ${this.applicationData.schemeData.nameOfTheDivision}`, 100, 55)


    doc.text(`Scheme Name : ${this.applicationData.schemeData.schemeName}`, 10, 65)

    doc.line(10, 70, 200, 70);

    doc.text(`By: ${this.receiptData.paymentBy}`, 10, 75)
    doc.text(`Bank Name: ${this.receiptData.bankName}`, 60, 75)

    doc.text(`Payment Type: ${this.receiptData.paymentType}`, 140, 75)

    doc.text(`Payment ID: ${this.receiptData.paymentId}`, 10, 85)

    doc.line(10, 90, 200, 90);
    // doc.text('Scheme: 7002', 10, 45);
    // doc.text('32 HIG Flats Block: Fourth Floor', 10, 50);
    // doc.text('Bank: Punjab National Bank', 10, 55);
    // doc.text('Door No: 30', 10, 60);

    // Add Table using autoTable
    autoTable(doc, {
      startY: 95,
      head: [['A/C Code', 'Description', 'Amount(Rs)']],
      // body: [
      //   ['180', 'SALE OF FORMS/PLANS/B.P.S. ETC.', '752'], // Row 1
      //   ['751', 'CGST on rent for Commercial Units', '19'], // Row 1
      //   ['751', 'SGST on rent for Commercial Units', '19'],
      //   ['', 'Total', '790'],// Row 1

      // ],
      body: billDescription,
      columnStyles: {
        0: { halign: 'center' },
        2: { halign: 'right' }, // Align the 3rd column (index 2) to the right
      },
      headStyles: { halign: 'center' },
      styles: { fontSize: 10 }, // Table font size
      theme: 'grid', // Table theme
    });

    // Add Footer
    const finalY = (doc as any).lastAutoTable.finalY || 70; // The final Y position of the table
    // doc.setFont('Helvetica', 'italic');

    doc.text(`Received a sum of rupees ${this.receiptData.billDescription[0].amountInRupees} ONLY`, 10, finalY + 5);
    doc.setFontSize(10);


    const canvas = document.querySelector('qrcode canvas') as HTMLCanvasElement;
    if (canvas) {
      const image = canvas.toDataURL('image/png');
      doc.addImage(image, 'png', 140, finalY + 10, 50, 50);

    }

    doc.text('Scan for E-receipt', 150, finalY + 60);
    doc.text('**This is system generated receipt. Does not require signature.**', 10, finalY + 60);




    // doc.text('Towards the payment of Sale of Tender Form', 10, finalY + 10);
    // doc.text('Approved by:', 10, finalY + 30);
    // doc.text('Cashier', 150, finalY + 30);

    // // Add barcode placeholder (can be replaced with a real barcode image)
    // // doc.setFont('Helvetica', 'normal');
    // doc.text('Please visit TNHB Website www.tnhb.tn.gov.in for your account status', 10, finalY + 50);
    // doc.text('The above demand and amount received is subject to reconciliation of the account.Additional demand (id any) will', 10, finalY + 60);
    // doc.text('be collected at later date on reconciliation of the respective account.', 10, finalY + 65);


    // Save PDF
    doc.save('receipt.pdf');
  }
}
