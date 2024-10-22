import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CustomerHeaderComponent } from '../customer-header/customer-header.component';
import { SalesService } from '../../services/sales.service';
import { ReservationService } from '../../services/reservation.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-customer-reservation-page',
  standalone: true,
  imports: [SharedModule, CustomerHeaderComponent],
  templateUrl: './customer-reservation-page.component.html',
  styleUrl: './customer-reservation-page.component.scss'
})
export class CustomerReservationPageComponent {

  schemeId: any;
  schemeData: any = {};
  reservations: any[] = [];

  constructor(
    // private projectservice: ProjectDetailsService,
    private route: ActivatedRoute,
    private salesService: SalesService,
    private reservationService: ReservationService,
    private router: Router,
    private title: Title
  ) {
    this.title.setTitle('Reservation Page');
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.schemeId = params['schemeId'];
    });
    this.fetchschemeData(this.schemeId);
    this.getReservationDataBySchemeId();
  }

  fetchschemeData(schemeId: number): void {

    this.salesService.getUnitDataBySchemeId(schemeId)
      .subscribe(
        (response) => {
          this.schemeData = response.responseObject[0].schemeData;
          // // Calculate unsold units for each category
          // this.schemeData.scheduledCasteUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.scheduledCaste, this.schemeData.reservation.scheduledCasteSoldUnits);
          // this.schemeData.artistUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.artist, this.schemeData.reservation.artistsSoldUnits);
          // this.schemeData.politicalSufferersUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.politicalSufferers, this.schemeData.reservation.politicalSufferersSoldUnits);
          // this.schemeData.physicallyChallengedUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.physicallyChallenged, this.schemeData.reservation.physicallyChallengedSoldUnits);

          // this.schemeData.scheduledTribesUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.scheduledTribes, this.schemeData.reservation.scheduledTribesSoldUnits);
          // this.schemeData.stPhysicallyChallengedUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.stPhysicallyChallenged, this.schemeData.reservation.stPhysicallyChallengedSoldUnits);

          // this.schemeData.stateGovermentUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.stateGoverment, this.schemeData.reservation.stateGovermentSoldUnits);
          // this.schemeData.stateGovermentPhysicallyChallengedUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.stateGovermentPhysicallyChallenged, this.schemeData.reservation.stateGovermentPhysicallyChallengedSoldUnits);
          // this.schemeData.stateGovermentJudicialOfficersUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.stateGovermentJudicialOfficers, this.schemeData.reservation.stateGovermentJudicialOfficersSoldUnits);

          // this.schemeData.centralTnebLocalBodiesUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.centralTnebLocalBodies, this.schemeData.reservation.centralTnebLocalBodiesSoldUnits);
          // this.schemeData.centralGovermentPhysicallyChallengedUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.centralGovermentPhysicallyChallenged, this.schemeData.reservation.centralGovermentPhysicallyChallengedSoldUnits);

          // this.schemeData.defenceUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.defence, this.schemeData.reservation.defenceSoldUnits);
          // this.schemeData.awardeesUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.awardees, this.schemeData.reservation.awardeesSoldUnits);
          // this.schemeData.defencePhysicallyChallengewdUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.defencePhysicallyChallenged, this.schemeData.reservation.defencePhysicallyChallengewdSoldUnits);

          // this.schemeData.dhobbiesArtisUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.dhobbiesArtists, this.schemeData.reservation.dhobbiesArtisSoldUnits);
          // this.schemeData.dhobbiesBarbersUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.dhobbiesBarbers, this.schemeData.reservation.dhobbiesBarbersSoldUnits);
          // this.schemeData.dhobbiesPhysicallyChallengedUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.dhobbiesPhysicallyChallenged, this.schemeData.reservation.dhobbiesPhysicallyChallengedSoldUnits);

          // this.schemeData.workingJournalistUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.workingJournalist, this.schemeData.reservation.workingJournalistSoldUnits);
          // this.schemeData.journalistPhysicallyChallengedUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.journalistPhysicallyChallenged, this.schemeData.reservation.journalistPhysicallyChallengedsoldUnits);

          // this.schemeData.languageCrusadersUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.languageCrusaders, this.schemeData.reservation.languageCrusadersSoldUnits);
          // this.schemeData.languagePhysicallyChallengedUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.languagePhysicallyChallenged, this.schemeData.reservation.languagePhysicallyChallengedSoldUnits);

          // this.schemeData.tnhbEmployeesUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.tnhbEmployees, this.schemeData.reservation.tnhbEmployeesSoldUnits);
          // this.schemeData.tnhbPhysicallyChallengedUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.tnhbPhysicallyChallenged, this.schemeData.reservation.tnhbPhysicallyChallengedSoldUnits);

          // this.schemeData.generalPublicUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.generalPublic, this.schemeData.reservation.generalPublicSoldUnits);
          // this.schemeData.generalPublicArtistUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.generalPublicArtist, this.schemeData.reservation.generalPublicArtistsSoldUnits);
          // this.schemeData.generalPublicPhysicallyChallengedUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.generalPublicPhysicallyChallenged, this.schemeData.reservation.generalPublicPhysicallyChallengedSoldUnits);
          // this.schemeData.generalPublicPoliticalSufferersUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.generalPublicPoliticalSufferers, this.schemeData.reservation.generalPublicPoliticalSufferersSsoldUnits);


          // this.schemeData.workingJournalistUnsoldUnits = this.calculateUnsoldUnits(this.schemeData.reservation.workingJournalist, this.schemeData.reservation.workingJournalistSoldUnits);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  calculateUnsoldUnits(totalUnits: any, soldUnits: any): number {
    // Log input values for debugging
    console.log("totalUnits:", totalUnits);
    console.log("soldUnits:", soldUnits);

    // Convert inputs to numbers, defaulting to 0 if conversion fails
    const total = parseFloat(totalUnits) || 0;
    const sold = parseFloat(soldUnits) || 0;

    // Calculate unsold units
    const unsold = total - sold;

    // Return the result
    return unsold;
  }


  setSharedData(data: any) {
    debugger
    const sharedData = {
      ...data,
      schemeId: this.schemeId
    }
    sessionStorage.setItem('reservationId', data.id);
    this.reservationService.setSharedData(sharedData);
    this.router.navigate(['/booking-status'], { queryParams: { schemeId: this.schemeId } });
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
  goToAminitiesDetails(data: any) {
    debugger
    const sharedData = {
      ...data,
      schemeId: this.schemeId
    }
    sessionStorage.setItem('reservationId', data.id);
    this.reservationService.setSharedData(sharedData);
    this.router.navigate(['/view-scheme'], { queryParams: { schemeId: this.schemeId } });

  }
  transform(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }



}
