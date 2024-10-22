import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

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
  constructor(private location: Location, private router: Router) {

    let getSelectedData = sessionStorage.getItem('selectedData');
    this.selectedData = getSelectedData ? JSON.parse(getSelectedData) : ''
    debugger
  }
  back() {
    this.location.back();
  }
}
