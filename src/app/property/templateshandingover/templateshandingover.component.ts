import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { SharedModule } from '../../shared/shared.module';
import { PropertyService } from '../../services/property.service';
import { ToastService } from '../../services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';

@Component({
  selector: 'app-templateshandingover',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './templateshandingover.component.html',
  styleUrl: './templateshandingover.component.scss'
})
export class TemplateshandingoverComponent {
  selectedFiles: { [key: string]: File | null } = {
    Flat_HO: null,
    House_HO: null,
    Plot_HO: null,

  };

  allotmentOrderPath: any;
  responseObject: any;

  uploadedFilePaths: { [key: string]: string } = {};
  @ViewChild('fileInput1', { static: false }) fileInput1!: ElementRef;
  @ViewChild('fileInput2', { static: false }) fileInput2!: ElementRef;
  @ViewChild('fileInput3', { static: false }) fileInput3!: ElementRef;
  type1: any;
  type2: any;
  type3: any;

  constructor(
    private propertyService: PropertyService,
    private toast: ToastService,
    private dialog: MatDialog,
  ) {
  }
  ngOnInit() {
    this.getAllTemplates();
  }

  onFileSelected(event: any, fileType: string) {
    const input = event.target as HTMLInputElement;

    const file: File = event.target.files[0];
    if (file) {
      this.selectedFiles[fileType] = file;
      console.log(`${fileType} selected:`, file);
    }

  }

  async uploadFiles() {
    debugger
    this.uploadedFilePaths = {}
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

      // if (this.uploadedFilePaths['allotmentOrder']) {
      //   const data = {
      //     "templateName": "Allotment",
      //     "path": this.uploadedFilePaths['allotmentOrder']
      //   }
      // }
      console.log('All files uploaded successfully:', this.uploadedFilePaths);

      // Send data to createTemplateData for each uploaded path
      for (const fileType in this.uploadedFilePaths) {
        if (this.uploadedFilePaths[fileType]) {
          const data = {
            templateName: this.getTemplateName(fileType),
            documentName: "Handing Over", // Adjust this method to get the template name based on fileType
            path: this.uploadedFilePaths[fileType],
            unitType: this.getUnitTypeName(fileType),
            projectStatus: this.getProjectStatusName(fileType),
            sno: this.getSno(fileType)
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
      }


      this.fileInput1.nativeElement.value = '';
      this.fileInput2.nativeElement.value = '';
      this.fileInput3.nativeElement.value = '';
      window.location.reload();


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
      case 'Flat_HO':
        return '9.1.Flat_HO';
      case 'House_HO':
        return '9.2.House_HO';
      case 'Plot_HO':
        return '9.3.Plot_HO';

      default:
        return 'Unknown Template';
    }
  }
  getUnitTypeName(fileType: string): string {
    switch (fileType) {
      case 'Flat_HO':
        return 'Flat';
      case 'House_HO':
        return 'House';
      case 'Plot_HO':
        return 'Plot';

      default:
        return 'Unknown Template';
    }
  }
  getProjectStatusName(fileType: string): string {
    switch (fileType) {
      case 'Flat_HO':
        return '';
      case 'House_HO':
        return '';
      case 'Plot_HO':
        return '';

      default:
        return 'Unknown Template';
    }
  }
  getSno(fileType: string): string {
    switch (fileType) {
      case 'Flat_HO':
        return '1';
      case 'House_HO':
        return '2';
      case 'Plot_HO':
        return '3';

      default:
        return 'Unknown Template';
    }
  }

  async getAllTemplates() {
    try {
      const response = await this.propertyService.getTemplateBuDocument("Handing Over").subscribe((res: any) => {
        if (res) {
          console.log('All templates:', response);
          this.responseObject = _.orderBy(res.responseObject, ['sno'], ['asc']);

          let fileName1 = this.responseObject.filter((x: any) => x.templateName == "9.1.Flat_HO");
          if (fileName1.length > 0) {
            this.type1 = fileName1[0].templateName
          } else {
            this.type1 = "";
          }

          let fileName2 = this.responseObject.filter((x: any) => x.templateName == "9.2.House_HO");
          if (fileName2.length > 0) {
            this.type2 = fileName2[0].templateName
          } else {
            this.type2 = "";
          }
          let fileName3 = this.responseObject.filter((x: any) => x.templateName == "9.3.Plot_HO");
          if (fileName3.length > 0) {
            this.type3 = fileName3[0].templateName
          } else {
            this.type3 = "";
          }
        }
      });

      // if (response && response.responseObject && response.responseObject.length > 0) {
      //   // Extract the file paths from the response and store them
      //   for (const template of response.responseObject) {
      //     this.uploadedFilePaths[template.templateName.toLowerCase()] = template.path;
      //   }
      //   // Assign the path of allotment order if available
      //   if (this.uploadedFilePaths['allotment']) {
      //     this.allotmentOrderPath = this.uploadedFilePaths['allotment'];
      //   } else if (this.uploadedFilePaths['allotment']) {
      //     this.allotmentOrderPath = this.uploadedFilePaths['allotment'];
      //   } else if (this.uploadedFilePaths['allotment']) {
      //     this.allotmentOrderPath = this.uploadedFilePaths['allotment'];
      //   } else if (this.uploadedFilePaths['allotment']) {
      //     this.allotmentOrderPath = this.uploadedFilePaths['allotment'];
      //   } else if (this.uploadedFilePaths['allotment']) {
      //     this.allotmentOrderPath = this.uploadedFilePaths['allotment'];
      //   } else if (this.uploadedFilePaths['allotment']) {
      //     this.allotmentOrderPath = this.uploadedFilePaths['allotment'];
      //   }
      // } else {
      //   console.log('No templates found');
      // }
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