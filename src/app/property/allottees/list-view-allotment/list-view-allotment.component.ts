import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-list-view-allotment',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './list-view-allotment.component.html',
  styleUrl: './list-view-allotment.component.scss'
})
export class ListViewAllotmentComponent implements OnInit, AfterViewInit {

  schemeId: any;

  displayedColumns: string[] = ['sno', 'unitAccountNo', 'dateOfAllotment', 'alloteeName', 'unitCost', 'amountPaidSoFar', 'currentStatus', 'remainingTime', 'action'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private title: Title
  ) {
    this.title.setTitle('All Applications | Allotment');
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.schemeId = params['schemeId'];
    });
    this.getAllAllotedApplication();
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

  viewAllotee(id: any) {
    this.router.navigate(['/employee/view-allotment'], { queryParams: { applicationId: id } });
  }

  getAllAllotedApplication() {
    this.propertyService.getAllApplicationsBySchemeId(this.schemeId, "Yes").subscribe(
      (response: any) => {
        console.log(response.responseObject);
        this.dataSource.data = response.responseObject.map((item: { unitData: { unitAccountNumber: any; unitCost: any; }; allotedTime: string | number | Date; applicantName: any; amountPaidSoFar: any; currentStatus: any; remainingTime: any; id: any; }) => ({
          unitAccountNo: item.unitData.unitAccountNumber,
          dateOfAllotment: new Date(item.allotedTime).toLocaleString(),
          alloteeName: item.applicantName,
          unitCost: item.unitData.unitCost,
          amountPaidSoFar: item.amountPaidSoFar,
          currentStatus: item.currentStatus,
          remainingTime: item.remainingTime,
          applicationId: item.id
        }));
      },
      (error: any) => {
        console.error(error);
      }
    );
  }


}
