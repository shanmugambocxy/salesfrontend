import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastService } from '../../services/toast.service';
import { PropertyService } from '../../services/property.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent implements OnInit {
  reservationForm!: FormGroup;

  createMode: boolean = false;
  reservationSelect = new FormControl([]);
  reservationFormGroup: any = FormGroup;
  expansionPanelsArray1: any = FormArray;

  myForm!: FormGroup;
  reservationFormList: any = [];



  empForm!: FormGroup;



  formData = {
    name: '',
    address: {
      street: '',
      city: '',
      state: ''
    },
    hobbies: [
      { name: '' }
    ]
  };
  reservationGetList: any;
  type: any;
  constructor(
    private fb: FormBuilder,
    private title: Title,
    private toast: ToastService,
    private propertyService: PropertyService,
    private router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private salesService: SalesService,
    private changeDetector: ChangeDetectorRef,


  ) {


    // "subReservationName": "string",
    //           "priorityCode": "string",
    //           "percentage": "string"

  }

  ngOnInit(): void {



    debugger
    this.title.setTitle('Reservation');
    // this.reservationForm = this.fb.group({
    //   reservations: this.fb.array([this.createReservationGroup()])
    // });
    // // this.getAllReservation();

    // this.reservationFormGroup = this.fb.group({
    //   reservations: this.fb.array([this.createReservationGroup()])
    // });


    // const expansionPanelsArray1 = this.fb.group({
    //   ccCode: [''],
    //   title: [''],
    //   subtitle: [''],
    //   age: [''],
    //   finalAllocation: ['']
    //   // v_4_ONE_GO_REF_NO: [''],
    // });
    // this.expansionPanelsArray1.push(expansionPanelsArray1);


    // this.myForm = this.fb.group({
    //   id: [null],  // Add ID field
    //   ccCode: ['', Validators.required],
    //   priorityCode: [''],
    //   reservationName: ['', Validators.required],
    //   percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    //   subtitle: this.fb.array([this.createSubtitle()])
    // });


    // this.myForm = this.mainTitle();
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    this.type = this.activatedRoute.snapshot.paramMap.get('type');

    if (this.type == '2') {
      this.myForm = this.fb.group({
        id: [null],  // Add ID field
        ccCode: ['', Validators.required],
        priorityCode: [''],
        reservationName: ['', Validators.required],
        percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
        subtitle: this.fb.array([this.createSubtitle()])
      });
    } else {
      this.myForm = this.fb.group({
        id: [null],  // Add ID field
        ccCode: ['', Validators.required],
        priorityCode: [''],
        reservationName: ['', Validators.required],
        percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
        subtitle: this.fb.array([])
      });
    }




    // this.empForm = this.fb.group({
    //   employees: this.fb.array([])
    // });
    // this.addEmployee();


    console.log('id', id);
    if (id && (this.type == '0' || this.type == '1')) {
      debugger
      this.salesService.getAllSChemesData().subscribe((res: any) => {
        if (res) {

          console.log('res', res);
          let responseList: any = [];
          let reservationList: any = [];
          responseList = res.responseObject;
          // this.dataSource.data = res.responseObject;
          let getId = id ? parseInt(id) : 0;

          reservationList = responseList.filter((x: any) => x.id === getId);
          if (reservationList && reservationList.length > 0) {
            this.reservationGetList = reservationList[0];
            this.myForm.patchValue({
              id: this.reservationGetList.id,
              ccCode: this.reservationGetList.ccCode,
              reservationName: this.reservationGetList.reservationName,
              percentage: this.reservationGetList.percentage
            })
            let myForm = this.myForm.get('subtitle') as FormArray;
            this.reservationGetList.subCategoryReservation.forEach((element: any, index: any) => {
              this.subtitleForms.push(this.fb.group(element));
              // myForm.patchValue(element);
              // this.createSubtitle()
              // const myForm = this.subtitleForms.at(index) as FormGroup;
              // myForm.controls['id'].setValue(element.id);
              // myForm.controls['priorityCode'].setValue(element.priorityCode)
              // myForm.controls['subReservationName'].setValue(element.subReservationName)
              // myForm.controls['percentage'].setValue(element.percentage)
              // this.changeDetector.detectChanges();

            })

            // let myForm = this.myForm.get('subtitle').at(i) as FormArray;
            // let myForm = this.myForm.get('subtitle') as FormArray;
            // this.subtitleForms.setValue(this.reservationGetList.subCategoryReservation);
            // myForm.patchValue(this.reservationGetList.subCategoryReservation);
            // this.reservationGetList.subCategoryReservation.forEach((element: any, index: any) => {
            //   this.createSubtitle();
            //   this.subtitleForms.at(index).patchValue(element)
            // })


            // this.changeDetector.detectChanges();

            this.reservationGetList.subCategoryReservation.forEach((element: any, index: any) => {
              // myForm?.at(index)?.patchValue(element);

              // let myForm = this.myForm.get('subtitle').at(i) as FormArray;
              // if (element) {
              //   myForm.value.push(element);
              //   // myForm.patchValue(element);

              // }
            });


            // this.myForm.get('subtitle')?.value =myForm.value as FormArray
            // myForm.value.push(this.reservationGetList.subCategoryReservation)

            console.log('this.reservationGetList', this.reservationGetList);
            console.log('form', this.myForm.value);


          }


        }
      })
    }
    // this.reservationGetList = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('this.reservationGetList', this.reservationGetList);



  }


  addNewReservationForm(): FormGroup {
    return this.fb.group({
      id: [null],  // Add ID field
      ccCode: ['', Validators.required],
      priorityCode: [''],
      reservationName: ['', Validators.required],
      percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      subtitle: this.fb.array([this.createSubtitle()])
    });


  }
  createReservationForm() {
    this.getNewReservation().push(this.addNewReservationForm());
  }
  getNewReservation(): FormArray {
    return this.reservationFormGroup.get() as FormArray;
  }

  createSubtitle(): FormGroup {

    return this.fb.group({
      // title: [''],
      id: [''],
      subReservationName: [''],
      percentage: [''],
      priorityCode: ['']
    });
  }

  createSubtitleEdit(data: any): FormGroup {

    return this.fb.group({
      // title: [''],
      id: [data.id],
      subReservationName: [data.subReservationName],
      percentage: [data.percentage],
      priorityCode: [data.priorityCode]
    });
  }

  // Function to add a new subtitle form group to the array
  addSubtitle() {
    (this.myForm.get('subtitle') as FormArray).push(this.createSubtitle());
  }

  get subtitleForms() {
    return this.myForm.get('subtitle') as FormArray;
  }

  onSubmitReservationForm() {
    console.log('this.myForm.value', this.myForm.value);
  }

  submitData() {

    debugger
    // "subReservationName": "string",
    //       "priorityCode": "string",
    //       "percentage": "string"

    let subReservationList: any = this.myForm.value.subtitle;



    let data = {
      "ccCode": this.myForm.value.ccCode,
      "reservationName": this.myForm.value.reservationName,
      "percentage": this.myForm.value.percentage,
      // "subCategoryReservation": [
      //   {
      //     "subReservationName": "string",
      //     "priorityCode": "string",
      //     "percentage": "string"
      //   }
      // ]

      "subCategoryReservationDTO": subReservationList
    }
    this.propertyService.createReservationForm(data).subscribe(res => {

      if (res) {
        this.toast.showToast("success", "Success!", "Created SuccessFully")
        this.back();

      }

    })
    console.log('this.myForm.value', this.myForm.value);

  }
  updateData() {


    let id = this.myForm.value.id ? parseInt(this.myForm.value.id) : 0;
    let subReservationList: any = [];
    let subTitleReservationList: any = [];

    subReservationList = this.myForm.value.subtitle;
    subReservationList.forEach((element: any) => {
      if (element) {
        element.id = typeof element.id == 'string' ? parseInt(element.id) : ""
      }
    });
    subTitleReservationList = subReservationList;
    let data = {
      "id": id,
      "ccCode": this.myForm.value.ccCode,
      "reservationName": this.myForm.value.reservationName,
      "percentage": this.myForm.value.percentage,
      // "subCategoryReservation": [
      //   {
      //     "subReservationName": "string",
      //     "priorityCode": "string",
      //     "percentage": "string"
      //   }
      // ]

      "subCategoryReservationDTO": subTitleReservationList
    }
    this.propertyService.updateReservationForm(data).subscribe(res => {

      if (res) {
        this.toast.showToast("success", "Update!", "Updated SuccessFully")

        this.back();

      }

    })
    console.log('this.myForm.value', this.myForm.value);
  }

  addReservationForm() {

  }
  createReservationGroupForm(data: any) {

    return this.fb.group({
      id: [data.id || null],  // Add ID field
      ccCode: [data.ccCode || '', Validators.required],
      priorityCode: [data.priorityCode || ''],
      reservationName: [data.reservationName || '', Validators.required],
      percentage: [data.percentage || '', [Validators.required, Validators.min(0), Validators.max(100)]],
      subtitle: this.fb.array([{
        ccCode: [''],
        title: [''],
        subtitle: [''],
        age: [''],
        finalAllocation: ['']
      }])
    });

  }

  get controls() {
    return (this.reservationForm.get('reservations') as FormArray).controls;
  }

  createReservationGroup(data: any = {}): FormGroup {
    return this.fb.group({
      id: [data.id || null],  // Add ID field
      ccCode: [data.ccCode || '', Validators.required],
      priorityCode: [data.priorityCode || ''],
      reservationName: [data.reservationName || '', Validators.required],
      percentage: [data.percentage || '', [Validators.required, Validators.min(0), Validators.max(100)]],
      subtitle: this.fb.array([{
        ccCode: [''],
        title: [''],
        subtitle: [''],
        age: [''],
        finalAllocation: ['']
      }])
    });
  }


  get subtitle(): FormArray {
    return this.reservationForm.get("subtitle") as FormArray
  }



  addReservation(data: any = {}): void {
    (this.reservationForm.get('reservations') as FormArray).push(this.createReservationGroup(data));
  }


  removeReservation(index: number): void {
    (this.reservationForm.get('reservations') as FormArray).removeAt(index);
  }

  onSubmit(): void {
    // const totalPercentage = this.reservationForm.value.reservations.reduce((sum: number, reservation: { reservationPercentage: any; }) => {
    //   return sum + Number(reservation.reservationPercentage);
    // }, 0);

    // if (totalPercentage > 100) {
    //   this.toast.showToast('warning', 'Total reservation percentage cannot exceed 100%', '');
    //   return;
    // }

    if (this.reservationForm.valid) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '250px',
        data: { title: 'Confirm Submission', message: 'Do you want to submit the reservations?' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const reservations = this.reservationForm.value.reservations;
          reservations.forEach((reservation: any, index: number) => {
            if (reservation.id) {
              this.propertyService.updateReservation(reservation).subscribe(
                (response: any) => {
                  console.log(response);
                  this.toast.showToast('success', `Reservation updated successfully`, '');
                  this.getAllReservation();
                },
                (error: any) => {
                  console.error(error);
                  this.toast.showToast('error', `Error while updating reservation`, '');
                }
              );
            } else {
              this.propertyService.createReservation(reservation).subscribe(
                (response: any) => {
                  console.log(response);
                  this.toast.showToast('success', `Reservation submitted successfully`, '');
                  this.getAllReservation();
                },
                (error: any) => {
                  console.error(error);
                  this.toast.showToast('error', `Error while submitting reservation`, '');
                }
              );
            }
          });
        }
      });
    } else {
      this.toast.showToast('warning', `Fill all the details`, '');
    }
  }

  // onEdit(index: number): void {
  //   const reservationGroup = (this.reservationForm.get('reservations') as FormArray).at(index) as FormGroup;

  //   if (reservationGroup.valid) {
  //     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //       width: '400px',
  //       data: { title: 'Confirm Edit', message: 'Do you want to edit this reservation?' }
  //     });

  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //         this.propertyService.updateReservation(reservationGroup.value).subscribe(
  //           (response: any) => {
  //             console.log(response);
  //             this.toast.showToast('success', `Reservation updated successfully`, '');
  //             this.getAllReservation();
  //           },
  //           (error: any) => {
  //             console.error(error);
  //             this.toast.showToast('error', `Error while updating reservation`, '');
  //           }
  //         );
  //       }
  //     });
  //   } else {
  //     this.toast.showToast('warning', `Fill all the details`, '');
  //   }
  // }

  onDelete(index: number): void {
    const reservationGroup = (this.reservationForm.get('reservations') as FormArray).at(index) as FormGroup;
    console.log(reservationGroup.value.id);
    if (reservationGroup.value.id) {
      if (reservationGroup.valid) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '400px',
          data: { title: 'Confirm Delete', message: 'Do you want to delete this reservation?' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.propertyService.deleteReservation(reservationGroup.value.id).subscribe(
              (response: any) => {
                console.log(response);
                this.toast.showToast('success', `Reservation deleted successfully`, '');
                this.getAllReservation();
              },
              (error: any) => {
                console.error(error);
                this.toast.showToast('error', `Error while deleting reservation`, '');
              }
            );
          }
        });
      } else {
        this.toast.showToast('warning', `Fill all the details`, '');
      }
    } else {
      (this.reservationForm.get('reservations') as FormArray).removeAt(index);
    }
  }

  inputValidate(evt: any, field: any) {
    const theEvent = evt || window.event;
    let key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    let regexValue = /[0-9.]/;
    if (field == 'alphabets') {
      regexValue = /^[a-zA-Z ]+$/;
    } else if (field == 'alphaNumeric') {
      regexValue = /[0-9 a-zA-Z]/;
    } else if (field == 'numbersonly') {
      regexValue = /[0-9 ]/;
    } else if (field == 'alphaNumericWithUnderscore') {
      regexValue = /^[a-zA-Z0-9_]+$/;
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

  getAllReservation() {
    this.propertyService.getAllReservation().subscribe(
      (response: any) => {
        console.log(response);
        // Clear existing reservations
        const reservationsArray = this.reservationForm.get('reservations') as FormArray;
        reservationsArray.clear();
        if (response.responseObject.length === 0) {
          this.toast.showToast('warning', 'No reservations found', '');
          this.createMode = true;
        }
        // Populate the form with the retrieved reservations
        response.responseObject.forEach((reservation: any) => {
          this.addReservation(reservation);
        });
      },
      (error: any) => {
        console.error(error);
        this.toast.showToast('error', `Error while fetching data`, '');
      }
    );
  }


  filterReservationSelect() {

  }


  addReservationOne() {


    const expansionPanelsArray1 = this.fb.group({
      ccCode: [''],
      title: [''],
      subtitle: [''],
      age: [''],
      finalAllocation: ['']

      // v_4_ONE_GO_REF_NO: [''],


    });
    this.expansionPanelsArray1.push(expansionPanelsArray1);

  }

  removeReservationOne() {

  }
  deleteData() {

  }




  ////empform


  employees(): FormArray {
    // return <FormArray> this.empForm.get('employees') as FormArray;
    return <FormArray>this.empForm.get('employees');

  }

  newEmployee(): FormGroup {
    return this.fb.group({
      firstName: '',
      lastName: '',
      skills: this.fb.array([])
    });
  }

  addEmployee() {
    this.employees().push(this.newEmployee());
  }

  removeEmployee(empIndex: number) {
    this.employees().removeAt(empIndex);
  }




  addHobby() {
    this.formData.hobbies.push({ name: '' });
  }

  removeHobby(index: number) {
    this.formData.hobbies.splice(index, 1);
  }

  back() {
    this.router.navigateByUrl('/employee/reservationlist')
  }


  deleteSubcategory(index: any) {
    // api/categoryReservation/deleteById/12

    const reservationGroup = (this.reservationForm.get('reservations') as FormArray).at(index) as FormGroup;
    console.log(reservationGroup.value.id);
    if (reservationGroup.value.id) {
      if (reservationGroup.valid) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '400px',
          data: { title: 'Confirm Delete', message: 'Do you want to delete this reservation?' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.propertyService.deleteReservation(reservationGroup.value.id).subscribe(
              (response: any) => {
                console.log(response);
                this.toast.showToast('success', `Reservation deleted successfully`, '');
                this.getAllReservation();
              },
              (error: any) => {
                console.error(error);
                this.toast.showToast('error', `Error while deleting reservation`, '');
              }
            );
          }
        });
      } else {
        this.toast.showToast('warning', `Fill all the details`, '');
      }
    } else {
      (this.reservationForm.get('reservations') as FormArray).removeAt(index);
    }
  }

  deletecategory(data: any, i: any) {
    // api/categoryReservation/deleteById/12
    debugger
    let id = data.value.id;
    console.log(id);
    if (id) {

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: { title: 'Confirm Delete', message: 'Do you want to delete this Subcategory?' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.propertyService.deleteReservationSubcategory(id).subscribe(
            (response: any) => {
              if (response && response.statusCodeValue == 200) {
                console.log(response);
                // this.toast.showToast('Warning', `Reservation deleted successfully`, '');
                this.subtitleForms.removeAt(i);

                this.toast.showToast('success', `Reservation Subcategory Deleted Successfully`, '');
              }

            },
            (error: any) => {
              console.error(error);
              this.toast.showToast('error', `Error while deleting reservation`, '');
            }
          );

        }
      });

    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: { title: 'Confirm Delete', message: 'Do you want to delete this Subcategory?' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.subtitleForms.removeAt(i);

        }
      })

    }
  }


}