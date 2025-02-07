import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PropertyService } from '../../services/property.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import { PaymentRefundService } from '../../services/payment-refund.service';
import { SalesService } from '../../services/sales.service';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
@Component({
  selector: 'app-verified',
  standalone: true,
  imports: [SharedModule, MatTabsModule],
  templateUrl: './verified.component.html',
  styleUrl: './verified.component.scss'
})
export class VerifiedComponent {
  displayedColumns: string[] = ['sno', 'applicationno', 'date', 'unitid', 'scheme', 'type', 'unitno', 'name', 'action'];
  rejectColumns: string[] = ['sno', 'applicationno', 'date', 'unitid', 'scheme', 'type', 'unitno', 'name', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  rejectDatasource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selectDivision: any;
  divisionList: any = [];
  selectSchemeType: any;
  originalDataList: any = [];
  selectScheme: any;
  selectedDate: any;
  schemeNameList: any = [];
  originalDataListReject: any = [];
  schemeListReject: any = [];
  selectDivisionReject: any;
  selectSchemeNameReject: any;
  selectSchemeTypeReject: any;
  selectedDateReject: any;

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
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
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

  applyFilterReject(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }

    if (filterValue) {
      this.rejectDatasource.data = this.originalDataListReject.filter((element: any) => {
        return JSON.stringify(element?.applicationNumber)?.toLowerCase().includes(filterValue.toLowerCase()) || element?.unitData?.unitAccountNumber.toLowerCase().includes(filterValue.toLowerCase()) || element?.schemeData?.schemeName.toLowerCase().includes(filterValue.toLowerCase()) || element?.schemeData?.schemeType.toLowerCase().includes(filterValue.toLowerCase()) || element?.applicantName?.toLowerCase().includes(filterValue.toLowerCase())

        // && element?.schemeData?.schemeType.toLowerCase().includes(filterValue.toLowerCase()) && element?.applicantName?.toLowerCase().includes(filterValue.toLowerCase())
      })
    } else {
      this.rejectDatasource.data = this.originalDataListReject;
    }

  }


  getAllApplicationData() {
    debugger
    this.propertyService.getAlloteApplication("Accept").subscribe(
      (response: any) => {
        response.responseObject.forEach((element: any) => {
          if (element.creationDate) {
            let date = this.datePipe.transform(new Date(element?.createdDateTime), 'yyyy-MM-dd')
            element.formateDate = date
          } else {
            element.formateDate = '';

          }
        });
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

    this.propertyService.getAlloteApplication("Reject").subscribe(
      (response: any) => {
        console.log(response.responseObject);

        // response.responseObject.forEach((element: any) => {
        //   if (element) {
        //     element.createdDate = this.datePipe.transform(new Date(element?.creationDate), 'yyyy-MM-dd')
        //   }
        // });
        this.rejectDatasource.data = response.responseObject;
        this.originalDataListReject = this.rejectDatasource.data;
        let schemeNameList = this.dataSource.data.map(x => x.schemeData?.schemeName);
        this.schemeListReject = schemeNameList.filter(this.onlyUnique);
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

  applyFilterByOptions() {
    debugger
    // if (this.selectDivision && this.selectScheme && this.selectSchemeType && this.selectedDate) {
    //   this.dataSource.data = this.originalDataList.filter((x: any) => x.schemeData.divisionCode == this.selectDivision && x.schemeData.schemeName == this.selectScheme && x.schemeData.schemeType == this.selectSchemeType && x.creationDate)
    // }
    let filteredData = this.originalDataList;
    if (this.selectDivision == "ALL" || !this.selectDivision) {
      filteredData = this.originalDataList;
    } else {
      filteredData = filteredData.filter((x: any) => x.schemeData.divisionCode == this.selectDivision)

    }
    if (this.selectScheme) {
      filteredData = filteredData.filter((x: any) => x.schemeData?.schemeName == this.selectScheme)
    }
    if (this.selectSchemeType) {
      filteredData = filteredData.filter((x: any) => x.schemeData?.schemeType == this.selectSchemeType)
    }
    debugger
    if (this.selectedDate) {
      // filteredData = filteredData.filter((x: any) => x.creationDate == this.selectedDate)
      console.log('datepipe', this.datePipe.transform(new Date('9/3/2024, 1:14:02 PM'), 'yyyy-MM-dd'));

      filteredData = filteredData.filter((x: any) => {
        const formattedDate = x?.createdDateTime ? this.datePipe.transform(new Date(x?.createdDateTime), 'yyyy-MM-dd') : x?.createdDateTime;
        return formattedDate === this.selectedDate;
      })
      // x?.createdDate && this.datePipe.transform(new Date(x?.creationDate), 'yyyy-MM-dd') == this.selectedDate)

    }
    this.dataSource.data = filteredData;
  }
  clearFilter() {
    this.selectDivision = 'ALL';
    this.selectScheme = '';
    this.selectSchemeType = '';
    this.selectedDate = '';
    this.getAllApplicationData();
  }

  clearFilter2() {
    this.selectDivisionReject = 'ALL';
    this.selectSchemeNameReject = '';
    this.selectSchemeTypeReject = '';
    this.selectedDateReject = '';


  }

  applyFilterByOptionsReject() {
    let filteredData = this.originalDataListReject;
    // if (this.selectDivisionReject) {
    //   filteredData = filteredData.filter((x: any) => x.schemeData.divisionCode == this.selectDivisionReject)
    // }



    if (this.selectDivisionReject == "ALL" || !this.selectDivisionReject) {
      filteredData = this.originalDataListReject;
    } else {
      filteredData = filteredData.filter((x: any) => x.schemeData.divisionCode == this.selectDivisionReject)

    }

    if (this.selectSchemeNameReject) {
      filteredData = filteredData.filter((x: any) => x.schemeData?.schemeName == this.selectSchemeNameReject)
    }
    if (this.selectSchemeTypeReject) {
      filteredData = filteredData.filter((x: any) => x.schemeData?.schemeType == this.selectSchemeTypeReject)
    }

    if (this.selectedDateReject) {
      debugger
      filteredData = filteredData.filter((x: any) => {
        const formattedDate = x?.createdDateTime ? this.datePipe.transform(new Date(x?.createdDateTime), 'yyyy-MM-dd') : x?.createdDateTime;
        return formattedDate === this.selectedDate;
      })

    }
    this.rejectDatasource.data = filteredData;
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
  viewAllApplicationsBySchemeId(applicationId: any) {
    // this.router.navigate(['/employee/scheme/applications'], { queryParams: { schemeId: schemeId } });

    this.router.navigate(['/employee/view-application'], { queryParams: { applicationId: applicationId } });

  }
}
