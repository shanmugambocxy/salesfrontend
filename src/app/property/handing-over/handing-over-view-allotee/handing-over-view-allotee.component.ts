import { ChangeDetectorRef, Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { TimerService } from '../../../services/timer.service';
import { ToastService } from '../../../services/toast.service';
import { WordToPdfService } from '../../../services/word-to-pdf.service';
import { Subscription } from 'rxjs';

interface IInterval {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-handing-over-view-allotee',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './handing-over-view-allotee.component.html',
  styleUrl: './handing-over-view-allotee.component.scss'
})
export class HandingOverViewAlloteeComponent {

  applicationId: any;
  applicationDetails: any;
  role: any;

  countdownSubscription: Subscription | undefined;
  handingOverCountdown: IInterval = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  signedChecklist: any;
  checklistDescription: any;

  constructor(
    private wordToPdfService: WordToPdfService,
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private timerService: TimerService,
    private title: Title,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.title.setTitle("View Allotment");
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.applicationId = params['applicationId'];
    });
    this.role = sessionStorage.getItem('role');
    this.getApplicationById();
  }

  ngOnDestroy(): void {
    // Unsubscribe from the countdown observable to prevent memory leaks
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }


  getApplicationById() {
    this.propertyService.getApplicationById(this.applicationId).subscribe(
      (response: any) => {
        console.log(response);
        this.applicationDetails = response;
        this.startCountdownTimers(response);

      },
      (error: any) => {
        console.error('Error fetching application details:', error);
      }
    );
  }

  startCountdownTimers(response: any) {
    const handingOverCreatedDateAndTime = new Date(response.handingOverCreatedDateAndTime);

    // Calculate the countdown for the allotedTime
    const handingOverCountdown = new Date(handingOverCreatedDateAndTime.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.countdownSubscription = this.timerService.getCountDown(handingOverCountdown.getTime()).subscribe(interval => {
      this.handingOverCountdown = interval;
    });

  }

  onChecklistUpload(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.signedChecklist = files[0];
    } else {
      console.error('No file selected.');
    }
  }

  uploadChecklist() {
    if (!this.signedChecklist) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.signedChecklist);

    this.propertyService.uploadChecklist(formData).subscribe(
      (response: any) => {
        const data = {
          id: parseInt(this.applicationId),
          checklistPath: response.body.responseObject,
          description: this.checklistDescription
        };

        this.propertyService.changeChecklistStatus(data).subscribe(
          (response: any) => {
            this.signedChecklist = null;
            this.toast.showToast('success', 'Successfully uploaded Checklist', '');
            this.router.navigate(['/employee/handing-over']);

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

  uploadChecklist2() {
    if (!this.signedChecklist) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.signedChecklist);

    this.propertyService.uploadChecklist(formData).subscribe(
      (response: any) => {
        const data = {
          id: parseInt(this.applicationId),
          checklistPath2: response.body.responseObject,
          description: this.checklistDescription
        };

        this.propertyService.updateChecklist2(data).subscribe(
          (response: any) => {
            this.signedChecklist = null;
            this.toast.showToast('success', 'Successfully uploaded Checklist', '');
            this.router.navigate(['/employee/handing-over']);

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
