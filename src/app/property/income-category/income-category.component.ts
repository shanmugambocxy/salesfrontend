import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PropertyService } from '../../services/property.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-income-category',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './income-category.component.html',
  styleUrl: './income-category.component.scss'
})
export class IncomeCategoryComponent implements OnInit {
  incomeForm!: FormGroup;
  incomes: any[] = [];
  mode: any;
  incomeData: any;
  incomeId: any;

  constructor(
    private fb: FormBuilder,
    private title: Title,
    private propertyService: PropertyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Income Category');
    this.incomeForm = this.fb.group({
      higFrom: ['', Validators.required],
      higTo: ['', Validators.required],
      migFrom: ['', Validators.required],
      migTo: ['', Validators.required],
      ligFrom: ['', Validators.required],
      ligTo: ['', Validators.required],
      ewsFrom: ['', Validators.required],
      ewsTo: ['', Validators.required]
    });

    // Add value change listeners to format the values
    this.formatValueOnChange('higFrom');
    this.formatValueOnChange('higTo');
    this.formatValueOnChange('migFrom');
    this.formatValueOnChange('migTo');
    this.formatValueOnChange('ligFrom');
    this.formatValueOnChange('ligTo');
    this.formatValueOnChange('ewsFrom');
    this.formatValueOnChange('ewsTo');

    this.getAllIncome();
  }

  private formatValueOnChange(controlName: string) {
    this.incomeForm.get(controlName)?.valueChanges.subscribe(value => {
      if (value) {
        const formattedValue = this.formatIndianCurrency(value);
        this.incomeForm.get(controlName)?.setValue(formattedValue, { emitEvent: false });
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

  createIncome() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '50%',
      data: { title: 'Confirm Submission', message: 'Are you sure you want to submit the form?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const formValue = { ...this.incomeForm.value };
        formValue.higFrom = this.removeCommas(formValue.higFrom);
        formValue.higTo = this.removeCommas(formValue.higTo);
        formValue.migFrom = this.removeCommas(formValue.migFrom);
        formValue.migTo = this.removeCommas(formValue.migTo);
        formValue.ligFrom = this.removeCommas(formValue.ligFrom);
        formValue.ligTo = this.removeCommas(formValue.ligTo);
        formValue.ewsFrom = this.removeCommas(formValue.ewsFrom);
        formValue.ewsTo = this.removeCommas(formValue.ewsTo);

        console.log(formValue);
        this.propertyService.createIncomeCategory(formValue).subscribe(
          (response: any) => {
            console.log(response);
            this.getAllIncome();
          },
          (error: any) => {
            console.error(error);
          }
        );
      }
    });
  }


  getAllIncome() {
    this.propertyService.getAllIncome().subscribe(
      (response: any) => {
        console.log(response);
        this.incomes = response.responseObject;
        if (this.incomes.length === 0) {
          this.mode = 'create';
        } else {
          this.mode = 'edit';
        }
        this.incomeData = response.responseObject[0];
        if (this.incomeData) {
          this.incomeId = response.responseObject[0].id;
          this.incomeForm.patchValue({
            higFrom: this.incomeData.higFrom,
            higTo: this.incomeData.higTo,
            migFrom: this.incomeData.migFrom,
            migTo: this.incomeData.migTo,
            ligFrom: this.incomeData.ligFrom,
            ligTo: this.incomeData.ligTo,
            ewsFrom: this.incomeData.ewsFrom,
            ewsTo: this.incomeData.ewsTo,
          });
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  editIncome() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '50%',
      data: { title: 'Confirm Submission', message: 'Are you sure you want to edit the form?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const formValue = { ...this.incomeForm.value, id: parseInt(this.incomeId) };
        formValue.higFrom = this.removeCommas(formValue.higFrom);
        formValue.higTo = this.removeCommas(formValue.higTo);
        formValue.migFrom = this.removeCommas(formValue.migFrom);
        formValue.migTo = this.removeCommas(formValue.migTo);
        formValue.ligFrom = this.removeCommas(formValue.ligFrom);
        formValue.ligTo = this.removeCommas(formValue.ligTo);
        formValue.ewsFrom = this.removeCommas(formValue.ewsFrom);
        formValue.ewsTo = this.removeCommas(formValue.ewsTo);

        console.log(formValue);
        this.propertyService.editIncomeCategory(formValue).subscribe(
          (response: any) => {
            console.log(response);
            this.getAllIncome();
          },
          (error: any) => {
            console.error(error);
          }
        );
      }
    });
  }


}