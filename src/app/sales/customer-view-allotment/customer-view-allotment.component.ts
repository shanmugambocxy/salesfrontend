import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesService } from '../../services/sales.service';
import { ToastService } from '../../services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-view-allotment',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-view-allotment.component.html',
  styleUrl: './customer-view-allotment.component.scss'
})
export class CustomerViewAllotmentComponent implements OnInit {

  activePanel: number = 0;

  applicationId: any;
  applicationData: any;

  lcsRequestLetterTemplate: any;
  lcsRequestFile: any;

  homeLoan: any = 'No';

  loanSanctionLetter: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private salesService: SalesService,
    private toast: ToastService,
    private dialog: MatDialog,
    private title: Title,
    private datePipe: DatePipe
  ) {
    this.title.setTitle('Customer | Allotment');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.applicationId = params['applicationId'];
      this.getApplicationById();
    });
    this.getAllTemplate();
  }

  togglePanel(panel: number) {
    this.activePanel = this.activePanel === panel ? 0 : panel;
  }

  getApplicationById() {
    this.salesService.getApplicationById(this.applicationId).subscribe(
      (response: any) => {
        console.log(response);
        this.applicationData = response;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  formatDate(date: any) {
    const utcDate = new Date(date);
    const localDateString = utcDate.toLocaleString();
    return localDateString;
  }

  formatDateString(date: string) {
    return this.datePipe.transform(date, 'dd-MM-yyyy');
  }

  getAllTemplate() {
    this.salesService.getAllTemplate().subscribe(
      (response: any) => {
        console.log(response);
        const templates = response.responseObject;
        this.lcsRequestLetterTemplate = templates.find((template: any) => template.templateName === 'LCS Request Letter');
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  onLCSRequestUpload(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.lcsRequestFile = files[0];
    } else {
      console.error('No file selected.');
    }
  }

  uploadLCSRequest() {
    if (!this.lcsRequestFile) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.lcsRequestFile);

    this.salesService.lcsRequestUpload(formData).subscribe(
      (response: any) => {
        const data = {
          id: parseInt(this.applicationId),
          lcsRequestLetterPath: response.body.responseObject
        };

        this.salesService.updateLCSRequestStatus(data).subscribe(
          (response: any) => {
            this.lcsRequestFile = null;
            this.toast.showToast('success', 'Successfully uploaded LCS Letter', '');
            this.getApplicationById();
          },
          (error: any) => {
            console.error(error);
          }
        );
      },
      (error: any) => {
        console.error(error);
        this.toast.showToast('error', 'Error', 'An error occurred.');
      }
    );
  }

  onHomeLoan() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: { title: 'Confirm Home Loan', message: 'Do you wish to updated home loan status?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = {
          id: this.applicationId,
          homeLoanStatus: this.homeLoan
        }
        this.salesService.updateHomeLoanStatus(data).subscribe(
          (response: any) => {
            console.log(response);
            this.toast.showToast('success', 'Successfully updated Home Loan Status', '');
            this.getApplicationById();
          },
          (error: any) => {
            console.error(error);
          }
        );
      }
    });
  }

  onLoanSancUpload(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.loanSanctionLetter = files[0];
    } else {
      console.error('No file selected.');
    }
  }

  uploadLoanSanc() {
    if (!this.loanSanctionLetter) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.loanSanctionLetter);

    this.salesService.fileUpload(formData).subscribe(
      (response: any) => {
        const data = {
          id: parseInt(this.applicationId),
          loanSanctionLetterPath: response.body.responseObject
        };

        this.salesService.updateLoanSancStatus(data).subscribe(
          (response: any) => {
            this.loanSanctionLetter = null;
            this.toast.showToast('success', 'Successfully uploaded Loan Sanction Letter', '');
            this.getApplicationById();
          },
          (error: any) => {
            console.error(error);
          }
        );
      },
      (error: any) => {
        console.error(error);
        this.toast.showToast('error', 'Error', 'An error occurred.');
      }
    );
  }


}
