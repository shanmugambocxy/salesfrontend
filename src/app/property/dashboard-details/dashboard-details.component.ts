import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-dashboard-details',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard-details.component.html',
  styleUrl: './dashboard-details.component.scss'
})
export class DashboardDetailsComponent {
  displayedColumns: string[] = ['sno', 'description', 'noofunits', 'flat', 'house', 'plot',];
  dataSource = new MatTableDataSource<any>([]);
  divisionWiseDataList: any = []
  schemeWiseData: any = [];
  selectedData: any;
  divisionList: any = [];
  divisionWiseData: any = [];
  typeWiseDashboardData: any = '';
  totalTypeWiseData: any = 0;
  isDivision: boolean = false;
  divisionName: any = "";

  constructor(private location: Location, private router: Router, private http: HttpClient, private propertyService: PropertyService) {

    let getSelectedData = sessionStorage.getItem('selectedData');
    this.selectedData = getSelectedData ? JSON.parse(getSelectedData) : ''
    debugger

    this.getDashboardTypeWiseData()
  }
  ngOnInit(): void {
    this.getDivisionList();
  }
  back() {
    // this.location.back();
    this.router.navigateByUrl('employee/dashboard-officer')
  }

  getDivisionList() {
    debugger
    this.http.get('https://personnelapi.tnhb.in/getAllDivisionCode').subscribe((res: any) => {
      if (res && res.data) {
        this.divisionList = res.data.filter((x: any) => x != '');
        console.log(' this.divisionList', this.divisionList);

        this.divisionWiseData = this.divisionList.map((x: any) => x.divisionName);

        console.log('this.divisionWiseData ', this.divisionWiseData);
        let data = {
          "divisionNames": this.divisionWiseData,
          "userType": this.selectedData.keyWord
        }
        if (this.selectedData.division == "ALL") {
          this.isDivision = true;
          this.propertyService.dashBoardDivisionwiseCount(data).subscribe((res: any) => {
            if (res.length > 0) {
              this.dataSource.data = res;
              this.divisionWiseDataList = res;
            } else {
              this.dataSource.data = [];
              this.divisionWiseDataList = [];
            }
          })
        } else {
          this.isDivision = false;
          let divisionData = this.divisionList.filter((x: any) => x.divisionCode == this.selectedData.division);
          let divisionName = divisionData.length > 0 ? divisionData[0].divisionName : '';
          this.divisionName = divisionName;
          let data =
          {
            "divisionNames": [
              divisionName
            ],
            "userType": this.selectedData.keyWord
          }
          this.propertyService.dashBoardSchemewiseCount(data).subscribe(res => {
            if (res) {
              this.schemeWiseData = res;
            }
          })
        }


      } else {
        this.divisionList = [];

      }
    })
  }

  getDashboardTypeWiseData() {
    this.propertyService.dashBoardTypewiseCount(this.selectedData.keyWord).subscribe((res: any) => {
      if (res.length > 0) {
        this.typeWiseDashboardData = res[0];
        this.totalTypeWiseData = this.typeWiseDashboardData.higCount + this.typeWiseDashboardData.migCount + this.typeWiseDashboardData.ligCounnt + this.typeWiseDashboardData.ewsCount
      } else {
        this.typeWiseDashboardData = "";
        this.totalTypeWiseData = 0;
      }
    })
  }

  gotoPage(data: any, division: any) {
    debugger
    sessionStorage.setItem('unitType', data);
    sessionStorage.setItem('division', division)
    switch (this.selectedData.keyWord) {
      case 'TotalUnits':
        this.router.navigateByUrl('employee/TotalUnits');
        break
      case 'UnsoldUnits':
        this.router.navigateByUrl('employee/unsoldstocks');

        break
      case 'AllottedUnits':
        this.router.navigateByUrl('employee/allotmentorder');


        break;
      case 'SaledeedIssued':

        this.router.navigateByUrl('employee/saledeed_executed');

        break;
      case 'SaledeedToBeIssued':
        this.router.navigateByUrl('employee/saledeed_tobeissued');

        break;
      case 'FullCostNotPaid':

        this.router.navigateByUrl('employee/fullcostnotpaid');


        break;
      case 'FullCostPaid':

        this.router.navigateByUrl('employee/fullcostpaid');

        break;
      case 'OutstandingDue':
        this.router.navigateByUrl('employee/outstandingdue');

        break;

      case 'DraftSaledeedIssued':
        this.router.navigateByUrl('employee/draftsaledeed_generated');

        break;
      case 'DraftSaledeedToBeIssued':
        this.router.navigateByUrl('employee/draftsaledeed_generate');

        break;
      case 'Verification':


        this.router.navigateByUrl('employee/pending-applications');

        break;
      case 'notbroughtintosale':


        this.router.navigateByUrl('employee/notbroughtintosale');

        break;
      case 'openforFCFS':


        this.router.navigateByUrl('employee/openforFCFS');

        break;

      case 'ApplicationInvitingforLOT':


        this.router.navigateByUrl('employee/applicationinvitingforLOT');

        break;


      default:
        break;
    }

  }

  gotoPagebyScheme(data: any, scheme: any) {
    sessionStorage.setItem('unitType', data);
    sessionStorage.setItem('division', this.divisionName)
    sessionStorage.setItem('scheme', scheme)
    switch (this.selectedData.keyWord) {
      case 'TotalUnits':
        this.router.navigateByUrl('employee/TotalUnits');
        break
      case 'UnsoldUnits':
        this.router.navigateByUrl('employee/unsoldstocks');

        break
      case 'AllottedUnits':
        this.router.navigateByUrl('employee/allotmentorder');


        break;
      case 'SaledeedIssued':
        break;
      case 'SaledeedToBeIssued':
        break;
      case 'FullCostNotPaid':
        break;
      case 'FullCostPaid':
        break;
      case 'HandingOverIssued':
        break;
      case 'HandingOverToBeIssued':
        break;
      case 'DraftSaledeedIssued':
        break;
      case 'DraftSaledeedToBeIssued':
        break;
      case 'Verification':
        break;

      default:
        break;
    }

  }

}
