import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { WordToPdfService } from '../../../services/word-to-pdf.service';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { Subscription } from 'rxjs';
import { TimerService } from '../../../services/timer.service';
import { Title } from '@angular/platform-browser';
import { ToastService } from '../../../services/toast.service';

interface IInterval {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-view-allotment',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './view-allotment.component.html',
  styleUrl: './view-allotment.component.scss'
})
export class ViewAllotmentComponent implements OnInit, OnDestroy {

  lcs: boolean = false;

  activePanel: number = 0;
  applicationId: any;
  applicationDetails: any;
  mailDescription: any;
  anbDescription: any;
  saleDeedDescription: any

  allotmentCountdown: IInterval = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  lcsCountdown: IInterval = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  anbCountdown: IInterval = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  draftSaleCountdown: IInterval = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  countdownSubscription: Subscription | undefined;

  signedAllotmentFile: any;
  signedLcsFile: any;
  anbCertificate: any;
  hoReport: any;
  handingOverOfficer: any;
  saleDeedFile: any;

  firstDate!: string;
  secondDate!: string;
  thirdDate!: string;
  minDate!: string;

  togglePanel(panel: number) {
    this.activePanel = this.activePanel === panel ? 0 : panel;
  }

  constructor(
    private wordToPdfService: WordToPdfService,
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private timerService: TimerService,
    private title: Title,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    this.title.setTitle("View Allotment");
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.applicationId = params['applicationId'];
    });
    this.getApplicationById();

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];
  }

  ngOnDestroy(): void {
    // Unsubscribe from the countdown observable to prevent memory leaks
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  formatDate(date: any) {
    const utcDate = new Date(date);
    const localDateString = utcDate.toLocaleString();
    return localDateString;
  }

  async generateAllotmentOrder() {
    try {
      const docxUrl = '../../../../assets/Allotment-Order.docx';
      const data = {
        name: this.applicationDetails.applicantName,
      };
      this.wordToPdfService.fetchAndProcessWordFile(docxUrl, data, "Allotment Order", "");
    } catch (error) {
      console.error('Error generating allotment order:', error);
    }
  }

  getApplicationById() {
    this.propertyService.getApplicationById(this.applicationId).subscribe(
      (response: any) => {
        console.log(response);
        this.applicationDetails = response;
        this.startCountdownTimers(response);

        if (response.lcsRequestLetterCreatedDateTime) {
          this.lcs = true;
        }
      },
      (error: any) => {
        this.handleError('Error fetching application details:', error);
      }
    );
  }

  startCountdownTimers(response: any) {
    const allotedTime = new Date(response.allotedTime);
    const lcsRequestLetterCreatedDateTime = new Date(response.lcsRequestLetterCreatedDateTime);
    const loanSanctionDateTime = new Date(response.loanSanctionDateTime);
    const checklistCreatedDateTime = new Date(response.checklistCreatedDateTime);

    // Calculate the countdown for the allotedTime
    const allotmentCountdownTime = new Date(allotedTime.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.countdownSubscription = this.timerService.getCountDown(allotmentCountdownTime.getTime()).subscribe(interval => {
      this.allotmentCountdown = interval;
    });

    // Calculate the lcsCountdown as lcsRequestLetterCreatedDateTime plus 7 days
    const lcsCountdownTime = new Date(lcsRequestLetterCreatedDateTime.getTime() + 7 * 24 * 60 * 60 * 1000); // Adding 7 days in milliseconds

    this.countdownSubscription.add(
      this.timerService.getCountDown(lcsCountdownTime.getTime()).subscribe(interval => {
        this.lcsCountdown = interval;
      })
    );

    // Calculate the a&bCountdown
    const anbCountdownTime = new Date(loanSanctionDateTime.getTime() + 7 * 24 * 60 * 60 * 1000); // Adding 7 days in milliseconds

    this.countdownSubscription.add(
      this.timerService.getCountDown(anbCountdownTime.getTime()).subscribe(interval => {
        this.anbCountdown = interval;
      })
    );

    // Calculate the draftSaleDeedCountdown
    const draftSaleCountdownTime = new Date(checklistCreatedDateTime.getTime() + 7 * 24 * 60 * 60 * 1000); // Adding 7 days in milliseconds

    this.countdownSubscription.add(
      this.timerService.getCountDown(draftSaleCountdownTime.getTime()).subscribe(interval => {
        this.draftSaleCountdown = interval;
      })
    );
  }

  onAllotmentUpload(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.signedAllotmentFile = files[0];
    } else {
      console.error('No file selected.');
    }
  }

  uploadSignedAllotmentFile() {
    if (!this.signedAllotmentFile) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.signedAllotmentFile);

    this.propertyService.uploadSignedAllotmentFile(formData).subscribe(
      (response: any) => {
        this.handleUploadSuccess(response);
      },
      (error: any) => {
        this.handleError('File upload failed:', error);
      }
    );
  }

  handleUploadSuccess(response: any) {
    const data = {
      id: parseInt(this.applicationId),
      sighnedAllotmentOrderDateTime: '',
      sighnedAllotmentOrderPath: response.body.responseObject
    };

    this.propertyService.addSignedAllotmentStatus(data).subscribe(
      (response: any) => {
        this.signedAllotmentFile = null;
        this.toast.showToast('success', 'Successfully uploaded Allotment Order', '');
        this.getApplicationById();
      },
      (error: any) => {
        this.handleError('Error updating status:', error);
      }
    );
  }

  handleError(message: string, error: any) {
    console.error(message, error);
    this.toast.showToast('error', 'Error', 'An error occurred.');
  }

  onLCSUpload(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.signedLcsFile = files[0];
    } else {
      console.error('No file selected.');
    }
  }

  uploadLCS() {
    if (!this.signedLcsFile) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.signedLcsFile);

    this.propertyService.uploadSignedLCSFile(formData).subscribe(
      (response: any) => {
        const data = {
          id: parseInt(this.applicationId),
          sighnedLcsOrderPath: response.body.responseObject,
          description: this.mailDescription
        };

        this.propertyService.addSignedLCSStatus(data).subscribe(
          (response: any) => {
            console.log(response);
            this.signedLcsFile = null;
            this.toast.showToast('success', 'Successfully uploaded LCS', '');
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

  async generateABCertificate() {
    try {
      const docxUrl = '../../../../assets/Allotment-Order.docx';
      const data = {
        name: this.applicationDetails.applicantName,
      };
      this.wordToPdfService.fetchAndProcessWordFile(docxUrl, data, "AandB certificate", "");
    } catch (error) {
      console.error('Error generating allotment order:', error);
    }
  }

  onABUpload(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.anbCertificate = files[0];
    } else {
      console.error('No file selected.');
    }
  }

  uploadABCertificate() {
    if (!this.anbCertificate) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.anbCertificate);

    this.propertyService.uploadSignedABCerticate(formData).subscribe(
      (response: any) => {
        const data = {
          id: parseInt(this.applicationId),
          anBOrderPath: response.body.responseObject,
          description: this.anbDescription
        };

        this.propertyService.addSignedABStatus(data).subscribe(
          (response: any) => {
            this.anbCertificate = null;
            this.toast.showToast('success', 'Successfully A&B Certificate', '');
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

  async generateHO() {
    try {
      const docxUrl = '../../../../assets/Allotment-Order.docx';
      const data = {
        name: this.applicationDetails.applicantName,
      };
      this.wordToPdfService.fetchAndProcessWordFile(docxUrl, data, "Allotment Order", "");
    } catch (error) {
      console.error('Error generating allotment order:', error);
    }
  }

  onHOUpload(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.hoReport = files[0];
    } else {
      console.error('No file selected.');
    }
  }

  uploadHO() {
    if (!this.hoReport) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.hoReport);

    this.propertyService.uploadSignedHOReport(formData).subscribe(
      (response: any) => {
        let data;
        if (this.applicationDetails.schemeData.unitType === 'Flat') {
          data = {
            id: parseInt(this.applicationId),
            handingOverPath: response.body.responseObject,
            handingOverOfficer: this.handingOverOfficer,
            handOverOfficer2: null
          };
        } else if (this.applicationDetails.schemeData.unitType === 'House') {
          data = {
            id: parseInt(this.applicationId),
            handingOverPath: response.body.responseObject,
            handingOverOfficer: this.handingOverOfficer,
            handOverOfficer2: 'Surveyor'
          };
        } else if (this.applicationDetails.schemeData.unitType === 'Plot') {
          data = {
            id: parseInt(this.applicationId),
            handingOverPath: response.body.responseObject,
            handingOverOfficer: null,
            handOverOfficer2: 'Surveyor'
          };
        }

        this.propertyService.addSignedHOStatus(data).subscribe(
          (response: any) => {
            this.hoReport = null;
            this.toast.showToast('success', 'Successfully uploaded HO Report', '');
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

  addExecutionDates() {
    const data = {
      "id": this.applicationId,
      "date1": this.firstDate,
      "date2": this.secondDate,
      "date3": this.thirdDate
    };
    this.propertyService.addExecutionDates(data).subscribe(
      (response: any) => {
        this.toast.showToast('success', 'Successfully uploaded dates', '');
        this.getApplicationById();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  onSaleDeedUpload(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.saleDeedFile = files[0];
    } else {
      console.error('No file selected.');
    }
  }

  uploadSaleDeed() {
    if (!this.saleDeedFile) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.saleDeedFile);

    this.propertyService.uploadSaleDeed(formData).subscribe(
      (response: any) => {
        const data = {
          id: parseInt(this.applicationId),
          saleDeed: response.body.responseObject,
          description: this.saleDeedDescription
        };

        this.propertyService.updateSaleDeedStatus(data).subscribe(
          (response: any) => {
            this.saleDeedFile = null;
            this.toast.showToast('success', 'Successfully uploaded Sale Deed', '');
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
