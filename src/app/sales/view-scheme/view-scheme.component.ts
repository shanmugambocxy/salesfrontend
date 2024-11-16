import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SafeResourceUrl, DomSanitizer, Title, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CustomerHeaderComponent } from '../customer-header/customer-header.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SalesService } from '../../services/sales.service';
import { ToastService } from '../../services/toast.service';
import { forkJoin } from 'rxjs';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-view-scheme',
  standalone: true,
  imports: [SharedModule, CustomerHeaderComponent],
  templateUrl: './view-scheme.component.html',
  styleUrl: './view-scheme.component.scss'
})
export class ViewSchemeComponent {

  images: any;
  amenities: any;
  schemeId: any;
  projectDescription: any;
  uploadSchemeVideosPath: any;
  floorImagePath: any;
  layoutPath: any;
  carParkingLayout: any;
  geoTagLink: any;
  schemeData: any = {};
  unitId: any;
  unitData: any;

  modelImages: any;
  currentStatusImages: any;
  locationMap: any;
  icons!: string[];
  iconsImage: any[] = [];
  pointOfContactPicture: any;

  enquiryForm!: FormGroup;

  activeTab: string = 'video';
  reservations: any[] = [];
  setActiveTab(tab: string) {
    this.activeTab = tab;
    console.log(this.activeTab);
  }

