import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-handing-over-all-schemes',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './handing-over-all-schemes.component.html',
  styleUrl: './handing-over-all-schemes.component.scss'
})
export class HandingOverAllSchemesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['sno', 'crCode', 'ccCode', 'dCode', 'schemeCode', 'schemeName', 'schemePlace', 'district', 'unitType', 'schemeType', 'application'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private propertyService: PropertyService,
    private title: Title
  ) {
    this.title.setTitle('All Schemes | Allotment');
  }
  ngOnInit() {
    this.getAllSchemes();
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

  viewAllAllotmentsBySchemeId(schemeId: any, unitType: any) {
    this.router.navigate(['/employee/handing-over/scheme'], { queryParams: { schemeId: schemeId, unitType: unitType } });
  }

  getAllSchemes() {
    this.propertyService.getAllSchemes().subscribe(
      (response: any) => {
        console.log(response.responseObject);
        this.dataSource.data = response.responseObject;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
}