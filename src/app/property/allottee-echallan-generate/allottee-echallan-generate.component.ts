import { Component, ViewChild } from '@angular/core';
import { SalesService } from '../../services/sales.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Banks } from '../../bank_enum';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { PaymentRefundService } from '../../services/payment-refund.service';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-allottee-echallan-generate',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './allottee-echallan-generate.component.html',
  styleUrl: './allottee-echallan-generate.component.scss'
})
export class AllotteeEchallanGenerateComponent {
  displayedColumns: string[] = ['sno', 'unitAccountNumber', 'schemeName', 'schemeType', 'unitNo', 'unittype', 'applicantName', 'action'];

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
  selectTypeofHouse: any;
  customerID: any;
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
    this.customerID = sessionStorage.getItem('customerId');

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

  getAllApplicationData() {
    this.propertyService.getApplicationbyCustomerId("Accept", this.customerID).subscribe(
      (response: any) => {
        console.log(response.responseObject);
        this.dataSource.data = response.responseObject;
        // this.originalDataList = this.dataSource.data;
        // let schemeNameList = this.dataSource.data.map(x => x.schemeData?.schemeName);
        // this.schemeNameList = schemeNameList.filter(this.onlyUnique);
        // console.log('this.schemeNameList', this.schemeNameList);
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

  goToCreate(element: any) {
    // this.router.navigate(['/employee/scheme/applications'], { queryParams: { schemeId: schemeId } });

    this.router.navigate(['/customer/allottee_echallan_create'], { queryParams: { applicationId: element.id, unitaccountno: element.unitData.unitAccountNumber } });

  }
}
