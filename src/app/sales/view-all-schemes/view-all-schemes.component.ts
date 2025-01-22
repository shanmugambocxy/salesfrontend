import { AfterViewInit, Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CustomerHeaderComponent } from '../customer-header/customer-header.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesService } from '../../services/sales.service';
import { Title } from '@angular/platform-browser';
import { PropertyService } from '../../services/property.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

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
  selectedSquareFeet: string = '';
  divisionname: string[] = [];  // Initialized correctly
  selectedDivision: string = '';
  selectedTab: string = 'all';

  photos: any = [];
  selectedFilter: string = 'all';
  displayedColumns: string[] = [
    'sno',
    'reservationFromDate',
    'reservationToDate',
    // 'reservationStatus',
    'projectStatus',
    // 'nameOfTheDivision',
    'district',
    'schemeCode',
    'schemeName',
    'unitType',
    'schemeType',
    'unsoldUnit',
    // 'sellingExtent',
    // 'startingFrom',
    'action'
  ];
  dataSource: MatTableDataSource<UserData> = new MatTableDataSource<UserData>([]);
  originalData: UserData[] = [];
  unitType: any = ''
  originalCardData: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild('videoPlayer') videoPlayer!: HTMLVideoElement;

  fetchedPhotos!: any[];
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  enquiryForm!: FormGroup;
  agreeCheckBox: any;
  constructor(private salesService: SalesService,
    private router: Router,
    private fb: FormBuilder,
    private toast: ToastService,

    private title: Title,
    private propertyService: PropertyService, private route: ActivatedRoute) {
    this.title.setTitle("View All Schemes");
  }

  ngOnInit(): void {
    // window.location.reload();
    this.enquiryForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      description: ['', Validators.required],
    });
    // this.getAllSchemesData();
    this.getCardViewData();
    this.username = sessionStorage.getItem('username');
    let id = this.route.snapshot.paramMap.get('id');
    debugger
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.videoPlayer.play(); // Ensures video plays programmatically
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    video.muted = true; // Ensure muted
    video.play().catch(err => {
      console.error('Autoplay failed:', err);
    });

  }



  selectTab(tab: string) {
    this.selectedTab = tab;
    this.applyFilters();
  }

  toggleView(listView: boolean) {
    this.isListView = listView;
  }

  getAllSchemesData() {
    debugger
    this.salesService.getAllSchemes().subscribe(
      (response: any) => {
        // this.originalData = response.responseObject;

        console.log(response);
        let schemeId = response.responseObject.map((x: any) => x.id);

        this.propertyService.getAllotedUnsoldUnits(schemeId).subscribe(res => {
          if (res) {

            let allUnitCount = res
            const uniqueDivisions: string[] = [];
            const uniqueDistricts: string[] = [];
            const uniqueProjectStatus: string[] = [];

            response.responseObject.forEach((element: any) => {

              let checkSchemeId = allUnitCount.filter((x: any) => x.schemeDataIds == element.id);
              if (checkSchemeId.length > 0) {
                element.unitAllottedStatusYesCount = checkSchemeId[0].unitAllottedStatusYesCount;
                element.unsoldUnit = checkSchemeId[0].unsoldUnit
              }

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
              if (element.nameOfTheDivision && !uniqueDivisions.includes(element.nameOfTheDivision)) {
                uniqueDivisions.push(element.nameOfTheDivision);
              }
              if (element.district && !uniqueDistricts.includes(element.district)) {
                uniqueDistricts.push(element.district);
              }
              if (element.projectStatus && !uniqueProjectStatus.includes(element.projectStatus)) {
                uniqueProjectStatus.push(element.projectStatus);
              }


            });

            this.originalData = response.responseObject.filter((x: any) => x.publishedStatus == "Yes");
            this.dataSource.data = this.originalData;

            // response.responseObject.forEach((item: { nameOfTheDivision: string; district: string; projectStatus: string }) => {  // Corrected from `response.data`
            //   if (item.nameOfTheDivision && !uniqueDivisions.includes(item.nameOfTheDivision)) {
            //     uniqueDivisions.push(item.nameOfTheDivision);
            //   }
            //   if (item.district && !uniqueDistricts.includes(item.district)) {
            //     uniqueDistricts.push(item.district);
            //   }
            //   if (item.projectStatus && !uniqueProjectStatus.includes(item.projectStatus)) {
            //     uniqueProjectStatus.push(item.projectStatus);
            //   }
            // });

            this.filterDatadiv = {
              nameOfTheDivision: uniqueDivisions,
              district: uniqueDistricts,
              projectStatus: uniqueProjectStatus,
            };
            console.log(this.filterDatadiv);

          }
        })
        // this.dataSource.data = response.responseObject;


      },
      (error) => {
        console.error("Error in fetching Website data:", error);
      }
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
    if (filterValue) {

      this.photos = this.originalCardData.filter((element: any) => {
        return element.schemeData.district.toLowerCase() == filterValue.toLowerCase() || element.schemeData.projectStatus.toLowerCase() == filterValue.toLowerCase() || element.schemeData.unitType.toLowerCase() == filterValue.toLowerCase();
      });
    } else {
      this.photos = this.originalCardData;
    }
  }

  getCardViewData() {
    debugger
    this.salesService.getAllSchemesCardView().subscribe(
      (response: any) => {
        // this.fetchedPhotos = response.data;
        let schemeId = response.responseObject.map((x: any) => x.schemeData.id);
        this.propertyService.getAllotedUnsoldUnits(schemeId).subscribe(res => {
          if (res) {
            let allUnitCount = res;
            const uniqueDivisions: string[] = [];
            const uniqueDistricts: string[] = [];
            const uniqueProjectStatus: string[] = [];
            const uniqueSquarefeet: string[] = [];

            response.responseObject.forEach((element: any) => {
              let checkSchemeId = allUnitCount.filter((x: any) => x.schemeDataIds == element.schemeData.id);
              if (checkSchemeId.length > 0) {
                element.unitAllottedStatusYesCount = checkSchemeId[0].unitAllottedStatusYesCount;
                element.unsoldUnit = checkSchemeId[0].unsoldUnit
              }

              let startDate = element.schemeData.applicationReceieveDate ? new Date(element.schemeData.applicationReceieveDate) : '';
              let endDate = element.schemeData.applicationReceieveLastDate ? new Date(element.schemeData.applicationReceieveLastDate) : '';
              let currentDate = new Date();
              if (startDate && endDate) {
                if (currentDate >= startDate && currentDate <= endDate) {

                  element.publishedStatus = "Yes";

                } else {
                  element.publishedStatus = "No";
                }
              } else {
                element.publishedStatus = "No";

              }


              if (element.schemeData.nameOfTheDivision && !uniqueDivisions.includes(element.schemeData.nameOfTheDivision)) {
                uniqueDivisions.push(element.schemeData.nameOfTheDivision);
              }
              if (element.schemeData.district && !uniqueDistricts.includes(element.schemeData.district)) {
                uniqueDistricts.push(element.schemeData.district);
              }
              if (element.schemeData.projectStatus && !uniqueProjectStatus.includes(element.schemeData.projectStatus)) {
                uniqueProjectStatus.push(element.schemeData.projectStatus);
              }
              if (element.schemeData.plinthArea && !uniqueSquarefeet.includes(element.schemeData.plinthArea)) {
                uniqueSquarefeet.push(element.schemeData.plinthArea);
              }
            });
            this.photos = response.responseObject.filter((x: any) => x.publishedStatus == "Yes");
            this.originalCardData = this.photos;
            console.log('this.photos', this.photos);
            this.filterDatadiv = {
              nameOfTheDivision: uniqueDivisions,
              district: uniqueDistricts,
              projectStatus: uniqueProjectStatus,
              squareFeet: uniqueSquarefeet
            };

          }
        })

        console.log(response);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  applyFilters() {
    debugger
    let filteredData = [...this.originalData];
    // let filteredPhotos = [...this.fetchedPhotos];
    console.log(filteredData);
    if (this.unitType === 'Plot') {
      filteredData = filteredData.filter(item => item.unitType === 'Plot');
      // filteredPhotos = filteredPhotos.filter(item => item.unitType === 'Plot');
    }

    if (this.unitType === 'House') {
      filteredData = filteredData.filter(item => item.unitType === 'House');
      // filteredPhotos = filteredPhotos.filter(item => item.unitType === 'House');
    }
    if (this.unitType === 'Flat') {
      filteredData = filteredData.filter(item => item.unitType === 'Flat');
      // filteredPhotos = filteredPhotos.filter(item => item.unitType === 'Flat');
    }
    if (this.unitType == "ALL") {
      filteredData = this.originalData;

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
    // this.sort.active = '';
    // this.sort.direction = '';
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }
  applyFilters2() {
    debugger
    let filteredData = [...this.originalCardData];
    // let filteredPhotos = [...this.fetchedPhotos];
    console.log(filteredData);
    if (this.unitType === 'Plot') {
      filteredData = filteredData.filter(item => item.schemeData.unitType === 'Plot');
      // filteredPhotos = filteredPhotos.filter(item => item.unitType === 'Plot');
    }

    if (this.unitType === 'House') {
      filteredData = filteredData.filter(item => item.schemeData.unitType === 'House');
      // filteredPhotos = filteredPhotos.filter(item => item.unitType === 'House');
    }
    if (this.unitType === 'Flat') {
      filteredData = filteredData.filter(item => item.schemeData.unitType === 'Flat');
      // filteredPhotos = filteredPhotos.filter(item => item.unitType === 'Flat');
    }
    if (this.unitType == "ALL") {
      filteredData = this.originalData;

    }

    if (this.selectedSquareFeet) {
      filteredData = filteredData.filter(item => item.schemeData.plinthArea === this.selectedSquareFeet);
      // filteredPhotos = filteredPhotos.filter(item => item.nameOfTheDivision === this.selectedDivision);
    }


    if (this.selectedDistrict) {
      filteredData = filteredData.filter(item => item.schemeData.district === this.selectedDistrict);
    }
    if (this.selectedProjectStatus) {
      filteredData = filteredData.filter(item => item.schemeData.projectStatus === this.selectedProjectStatus);
    }
    // this.dataSource.data = filteredData;
    this.photos = filteredData;
    // this.photos = filteredPhotos;
    // this.sort.active = '';
    // this.sort.direction = '';
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  clearFilters() {
    this.selectedDivision = '';
    this.selectedDistrict = '';
    this.selectedProjectStatus = '';
    this.unitType = "";
    this.selectedSquareFeet = "";
    this.applyFilters2();
  }

  proceed(schemeId: any, reservationToDate: string, allotment: any) {
    debugger
    const queryParams = { schemeId: schemeId };
    sessionStorage.setItem('SchemeId', schemeId)
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
  unitTypeChange() {

  }

  goToHome() {

    this.router.navigate(['customer/home']);
  }

  sendEnquiry() {
    const data = {
      name: this.enquiryForm.value.name,
      email: this.enquiryForm.value.email,
      mobileNumber: this.enquiryForm.value.mobileNumber,
      description: this.enquiryForm.value.description
    }
    this.salesService.sendEnquiry(data).subscribe(
      (response: any) => {
        console.log('Response:', response.responseObject);
        this.toast.showToast('success', 'TNHB Staff will contact you shortly', 'Mail Sent');
      },
      (error: any) => {
        console.error('Error:', error);
        this.toast.showToast('error', 'Error sending mail', '');
      }
    );
  }

  inputValidate(evt: any, field: any) {
    const theEvent = evt || window.event;
    let key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    let regexValue = /[0-9.]/;
    if (field == 'alphabets') {
      regexValue = /^[a-zA-Z]+$/;
    } else if (field == 'alphaNumeric') {
      regexValue = /[0-9 a-zA-Z]/;
    } else if (field == 'numbersonly') {
      regexValue = /[.0-9 ]/;
    } else if (field == 'caps') {
      regexValue = /^[A-Z]+$/;
    } else if (field === 'email') {
      // Email regex pattern
      regexValue = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    }

    const regex = regexValue;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) {
        theEvent.preventDefault();
      }
    }

    // Prevent pasting using Ctrl+V within the keypress event
    if (theEvent.ctrlKey && (theEvent.key === 'v' || theEvent.key === 'V')) {
      theEvent.preventDefault();
    }

  }

}
