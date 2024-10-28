import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PropertyService } from '../../../services/property.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';
import { Toast } from 'ngx-toastr';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-list-view-schemes',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './list-view-schemes.component.html',
  styleUrl: './list-view-schemes.component.scss'
})
export class ListViewSchemesComponent implements OnInit, AfterViewInit {

  id: any;
  divisionCode: any;
  division: any;
  role: any;

  divisionsList = [
    { code: '11', circle: 'Chennai Circle I', city_n_rural: 'City', name: 'Anna Nagar' },
    { code: '12', circle: 'Chennai Circle I', city_n_rural: 'City', name: 'JJ Nagar' },
    { code: '13', circle: 'Chennai Circle I', city_n_rural: 'City', name: 'KK Nagar' },
    { code: '15', circle: 'Chennai Circle II', city_n_rural: 'City', name: 'Besant Nagar' },
    { code: '16', circle: 'Chennai Circle II', city_n_rural: 'City', name: 'Nandanam' },
    { code: '17', circle: 'Chennai Circle II', city_n_rural: 'City', name: 'Maintenance' },
    { code: '19', circle: 'Project Circle (City)', city_n_rural: 'City', name: 'SPD I' },
    { code: '20', circle: 'Project Circle (City)', city_n_rural: 'City', name: 'SPD II' },
    { code: '21', circle: 'Project Circle (City)', city_n_rural: 'City', name: 'CIT Nagar' },
    { code: '22', circle: 'Project Circle (City)', city_n_rural: 'City', name: 'Foreshore Estate' },
    { code: '23', circle: 'Project Circle (City)', city_n_rural: 'City', name: 'SAF Games Village' },
    { code: '25', circle: 'Project Circle (Rural)', city_n_rural: 'Rural', name: 'Thirumazhisai Satellite Town' },
    { code: '26', circle: 'Project Circle (Rural)', city_n_rural: 'Rural', name: 'SPD III' },
    { code: '27', circle: 'Project Circle (Rural)', city_n_rural: 'Rural', name: 'Uchapatti Thoppur Satellite Town' },
    { code: '29', circle: 'Salem', city_n_rural: 'Rural', name: 'Coimbatore Housing Unit' },
    { code: '30', circle: 'Salem', city_n_rural: 'Rural', name: 'Erode Housing Unit ' },
    { code: '31', circle: 'Salem', city_n_rural: 'Rural', name: 'Salem Housing Unit ' },
    { code: '32', circle: 'Salem', city_n_rural: 'Rural', name: 'Hosur Housing Unit ' },
    { code: '33', circle: 'Salem', city_n_rural: 'Rural', name: 'Vellore Housing Unit ' },
    { code: '35', circle: 'Madurai', city_n_rural: 'Rural', name: 'Madurai Housing Unit ' },
    { code: '36', circle: 'Madurai', city_n_rural: 'Rural', name: 'Tirunelveli Housing Unit' },
    { code: '37', circle: 'Madurai', city_n_rural: 'Rural', name: 'Ramanathapuram Housing Unit' },
    { code: '38', circle: 'Madurai', city_n_rural: 'Rural', name: 'Trichy Housing Unit' },
    { code: '39', circle: 'Madurai', city_n_rural: 'Rural', name: 'Thanjavur Housing Unit' },
    { code: '40', circle: 'Madurai', city_n_rural: 'Rural', name: 'Villupuram Housing Unit' },
  ];

  displayedColumns: string[] = ['sno', 'nameOfTheDivision', 'schemeCode', 'schemeName', 'schemeType', 'unitType', 'totalUnit', 'allottedUnits', 'unsoldUnits', 'projectStatus', 'publishedStatus', 'action', 'websiteData', 'masterData'];
  allSchemesDataSource = new MatTableDataSource<any>([]);
  originalDataSource: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectStatus: any;

  constructor(
    private router: Router,
    private title: Title,
    private propertyService: PropertyService,
    private dialog: MatDialog,
    private toast: ToastService
  ) {
    this.title.setTitle('All Schemes');
  }

  ngOnInit() {
    this.divisionCode = sessionStorage.getItem('code');
    this.division = sessionStorage.getItem('division');
    this.role = sessionStorage.getItem('role');
    console.log('role_______', this.role);

    if (this.role === 'DE') {
      this.getAllSchemesData(this.division);
    } else {
      this.getAllSchemesData('Admin');
    }

  }

  ngAfterViewInit() {
    this.allSchemesDataSource.paginator = this.paginator;
    this.allSchemesDataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    debugger
    const filterValue = (event.target as HTMLInputElement).value;
    this.allSchemesDataSource.filter = filterValue.trim().toLowerCase();

    if (this.allSchemesDataSource.paginator) {
      this.allSchemesDataSource.paginator.firstPage();
    }
  }

