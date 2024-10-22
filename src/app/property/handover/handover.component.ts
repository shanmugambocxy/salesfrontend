import { Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import { PaymentRefundService } from '../../services/payment-refund.service';
import { SalesService } from '../../services/sales.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Banks } from '../../bank_enum';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-handover',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './handover.component.html',
  styleUrl: './handover.component.scss'
})
export class HandoverComponent {
  displayedColumns: string[] = ['sno', 'unitAccountNumber', 'schemeName', 'schemeType', 'unitNo', 'unittype', 'applicantName', 'createdDateTime', 'modeofallottment', 'action'];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  paymentDetails: any = [];
  totalAmount: any;
  banks = Banks;
  applicationData: any;
  selectDivision: any;
  divisionList: any = [];
  selectSchemeType: any;
  originalDataList: any = [];
  selectScheme: any;
  selectedDate: any;
  schemeNameList: any = [];
  selectedDateFrom: any;
  selectedDateTo: any;
  selectTypeofHouse: any;
  role: any;

  constructor(
    private router: Router,
    private title: Title,
    private propertyService: PropertyService,
    private dialog: MatDialog,
    private toast: ToastService,
    private paymentRefundService: PaymentRefundService,
    private salesService: SalesService,
    private http: HttpClient,
    private datePipe: DatePipe
  ) {
    this.title.setTitle('All Schemes');
  }
  ngOnInit() {
    this.getAllApplicationData();
    this.getDivisionList();

    this.role = sessionStorage.getItem('role');
    let divisionCode = sessionStorage.getItem('code');
    if (this.role == "Surveyor" || this.role == 'AEE') {
      this.selectDivision = divisionCode;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    debugger
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
    if (filterValue) {
      this.dataSource.data = this.originalDataList.filter((element: any) => {
        return JSON.stringify(element?.applicationNumber)?.toLowerCase().includes(filterValue.toLowerCase()) || element?.unitData?.unitAccountNumber.toLowerCase().includes(filterValue.toLowerCase()) || element?.schemeData?.schemeName.toLowerCase().includes(filterValue.toLowerCase()) || element?.schemeData?.schemeType.toLowerCase().includes(filterValue.toLowerCase()) || element?.applicantName?.toLowerCase().includes(filterValue.toLowerCase())

        // && element?.schemeData?.schemeType.toLowerCase().includes(filterValue.toLowerCase()) && element?.applicantName?.toLowerCase().includes(filterValue.toLowerCase())
      })
    } else {
      this.dataSource.data = this.originalDataList;
    }


  }

  applyFilterByOptions() {
    debugger
    // if (this.selectDivision && this.selectScheme && this.selectSchemeType && this.selectedDate) {
    //   this.dataSource.data = this.originalDataList.filter((x: any) => x.schemeData.divisionCode == this.selectDivision && x.schemeData.schemeName == this.selectScheme && x.schemeData.schemeType == this.selectSchemeType && x.creationDate)
    // }
    let filteredData = this.originalDataList;
    if (this.selectDivision) {
      filteredData = filteredData.filter((x: any) => x.schemeData.divisionCode == this.selectDivision)
    }
    if (this.selectScheme) {
      filteredData = filteredData.filter((x: any) => x.schemeData?.schemeName == this.selectScheme)
    }
    if (this.selectSchemeType) {
      filteredData = filteredData.filter((x: any) => x.schemeData?.schemeType == this.selectSchemeType)
    }
    if (this.selectTypeofHouse) {
      filteredData = filteredData.filter((x: any) => x.schemeData?.unitType == this.selectTypeofHouse)

    }

    if (this.selectedDate) {
      filteredData = filteredData.filter((x: any) => {
        const formattedDate = x?.createdDateTime ? this.datePipe.transform(new Date(x?.createdDateTime), 'yyyy-MM-dd') : x?.createdDateTime;
        return formattedDate === this.selectedDate;
      })

    }
    this.dataSource.data = filteredData;
  }

  clearFilter() {
    this.selectDivision = 'ALL';
    this.selectScheme = '';
    this.selectSchemeType = '';
    this.selectTypeofHouse = '';
    this.selectedDateFrom = '';
    this.selectedDateTo = '';
    this.getAllApplicationData();
  }

  getAllApplicationData() {
    // this.propertyService.getHandingOverByOfficer(0, "Generated").subscribe(
    this.propertyService.getHandingOverByOfficer(0, "Generated").subscribe(
      (response: any) => {
        console.log(response.responseObject);

        if (response.responseObject.length > 0) {


          if (this.role == "Surveyor") {

            this.dataSource.data = response.responseObject.filter((x: any) => x.schemeData.unitType == 'House' || x.schemeData.unitType == 'Plot');
          } else if (this.role == "AEE") {
            this.dataSource.data = response.responseObject.filter((x: any) => x.schemeData.unitType == 'House' || x.schemeData.unitType == 'Flat');

          } else {

            this.dataSource.data = response.responseObject;
          }


          this.originalDataList = this.dataSource.data;
          let schemeNameList = this.dataSource.data.map(x => x.schemeData?.schemeName);
          this.schemeNameList = schemeNameList.filter(this.onlyUnique);
          console.log('this.schemeNameList', this.schemeNameList);

        } else {
          this.dataSource.data = [];

        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  onlyUnique(value: any, index: any, array: any) {
    return array.indexOf(value) === index;
  }

  getDivisionList() {

    this.http.get('https://personnelapi.tnhb.in/getAllDivisionCode').subscribe((res: any) => {
      if (res && res.data) {
        this.divisionList = res.data.filter((x: any) => x != '');
        console.log(' this.divisionList', this.divisionList);


      } else {
        this.divisionList = [];

      }
    })
  }

  checkSurveyor(element: any) {
    debugger
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Allotment',
        message: 'Are you sure you want to HandOver this application?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const date = new Date();

        // const formattedDate = date.toLocaleString('en-US', {
        //   month: 'numeric',
        //   day: 'numeric',
        //   year: 'numeric',
        //   hour: 'numeric',
        //   minute: 'numeric',
        //   second: 'numeric',
        //   hour12: true
        // });

        const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss.SSS')
        if (element?.schemeData?.unitType == 'House') {
          let surveyorData = {
            "id": element.id,
            "checklistPath1": "CheckList Path 1",
            "surveyorStatus": "True",
            // "handingOverStatus": "HandOvered",
            "checklistPath2": "CheckList Path 2",
            "aeeStatus": element.aeeStatus,
            "checklistCreatedDateTime1": formattedDate,
            "checklistCreatedDateTime2": element.checklistCreatedDateTime2
          }
          this.propertyService.surveyorCheckListHouse(surveyorData).subscribe((res: any) => {
            if (res) {
              this.getAllApplicationData();

            }

          })

        } else if (element?.schemeData?.unitType == 'Plot') {
          let surveyorData = {
            "id": element.id,
            "checklistPath": "Check List Path",
            // "handingOverStatus": "HandOvered",
            "description": "HandOvered",
            "surveyorStatus": "True"
          }
          this.propertyService.surveyorCheckListPlot(surveyorData).subscribe(res => {
            if (res) {
              this.getAllApplicationData();

            }
          })


        }

      }
    })

  }

  checkAEE(element: any) {
    debugger

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Allotment',
        message: 'Are you sure you want to HandOver this application?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const date = new Date();

        // const formattedDate = date.toLocaleString('en-US', {
        //   month: 'numeric',
        //   day: 'numeric',
        //   year: 'numeric',
        //   hour: 'numeric',
        //   minute: 'numeric',
        //   second: 'numeric',
        //   hour12: true
        // });

        const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss.SSS')

        if (element?.schemeData?.unitType == 'House') {


          let AEEData = {
            "id": element.id,
            "checklistPath1": "CheckList Path 1",
            "surveyorStatus": element.surveyorStatus,
            // "handingOverStatus": "HandOvered",
            "checklistPath2": "CheckList Path 2",
            "aeeStatus": "True",
            "checklistCreatedDateTime1": element.checklistCreatedDateTime,
            "checklistCreatedDateTime2": formattedDate
          }
          this.propertyService.surveyorCheckListHouse(AEEData).subscribe((res: any) => {

            if (res) {
              this.getAllApplicationData();

            }

          })
        } else if (element?.schemeData?.unitType == 'Flat') {
          let AEEData = {
            "id": element.id,
            "checklistPath2": "Check list Path2",
            "description": "HandOvered",
            // "handingOverStatus": "HandOvered",
            "aeeStatus": "True"
          }
          this.propertyService.AeeCheckListFlat(AEEData).subscribe((res: any) => {
            if (res) {
              this.getAllApplicationData();

            }
          })
        }

      }
    })

  }

  viewAllApplicationsBySchemeId(applicationId: any) {
    // this.router.navigate(['/employee/scheme/applications'], { queryParams: { schemeId: schemeId } });

    this.router.navigate(['/employee/view-application'], { queryParams: { applicationId: applicationId } });

  }
}
