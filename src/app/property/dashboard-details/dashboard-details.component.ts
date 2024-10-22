import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-dashboard-details',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard-details.component.html',
  styleUrl: './dashboard-details.component.scss'
})
export class DashboardDetailsComponent {
  displayedColumns: string[] = ['sno', 'description', 'noofunits', 'flat', 'house', 'plot',];
  dataSource = new MatTableDataSource<any>([]);
  selectedData: any;
  divisionList: any = [];
  divisionWiseData: any = [];
  typeWiseDashboardData: any = '';
  totalTypeWiseData: any = 0;
  constructor(private location: Location, private router: Router, private http: HttpClient, private propertyService: PropertyService) {

    let getSelectedData = sessionStorage.getItem('selectedData');
    this.selectedData = getSelectedData ? JSON.parse(getSelectedData) : ''
    debugger
    this.getDashboardTypeWiseData()
  }
  ngOnInit(): void {
    this.getDivisionList();
  }
  back() {
    this.location.back();
  }

  getDivisionList() {

    this.http.get('https://personnelapi.tnhb.in/getAllDivisionCode').subscribe((res: any) => {
      if (res && res.data) {
        this.divisionList = res.data.filter((x: any) => x != '');
        console.log(' this.divisionList', this.divisionList);

        this.divisionWiseData = this.divisionList.map((x: any) => x.divisionName);
        console.log('this.divisionWiseData ', this.divisionWiseData);

      } else {
        this.divisionList = [];

      }
    })
  }

  getDashboardTypeWiseData() {
    this.propertyService.dashBoardTypewiseCount(this.selectedData.keyWord).subscribe((res: any) => {
      if (res.length > 0) {
        this.typeWiseDashboardData = res[0];
        this.totalTypeWiseData = this.typeWiseDashboardData.higCount + this.typeWiseDashboardData.migCount + this.typeWiseDashboardData.ligCounnt + this.typeWiseDashboardData.ewsCount
      } else {
        this.typeWiseDashboardData = "";
        this.totalTypeWiseData = 0;
      }
    })
  }



}