  iconsList = [
    { id: 1, title: 'Rain Water Harvesting', iconPath: '../../../assets/attachment-images/1.png' },
    { id: 2, title: 'Mini Theatre', iconPath: '../../../../assets/attachment-images/2.png' },
    { id: 3, title: 'Water Treatment Plant', iconPath: '../../../../assets/attachment-images/3.png' },
    { id: 4, title: 'Swimming Pool', iconPath: '../../../../assets/attachment-images/4.png' },
    { id: 5, title: 'Fire Alarm & Wet riser system', iconPath: '../../../../assets/attachment-images/5.png' },
    { id: 6, title: 'Reticulated Gas', iconPath: '../../../../assets/attachment-images/6.png' },
    { id: 7, title: 'Garbage collection room', iconPath: '../../../../assets/attachment-images/7.png' },
    { id: 8, title: 'Motion Sensor Lighting system in club house', iconPath: '../../../../assets/attachment-images/8.png' },
    { id: 9, title: 'CCTV Surveillance', iconPath: '../../../../assets/attachment-images/9.png' },
    { id: 10, title: 'Solar Powered LED Lights in common area', iconPath: '../../../../assets/attachment-images/10.png' },
    { id: 11, title: 'Clubhouse', iconPath: '../../../../assets/attachment-images/11.png' },
    { id: 12, title: 'Fitness Centre', iconPath: '../../../../assets/attachment-images/12.png' },
    { id: 13, title: 'Party Hall', iconPath: '../../../../assets/attachment-images/13.png' },
    { id: 14, title: 'Lifts with V3F & ARD', iconPath: '../../../../assets/attachment-images/14.png' },
    { id: 15, title: 'Water meters for all apartments Digital', iconPath: '../../../../assets/attachment-images/15.png' }
  ]

  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private authService: AuthService,
    private router: Router,
    private title: Title,
    private sanitizer: DomSanitizer,
    private reservationService: ReservationService,
  ) {
    this.title.setTitle("Scheme Details");
  }

  ngOnInit(): void {
    this.enquiryForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      description: ['', Validators.required],
    });

    // this.route.queryParams.subscribe(params => {
    //   this.schemeId = params['schemeId'];
    // });
    this.schemeId = sessionStorage.getItem('SchemeId')
    this.unitId = sessionStorage.getItem('unitId');
    this.getAllSchemesData();
    // this.getUnitData();
    this.getReservationDataBySchemeId();
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getAllSchemesData() {
    debugger
    this.salesService.getWebsiteDataBySchemeId(this.schemeId).subscribe(
      (response: any) => {
        console.log('Response:', response.responseObject);
        this.images = response.responseObject[0].schemeImagePath.map((image: { uploadSchemePhotosPath: any; }) => ({
          uploadSchemePhotosPath: image.uploadSchemePhotosPath
        }));
        this.amenities = response.responseObject[0].amenities.map((amenities: { amenities: any; }) => ({
          amenities: amenities.amenities
        }));
        this.projectDescription = response.responseObject[0].projectDescription;
        this.schemeData = response.responseObject[0].schemeData;
        this.uploadSchemeVideosPath = response.responseObject[0].uploadSchemeVideosPath;
        this.floorImagePath = response.responseObject[0].floorImagePath;
        console.log("floorImagePath:", this.floorImagePath);
        this.layoutPath = response.responseObject[0].layoutPath;
        console.log("layoutPath:", this.layoutPath);
        this.carParkingLayout = response.responseObject[0].carParkingLayout;
        console.log("carParkingLayout:", this.carParkingLayout);
        this.geoTagLink = response.responseObject[0].geoTagLink;
        this.modelImages = response.responseObject[0].modelImagePathDTO;
        this.currentStatusImages = response.responseObject[0].currentImageStatus;
        this.locationMap = response.responseObject[0].geoTagLink;
        this.pointOfContactPicture = response.responseObject[0].uploadPointOfContactPicturePath;
        this.icons = response.responseObject[0].icons.split(',');
        console.log(this.icons);
        this.getIconsById();
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  getIconsById(): void {
    this.iconsImage = [];  // Ensure the array is empty before pushing new data

    // Create an array of observables
    const iconRequests = this.icons.map(id => this.salesService.getIconsById(parseInt(id)));

    // Use forkJoin to wait for all observables to complete
    forkJoin(iconRequests).subscribe(
      responses => {
        console.log('API responses:', responses);
        this.iconsImage = responses;
        console.log('Icons Image:', this.iconsImage);
      },
      error => {
        console.error('Error fetching icon by ID:', error);
      }
    );
  }

  getUnitData() {
    this.salesService.getUnitById(this.unitId).subscribe(
      (response: any) => {
        console.log('Response:', response);
        this.unitData = response;
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
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

  onBookNowClick() {
    if (this.authService.getToken()) {
      this.router.navigate(['/customer/application']);
    } else {
      this.authService.setTargetUrl('/customer/application');
      this.router.navigate(['/customer-login']);
    }
  }
  getReservationDataBySchemeId(): void {
    this.salesService.getReservationDataBySchemeId(this.schemeId).subscribe(
      (res: any) => {
        if (res.responseStatus) {
          this.reservations = res.responseObject
            .map((reservation: any) => {
              // Ensure allocatedUnits and soldUnits are numbers before calculation
              const allocatedUnits = parseInt(reservation.allocatedUnits, 10) || 0;
              const soldUnits = parseInt(reservation.soldUnits, 10) || 0;
              reservation.unsold = allocatedUnits - soldUnits;
              return reservation;
            })
            .sort((a: any, b: any) => {
              // Convert ccCode to numbers for numerical sorting
              const ccCodeA = parseInt(a.ccCode, 10);
              const ccCodeB = parseInt(b.ccCode, 10);

              // Handle potential NaN values in ccCode
              if (isNaN(ccCodeA) && isNaN(ccCodeB)) {
                return 0;
              } else if (isNaN(ccCodeA)) {
                return 1;
              } else if (isNaN(ccCodeB)) {
                return -1;
              }

              // Compare ccCode values
              return ccCodeA - ccCodeB;
            });
        } else {
          console.error('Error in response:', res);
        }
      },
      (err: any) => {
        console.error('Error fetching reservation data:', err);
      }
    );
  }
  goToUnitSelect() {
    debugger
    // const sharedData = {
    //   ...data,
    //   schemeId: this.schemeId
    // }
    // sessionStorage.setItem('reservationId', data.id);
    // this.reservationService.setSharedData(sharedData);


    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"
    console.log(formattedDate);
    let checkDate = new Date("Sun Oct 27 2024 20:55:00 GMT+0530 (India Standard Time)");
    let currentDate = new Date()
    let startDateNew: any = new Date(this.schemeData.startDate);
    let endDateNew: any = new Date(this.schemeData.endDate);
    debugger
    if (currentDate.getTime() >= startDateNew.getTime() && currentDate.getTime() <= endDateNew.getTime()) {

      if (currentDate.getTime() >= startDateNew.getTime()) {
        if (this.authService.getToken()) {
          this.router.navigate(['/booking-status'], { queryParams: { schemeId: this.schemeId } });

        } else {
          this.authService.setTargetUrl('/booking-status');
          this.router.navigate(['/customer-login']);
        }
      }
    } else {
      this.toast.showToast("warning", `Booking time Starts From ${startDateNew}`, "")
    }



    const startDate = '2024-10-01T10:00:00'; // Example start date
    const endDate = '2024-10-02T12:00:00';
    const result = this.isDateGreaterOrEqual(startDate, endDate);
    debugger

  }

  isDateGreaterOrEqual(startDate: string, endDate: string): boolean {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if the end date is greater than or equal to the start date
    return end.getTime() >= start.getTime();
  }

  openMap() {
    window.open(this.locationMap, '_blank'); // Open in a new tab

  }

}