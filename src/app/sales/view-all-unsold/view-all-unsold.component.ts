import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CustomerHeaderComponent } from '../customer-header/customer-header.component';
import { SalesService } from '../../services/sales.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-all-unsold',
  standalone: true,
  imports: [SharedModule, CustomerHeaderComponent],
  templateUrl: './view-all-unsold.component.html',
  styleUrl: './view-all-unsold.component.scss'
})
export class ViewAllUnsoldComponent {
  schemeId: any;
  bookingDataAllSchemes: any;
  schemeName: any;
  searchText = '';
  filteredData: any;
  selectedCircle: string = 'Select Circle';
  selectedDivision: string = 'Select Division';
  selectedDistrict: string = 'Select District';
  selectedUnitType: string = 'Select Unit Type';

  uniqueCircles: any[] = [];
  uniqueDivisions: any[] = [];
  uniqueDistricts: any[] = [];

  constructor(
    private salesService: SalesService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.schemeId = this.route.snapshot.paramMap.get('id');
    this.fetchBookingData(); // Call the method to fetch data when the component initializes
  }

  fetchBookingData() {
    const id = {
      id: 1
    };
    // this.salesService.fetchBookingDataAllSchemes(id).subscribe(
    //   (response) => {
    //     this.bookingDataAllSchemes = response.data;
    //     this.filteredData = this.bookingDataAllSchemes;
    //     console.log(this.bookingDataAllSchemes);
    //     this.getUniqueData();
    //   },
    //   (error) => {
    //     console.error('Error fetching booking data:', error);
    //   }
    // );
  }

  getButtonStyle(status: string) {
    let backgroundColor = '';
    let textColor = 'white'; // Set the text color to white

    switch (status) {
      case 'No':
        backgroundColor = 'green';
        break;
      case 'Pending':
        backgroundColor = '#F0DE36';
        break;
      default:
        backgroundColor = 'transparent'; // Default background color
        break;
    }

    return { 'background-color': backgroundColor, 'color': textColor };
  }

  filterData() {
    this.filteredData = this.bookingDataAllSchemes.filter((item: { [s: string]: unknown; } | ArrayLike<unknown>) => {
      // Convert all properties to lowercase for case-insensitive search
      const itemValues = Object.values(item).join(' ').toLowerCase();
      return itemValues.includes(this.searchText.toLowerCase());
    });
  }

  filterDataByUnitType() {
    if (this.selectedUnitType === 'Select Unit Type') {
      this.filteredData = this.bookingDataAllSchemes;
    } else {
      this.filteredData = this.bookingDataAllSchemes.filter((item: { unitType: string; }) => item.unitType === this.selectedUnitType);
    }
  }

  getUniqueData() {
    const uniqueDistricts = [...new Set(this.bookingDataAllSchemes.map((item: { District: any; }) => item.District))];
    this.uniqueDistricts = uniqueDistricts.filter(district => district !== undefined && district !== null);
    console.log("Districts", this.uniqueDistricts);

    const uniqueCircles = [...new Set(this.bookingDataAllSchemes.map((item: { Circle: any; }) => item.Circle))];
    this.uniqueCircles = uniqueCircles.filter(circle => circle !== undefined && circle !== null);
    console.log("Circles", this.uniqueCircles);

    const uniqueDivisions = [...new Set(this.bookingDataAllSchemes.map((item: { Division: any; }) => item.Division))];
    this.uniqueDivisions = uniqueDivisions.filter(division => division !== undefined && division !== null);
    console.log("Divisions", this.uniqueDivisions);
  }



}