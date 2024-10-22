import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Title } from '@angular/platform-browser';
import { PropertyService } from '../../services/property.service';
import FileSaver from "file-saver";
import { ToastService } from '../../services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent implements OnInit {

  // selectedFiles: { [key: string]: File | null } = {
  //   // allotmentOrder: null,
  //   // lcsRequestLetter: null,
  //   // lcsOrder: null,
  //   // abOrder: null,
  //   // handingOverReport: null,
  //   // draftSaleDeed: null

  //   allotmentOrder_flat: null,
  //   allotmentOrder_house: null,
  //   allotmentOrder_plot: null,
  //   lcsRequestLetter_flat: null,
  //   lcsRequestLetter_house: null,
  //   lcsRequestLetter_plot: null,
  //   lcsOrder_flat: null,
  //   lcsOrder_house: null,
  //   lcsOrder_plot: null,
  //   abOrder_flat: null,
  //   abOrder_house: null,
  //   abOrder_plot: null,
  //   handingOverReport_flat: null,
  //   handingOverReport_house: null,
  //   handingOverReport_plot: null,
  //   draftSaleDeed_flat: null,
  //   draftSaleDeed_house: null,
  //   draftSaleDeed_plot: null,
  // };

  selectedFiles: { [key: string]: File | null } = {
    allotmentOrder: null,
    lcsRequestLetter: null,
    lcsOrder: null,
    abOrder: null,
    handingOverReport: null,
    draftSaleDeed: null
  };

  allotmentOrderPath: any;
  responseObject: any;

  uploadedFilePaths: { [key: string]: string } = {};

  constructor(
    private title: Title,
    private propertyService: PropertyService,
    private toast: ToastService,
    private dialog: MatDialog,
  ) {
    this.title.setTitle('Templates');
  }
  ngOnInit() {
    this.getAllTemplates();
  }

  onFileSelected(event: any, fileType: string) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFiles[fileType] = file;
      console.log(`${fileType} selected:`, file);
    }
  }

  async uploadFiles() {
    debugger
    try {
      for (const fileType in this.selectedFiles) {
        if (this.selectedFiles[fileType]) {
          const formData = new FormData();
          formData.append('file', this.selectedFiles[fileType] as File); // Type assertion to ensure type is File

          const response = await this.propertyService.templateFileUpload(formData).toPromise();
          this.uploadedFilePaths[fileType] = response.body.responseObject; // Assuming the response contains a filePath
          console.log(`${fileType} uploaded successfully:`, response);
        }
      }

      if (this.uploadedFilePaths['allotmentOrder']) {
        const data = {
          "templateName": "Allotment",
          "path": this.uploadedFilePaths['allotmentOrder']
        }
      }
      console.log('All files uploaded successfully:', this.uploadedFilePaths);

      // Send data to createTemplateData for each uploaded path
      for (const fileType in this.uploadedFilePaths) {
        const data = {
          templateName: this.getTemplateName(fileType), // Adjust this method to get the template name based on fileType
          path: this.uploadedFilePaths[fileType]
        };

        this.propertyService.createTemplateData(data).subscribe(
          (response: any) => {
            console.log(`Data for ${fileType} uploaded successfully:`, response);
            this.getAllTemplates();
          },
          (error: any) => {
            console.error(`Error uploading data for ${fileType}:`, error);
          }
        );
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

  // Helper method to get template name based on fileType
  // getTemplateName(fileType: string): string {
  //   switch (fileType) {
  //     case 'allotmentOrder_flat':
  //       return 'Allotment Flat';
  //     case 'allotmentOrder_house':
  //       return 'Allotment House';
  //     case 'allotmentOrder_plot':
  //       return 'Allotment Plot';
  //     case 'lcsRequestLetter_flat':
  //       return 'LCS Request Letter Flat';
  //     case 'lcsRequestLetter_house':
  //       return 'LCS Request Letter House';
  //     case 'lcsRequestLetter_plot':
  //       return 'LCS Request Letter Plot';
  //     case 'lcsOrder_flat':
  //       return 'LCS Order Flat';
  //     case 'lcsOrder_house':
  //       return 'LCS Order House';
  //     case 'lcsOrder_plot':
  //       return 'LCS Order Plot';
  //     case 'abOrder_flat':
  //       return 'A&B Order Flat';
  //     case 'abOrder_house':
  //       return 'A&B Order Flat House';
  //     case 'abOrder_plot':
  //       return 'A&B Order Flat Plot';
  //     case 'handingOverReport_flat':
  //       return 'Handing Over Report Flat';
  //     case 'handingOverReport_house':
  //       return 'Handing Over Report House';
  //     case 'handingOverReport_plot':
  //       return 'Handing Over Report Plot';
  //     case 'draftSaleDeed_flat':
  //       return 'Draft Sale Deed Flat';
  //     case 'draftSaleDeed_house':
  //       return 'Draft Sale Deed House';
  //     case 'draftSaleDeed_plot':
  //       return 'Draft Sale Deed Plot';
  //     default:
  //       return 'Unknown Template';
  //   }
  // }

  getTemplateName(fileType: string): string {
    switch (fileType) {
      case 'allotmentOrder':
        return 'Allotment';
      case 'lcsRequestLetter':
        return 'LCS Request Letter';
      case 'lcsOrder':
        return 'LCS Order';
      case 'abOrder':
        return 'A&B Order';
      case 'handingOverReport':
        return 'Handing Over Report';
      case 'draftSaleDeed':
        return 'Draft Sale Deed';
      default:
        return 'Unknown Template';
    }
  }

  async getAllTemplates() {
    try {
      const response = await this.propertyService.getAllTemplate().toPromise();
      console.log('All templates:', response);
      this.responseObject = response.responseObject;
      if (response && response.responseObject && response.responseObject.length > 0) {
        // Extract the file paths from the response and store them
        for (const template of response.responseObject) {
          this.uploadedFilePaths[template.templateName.toLowerCase()] = template.path;
        }
        // Assign the path of allotment order if available
        if (this.uploadedFilePaths['allotment']) {
          this.allotmentOrderPath = this.uploadedFilePaths['allotment'];
        } else if (this.uploadedFilePaths['allotment']) {
          this.allotmentOrderPath = this.uploadedFilePaths['allotment'];
        } else if (this.uploadedFilePaths['allotment']) {
          this.allotmentOrderPath = this.uploadedFilePaths['allotment'];
        } else if (this.uploadedFilePaths['allotment']) {
          this.allotmentOrderPath = this.uploadedFilePaths['allotment'];
        } else if (this.uploadedFilePaths['allotment']) {
          this.allotmentOrderPath = this.uploadedFilePaths['allotment'];
        } else if (this.uploadedFilePaths['allotment']) {
          this.allotmentOrderPath = this.uploadedFilePaths['allotment'];
        }
      } else {
        console.log('No templates found');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  }


  openWordDoc() {

    // window.open('https://propertyapi.tnhb.in/var/uploads/property/templates/1727523073427_19586bae-eba1-4cdc-bd50-989898d9b648.doc', '_blank');
    // const pdfUrl =
    //   "https://propertyapi.tnhb.in/var/uploads/property/templates/1727523073427_19586bae-eba1-4cdc-bd50-989898d9b648.doc";
    // // const pdfUrl =
    // //   "https://staging.safegold.com/display/sales-invoice/da771e90-aa8f-4147-bc7c-805b73bb1283";
    // const pdfName = "invoice.doc";
    // FileSaver.saveAs(pdfUrl, pdfName);

  }
  deleteById(Element: any) {
    debugger

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Refund',
        message: `Are you sure you want to Delete this File?`
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.propertyService.deleteTemplateFileByID(Element.id).subscribe(res => {
          if (res) {
            this.toast.showToast('success', 'File Deleted Successfully', '');
            this.getAllTemplates();
          }
        })

      }
    })

  }

}
