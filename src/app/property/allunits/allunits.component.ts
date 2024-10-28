import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Banks } from '../../bank_enum';
import { Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import { PaymentRefundService } from '../../services/payment-refund.service';
import { SalesService } from '../../services/sales.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe, Location } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-allunits',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './allunits.component.html',
  styleUrl: './allunits.component.scss'
})
export class AllunitsComponent {
  displayedColumns: string[] = ['sno', 'unitAccountNumber', 'schemeName', 'schemeType', 'unitNo', 'unittype', 'modeofallottment'];
  // 'applicantName', 'createdDateTime',

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
  selectedDateFrom: any;
  selectedDateTo: any;
  schemeNameList: any = [];
  selectTypeofHouse: any;

  constructor(
    private router: Router,
    private propertyService: PropertyService,
    private dialog: MatDialog,
    private toast: ToastService,
    private paymentRefundService: PaymentRefundService,
    private salesService: SalesService,
    private http: HttpClient,
    private datePipe: DatePipe,
    private location: Location
  ) {
  }

  ngOnInit() {

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
    if (this.selectDivision == "ALL" || !this.selectDivision) {
      filteredData = this.originalDataList;
      let schemeNameList = filteredData.map((x: any) => x.schemeData?.schemeName);
      this.schemeNameList = schemeNameList.filter(this.onlyUnique);
      console.log('this.schemeNameList', this.schemeNameList);
      let schemeName = sessionStorage.getItem('scheme');
      this.selectScheme = schemeName ? schemeName : '';
    } else {
      filteredData = filteredData.filter((x: any) => x.schemeData.divisionCode == this.selectDivision)
      let schemeNameList = filteredData.map((x: any) => x.schemeData?.schemeName);
      this.schemeNameList = schemeNameList.filter(this.onlyUnique);
      console.log('this.schemeNameList', this.schemeNameList);

      let schemeName = sessionStorage.getItem('scheme');
      this.selectScheme = schemeName ? schemeName : '';

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

    if (this.selectedDateFrom && this.selectedDateTo) {
      filteredData = filteredData.filter((x: any) => {
        const formattedDate = x?.createdDateTime ? this.datePipe.transform(new Date(x?.createdDateTime), 'yyyy-MM-dd') : x?.createdDateTime;
        return formattedDate >= this.selectedDateFrom && formattedDate <= this.selectedDateTo;
      })

    }
    // if (this.selectedDateTo) {
    //   filteredData = filteredData.filter((x: any) => {
    //     const formattedDate = x?.createdDateTime ? this.datePipe.transform(new Date(x?.createdDateTime), 'yyyy-MM-dd') : x?.createdDateTime;
    //     return formattedDate === this.selectedDateTo;
    //   })
    // }
    this.dataSource.data = filteredData;
  }

  clearFilter() {
    this.selectDivision = 'ALL';
    this.selectScheme = '';
    this.selectSchemeType = '';
    this.selectTypeofHouse = '';
    this.selectedDateFrom = '';
    this.selectedDateTo = '';
    sessionStorage.removeItem('division');
    sessionStorage.removeItem('unitType');
    sessionStorage.removeItem('scheme');

    this.getAllApplicationData();
  }

  getAllApplicationData() {
    debugger
    this.propertyService.getAllUnitsData().subscribe(
      (response: any) => {
        console.log(response.responseObject);
        this.dataSource.data = response.responseObject;
        this.originalDataList = this.dataSource.data;
        // let schemeNameList = this.dataSource.data.map(x => x.schemeData?.schemeName);
        // this.schemeNameList = schemeNameList.filter(this.onlyUnique);
        // console.log('this.schemeNameList', this.schemeNameList);
        let division = sessionStorage.getItem('division');

        let getDivisionCode = this.divisionList.filter((x: any) => x.divisionName == division)
        this.selectDivision = getDivisionCode.length > 0 ? getDivisionCode[0].divisionCode : 'ALL';
        let unitType = sessionStorage.getItem('unitType');

        this.selectTypeofHouse = unitType ? unitType : '';

        this.applyFilterByOptions()

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

        this.getAllApplicationData();
      } else {
        this.divisionList = [];

      }
    })
  }

  viewAllApplicationsBySchemeId(applicationId: any) {
    // this.router.navigate(['/employee/scheme/applications'], { queryParams: { schemeId: schemeId } });

    this.router.navigate(['/employee/view-application'], { queryParams: { applicationId: applicationId } });

  }

  ngOnDestroy() {
    sessionStorage.removeItem('division');
    sessionStorage.removeItem('unitType');
    sessionStorage.removeItem('scheme');
  }
  back() {
    this.location.back();
  }
}
