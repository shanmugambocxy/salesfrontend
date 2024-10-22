import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-employee-scheme-applications',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './employee-scheme-applications.component.html',
  styleUrl: './employee-scheme-applications.component.scss'
})
export class EmployeeSchemeApplicationsComponent implements OnInit, AfterViewInit {

  schemeId: any;

  displayedColumns: string[] = ['sno', 'unitAccountNo', 'applicationNo', 'applicantName', 'schemeName', 'unitType', 'schemeType', 'reservationStatus', 'action'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) {

  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.schemeId = params['schemeId'];
    });
    this.getAllApplicationsBySchemeId();
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

  getAllApplicationsBySchemeId() {
    this.propertyService.getAllApplicationsBySchemeId(this.schemeId, "No").subscribe(
      (response: any) => {
        console.log(response.responseObject);
        this.dataSource.data = response.responseObject.map((item: { unitData: { unitAccountNumber: any; }; id: any; applicationNumber: any; applicantName: any; schemeData: { schemeName: any; unitType: any; schemeType: any; reservationStatus: any; }; }) => ({
          unitAccountNo: item.unitData.unitAccountNumber,
          applicationNo: item.applicationNumber,
          applicantName: item.applicantName,
          schemeName: item.schemeData.schemeName,
          unitType: item.schemeData.unitType,
          schemeType: item.schemeData.schemeType,
          reservationStatus: item.schemeData.reservationStatus,
          applicationId: item.id
        }));
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  viewApplication(applicationId: any) {
    this.router.navigate(['/employee/view-application'], { queryParams: { applicationId: applicationId } });
  }

}

