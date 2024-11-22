import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-customer-receipt',
  standalone: true,
  imports: [],
  templateUrl: './customer-receipt.component.html',
  styleUrl: './customer-receipt.component.scss'
})
export class CustomerReceiptComponent {




  download() {
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
    doc.text('Receipt No: R-25-123456789', 130, 15);
    doc.text('Date: 29-Jan-2021', 130, 20);

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

    doc.text('Unit Account No. : 350401000101', 10, 45)
    // doc.text('Unit No. : F1-1', 80, 45)
    doc.text('Name of the Allottee : Kabeer Ahamed S', 100, 45)

    doc.text('Unit No. : F1-1', 10, 55)
    doc.text('Type : HIG', 60, 55)
    doc.text('Name of the Division : Madurai Housing Unit', 100, 55)


    doc.text('Scheme Name : Ellis Nagar 30 HIG', 10, 65)

    doc.line(10, 70, 200, 70);

    doc.text('By: Payment Gateway', 10, 75)
    doc.text('Payment ID: 12345678910111213456', 60, 75)

    doc.text('Payment Type: NEFT', 130, 75)
    doc.text('Bank Name: State Bank Of India', 10, 85)

    doc.line(10, 90, 200, 90);
    // doc.text('Scheme: 7002', 10, 45);
    // doc.text('32 HIG Flats Block: Fourth Floor', 10, 50);
    // doc.text('Bank: Punjab National Bank', 10, 55);
    // doc.text('Door No: 30', 10, 60);

    // Add Table using autoTable
    autoTable(doc, {
      startY: 95,
      head: [['A/C Code', 'Description', 'Amount(Rs)']],
      body: [
        ['180', 'SALE OF FORMS/PLANS/B.P.S. ETC.', '752'], // Row 1
        ['751', 'CGST on rent for Commercial Units', '19'], // Row 1
        ['751', 'SGST on rent for Commercial Units', '19'],
        ['', 'Total', '790'],// Row 1

      ],
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

    doc.text('Received a sum of rupees SEVEN HUNDRED AND NINETY ONLY', 10, finalY + 5);
    doc.text('This is system generated receipt. Does not require signature.', 10, finalY + 15);

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
