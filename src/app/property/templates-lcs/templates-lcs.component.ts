import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { PropertyService } from '../../services/property.service';
import { ToastService } from '../../services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import * as _ from 'lodash';

@Component({
  selector: 'app-templates-lcs',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './templates-lcs.component.html',
  styleUrl: './templates-lcs.component.scss'
})
export class TemplatesLCSComponent {
  selectedFiles: { [key: string]: File | null } = {
    OR_Flat_LCS: null,
    OR_House_LCS: null,
    OR_Plot_LCS: null,
    SFS_Flat_LCS: null,
    SFS_House_LCS: null,
    HP_Flat_LCS: null,
    HP_House_LCS: null,
    HP_Plot_LCS: null
  };

  allotmentOrderPath: any;
  responseObject: any;

  uploadedFilePaths: { [key: string]: string } = {};

  @ViewChild('fileInput1', { static: false }) fileInput1!: ElementRef;
  @ViewChild('fileInput2', { static: false }) fileInput2!: ElementRef;
  @ViewChild('fileInput3', { static: false }) fileInput3!: ElementRef;
  @ViewChild('fileInput4', { static: false }) fileInput4!: ElementRef;
  @ViewChild('fileInput5', { static: false }) fileInput5!: ElementRef;
  @ViewChild('fileInput6', { static: false }) fileInput6!: ElementRef;
  @ViewChild('fileInput7', { static: false }) fileInput7!: ElementRef;
  @ViewChild('fileInput8', { static: false }) fileInput8!: ElementRef;

  type1: any;
  type2: any;
  type3: any;
  type4: any;
  type5: any;
  type6: any;
  type7: any;
  type8: any;

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
    debugger
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

            documentName: "LCS", // Adjust this method to get the template name based on fileType
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
      this.fileInput4.nativeElement.value = '';
      this.fileInput5.nativeElement.value = '';
      this.fileInput6.nativeElement.value = '';
      this.fileInput7.nativeElement.value = '';
      this.fileInput8.nativeElement.value = '';
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
      case 'OR_Flat_LCS':
        return '4.1.OR_Flat_LCS';
      case 'OR_House_LCS':
        return '4.2.OR_House_LCS';
      case 'OR_Plot_LCS':
        return '4.3.OR_Plot_LCS';
      case 'SFS_Flat_LCS':
        return '5.1.SFS_Flat_lCS';
      case 'SFS_House_LCS':
        return '5.2.SFS_House_LCS';
      case 'HP_Flat_LCS':
        return '6.1.HP_Flat_LCS';
      case 'HP_House_LCS':
        return '6.2.HP_House_LCS';
      case 'HP_Plot_LCS':
        return '6.3.HP_Plot_LCS';
      default:
        return 'Unknown Template';
    }
  }
  getUnitTypeName(fileType: string): string {
    switch (fileType) {
      case 'OR_Flat_LCS':
        return 'Flat';
      case 'OR_House_LCS':
        return 'House';
      case 'OR_Plot_LCS':
        return 'Plot';
      case 'SFS_Flat_LCS':
        return 'Flat';
      case 'SFS_House_LCS':
        return 'House';
      case 'HP_Flat_LCS':
        return 'Flat';
      case 'HP_House_LCS':
        return 'House';
      case 'HP_Plot_LCS':
        return 'Plot';
      default:
        return 'Unknown Template';
    }
  }
  getProjectStatusName(fileType: string): string {
    switch (fileType) {
      case 'OR_Flat_LCS':
        return 'Outright Purchase';
      case 'OR_House_LCS':
        return 'Outright Purchase';
      case 'OR_Plot_LCS':
        return 'Outright Purchase';
      case 'SFS_Flat_LCS':
        return 'Self Finance';
      case 'SFS_House_LCS':
        return 'Self Finance';
      case 'HP_Flat_LCS':
        return 'Higher Purchase';
      case 'HP_House_LCS':
        return 'Higher Purchase';
      case 'HP_Plot_LCS':
        return 'Higher Purchase';
      default:
        return 'Unknown Template';
    }
  }
  getSno(fileType: string): string {
    switch (fileType) {
      case 'OR_Flat_LCS':
        return '1';
      case 'OR_House_LCS':
        return '2';
      case 'OR_Plot_LCS':
        return '3';
      case 'SFS_Flat_LCS':
        return '4';
      case 'SFS_House_LCS':
        return '5';
      case 'HP_Flat_LCS':
        return '6';
      case 'HP_House_LCS':
        return '7';
      case 'HP_Plot_LCS':
        return '8';
      default:
        return 'Unknown Template';
    }
  }

  async getAllTemplates() {
    try {
      const response = await this.propertyService.getTemplateBuDocument("LCS").subscribe((res: any) => {
        if (res) {
          console.log('All templates:', response);
          this.responseObject = _.orderBy(res.responseObject, ['sno'], ['asc']);

          let fileName1 = this.responseObject.filter((x: any) => x.templateName == "4.1.OR_Flat_LCS");
          if (fileName1.length > 0) {
            this.type1 = fileName1[0].templateName
          } else {
            this.type1 = "";
          }

          let fileName2 = this.responseObject.filter((x: any) => x.templateName == "4.2.OR_House_LCS");
          if (fileName2.length > 0) {
            this.type2 = fileName2[0].templateName
          } else {
            this.type2 = "";
          }
          let fileName3 = this.responseObject.filter((x: any) => x.templateName == "4.3.OR_Plot_LCS");
          if (fileName3.length > 0) {
            this.type3 = fileName3[0].templateName
          } else {
            this.type3 = "";
          }
          let fileName4 = this.responseObject.filter((x: any) => x.templateName == "5.1.SFS_Flat_lCS");
          if (fileName4.length > 0) {
            this.type4 = fileName4[0].templateName
          } else {
            this.type4 = "";
          }

          let fileName5 = this.responseObject.filter((x: any) => x.templateName == "5.2.SFS_House_LCS");
          if (fileName5.length > 0) {
            this.type5 = fileName5[0].templateName
          } else {
            this.type5 = "";
          }

          let fileName6 = this.responseObject.filter((x: any) => x.templateName == "6.1.HP_Flat_LCS");
          if (fileName6.length > 0) {
            this.type6 = fileName6[0].templateName
          } else {
            this.type6 = "";
          }
          let fileName7 = this.responseObject.filter((x: any) => x.templateName == "6.2.HP_House_LCS");
          if (fileName7.length > 0) {
            this.type7 = fileName7[0].templateName
          } else {
            this.type7 = "";
          }

          let fileName8 = this.responseObject.filter((x: any) => x.templateName == "6.3.HP_Plot_LCS");
          if (fileName8.length > 0) {
            this.type8 = fileName8[0].templateName
          } else {
            this.type8 = "";
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
