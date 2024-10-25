import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-list-view-units',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './list-view-units.component.html',
  styleUrl: './list-view-units.component.scss'
})
export class ListViewUnitsComponent {

  schemeId: any
  schemeDataFormGroup!: FormGroup;
  allUnitDataSource = new MatTableDataSource<any>([]);
  unitData!: any;
  unitTableColumns: string[] = ['sno', 'unitAccountNumber', 'unitAllottedStatus', 'unitNo', 'dateOfAllotment', 'unitCost',
    'saleDeedStatus', 'action'];
  id!: any;

  totalunits: any;
  allotedunits: any;
  unsoldunits: any;
  createdUnits: any;
  remainingUnits: any;
  role: any;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;


  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private toast: ToastService
  ) { }



  ngOnInit() {
    this.schemeDataFormGroup = this.formBuilder.group({
      schemeCode: [''],
      nameOfTheDivision: [''],
      schemeName: [''],
      schemeType: [''],
      unitType: [''],
    });

    this.route.queryParams.subscribe(params => {
      this.role = sessionStorage.getItem('role');
      this.schemeId = params['id'];
      this.fetchSchemeData();
      this.getAllUnitsDataBySchemeId();
      this.getCountsBySchemeId();

    });

  }

  ngAfterViewInit() {
    this.allUnitDataSource.paginator = this.paginator;
    this.allUnitDataSource.sort = this.sort;
  }

  fetchSchemeData() {
    this.propertyService.getSchemeById(this.schemeId)
      .subscribe((response) => {
        console.log(response);
        // this.totalunits = response.data.n_TOTAL_UNITS;
        // this.allotedunits = response.data.n_TOTAL_ALLOTTED_UNITS;
        // this.unsoldunits = response.data.n_TOTAL_UNSOLD_UNITS;
        this.schemeDataFormGroup.patchValue({
          schemeCode: response.schemeCode,
          nameOfTheDivision: response.nameOfTheDivision,
          schemeName: response.schemeName,
          schemeType: response.schemeType,
          unitType: response.unitType,
        });
      })

  }

  getAllUnitsDataBySchemeId() {
    this.propertyService.getAllUnitsBySchemeId(this.schemeId).subscribe(
      (response) => {
        console.log(response);
        this.allUnitDataSource.data = response.responseObject;
      },
      (error) => {
        console.error('Error:', error);
        this.toast.showToast('error', 'Error while fetching Unit Data', '');
      }
    );
  }

  getCountsBySchemeId() {
    this.propertyService.getCountsBySchemeId(this.schemeId).subscribe(
      (response: any) => {
        console.log('Response:', response);
        this.totalunits = response.schemeDataTotalUnit;
        this.createdUnits = response.schemeIdCountInUnitData;
        this.remainingUnits = this.totalunits - this.createdUnits;
        this.allotedunits = response.unitAllottedStatusYesCount;
        this.unsoldunits = this.totalunits - this.allotedunits;
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allUnitDataSource.filter = filterValue.trim().toLowerCase();
  }

  showCreateUnit() {
    this.router.navigate(['/employee/unit-data'], { queryParams: { mode: 'create', schemeId: this.schemeId } });
  }

  showEditUnit(unitId: any) {
    this.router.navigate(['/employee/unit-data'], { queryParams: { mode: 'edit', schemeId: this.schemeId, unitId: unitId } });
  }

  showViewUnit(unitId: any) {
    this.router.navigate(['/employee/unit-data'], { queryParams: { mode: 'view', schemeId: this.schemeId, unitId: unitId } });
  }

  goTo(route: any) {
    this.router.navigateByUrl(route);
  }
}
