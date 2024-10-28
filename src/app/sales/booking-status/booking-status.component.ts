import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CustomerHeaderComponent } from '../customer-header/customer-header.component';
import { SalesService } from '../../services/sales.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';
import { Title } from '@angular/platform-browser';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { DatePipe, Location } from '@angular/common';
import { SocketioService } from '../../services/socketio.service';
import { StompserviceService } from '../../services/stompservice.service';

@Component({
  selector: 'app-booking-status',
  standalone: true,
  imports: [SharedModule, CustomerHeaderComponent],
  templateUrl: './booking-status.component.html',
  styleUrl: './booking-status.component.scss'
})
export class BookingStatusComponent {

  schemeData: any = {};
  unitData: any;
  schemeId: any;

  bookingData: any;
  schemeName: any;

  allottedUnits: any;
  unsoldUnits: any;

  totalCoveredCarparking: any;
  openCoveredCarParking: any;

  selectedCarParkingSlot1: any;
  selectedCarParkingSlot2: any;

  bookedCarParkings: any;


  minutes = 30;
  seconds = 0;
  interval: any = [];
  currentTime: any;
  message: string = '';
  private intervalId: any;
  webSocket!: WebSocket;
  stock: any;

  constructor(
    private salesService: SalesService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private title: Title,
    private toast: ToastService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private cdref: ChangeDetectorRef,
    private socketioService: SocketioService,
    private stompService: StompserviceService,
    private location: Location
  ) {
    this.title.setTitle('Book Unit');


  }

  // @HostListener('window:load', ['$event'])
  // onLoad(event: Event) {
  //   console.log('hostlistener');

  //   this.router.navigate(['/customer/home']);
  // }

  ngOnInit(): void {
    // this.route.queryParams.subscribe(params => {
    //   this.schemeId = params['schemeId'];
    // });
    this.schemeId = sessionStorage.getItem('SchemeId')
    this.fetchschemeData(this.schemeId);

    // setInterval(() => {

    //   if (this.interval) {
    //     this.interval.forEach((element: any) => {
    //       clearInterval(this.interval[element.id]);
    //       // clearInterval(element.id);

    //     });
    //   }
    //   this.fetchschemeData(this.schemeId);

    // }, 9000);
    this.getSchemeCounts();


    debugger
    let curreDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy, hh:mm a');
    const currentDate = new Date();
    // Add 30 minutes
    const newDate = new Date(currentDate.getTime() + 30 * 60000);

    // Format the new date using DatePipe
    const formattedDate = this.datePipe.transform(newDate, 'dd/MM/yyyy, hh:mm a');

    let getMinutesAndSeconds = this.getTimeDifference(curreDate, formattedDate);
    console.log('getMinutesAndSeconds', getMinutesAndSeconds);



    // this.socketioService.listen('/topic/unitData').subscribe((data: any) => {
    //   console.log('data', JSON.stringify(data));

    //   if (data) {
    //     debugger
    //     this.message = data;
    //     alert('data')
    //     console.log('Message received from server:', data);
    //   }

    // });

    // this.stompService.getUnitData().subscribe((data: any[]) => {

    //   console.log('stompservice', data);

    // });


    // this.socketioService.onMessage().subscribe((message) => {

    //   console.log('message', message);

    // });


    // this.webSocket = new WebSocket('ws://localhost:8080/topic/unitData');
    // this.webSocket.onmessage = (event) => {
    //   this.stock = JSON.parse(event.data)
    //   console.log('socket___________', this.stock);

    // };

    this.startRepeatingFunction();
    // this.sendMessage();
  }

  startRepeatingFunction(): void {
    this.intervalId = setTimeout(() => {
      this.myFunction();
      this.startRepeatingFunction(); // Recursively call to repeat every 5 seconds
    }, 60000); // 5000 milliseconds = 5 seconds
  }

  myFunction(): void {
    console.log("Function is called every 5 seconds.");
    // Your logic here
    this.fetchschemeData(this.schemeId);


  }
  parseDate(dateString: string): Date {
    debugger
    const dateParts = dateString?.split(/,?\s+/); // Split date and time parts
    const [day, month, year] = dateParts[0]?.split('/')?.map(Number); // Parse date part
    const [time, period] = dateParts[1]?.split(' '); // Parse time and period (AM/PM)
    let [hours, minutes] = time?.split(':').map(Number); // Split hours and minutes

    // Convert PM to 24-hour format
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0; // Midnight case
    }

