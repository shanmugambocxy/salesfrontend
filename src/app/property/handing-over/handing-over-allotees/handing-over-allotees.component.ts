import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-handing-over-allotees',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './handing-over-allotees.component.html',
  styleUrl: './handing-over-allotees.component.scss'
})
export class HandingOverAlloteesComponent implements OnInit, AfterViewInit {

  schemeId: any;
  unitType: any;

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
      this.unitType = params['unitType'];
      if (this.unitType === 'Flat') {
        this.getAllAllotedApplicationForFlats();
      } else if (this.unitType === 'House') {
        this.getAllAllotedApplicationForHouse();
      } else if (this.unitType === 'Plot') {
        this.getAllAllotedApplicationForPlot();
      }
    });

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
    this.router.navigate(['/employee/handing-over/view-allotee'], { queryParams: { applicationId: id } });
  }

  getAllAllotedApplicationForFlats() {
    this.propertyService.getAllApplicationsByHandingOver(this.schemeId).subscribe(
      (response: any) => {
        console.log(response.responseObject);
        this.dataSource.data = response.responseObject
          .filter((item: any) => !item.handingOverOfficer2)
          .map((item: { unitData: { unitAccountNumber: any; unitCost: any; }; allotedTime: string | number | Date; applicantName: any; amountPaidSoFar: any; currentStatus: any; remainingTime: any; id: any; }) => ({
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

  getAllAllotedApplicationForHouse() {
    this.propertyService.getAllApplicationsByHandingOver(this.schemeId).subscribe(
      (response: any) => {
        console.log(response.responseObject);
        this.dataSource.data = response.responseObject
          .filter((item: any) => item.handingOverOfficer && item.handingOverOfficer2) // Correct filtering
          .map((item: { unitData: { unitAccountNumber: any; unitCost: any; }; allotedTime: string | number | Date; applicantName: any; amountPaidSoFar: any; currentStatus: any; remainingTime: any; id: any; }) => ({
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

  getAllAllotedApplicationForPlot() {
    this.propertyService.getAllApplicationsByHandingOver(this.schemeId).subscribe(
      (response: any) => {
        console.log(response.responseObject);
        this.dataSource.data = response.responseObject
          .filter((item: any) => {
            !item.handingOverOfficer && item.handingOverOfficer2
          })
          .map((item: { unitData: { unitAccountNumber: any; unitCost: any; }; allotedTime: string | number | Date; applicantName: any; amountPaidSoFar: any; currentStatus: any; remainingTime: any; id: any; }) => ({
            unitAccountNo: item.unitData.unitAccountNumber,
            dateOfAllotment: new Date(item.allotedTime).toLocaleString(),
            alloteeName: item.applicantName,
            unitCost: item.unitData.unitCost,
            amountPaidSoFar: item.amountPaidSoFar,
            currentStatus: item.currentStatus,
            remainingTime: item.remainingTime,
            applicationId: item.id
          }));
        console.log(this.dataSource.data);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }


}
