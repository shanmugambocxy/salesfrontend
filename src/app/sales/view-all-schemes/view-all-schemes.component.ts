import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CustomerHeaderComponent } from '../customer-header/customer-header.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SalesService } from '../../services/sales.service';
import { Title } from '@angular/platform-browser';

export interface UserData {
  sno: string;
  reservationFromDate: string;
  reservationToDate: string;
  reservationStatus: string;
  projectStatus: string;
  nameOfTheDivision: string;
  district: string;
  schemeName: string;
  unitType: string;
  type: string;
  totalUnit: string;
  sellingExtent: string;
  startingFrom: string;
  action: string;
}

@Component({
  selector: 'app-view-all-schemes',
  standalone: true,
  imports: [SharedModule, CustomerHeaderComponent],
  templateUrl: './view-all-schemes.component.html',
  styleUrls: ['./view-all-schemes.component.scss']  // Corrected from `styleUrl`
})
export class ViewAllSchemesComponent implements OnInit, AfterViewInit {
  username: any = '';
  isListView: boolean = true;
  filterDatadiv: any = {};
  selectedDistrict: string = '';
  selectedProjectStatus: string = '';
  divisionname: string[] = [];  // Initialized correctly
  selectedDivision: string = '';
  selectedTab: string = 'all';

  photos: any = [];
  selectedFilter: string = 'all';
  displayedColumns: string[] = [
    'sno',
    'reservationFromDate',
    'reservationToDate',
    'reservationStatus',
    'projectStatus',
    'nameOfTheDivision',
    'district',
    'schemeName',
    'unitType',
    'schemeType',
    'totalUnit',
    'sellingExtent',
    'startingFrom',
    'action'
  ];
  dataSource: MatTableDataSource<UserData> = new MatTableDataSource<UserData>([]);
  originalData: UserData[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  fetchedPhotos!: any[];

  constructor(private salesService: SalesService, private router: Router, private title: Title) {
    this.title.setTitle("View All Schemes");
  }

  ngOnInit(): void {
    this.getAllSchemesData();
    this.getCardViewData();
    this.username = sessionStorage.getItem('username');
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

  selectTab(tab: string) {
    this.selectedTab = tab;
    this.applyFilters();
  }

  toggleView(listView: boolean) {
    this.isListView = listView;
  }

  getAllSchemesData() {
    this.salesService.getAllSchemes().subscribe(
      (response: any) => {
        console.log(response);
        this.originalData = response.responseObject;
        this.dataSource.data = response.responseObject;

        const uniqueDivisions: string[] = [];
        const uniqueDistricts: string[] = [];
        const uniqueProjectStatus: string[] = [];

        response.responseObject.forEach((item: { nameOfTheDivision: string; district: string; projectStatus: string }) => {  // Corrected from `response.data`
          if (item.nameOfTheDivision && !uniqueDivisions.includes(item.nameOfTheDivision)) {
            uniqueDivisions.push(item.nameOfTheDivision);
          }
          if (item.district && !uniqueDistricts.includes(item.district)) {
            uniqueDistricts.push(item.district);
          }
          if (item.projectStatus && !uniqueProjectStatus.includes(item.projectStatus)) {
            uniqueProjectStatus.push(item.projectStatus);
          }
        });

        this.filterDatadiv = {
          nameOfTheDivision: uniqueDivisions,
          district: uniqueDistricts,
          projectStatus: uniqueProjectStatus,
        };
        console.log(this.filterDatadiv);
      },
      (error) => {
        console.error("Error in fetching Website data:", error);
      }
    );
  }

  applyFilters() {
    let filteredData = [...this.originalData];
    // let filteredPhotos = [...this.fetchedPhotos];
    console.log(filteredData);
    if (this.selectedTab === 'Plot') {
      filteredData = filteredData.filter(item => item.unitType === 'Plot');
      // filteredPhotos = filteredPhotos.filter(item => item.unitType === 'Plot');
    }

    if (this.selectedTab === 'House') {
      filteredData = filteredData.filter(item => item.unitType === 'House');
      // filteredPhotos = filteredPhotos.filter(item => item.unitType === 'House');
    }
    if (this.selectedTab === 'Flat') {
      filteredData = filteredData.filter(item => item.unitType === 'Flat');
      // filteredPhotos = filteredPhotos.filter(item => item.unitType === 'Flat');
    }

    if (this.selectedDivision) {
      filteredData = filteredData.filter(item => item.nameOfTheDivision === this.selectedDivision);
      // filteredPhotos = filteredPhotos.filter(item => item.nameOfTheDivision === this.selectedDivision);
    }

    if (this.selectedDistrict) {
      filteredData = filteredData.filter(item => item.district === this.selectedDistrict);
    }
    if (this.selectedProjectStatus) {
      filteredData = filteredData.filter(item => item.projectStatus === this.selectedProjectStatus);
    }
    this.dataSource.data = filteredData;
    // this.photos = filteredPhotos;
    this.sort.active = '';
    this.sort.direction = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters() {
    this.selectedDivision = '';
    this.selectedDistrict = '';
    this.selectedProjectStatus = '';
    this.applyFilters();
  }

  proceed(schemeId: any, reservationToDate: string, allotment: any) {
    debugger
    const queryParams = { schemeId: schemeId };

    // Convert reservationToDate string to a Date object
    const reservationDate = new Date(reservationToDate);
    const currentDate = new Date();

    console.log('Reservation Date:', reservationDate);
    console.log('Current Date:', currentDate);

    // Compare only the date parts (ignoring time)
    const isExpired = reservationDate.getFullYear() < currentDate.getFullYear() ||
      (reservationDate.getFullYear() === currentDate.getFullYear() &&
        reservationDate.getMonth() < currentDate.getMonth()) ||
      (reservationDate.getFullYear() === currentDate.getFullYear() &&
        reservationDate.getMonth() === currentDate.getMonth() &&
        reservationDate.getDate() <= currentDate.getDate());

    console.log('Is Expired:', isExpired);

    if (isExpired === false) {
      console.log('Navigating to reservation-category route');
      if (allotment == 'LOT') {
        this.router.navigate(['reservation-category'], { queryParams });

      } else {
        this.router.navigate(['/view-scheme'], { queryParams: { schemeId: schemeId } });

      }
    } else if (isExpired === true) {
      console.log('Navigating to booking-status route');
      if (allotment == 'LOT') {
        this.router.navigate(['booking-status'], { queryParams });
      } else {
        this.router.navigate(['/view-scheme'], { queryParams: { schemeId: schemeId } });
      }
    }
  }

  getCardViewData() {
    this.salesService.getAllSchemesCardView().subscribe(
      (response: any) => {
        // this.fetchedPhotos = response.data;
        this.photos = response.responseObject;
        console.log(response);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  sanitizePhotoUrls(photos: any[]): any[] {
    return photos.map((photo) => {
      if (photo.Photo && typeof photo.Photo === 'string') {
        // Replace backslashes with forward slashes and extract the path starting from 'src'
        const relativePath = photo.Photo.replace(/\\/g, '/').split('assets/')[1];

        // Construct the new URL
        const baseUrl = '/assets/';  // Replace this with your actual base URL
        photo.Photo = baseUrl + relativePath;
      } else {
        // Handle the case when the URL is null or not a string
        photo.Photo = ''; // You can set it to an empty string or any other default value
      }

      return photo;
    });
  }

  goToHome() {

    this.router.navigate(['customer/home']);
  }
}
