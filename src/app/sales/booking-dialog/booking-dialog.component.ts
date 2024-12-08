import { Component, Inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-booking-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.scss']
})
export class BookingDialogComponent {
  unitDetailsForm: FormGroup;
  popupData: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private salesService: SalesService
  ) {
    this.popupData = data;
    console.log(' this.popupData', this.popupData);

    // Initialize the form with default values and validators
    this.unitDetailsForm = this.fb.group({
      unitAccountNumber: ['', Validators.required],
      unitNo: ['', Validators.required],
      blockNo: ['', Validators.required],
      floorNo: ['', Validators.required],
      uds: ['', Validators.required],
      plinthArea: ['', Validators.required],
      unitCost: ['', [Validators.required, Validators.min(0)]],
      initialAmount: [{ value: '', disabled: true }],
      applicationFee: [{ value: '', disabled: true }],
      registrationFee: [{ value: '200', disabled: true }],
      grandTotal: [{ value: '', disabled: true }],
      doorFacing: ['', Validators.required],
      Plot_Area: ['', Validators.required],
      cgst: ['', Validators.required],
      sgst: ['', Validators.required]
    });

    // Patch the form with the provided data
    this.unitDetailsForm.patchValue({
      unitAccountNumber: this.popupData.unitAccountNumber,
      unitNo: this.popupData.unitNo,
      blockNo: this.popupData.blockNo,
      floorNo: this.popupData.floorNo,
      uds: this.popupData.uds,
      // plinthArea: this.popupData.plintArea,
      plinthArea: this.popupData.plinthArea,

      unitCost: this.popupData.unitCost,
      doorFacing: this.popupData.doorFacing,
      Plot_Area: this.popupData.actualExtent
    });
    this.setApplicationFee();
    this.calculateInitialAmount();
    this.calculateGrandTotal();
  }

  setApplicationFee() {
    let applicationFee: string;

    switch (this.popupData.schemeType) {
      case 'HIG':
        applicationFee = '500';
        break;
      case 'MIG':
        applicationFee = '300';
        break;
      case 'LIG':
        applicationFee = '200';
        break;
      case 'EWS':
        applicationFee = '100';
        break;
      default:
        applicationFee = '0';
        break;
    }

    this.unitDetailsForm.patchValue({ applicationFee: applicationFee });
  }

  calculateInitialAmount() {
    const unitCost = parseFloat(this.unitDetailsForm.get('unitCost')?.value);
    if (!isNaN(unitCost)) {
      const initialAmount = unitCost * 0.1;
      this.unitDetailsForm.patchValue({ initialAmount: initialAmount.toFixed(2) });
    }
  }

  calculateGrandTotal() {
    const applicationFee = parseFloat(this.unitDetailsForm.get('applicationFee')?.value);
    const applicationFeeWithGst = applicationFee * 1.18; // Including GST
    const initialAmount = parseFloat(this.unitDetailsForm.get('initialAmount')?.value);
    const registrationFee = parseFloat(this.unitDetailsForm.get('registrationFee')?.value);
    const cgst = applicationFee * (9 / 100)
    const sgst = applicationFee * (9 / 100)

    const grandTotal = initialAmount + applicationFeeWithGst + registrationFee;
    this.unitDetailsForm.patchValue({ grandTotal: grandTotal.toFixed(2), applicationFee: applicationFeeWithGst, cgst: cgst, sgst: sgst });
  }

  onProceedClick(): void {
    // Close the dialog with a result
    debugger
    this.salesService.getUnitDataBySchemeId(this.popupData.schemeData.id).subscribe(res => {
      if (res) {
        let allUnits = res.responseObject;
        // let checkUnits = res.filter((x: any) => x.id == this.popupData.id);
        debugger
      }
    })
    // this.dialogRef.close(data);
    this.dialogRef.close("proceed");

  }


  back() {
    this.dialogRef.close("back");

  }
}
