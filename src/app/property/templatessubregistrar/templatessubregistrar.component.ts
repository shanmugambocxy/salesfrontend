import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { PropertyService } from '../../services/property.service';
import { ToastService } from '../../services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import * as _ from 'lodash';

@Component({
  selector: 'app-templatessubregistrar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './templatessubregistrar.component.html',
  styleUrl: './templatessubregistrar.component.scss'
})
export class TemplatessubregistrarComponent {
  selectedFiles: { [key: string]: File | null } = {
    Flat_SRL: null,
    House_SRL: null,
    Plot_SRL: null,

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
    event.target.files = []
    input.value = '';
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
            documentName: "Sub Registrar Letter", // Adjust this method to get the template name based on fileType
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
      case 'Flat_SRL':
        return '11.1.Flat_SRL';
      case 'House_SRL':
        return '11.2.House_SRL';
      case 'Plot_SRL':
        return '11.3.Plot_SRL';

      default:
        return 'Unknown Template';
    }
  }
  getUnitTypeName(fileType: string): string {
    switch (fileType) {
      case 'Flat_SRL':
        return 'Flat';
      case 'House_SRL':
        return 'House';
      case 'Plot_SRL':
        return 'Plot';

      default:
        return 'Unknown Template';
    }
  }
  getProjectStatusName(fileType: string): string {
    switch (fileType) {
      case 'Flat_SRL':
        return '';
      case 'House_SRL':
        return '';
      case 'Plot_SRL':
        return '';

      default:
        return 'Unknown Template';
    }
  }

  getSno(fileType: string): string {
    switch (fileType) {
      case 'Flat_SRL':
        return '1';
      case 'House_SRL':
        return '2';
      case 'Plot_SRL':
        return '3';

      default:
        return 'Unknown Template';
    }
  }

  async getAllTemplates() {
    try {
      const response = await this.propertyService.getTemplateBuDocument("Sub Registrar Letter").subscribe((res: any) => {
        if (res) {
          console.log('All templates:', response);
          this.responseObject = _.orderBy(res.responseObject, ['sno'], ['asc']);

          let fileName1 = this.responseObject.filter((x: any) => x.templateName == "11.1.Flat_SRL");
          if (fileName1.length > 0) {
            this.type1 = fileName1[0].templateName
          } else {
            this.type1 = "";
          }

          let fileName2 = this.responseObject.filter((x: any) => x.templateName == "11.2.House_SRL");
          if (fileName2.length > 0) {
            this.type2 = fileName2[0].templateName
          } else {
            this.type2 = "";
          }
          let fileName3 = this.responseObject.filter((x: any) => x.templateName == "11.3.Plot_SRL");
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
