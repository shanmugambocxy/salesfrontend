import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SalesService } from '../../services/sales.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-customer-application-history',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-application-history.component.html',
  styleUrl: './customer-application-history.component.scss'
})
export class CustomerApplicationHistoryComponent implements OnInit, AfterViewInit {
  customerId: any;

  displayedColumns: string[] = ['sno', 'unitAccountNo', 'applicantname', 'schemeName', 'unitno', 'projectStatus', 'application', 'payment'];
  // displayedColumns: string[] = ['sno', 'unitAccountNo', 'applicationNo', 'schemeName', 'amountPaidSoFar', 'currentStatus', 'action', 'payment'];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private salesService: SalesService,
    private title: Title
  ) {
    this.title.setTitle('Customer | Application History');
  }
  ngOnInit(): void {
    this.customerId = sessionStorage.getItem('customerId');
    this.getAllApplicationByCustomerId();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewAllotee() {
    this.router.navigate(['/employee/view-allotment']);
  }

  getAllApplicationByCustomerId() {
    debugger
    this.salesService.getAllApplicationByCustomerId(this.customerId, 'Accept').subscribe(
      (response: any) => {
        console.log(response);
        // Assuming responseObject is an array of objects with properties like 'sno', 'unitAccountNo', etc.
        this.dataSource.data = response.responseObject.map((item: any) => ({
          sno: item.sno,
          unitAccountNo: item.unitData.unitAccountNumber,
          applicationNo: item.applicationNumber,
          schemeName: item.schemeData.schemeName,
          dateOfSubmission: item.creationDate,
          currentStatus: item.allotedStatus,
          id: item.id,
          applicantName: item.applicantName,
          unitNo: item?.unitData?.unitNo,
          projectStatus: item?.schemeData?.projectStatus
        }));
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  navigateToAllotment(id: any) {
    debugger
    console.log(id);
    this.router.navigate(['/customer/view-allotment'], { queryParams: { applicationId: id } });
  }

  goToPayment(data: any) {
    debugger
    this.router.navigate(['customer/selectbank'], { queryParams: { applicationId: data.id } })
  }

  navigateToPayments(id: any) {
    console.log(id);
    debugger
    // this.router.navigate(['/customer/all-payments'], { queryParams: { applicationId: id } });
    this.router.navigate(['/customer/all-payments'], { queryParams: { applicationNo: id } });

  }

  goToApplicationView(applicationId: any) {
    this.router.navigate(['/customer/view-application'], { queryParams: { applicationId: applicationId } });

  }

}
