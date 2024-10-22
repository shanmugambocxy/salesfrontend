import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
import { PropertyService } from '../services/property.service';

@Component({
  selector: 'app-allschemedata',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './allschemedata.component.html',
  styleUrl: './allschemedata.component.scss'
})
export class AllschemedataComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'schemeName', 'schemeCode', 'schemeType', 'schemePlace', 'modeOfAllotment', 'reraNo', 'action'];
  allPaymentDataSource = new MatTableDataSource<any>([]);
  constructor(private router: Router,
    private propertyService: PropertyService
  ) {

  }
  ngOnInit() {
    this.getAllSchemeData();
  }


  applyFilter(event: Event) {
    debugger
    const filterValue = (event.target as HTMLInputElement).value;
    this.allPaymentDataSource.filter = filterValue.trim().toLowerCase();

    if (this.allPaymentDataSource.paginator) {
      this.allPaymentDataSource.paginator.firstPage();
    }
  }

  getAllSchemeData() {
    this.propertyService.getAllSchemeDataByAllote().subscribe((res: any) => {
      if (res) {
        this.allPaymentDataSource.data = res.responseObject;
      }
    })
  }


  goToPaymentHistory(id: any) {
    debugger
    this.router.navigate(['employee/unitdata-byschemeID'], { queryParams: { schemeId: id } });

  }
}