  getAllSchemesData(division: any) {
    debugger
    this.propertyService.getAllSchemesByDivision(division).subscribe(
      (response: any) => {
        if (response && response.responseObject) {
          console.log('Response:', response);
          // this.allSchemesDataSource.data = response.responseObject;
          this.originalDataSource = response.responseObject;
          let schemeId = this.originalDataSource.map((x: any) => x.id);
          console.log('schemeId', schemeId);
          this.propertyService.getAllotedUnsoldUnits(schemeId).subscribe(res => {
            if (res) {
              let allUnitCount = res
              this.originalDataSource.forEach((element: any) => {

                let startDate = element.applicationReceieveDate ? new Date(element.applicationReceieveDate) : '';
                let endDate = element.applicationReceieveLastDate ? new Date(element.applicationReceieveLastDate) : '';
                let currentDate = new Date();
                if (startDate && endDate) {
                  if (currentDate >= startDate && currentDate <= endDate) {
                    // let checkDate = new Date("Sat Oct 26 2024 21:30:43 GMT+0530 (India Standard Time)");
                    // if (currentDate > checkDate) {
                    //   element.publishedStatus = "Yes";

                    // } else {
                    //   element.publishedStatus = "No";

                    // }
                    element.publishedStatus = "Yes";

                  } else {
                    element.publishedStatus = "No";
                  }
                } else {
                  element.publishedStatus = "No";

                }
                let checkSchemeId = allUnitCount.filter((x: any) => x.schemeDataIds == element.id);
                if (checkSchemeId.length > 0) {
                  element.unitAllottedStatusYesCount = checkSchemeId[0].unitAllottedStatusYesCount;
                  element.unsoldUnit = checkSchemeId[0].unsoldUnit
                }
              });
              this.allSchemesDataSource.data = this.originalDataSource;
              console.log('this.allSchemesDataSource.data ', this.allSchemesDataSource.data);

            }
          })

        } else {
          this.allSchemesDataSource.data = [];
          this.originalDataSource = [];
        }

      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
  changeStatus() {

    debugger
    let checkSelectAll = this.selectStatus.filter((x: any) => x == 'Select All');
    if (checkSelectAll && checkSelectAll.length > 0 || this.selectStatus.length == 0) {
      this.allSchemesDataSource.data = this.originalDataSource;

    } else {


      this.allSchemesDataSource.data =
        this.originalDataSource.filter((data: any) => {
          if (
            (this.selectStatus.includes(data.projectStatus))
          ) {
            return true;
          }
          return false;
        })

    }

  }

  deleteScheme(id: number) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Scheme',
        message: 'Are you sure you want to delete the scheme?'
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        debugger
        this.propertyService.deleteSchemeById(id).subscribe(
          (response: any) => {
            this.toast.showToast('success', 'Scheme data deleted successfully!', '');
            // this.getAllSchemesData(this.division);

            if (this.role === 'DE') {
              this.getAllSchemesData(this.division);
            } else {
              this.getAllSchemesData('Admin');
            }
          },
          (error: any) => {
            this.toast.showToast('error', 'Error in deleting scheme data. Please try again later.', '');
          }
        );
      }
    });

  }

  publishStatus(id: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Publish Scheme',
        message: 'Are you sure you want to publish the scheme?'
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.propertyService.publishStatusChange(id).subscribe(
          (response: any) => {
            this.toast.showToast('success', 'Scheme data published successfully!', '');
            // this.getAllSchemesData(this.division);
            if (this.role === 'DE') {
              this.getAllSchemesData(this.division);
            } else {
              this.getAllSchemesData('Admin');
            }
          },
          (error: any) => {
            this.toast.showToast('error', 'Error in publishing scheme data. Please try again later.', '');
          }
        );
      }
    });
  }

  navigateToNewScheme() {
    this.router.navigate(['/employee/scheme-data'], { queryParams: { mode: 'create' } });
  }

  navigateToViewScheme(id: any) {
    this.router.navigate(['/employee/scheme-data'], { queryParams: { mode: 'view', id: id } });
  }

  navigateToEditScheme(id: any) {
    this.router.navigate(['/employee/scheme-data'], { queryParams: { mode: 'edit', id: id } });
  }

  navigateToSchemeMedia(id: any) {
    this.router.navigate(['/employee/scheme-media'], { queryParams: { id: id } });
  }

  navigateToUnitList(id: any) {
    this.router.navigate(['/employee/all-units'], { queryParams: { id: id } });
  }



}
