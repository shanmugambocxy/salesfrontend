import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../shared/shared.module';
import { PropertyService } from '../services/property.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-unitbyschemeid',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './unitbyschemeid.component.html',
  styleUrl: './unitbyschemeid.component.scss'
})
export class UnitbyschemeidComponent {
  displayedColumns: string[] = ['sno', 'id', 'unitAccountNumber', 'unitNo', 'blockNo', 'floorNo', 'flatNo', 'action'];
  allPaymentDataSource = new MatTableDataSource<any>([]);
  SchemeID: any = '';

  constructor(private router: Router,
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private location: Location
  ) {

  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {

      let schemeId = params['schemeId'];
      this.SchemeID = schemeId ? parseInt(schemeId) : 0

    })
    this.getAllSchemeDataUnitData(this.SchemeID);
  }


  applyFilter(event: Event) {
    debugger
    const filterValue = (event.target as HTMLInputElement).value;
    this.allPaymentDataSource.filter = filterValue.trim().toLowerCase();

    if (this.allPaymentDataSource.paginator) {
      this.allPaymentDataSource.paginator.firstPage();
    }
  }

  getAllSchemeDataUnitData(schemeId: any) {
    this.propertyService.getUnitDataBySchemeId(schemeId).subscribe((res: any) => {
      if (res) {
        this.allPaymentDataSource.data = res;


      }
    })
  }


  goToPaymentHistory(unitAccountNumber: any) {
    this.router.navigate(['employee/payment-history'], { queryParams: { id: unitAccountNumber } });

  }
  back() {
    this.location.back();
  }
}