    return new Date(year, month - 1, day, hours, minutes); // Return parsed Date object

    // const parsedDate = new Date(dateString);

    // // Format it using DatePipe
    // const formattedDate = this.datePipe.transform(parsedDate, 'EEE MMM d yyyy HH:mm:ss zzzz', 'GMT+0530');
    // // let checkDate = formattedDate;

    // return parsedDate;
  }
  startTimer(time: any, unit: any) {
    debugger

    this.interval[unit.id] = setInterval(() => {
      if (unit.seconds === 0) {
        if (unit.minutes === 0) {

          if (this.interval[unit.id]) {
            clearInterval(this.interval[unit.id]);
            delete this.interval[unit.id]; // Optionally, delete the interval reference
          }

        } else {
          unit.minutes--;
          unit.seconds = 59;
        }
      } else {
        unit.seconds--;
      }

      // }, unit.interval);
    }, 1000);

  }

  addMinutesToTime(timeString: string, minutesToAdd: number): string {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setMinutes(date.getMinutes() + minutesToAdd);

    return this.datePipe.transform(date, 'HH:mm')!;
  }

  async fetchschemeData(schemeId: any): Promise<void> {
    debugger
    try {
      // Fetch unit data
      const unitResponse = await this.salesService.getUnitDataBySchemeId(schemeId).toPromise();
      // this.unitData = unitResponse.responseObject;
      this.unitData = [];
      this.unitData = unitResponse.responseObject.filter((x: { unitAllottedStatus: string; }) => x.unitAllottedStatus !== 'Yes');
      debugger


      this.salesService.getUpdatedTimeByUnit(this.schemeId, 1).subscribe(getRes => {
        if (getRes && getRes.responseObject) {

          this.unitData.forEach((element: any) => {
            let checkUnit = getRes.responseObject.filter((x: any) => x.id == element.id);
            debugger
            if (checkUnit && checkUnit.length > 0) {
              let curreDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy, hh:mm a');
              let getMinutesAndSeconds = this.getTimeDifference(curreDate, checkUnit[0]?.unitBookingEndTime)
              console.log('getMinutesAndSeconds', getMinutesAndSeconds);
              element.minutes = getMinutesAndSeconds.minutes && getMinutesAndSeconds.minutes > 30 ? 0 : getMinutesAndSeconds.minutes;
              element.seconds = getMinutesAndSeconds.seconds;
              element.interval = 1000;
              if (this.interval) {
                // this.interval.forEach((element: any) => {
                clearInterval(this.interval[element.id]);
                delete this.interval[element.id];
                // });
              }
              this.startTimer('', element);
            }
          });
        }
      })

      // Fetch booked car parking data
      await this.getAllBookedCarParkingBySchemeId();

      // Fetch scheme data
      const schemeResponse = await this.salesService.getSchemeDataById(schemeId).toPromise();
      console.log(schemeResponse);
      this.schemeData = schemeResponse;

      // Remove carParkingSlot1 number from totalCoveredCarparking array
      // this.totalCoveredCarparking = Array.from({ length: parseInt(schemeResponse.totalCoveredCarparking) }, (_, index) => index + 1);
      this.totalCoveredCarparking = Array.from({ length: parseInt(schemeResponse.totalCoveredCarParking) }, (_, index) => index + 1);

      this.removeParkingSlotsFromTotal('carParkingSlot1');

      // Remove carParkingSlot2 numbers from openCoveredCarParking array
      // this.openCoveredCarParking = Array.from({ length: parseInt(schemeResponse.openCoveredCarParking) }, (_, index) => index + 1);
      this.openCoveredCarParking = Array.from({ length: parseInt(schemeResponse.totalOpenCarParking) }, (_, index) => index + 1);

      this.removeParkingSlotsFromTotal('carParkingSlot2');
    } catch (error) {
      console.error(error);
    }
  }

  convertToDate(dateString: string): Date {
    const [datePart, timePart] = dateString.split(', ');
    const [day, month, year] = datePart.split('/').map(Number);
    return new Date(`${year}-${month}-${day}T${timePart}`);
  }

  getTimeDifference(start: any, end: any): { minutes: number, seconds: number } {

    debugger
    // const startDate = new Date(start);
    // const endDate = new Date(end);

    // const diffInMilliseconds = endDate.getTime() - startDate.getTime();
    // const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    // const minutes = Math.floor(diffInSeconds / 60);
    // const seconds = diffInSeconds % 60;

    // return { minutes, seconds };


    // const targetDate = new Date(end);
    // const currentDate = new Date();
    // if (currentDate < targetDate) {
    //   const diffInMilliseconds = Math.abs(targetDate.getTime() - currentDate.getTime());
    //   const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    //   const minutes = Math.floor(diffInSeconds / 60);
    //   const seconds = diffInSeconds % 60;
    //   return { minutes, seconds };
    // } else {
    //   const minutes = 0;
    //   const seconds = 0;
    //   return { minutes, seconds };
    // }
    // let startGetParsedDate = new Date(start);
    // // let startGetParsedDate: Date = this.convertToDate(start);

    // let startFormattedDate = this.datePipe.transform(startGetParsedDate, 'EEE MMM d yyyy HH:mm:ss zzzz', 'GMT+0530');

    // let endGetParsedDate = new Date(end);
    // // let endGetParsedDate: Date = this.convertToDate(end);

    // let endFormattedDate = this.datePipe.transform(endGetParsedDate, 'EEE MMM d yyyy HH:mm:ss zzzz', 'GMT+0530');
    const startDate = this.parseDate(start);
    const endDate = this.parseDate(end);

    let startDateWithTime = startDate.getTime();
    let endDateWithTime = endDate.getTime()
    let diffInMilliseconds: any;
    if (endDateWithTime > startDateWithTime) {
      diffInMilliseconds = Math.abs(endDate.getTime() - startDate.getTime())
    } else {
      diffInMilliseconds = endDate.getTime() - startDate.getTime()

    }
    // diffInMilliseconds = Math.abs(endDate.getTime() - startDate.getTime())



    if (diffInMilliseconds > 0) {
      console.log('diffInMilliseconds', diffInMilliseconds);

      // Convert milliseconds into seconds
      const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

      // Convert seconds into minutes and seconds
      const minutes = Math.floor(diffInSeconds / 60);
      // const seconds = diffInSeconds % 60;
      const seconds = 0;
      return { minutes, seconds };
    } else {
      const minutes = 0;
      const seconds = 0;
      return { minutes, seconds };
    }


    // if (minutes < 31) {
    //   return { minutes, seconds };
    // } else {
    //   const minutes = 0;
    //   const seconds = 0;
    //   return { minutes, seconds };
    // }

  }

  getSchemeCounts() {
    this.salesService.getCountsBySchemeId(this.schemeId).subscribe(
      (response) => {
        console.log(response);
        this.allottedUnits = response.unitAllottedStatusYesCount;
        this.unsoldUnits = parseInt(response.schemeDataTotalUnit) - parseInt(response.unitAllottedStatusYesCount);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getButtonStyle(status: string, unit: any) {
    let backgroundColor = '';
    let textColor = 'white'; // Set the text color to white

    switch (status) {
      case 'No':
        // backgroundColor = 'green';
        backgroundColor = '#54473F'
        break;
      case 'Pending':
        if (unit.minutes == 0 && unit.seconds == 0) {
          // backgroundColor = 'green';
          backgroundColor = '#54473F'

        } else {
          backgroundColor = 'brown';

        }
        break;
      case 'Completed':
        // backgroundColor = '#845EC2';
        backgroundColor = 'green';

        break;
      default:
        backgroundColor = '#54473F'
        // Default background color
        break;
    }

    return { 'background-color': backgroundColor, 'color': textColor };
  }

  getButtonDisabled(status: string, unit: any) {
    // return status === 'Pending';
    if (status === 'Pending') {
      if (unit.minutes > 0 || unit.seconds > 0) {
        return true;

      } else {
        return false;
      }

    } else if (status === 'Completed') {
      return true;
    } else {
      return false;

    }

  }

  updateBookingStatus(unit: any) {
    debugger
    console.log('Scheme Type:', this.schemeData.schemeType);
    console.log('Selected Car Parking Slot 1:', this.selectedCarParkingSlot1);
    console.log('Selected Car Parking Slot 2:', this.selectedCarParkingSlot2);

    // if (this.schemeData.schemeType === 'HIG' || this.schemeData.schemeType === 'MIG') {
    //   // if (!this.selectedCarParkingSlot1 || !this.selectedCarParkingSlot2) {
    //   //   this.toast.showToast('warning', 'Select Car Parking', '');
    //   //   return;
    //   // }
    // }
    if (unit.bookingStatus != 'Completed' && unit.bookingStatus != 'Pending') {
      this.salesService.getUnitById(unit.id).subscribe(

        async (response) => {
          debugger



          let curreDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy, hh:mm a');
          // let curreDate = new Date();

          const currentDate = new Date();
          // Add 30 minutes
          // const newDate = new Date(currentDate.getTime() + 30 * 60000);
          const newDate = new Date(currentDate.getTime() + 20 * 60000);


          // Format the new date using DatePipe
          const formattedDate = this.datePipe.transform(newDate, 'dd/MM/yyyy, hh:mm a');
          // const formattedDate = newDate;

          let unitData = {
            "id": unit.id,
            "unitBookingTime": curreDate,
            "unitBookingEndTime": formattedDate
          }

          this.salesService.UpdatedTimeByUnit(unitData).subscribe(async res => {
            if (res) {
              await this.salesService.getUpdatedTimeByUnit(this.schemeId, 1).subscribe(getRes => {
                if (getRes && getRes.responseObject) {

                  this.unitData.forEach((element: any) => {
                    let checkUnit = getRes.responseObject.filter((x: any) => x.id == element.id);
                    debugger
                    if (checkUnit && checkUnit.length > 0 && checkUnit[0].bookingStatus != 'Completed') {
                      // let curreDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddThh:mm:ss.SSSZ');
                      let curreDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy, hh:mm a');

                      if (this.interval) {
                        clearInterval(this.interval[element.id]);
                        delete this.interval[element.id];


                      }
                      let getMinutesAndSeconds = this.getTimeDifference(curreDate, checkUnit[0]?.unitBookingEndTime)
                      console.log('getMinutesAndSeconds', getMinutesAndSeconds);

                      element.minutes = getMinutesAndSeconds.minutes && getMinutesAndSeconds.minutes > 30 ? 0 : getMinutesAndSeconds.minutes;
                      element.seconds = getMinutesAndSeconds.seconds;

                      element.interval = 1000;

                      this.startTimer('', element);

                    }
                  });
                  // if (unit.bookingStatus != 'Completed' && unit.bookingStatus != 'Pending') {
                  const dialogRef = this.dialog.open(BookingDialogComponent, {
                    width: '55%',
                    height: '75vh',
                    data: {
                      schemeType: this.schemeData.schemeType,
                      ...popupData
                    },
                    // disableClose: true,
                    // hasBackdrop: false,
                    panelClass: 'custom-modalbox'
                  });

                  dialogRef.afterClosed().subscribe(result => {
                    console.log('Dialog Result:', result);
                    if (result === 'proceed') {
                      let updateUnitStatus = this.updateUnitStatus(unit, "Pending")
                      if (this.schemeData.schemeType === 'HIG' || this.schemeData.schemeType === 'MIG') {
                        sessionStorage.setItem('selectedCarParkingSlot1', this.selectedCarParkingSlot1);
                        sessionStorage.setItem('selectedCarParkingSlot2', this.selectedCarParkingSlot2);

                      } else {
                        sessionStorage.setItem('selectedCarParkingSlot1', '');
                        sessionStorage.setItem('selectedCarParkingSlot2', '');
                      }
                      sessionStorage.setItem('schemeId', this.schemeId);
                      sessionStorage.setItem('unitId', unit.id);

                      // this.router.navigate(['/view-scheme'], { queryParams: { schemeId: this.schemeId } });

                      // const data = {
                      //   "amount": result.grandTotal ? result.grandTotal : '0',
                      //   "unitId": unit.id,
                      //   "schemeId": this.schemeId,
                      //   "paymentType": "Initial Deposit",
                      //   "description": "Booking Saved",
                      //   "unitAcccountNumber": unit.unitAccountNumber,
                      //   "applicationId": '',
                      //   "createdDateTime": new Date().toLocaleString()
                      // }

                      // this.salesService.bookingSave(data).subscribe(res => {
                      //   if (res) {


                      //     if (this.authService.getToken()) {
                      //       this.router.navigate(['customer/selectbank'], { queryParams: { bookingId: res.responseObject.id } });
                      //     } else {
                      //       this.authService.setTargetUrl('/customer/application');
                      //       this.router.navigate(['/customer-login']);
                      //     }

                      //   }
                      // })

                      if (this.authService.getToken()) {
                        sessionStorage.setItem('minutes', JSON.stringify(unit.minutes))
                        sessionStorage.setItem('seconds', JSON.stringify(unit.seconds));
                        console.log('minutes', sessionStorage.getItem('minutes'));
                        console.log('seconds', sessionStorage.getItem('seconds'));
                        debugger
                        this.router.navigate(['/customer/application']);
                      } else {
                        this.authService.setTargetUrl('/customer/application');
                        this.router.navigate(['/customer-login']);
                      }

                    } else {
                      this.updateUnitStatus(unit, "No")
                      if (this.interval[unit.id]) {
                        clearInterval(this.interval[unit.id]);
                        delete this.interval[unit.id]; // Optionally remove the interval reference
                      }
                      this.fetchschemeData(this.schemeId)
                      // // Set the unit's minutes and seconds to 0
                      // unit.minutes = 0;
                      // unit.seconds = 0;

                    }
                  });
                  // } else {
                  //   this.toast.showToast('warning', "This Unit is Booked Already Please Choose another Unit", '');
                  // }



                  //   }
                  // })

                }

              })

            }

          })
          console.log('Unit Data Response:', response);
          const popupData = response;
          console.log('Popup Data:', popupData);
          // let checkUnitStatus = this.fetchschemeData(this.schemeId);


        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );

    }
  }

  proceedToApplication(unit: any) {
    debugger
    console.log('Scheme Type:', this.schemeData.schemeType);
    console.log('Selected Car Parking Slot 1:', this.selectedCarParkingSlot1);
    console.log('Selected Car Parking Slot 2:', this.selectedCarParkingSlot2);

    // if (this.schemeData.schemeType === 'HIG' || this.schemeData.schemeType === 'MIG') {
    //   // if (!this.selectedCarParkingSlot1 || !this.selectedCarParkingSlot2) {
    //   //   this.toast.showToast('warning', 'Select Car Parking', '');
    //   //   return;
    //   // }
    // }
    if (unit.bookingStatus != 'Completed' && unit.bookingStatus != 'Pending') {
      this.salesService.getUnitById(unit.id).subscribe(

        async (response) => {
          debugger



          let curreDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy, hh:mm a');
          // let curreDate = new Date();

          const currentDate = new Date();
          // Add 30 minutes
          // const newDate = new Date(currentDate.getTime() + 30 * 60000);
          const newDate = new Date(currentDate.getTime() + 20 * 60000);


          // Format the new date using DatePipe
          const formattedDate = this.datePipe.transform(newDate, 'dd/MM/yyyy, hh:mm a');
          // const formattedDate = newDate;

          let unitData = {
            "id": unit.id,
            "unitBookingTime": curreDate,
            "unitBookingEndTime": formattedDate
          }

          this.salesService.UpdatedTimeByUnit(unitData).subscribe(async res => {
            if (res) {
              await this.salesService.getUpdatedTimeByUnit(this.schemeId, 1).subscribe(getRes => {
                if (getRes && getRes.responseObject) {

                  this.unitData.forEach((element: any) => {
                    let checkUnit = getRes.responseObject.filter((x: any) => x.id == element.id);
                    debugger
                    if (checkUnit && checkUnit.length > 0 && checkUnit[0].bookingStatus != 'Completed') {
                      // let curreDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddThh:mm:ss.SSSZ');
                      let curreDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy, hh:mm a');

                      if (this.interval) {
                        clearInterval(this.interval[element.id]);
                        delete this.interval[element.id];


                      }
                      let getMinutesAndSeconds = this.getTimeDifference(curreDate, checkUnit[0]?.unitBookingEndTime)
                      console.log('getMinutesAndSeconds', getMinutesAndSeconds);

                      element.minutes = getMinutesAndSeconds.minutes && getMinutesAndSeconds.minutes > 30 ? 0 : getMinutesAndSeconds.minutes;
                      element.seconds = getMinutesAndSeconds.seconds;

                      element.interval = 1000;

                      this.startTimer('', element);

                    }
                  });

                  let updateUnitStatus = this.updateUnitStatus(unit, "Pending")
                  if (this.schemeData.schemeType === 'HIG' || this.schemeData.schemeType === 'MIG') {
                    sessionStorage.setItem('selectedCarParkingSlot1', this.selectedCarParkingSlot1);
                    sessionStorage.setItem('selectedCarParkingSlot2', this.selectedCarParkingSlot2);

                  } else {
                    sessionStorage.setItem('selectedCarParkingSlot1', '');
                    sessionStorage.setItem('selectedCarParkingSlot2', '');
                  }
                  sessionStorage.setItem('schemeId', this.schemeId);
                  sessionStorage.setItem('unitId', unit.id);



                  if (this.authService.getToken()) {
                    sessionStorage.setItem('minutes', JSON.stringify(unit.minutes))
                    sessionStorage.setItem('seconds', JSON.stringify(unit.seconds));
                    console.log('minutes', sessionStorage.getItem('minutes'));
                    console.log('seconds', sessionStorage.getItem('seconds'));
                    debugger
                    this.router.navigate(['/customer/application']);
                  } else {
                    this.authService.setTargetUrl('/customer/application');
                    this.router.navigate(['/customer-login']);
                  }
                  // this.unitData.forEach((element: any) => {
                  //   let checkUnit = getRes.responseObject.filter((x: any) => x.id == element.id);
                  //   debugger
                  //   if (checkUnit && checkUnit.length > 0 && checkUnit[0].bookingStatus != 'Completed') {
                  //     // let curreDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddThh:mm:ss.SSSZ');
                  //     let curreDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy, hh:mm a');

                  //     if (this.interval) {
                  //       clearInterval(this.interval[element.id]);
                  //       delete this.interval[element.id];


                  //     }
                  //     let getMinutesAndSeconds = this.getTimeDifference(curreDate, checkUnit[0]?.unitBookingEndTime)
                  //     console.log('getMinutesAndSeconds', getMinutesAndSeconds);

                  //     element.minutes = getMinutesAndSeconds.minutes && getMinutesAndSeconds.minutes > 30 ? 0 : getMinutesAndSeconds.minutes;
                  //     element.seconds = getMinutesAndSeconds.seconds;

                  //     element.interval = 1000;

                  //     this.startTimer('', element);

                  //   }
                  // });
                  // if (unit.bookingStatus != 'Completed' && unit.bookingStatus != 'Pending') {
                  // const dialogRef = this.dialog.open(BookingDialogComponent, {
                  //   width: '55%',
                  //   height: '75vh',
                  //   data: {
                  //     schemeType: this.schemeData.schemeType,
                  //     ...popupData
                  //   },
                  //   // disableClose: true,
                  //   // hasBackdrop: false,
                  //   panelClass: 'custom-modalbox'
                  // });

                  // dialogRef.afterClosed().subscribe(result => {
                  //   console.log('Dialog Result:', result);
                  //   if (result === 'proceed') {
                  //     let updateUnitStatus = this.updateUnitStatus(unit, "Pending")
                  //     if (this.schemeData.schemeType === 'HIG' || this.schemeData.schemeType === 'MIG') {
                  //       sessionStorage.setItem('selectedCarParkingSlot1', this.selectedCarParkingSlot1);
                  //       sessionStorage.setItem('selectedCarParkingSlot2', this.selectedCarParkingSlot2);

                  //     } else {
                  //       sessionStorage.setItem('selectedCarParkingSlot1', '');
                  //       sessionStorage.setItem('selectedCarParkingSlot2', '');
                  //     }
                  //     sessionStorage.setItem('schemeId', this.schemeId);
                  //     sessionStorage.setItem('unitId', unit.id);



                  //     if (this.authService.getToken()) {
                  //       sessionStorage.setItem('minutes', JSON.stringify(unit.minutes))
                  //       sessionStorage.setItem('seconds', JSON.stringify(unit.seconds));
                  //       console.log('minutes', sessionStorage.getItem('minutes'));
                  //       console.log('seconds', sessionStorage.getItem('seconds'));
                  //       debugger
                  //       this.router.navigate(['/customer/application']);
                  //     } else {
                  //       this.authService.setTargetUrl('/customer/application');
                  //       this.router.navigate(['/customer-login']);
                  //     }

                  //   } else {
                  //     this.updateUnitStatus(unit, "No")
                  //     if (this.interval[unit.id]) {
                  //       clearInterval(this.interval[unit.id]);
                  //       delete this.interval[unit.id]; // Optionally remove the interval reference
                  //     }
                  //     this.fetchschemeData(this.schemeId)
                  //     // // Set the unit's minutes and seconds to 0
                  //     // unit.minutes = 0;
                  //     // unit.seconds = 0;

                  //   }
                  // });
                  // } else {
                  //   this.toast.showToast('warning', "This Unit is Booked Already Please Choose another Unit", '');
                  // }



                  //   }
                  // })

                }

              })

            }

          })
          console.log('Unit Data Response:', response);
          const popupData = response;
          console.log('Popup Data:', popupData);
          // let checkUnitStatus = this.fetchschemeData(this.schemeId);


        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );

    }

  }


  viewInformation(unit: any) {


    this.salesService.getUnitById(unit.id).subscribe(

      async (response) => {
        const popupData = response;


        const dialogRef = this.dialog.open(BookingDialogComponent, {
          width: '55%',
          height: '75vh',
          data: {
            schemeType: this.schemeData.schemeType,
            ...popupData
          },
          // disableClose: true,
          // hasBackdrop: false,
          panelClass: 'custom-modalbox'
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('Dialog Result:', result);
          // if (result === 'proceed') {
          //   let updateUnitStatus = this.updateUnitStatus(unit, "Pending")
          //   if (this.schemeData.schemeType === 'HIG' || this.schemeData.schemeType === 'MIG') {
          //     sessionStorage.setItem('selectedCarParkingSlot1', this.selectedCarParkingSlot1);
          //     sessionStorage.setItem('selectedCarParkingSlot2', this.selectedCarParkingSlot2);

          //   } else {
          //     sessionStorage.setItem('selectedCarParkingSlot1', '');
          //     sessionStorage.setItem('selectedCarParkingSlot2', '');
          //   }
          //   sessionStorage.setItem('schemeId', this.schemeId);
          //   sessionStorage.setItem('unitId', unit.id);



          //   if (this.authService.getToken()) {
          //     sessionStorage.setItem('minutes', JSON.stringify(unit.minutes))
          //     sessionStorage.setItem('seconds', JSON.stringify(unit.seconds));
          //     console.log('minutes', sessionStorage.getItem('minutes'));
          //     console.log('seconds', sessionStorage.getItem('seconds'));
          //     debugger
          //     this.router.navigate(['/customer/application']);
          //   } else {
          //     this.authService.setTargetUrl('/customer/application');
          //     this.router.navigate(['/customer-login']);
          //   }

          // } else {
          //   this.updateUnitStatus(unit, "No")
          //   if (this.interval[unit.id]) {
          //     clearInterval(this.interval[unit.id]);
          //     delete this.interval[unit.id]; // Optionally remove the interval reference
          //   }
          //   this.fetchschemeData(this.schemeId)
          //   // // Set the unit's minutes and seconds to 0
          //   // unit.minutes = 0;
          //   // unit.seconds = 0;

          // }
        });

      })

  }

  updateUnitStatus(unit: any, status: any) {


    const date = new Date();

    const formattedDate = date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });

    let data = {
      "id": unit.id,
      "bookingStatus": status,
      "bookingTime": formattedDate
    }
    this.salesService.updateBookingStatus(data).subscribe(res => {
      if (res) {

      }
    })
  }

  selectCarParkingSlot1(slotNumber: number) {
    this.selectedCarParkingSlot1 = slotNumber;
  }

  selectCarParkingSlot2(slotNumber: number) {
    this.selectedCarParkingSlot2 = slotNumber;
  }

  removeParkingSlotsFromTotal(parkingSlot: string): void {
    if (!this.bookedCarParkings) return;

    const slotsToRemove = new Set<number>();

    // Collect all slot values to remove
    this.bookedCarParkings.forEach((obj: any) => {
      slotsToRemove.add(parseInt(obj[parkingSlot]));
    });

    console.log("Slots to remove:", slotsToRemove);

    // Filter the totalCoveredCarparking or openCoveredCarParking array
    if (parkingSlot === 'carParkingSlot1') {
      console.log("Total Covered Carparking before filtering:", this.totalCoveredCarparking);
      this.totalCoveredCarparking = this.totalCoveredCarparking.filter((slot: number) => !slotsToRemove.has(slot));
      console.log("Filtered totalCoveredCarparking:", this.totalCoveredCarparking);
    } else {
      console.log("Open Covered Carparking before filtering:", this.openCoveredCarParking);
      this.openCoveredCarParking = this.openCoveredCarParking.filter((slot: number) => !slotsToRemove.has(slot));
      console.log("Filtered openCoveredCarParking:", this.openCoveredCarParking);
    }
  }


  getAllBookedCarParkingBySchemeId() {
    return new Promise<void>((resolve, reject) => {
      this.salesService.getAllCarParkingBySchemeId(this.schemeId).subscribe(
        (response) => {
          console.log(response);
          this.bookedCarParkings = response.responseObject;
          resolve(); // Resolve the promise when data is fetched successfully
        },
        (error) => {
          console.error(error);
          reject(error); // Reject the promise if there's an error
        }
      );
    });
  }

  convertToIST(dateString: string): string {
    debugger
    // const date = new Date(dateString);
    // // Adjusting for IST (UTC +5:30)
    // const istOffset = 5.5 * 60 * 60 * 1000;
    // const istDate = new Date(date.getTime() + istOffset);

    // // Format the IST date to 'dd-MM-yyyy HH mm'
    // return this.datePipe.transform(istDate, 'dd-MM-yyyy HH mm')!;


    // const apidate1 = new Date(dateString);
    // const apiDate = new Date(apidate1.getTime());
    // let getDate = this.datePipe.transform(apiDate, 'HH:mm')!;
    // let getCurrentDateTime = this.datePipe.transform(new Date(), 'HH:mm')!;
    // let getIntervalTime = parseInt(getDate) - parseInt(getCurrentDateTime);
    // console.log('getIntervalTime', getIntervalTime);

    // const [hours, minutes] = getDate.split(':').map(Number);
    // const dateNew = new Date();
    // dateNew.setHours(hours);
    // dateNew.setMinutes(minutes);
    console.log('this.datePipe.transform(dateString', this.datePipe.transform(dateString, 'hh:mm'));

    return this.datePipe.transform(dateString, 'hh:mm')!;
    // return getDate;





    // Format the date to 'dd-MM-yyyy HH mm' in GMT
    // return this.datePipe.transform(date, 'dd-MM-yyyy HH mm', 'GMT')!;
  }

  private updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
    let dataFormate = '2024-07-26T11:40:06.238316';
    console.log('2024-07-26T11:40:06.238316', new Date(dataFormate).toLocaleTimeString());

  }

  sendMessage() {
    this.socketioService.emit('message', 'Hello from Angular!');
  }

  ngOnDestroy(): void {

    this.dialog.closeAll();
    // if (this.interval && this.interval.length > 0) {
    //   this.interval.forEach((element: any) => {
    //     // clearInterval(this.interval[element]);
    //     clearInterval(element);

    //   });

    // } else {
    //   this.interval = []
    // }


    if (this.interval) {
      this.interval.forEach((element: any) => {
        clearInterval(this.interval[element.id]);
        // clearInterval(element.id);

      });

      this.interval = [];
    }


    // this.socketioService.disconnect();


    if (this.intervalId) {
      clearTimeout(this.intervalId);
    }

  }
  back() {
    this.location.back();
  }

}
