import { Component } from '@angular/core';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PropertyService } from '../../services/property.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { Toast } from 'ngx-toastr';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-rateofinterest',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './rateofinterest.component.html',
  styleUrl: './rateofinterest.component.scss'
})
export class RateofinterestComponent {
  RateOfInterestForm!: FormGroup;
  application: any[] = [];
  mode: any;
  applicationData: any;
  applicationId: any;


  constructor(
    private fb: FormBuilder,
    private title: Title,
    private propertyService: PropertyService,
    private dialog: MatDialog,
    private toast: ToastService,
    private datePipe: DatePipe
  ) { }
  ngOnInit(): void {
    this.title.setTitle('Rate Of Interest');
    this.RateOfInterestForm = this.fb.group({

      interest: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],

    });

    // Add value change listeners to format the values
    // this.formatValueOnChange('interest');


    this.getAllInterest();
  }

  getAllInterest() {
    debugger
    this.propertyService.getAllRateOfInterest().subscribe(
      (response: any) => {
        console.log(response);
        if (response) {
          this.application = response.responseObject;
          if (this.application?.length === 0) {
            this.mode = 'create';
          } else {
            this.mode = 'edit';
          }
          this.applicationData = response.responseObject;
          if (this.applicationData) {
            // this.applicationId = response.responseObject[0].id;
            // this.RateOfInterestForm.patchValue({
            //   type: this.applicationData.type,
            //   fees: this.applicationData.fees,

            // });
          }
        }

      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  private formatValueOnChange(controlName: string) {
    this.RateOfInterestForm.get(controlName)?.valueChanges.subscribe(value => {
      if (value) {
        const formattedValue = this.formatIndianCurrency(value);
        this.RateOfInterestForm.get(controlName)?.setValue(formattedValue, { emitEvent: false });
      }
    });
  }

  private formatIndianCurrency(value: string): string {
    value = value.replace(/,/g, ''); // Remove existing commas
    let x = value.split('.');
    let lastThree = x[0].substring(x[0].length - 3);
    let otherNumbers = x[0].substring(0, x[0].length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    let result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    if (x.length > 1) {
      result += '.' + x[1];
    }
    return result;
  }
  private removeCommas(value: string): string {
    return value.replace(/,/g, '');
  }
  createApplication() {
    if (this.RateOfInterestForm.valid) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '50%',
        data: { title: 'Confirm Submission', message: 'Are you sure you want to submit the form?' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const formValue = { ...this.RateOfInterestForm.value };
          let startDate = this.datePipe.transform(new Date(formValue.startDate), 'yyyy-MM-dd');
          let endDate = this.datePipe.transform(new Date(formValue.endDate), 'yyyy-MM-dd');

          formValue.startDate = startDate;
          formValue.endDate = endDate;
          formValue.interest = formValue.interest ? parseFloat(formValue.interest) : 0;
          // formValue.interest = this.removeCommas(formValue.fees);

          console.log(formValue);
          this.propertyService.createRateOfInterest(formValue).subscribe(
            (response: any) => {
              console.log(response);
              this.getAllInterest();
              this.RateOfInterestForm.reset();
            },
            (error: any) => {
              console.error(error);
            }
          );
        }
      });
    } else {
      this.toast.showToast('warning', "Please Fill All The Fields.", '')
    }

  }
  editApplication(list: any) {
    debugger
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '50%',
      data: { title: 'Confirm Submission', message: 'Are you sure you want to edit the Data?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // const formValue = { ...this.applicationForm.value, id: id };
        // formValue.fees = this.removeCommas(formValue.fees);
        const formValue = {
          'interest': list.interest,
          "id": list.id,
          "startDate": list.startDate,
          "endDate": list.endDate
        };




        console.log(formValue);
        this.propertyService.editRateOfInterest(formValue).subscribe(
          (response: any) => {
            console.log(response);
            this.getAllInterest();
          },
          (error: any) => {
            console.error(error);
          }
        );
      }
    });
  }
  deleteApplication(id: any) {
    debugger
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '50%',
      data: { title: 'Confirm Submission', message: 'Are you sure you want to delete the Data?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // const formValue = { ...this.applicationForm.value, id: id };
        // formValue.fees = this.removeCommas(formValue.fees);

        console.log(id);
        this.propertyService.deleteRateOfInterest(id).subscribe(
          (response: any) => {
            console.log(response);
            this.getAllInterest();
          },
          (error: any) => {
            console.error(error);
          }
        );
      }
    });
  }
  inputValidate(evt: any, field: any) {
    const theEvent = evt || window.event;
    let key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    let regexValue = /[0-9.]/;
    if (field == 'alphabets') {
      regexValue = /^[a-zA-Z]+$/;
    } else if (field == 'alphaNumeric') {
      regexValue = /[0-9 a-zA-Z]/;
    } else if (field == 'numbersonly') {
      regexValue = /[.0-9 ]/;
    } else if (field == 'caps') {
      regexValue = /^[A-Z]+$/;
    } else if (field === 'email') {
      // Email regex pattern
      regexValue = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    }

    const regex = regexValue;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) {
        theEvent.preventDefault();
      }
    }

    // Prevent pasting using Ctrl+V within the keypress event
    if (theEvent.ctrlKey && (theEvent.key === 'v' || theEvent.key === 'V')) {
      theEvent.preventDefault();
    }

  }
}
