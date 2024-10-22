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
import Swal from 'sweetalert2';
import { AppointmeentpopupComponent } from '../appointmeentpopup/appointmeentpopup.component';

@Component({
  selector: 'app-allotee-saledeed-schedule',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './allotee-saledeed-schedule.component.html',
  styleUrl: './allotee-saledeed-schedule.component.scss'
})
export class AlloteeSaledeedScheduleComponent {
  displayedColumns: string[] = ['sno', 'unitAccountNumber', 'schemeName', 'schemeType', 'unitNo', 'unittype', 'applicantName', 'createdDateTime', 'schedule'];

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
  customerId: any;
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
    this.customerId = sessionStorage.getItem('customerId');

    this.getAllApplicationData();
    this.getDivisionList();
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
    this.propertyService.getSaledeedShedule("NotNeeded", "Uploded", this.customerId, "Ready").subscribe(
      (response: any) => {
        console.log(response.responseObject);
        this.dataSource.data = response.responseObject;
        this.originalDataList = this.dataSource.data;
        let schemeNameList = this.dataSource.data.map(x => x.schemeData?.schemeName);
        this.schemeNameList = schemeNameList.filter(this.onlyUnique);
        console.log('this.schemeNameList', this.schemeNameList);
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

  chooseDateSaledeed(element: any) {
    // Swal.fire({
    //   title: "Fix The Date",
    //   input: "date",
    //   inputAttributes: {
    //     autocapitalize: "off"
    //   },
    //   showCancelButton: true,
    //   confirmButtonText: "Submit",
    //   showLoaderOnConfirm: true,
    //   // preConfirm: async (login) => {
    //   //   try {
    //   //     const githubUrl = `
    //   //       https://api.github.com/users/${login}
    //   //     `;
    //   //     const response = await fetch(githubUrl);
    //   //     if (!response.ok) {
    //   //       return Swal.showValidationMessage(`
    //   //         ${JSON.stringify(await response.json())}
    //   //       `);
    //   //     }
    //   //     return response.json();
    //   //   } catch (error) {
    //   //     Swal.showValidationMessage(`
    //   //       Request failed: ${error}
    //   //     `);
    //   //   }
    //   // },
    //   // allowOutsideClick: () => !Swal.isLoading()
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     console.log('result', result.value);
    //     debugger
    //     // Swal.fire({
    //     //   title: `${result.value.login}'s avatar`,
    //     //   imageUrl: result.value.avatar_url
    //     // });
    //   }
    // });

    const dialogRef = this.dialog.open(AppointmeentpopupComponent, {
      data: {
        title: 'Confirm Allotment',
        message: 'Are you sure you want to Reject this application?'
      },
      // width: '550px',
      width: '30%',

      // height: '300px',

      panelClass: 'my-class-appointment'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        debugger
        let appointmentDate = result;
        let data = {
          "id": element.id,
          "date1": appointmentDate,
          "saledeedStatus": "Scheduled",
          "executedStatus": "Requested"
        }

        this.propertyService.updateAppointmentDateSaledeed(data).subscribe(res => {
          if (res) {
            this.getAllApplicationData();
          }
        })
      }
    })
  }

  viewAllApplicationsBySchemeId(applicationId: any) {
    // this.router.navigate(['/employee/scheme/applications'], { queryParams: { schemeId: schemeId } });

    this.router.navigate(['/employee/view-application'], { queryParams: { applicationId: applicationId } });

  }
}
