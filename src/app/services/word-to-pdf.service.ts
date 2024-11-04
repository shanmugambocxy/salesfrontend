import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Docxtemplater from 'docxtemplater';
import { PDFDocument } from 'pdf-lib';
import PizZip from 'pizzip';

import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PropertyService } from './property.service';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class WordToPdfService {

  private baseUrl = environment.apiURL;

  token = sessionStorage.getItem('token');
  headers = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
  };

  constructor(private http: HttpClient, private propertyService: PropertyService, private loaderService: LoaderService) { }

  async fetchAndProcessWordFile(docxUrl: string, data: any, ordertype: any, id: any): Promise<any> {
    this.loaderService.startLoader();
    try {
      debugger
      const response = await this.http.get(docxUrl, { responseType: 'arraybuffer' }).toPromise();
      if (!response) {
        throw new Error('No response received from the server.');
      }

      const zip = new PizZip(response);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

      // Set data for the template
      doc.setData(data);

      try {
        doc.render();
      } catch (error) {
        console.error('Error rendering document:', error);
        throw error;
      }

      const outputDoc = doc.getZip().generate({ type: 'arraybuffer' });

      const docxBlob = new Blob([outputDoc]);

      // Create formData object
      const formData = new FormData();
      formData.append('file', docxBlob, 'output.docx');
      // formData.append('fileName', ordertype);


      // Call fileUpload to upload the PDF
      this.convertToPdf(formData).subscribe((arraybuffer: ArrayBuffer) => {
        // Open the PDF
        if (ordertype == "Allotment Order") {
          this.openPDF(arraybuffer, id);

        }

        if (ordertype == 'Echallan') {
          this.openPDFEchallan(arraybuffer)
        }
      });

    } catch (error) {
      console.error('Error processing file:', error);
    }
  }

  convertToPdf(formData: FormData): Observable<any> {
    const options = {
      headers: this.headers.headers,
      responseType: 'arraybuffer' as 'json' // Set the response type to arraybuffer
    };
    return this.http.post(`${this.baseUrl}/api/fileUpload/convert`, formData, options);
  }


  openPDF(arraybuffer: ArrayBuffer, id: any) {
    const blob = new Blob([arraybuffer], { type: 'application/pdf' });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);
    console.log('url', url);
    const formData = new FormData();
    formData.append('file', blob, 'sample.pdf');
    this.uploadPdfAllotmentorder(formData).subscribe((res: any) => {
      if (res) {
        let updateAlloment = {
          "id": id,
          "sighnedAllotmentOrderPath": res.body.responseObject,
          "description": "Allotment Order",
          "lcsStatus": "Ready"
        }
        this.propertyService.updateAllotmentOrder(updateAlloment).subscribe(updateAllotmentOrder => {
          if (updateAllotmentOrder) {

          }

        })
      }
    })
    // Open the PDF in a new tab
    this.loaderService.stopLoader();

    window.open(url);

  }
  openPDFEchallan(arraybuffer: ArrayBuffer) {
    const blob = new Blob([arraybuffer], { type: 'application/pdf' });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);
    console.log('url', url);
    const formData = new FormData();
    formData.append('file', blob, 'sample.pdf');

    // Open the PDF in a new tab
    window.open(url);
  }


  uploadPdfAllotmentorder(formData: any) {

    return this.http.post(`${this.baseUrl}/api/fileUpload/uploadSighnedAlotmentOrder`, formData, this.headers);

  }
}
