import { Component, Inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-appointmeentpopup',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './appointmeentpopup.component.html',
  styleUrl: './appointmeentpopup.component.scss'
})
export class AppointmeentpopupComponent {
  appointmentDate: any;
  appointmentIssues: any = 0;

  constructor(
    public dialogRef: MatDialogRef<AppointmeentpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    private propertService: PropertyService
  ) { }



  onConfirm(): void {
    console.log('date', this.appointmentDate);
    let formateDate = this.datePipe.transform(this.appointmentDate, 'dd-MM-yyyy');
    this.dialogRef.close(formateDate);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  checkAppointmentDate(event: any) {
    let value = event.target.value;

    let formateDate = this.datePipe.transform(value, 'dd-MM-yyyy');
    debugger
    this.propertService.checkAppointmentCountSaledeed(formateDate).subscribe(res => {
      if (res) {
        this.appointmentIssues = res;
      }
    })
  }


}
