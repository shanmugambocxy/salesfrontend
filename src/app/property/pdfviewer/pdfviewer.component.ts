import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
// import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
// import { PdfViewerModule } from 'ng2-pdf-viewer'; // <- import PdfViewerModule

@Component({
  selector: 'app-pdfviewer',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './pdfviewer.component.html',
  styleUrl: './pdfviewer.component.scss'
})
export class PdfviewerComponent {
  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
}
