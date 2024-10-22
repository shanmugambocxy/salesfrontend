import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SalesService } from '../services/sales.service';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-gotopaymenthistory',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './gotopaymenthistory.component.html',
  styleUrl: './gotopaymenthistory.component.scss'
})
export class GotopaymenthistoryComponent implements OnInit {

  customerId: any;

  displayedColumns: string[] = ['sno', 'unitAccountNo', 'applicationNo', 'schemeName', 'applicantname', 'unitno', 'currentStatus', 'action'];
  // displayedColumns: string[] = ['sno', 'unitAccountNo', 'applicationNo', 'schemeName', 'amountPaidSoFar', 'currentStatus', 'action', 'payment'];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router,
    private salesService: SalesService,) {

  }
  ngOnInit() {

    this.customerId = sessionStorage.getItem('customerId');
    this.getAllApplicationByCustomerId();
  }


  getAllApplicationByCustomerId() {
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
          unitNo: item.unitData.unitNo
        }));
      },
      (error: any) => {
        console.error(error);
      }
    );
  }



  applyFilter(event: Event) {
    debugger
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  goToPaymentHistory(unitAccountNo: any) {
    this.router.navigate(['customer/payment-history'], { queryParams: { id: unitAccountNo } });

  }
}
