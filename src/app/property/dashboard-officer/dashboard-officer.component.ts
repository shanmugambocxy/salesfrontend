import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-dashboard-officer',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard-officer.component.html',
  styleUrl: './dashboard-officer.component.scss'
})
export class DashboardOfficerComponent implements OnInit {
  districts = [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kancheepuram",
    "Kanniyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivagangai",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thiruvallur",
    "Thiruvarur",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvannamalai",
    "Vellore",
    "Villuppuram",
    "Virudhunagar"
  ];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  barchartDatasets: any = [];

  public barChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  applicantCount: any = []
  totalSalesCount: any = [];
  @ViewChild('customersChart') customersChart!: ElementRef;
  barChart!: Chart;  // Chart instance
  pieCharts: any = Chart; // To store the chart instance
  pieChart: any = Chart;
  selectDivision: any = "ALL";
  divisionList: any = [];
  selectSchemeType: any = "ALL";
  originalDataList: any = [];
  selectScheme: any = "ALL";
  selectedDateFrom: any;
  selectedDateTo: any;
  schemeNameList: any = [];
  selectTypeofHouse: any = "ALL";
  selectDivisionWithCode: any = "ALL";
  divisionWiseData: any = [];
  allDashboardCount: any;
  allScheme: any;
  allSchemeData: any = [];
  schemeList: any = [];
  constructor(
    private http: HttpClient,
    private router: Router,
    private propertyService: PropertyService
  ) {
  }
  ngOnInit(): void {

    this.barchartDatasets = [
      {
        barThickness: 10,
        barPercentage: 0.5,
        label: 'Total Allotted Units',
        data: this.applicantCount,
        backgroundColor: '#42B6CA',
      },
      {
        barThickness: 10,
        barPercentage: 0.5,
        label: 'Total Unsold Units',
        data: this.totalSalesCount,
        backgroundColor: '#2D3079',
      },
    ]
    // this.linechart();
    // this.pieChart();
    // this.createPieChart();
    this.getDivisionList();
    this.getDashboardCount();
    this.getAllScheme();

  }

  getDashboardCount() {
    let divisionName = this.selectDivisionWithCode == "ALL" ? null : this.selectDivisionWithCode;
    let schemeName = this.selectScheme == "ALL" ? null : this.selectScheme;
    let type = this.selectSchemeType == "ALL" ? null : this.selectSchemeType;
    let unitType = this.selectTypeofHouse == "ALL" ? null : this.selectTypeofHouse;
    debugger


    let data = {
      "divisionName": divisionName,
      "schemeName": schemeName,
      "type": type,
      "unitType": unitType
    }
    this.propertyService.dashboardCount(data).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.allDashboardCount = res[0];
      } else {
        this.allDashboardCount = ''
      }
    })
  }

  getAllScheme() {
    this.propertyService.getAllSchemes().subscribe((res: any) => {
      if (res) {
        this.allSchemeData = res.responseObject;
        this.schemeList = this.allSchemeData.map((x: any) => x.schemeName)


      }
    })
  }

  getbarChart() {

  }


  barchart() {
    debugger
    const canvas = document.getElementById('stylistPerformanceChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    // let staffName = this.allStylistList.map(data => data.first_name);
    // let billCount = this.allStylistList.map(data => data.Billcount);
    // let totalAmount = this.allStylistList.map(data => data.serviceAndProductTotal);



    if (ctx) {
      const chartConfig: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels: this.divisionWiseData,
          datasets: this.barchartDatasets
          // datasets: [
          //   {
          //     barThickness: 10,
          //     barPercentage: 0.5,
          //     label: 'Applicant Count',
          //     data: this.applicantCount,
          //     backgroundColor: '#42B6CA',
          //   },
          //   {
          //     barThickness: 10,
          //     barPercentage: 0.5,
          //     label: 'Sales Count',
          //     data: this.totalSalesCount,
          //     backgroundColor: '#2D3079',
          //   },
          // ],
        },
        options: {
          // responsive: true,
          // maintainAspectRatio: false,
          scales: {
            x: {
              stacked: false,
            },
            y: {
              stacked: false,

            },

          },
          plugins: {
            datalabels: {
              formatter: (value, ctx) => value.toFixed(2) + '%', // Format the value to show percentage
              color: '#fff',
              font: {
                weight: 'bold',
                size: 14,
              }
            }
          },

        },

      };


      this.barChart = new Chart(ctx, chartConfig);
    }
  }

  linechart() {
    var chrt = document.getElementById("chartId") as HTMLCanvasElement;
    var chartId = new Chart(chrt, {
      type: 'line',
      data: {
        labels: ["Chennai", "Ariyalur", "Chengalpattu", "Cuddalore", "Dharmapuri", "Erode"],
        datasets: [{
          label: "online tutorial subjects",
          data: [20, 40, 30, 35, 30, 20],
          backgroundColor: ['yellow', 'aqua', 'pink', 'lightgreen', 'lightblue', 'gold'],
          borderColor: ['black'],
          borderWidth: 2,
          pointRadius: 5,
        }],
      },
      options: {
        responsive: true,
      },
    });

  }

  // pieChart() {
  //   var chrt = document.getElementById("piechart") as HTMLCanvasElement;
  //   // var piechart = new Chart(chrt, {
  //   this.pieCharts = new Chart(chrt, {

  //     type: 'pie',
  //     data: {
  //       labels: ["HTML", "CSS", "JAVASCRIPT", "CHART.JS", "JQUERY", "BOOTSTRP"],
  //       datasets: [{
  //         label: "online tutorial subjects",
  //         data: [20, 40, 13, 35, 20, 38],
  //         backgroundColor: ['yellow', 'aqua', 'pink', 'lightgreen', 'gold', 'lightblue'],
  //         hoverOffset: 5
  //       }],
  //     },
  //     options: {
  //       responsive: true,
  //     },
  //   });
  // }
  getDivisionList() {

    this.http.get('https://personnelapi.tnhb.in/getAllDivisionCode').subscribe((res: any) => {
      if (res && res.data) {
        this.divisionList = res.data.filter((x: any) => x != '');
        console.log(' this.divisionList', this.divisionList);

        this.divisionWiseData = this.divisionList.map((x: any) => x.divisionName);
        console.log('this.divisionWiseData ', this.divisionWiseData);
        this.barchart();

      } else {
        this.divisionList = [];

      }
    })
  }

  createPieChart() {

    const canvas = document.getElementById('piechart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    // let staffName = this.allStylistList.map(data => data.first_name);
    // let billCount = this.allStylistList.map(data => data.Billcount);
    // let totalAmount = this.allStylistList.map(data => data.serviceAndProductTotal);


    let billCount = [10, 20, 30]
    let totalAmount: any = [200, 300, 400];
    if (ctx) {


      const chartConfig: ChartConfiguration<'pie'> = {
        type: 'pie',
        data: {
          labels: ["HIG", "MIG", "LIG", "EWS", "SHIG", "CMR"],
          datasets: [{
            label: "Online Tutorial Subjects",
            data: [20, 40, 13, 35, 20, 38],
            backgroundColor: ['yellow', 'aqua', 'pink', 'lightgreen', 'gold', 'lightblue'],
            hoverOffset: 5
          }],
        },
        options: {
          responsive: true,
          plugins: {
            datalabels: {
              formatter: (value, ctx) => {
                const total: any = ctx.chart.data.datasets[0].data.reduce((acc: any, val: any) => acc + val, 0);
                const percentage = (value / total * 100).toFixed(2) + "%"; // Percentage calculation
                return percentage;
              },
              color: '#fff',
              font: {
                weight: 'bold',
                size: 14,
              }
            }
          }
        },
        // plugins: []

      };


      this.pieChart = new Chart(ctx, chartConfig);
    }






    // if (ctx) {
    //   this.pieChart = new Chart(ctx, {
    //     type: 'pie',
    //     data: {
    //       labels: ["HTML", "CSS", "JAVASCRIPT", "CHART.JS", "JQUERY", "BOOTSTRP"],
    //       datasets: [{
    //         label: "Online Tutorial Subjects",
    //         data: [20, 40, 13, 35, 20, 38],
    //         backgroundColor: ['yellow', 'aqua', 'pink', 'lightgreen', 'gold', 'lightblue'],
    //         hoverOffset: 5
    //       }],
    //     },
    //     options: {
    //       responsive: true,
    //     },
    //   });
    // }
  }
  changeType(event: any) {
    debugger
    let billCount = [10, 20, 30]
    let totalAmount: any = [200, 300, 400];

    this.applicantCount = [10, 20, 30];
    this.totalSalesCount = [200, 300, 400];
    // this.barchartDatasets = [
    //   {
    //     barThickness: 10,
    //     barPercentage: 0.5,
    //     label: 'Applicant Count',
    //     data: this.applicantCount,
    //     backgroundColor: '#42B6CA',
    //   },
    //   {
    //     barThickness: 10,
    //     barPercentage: 0.5,
    //     label: 'Sales Count',
    //     data: this.totalSalesCount,
    //     backgroundColor: '#2D3079',
    //   },
    // ]

    if (this.barChart) {
      this.barChart.destroy();
      this.barChart.data.labels = this.districts;  // Update chart labels
      this.barChart.data.datasets[0].data = this.applicantCount;  // Update first dataset
      this.barChart.data.datasets[1].data = this.totalSalesCount;  // Update second dataset
      // this.barChart.update();  // Call chart update method to re-render
    }
    this.barchart();
    // this.pieCharts.data.labels = this.districts;



    if (event.value == "Flat") {
      if (this.pieChart) {
        // this.pieChart.destroy();
        this.pieChart.data.labels = ["HIG", "MIG", "LIG", "EWS", "SHIG", "CMR"] // Update the labels
        this.pieChart.data.datasets[0].data = [20, 40, 50, 60, 15, 35]; // Update the data


        this.pieChart.update(); // Refresh the chart6
      }
      // this.createPieChart();
    } else {
      if (this.pieChart) {
        // this.pieChart.destroy();
        this.pieChart.data.labels = ["HIG", "MIG", "LIG", "EWS"] // Update the labels
        this.pieChart.data.datasets[0].data = [20, 40, 13]; // Update the data


        this.pieChart.update(); // Refresh the chart
        this.createPieChart();
      }
      this.createPieChart();
    }

  }

  applyFilterByOptions() {
    debugger



    let checkDivision = this.divisionList.filter((x: any) => x.divisionCode == this.selectDivision);
    if (checkDivision.length > 0) {
      this.selectDivisionWithCode = checkDivision[0].divisionName
    } else {
      this.selectDivisionWithCode = "ALL"
    }
    if (this.selectDivisionWithCode == "ALL") {
      this.schemeList = this.allSchemeData.map((x: any) => x.schemeName)
    } else {
      this.schemeList = this.allSchemeData.filter((x: any) => x.nameOfTheDivision == this.selectDivisionWithCode).map((x: any) => x.schemeName)
    }
    this.getDashboardCount();
    this.applicantCount = [10, 20, 30];
    this.totalSalesCount = [200, 300, 400];
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart.data.labels = this.districts;  // Update chart labels
      this.barChart.data.datasets[0].data = this.applicantCount;  // Update first dataset
      this.barChart.data.datasets[1].data = this.totalSalesCount;  // Update second dataset
      // this.barChart.update();  // Call chart update method to re-render
    }
    this.barchart();
    // if (this.selectDivision && this.selectScheme && this.selectSchemeType && this.selectedDate) {
    //   this.dataSource.data = this.originalDataList.filter((x: any) => x.schemeData.divisionCode == this.selectDivision && x.schemeData.schemeName == this.selectScheme && x.schemeData.schemeType == this.selectSchemeType && x.creationDate)
    // }
    // let filteredData = this.originalDataList;
    // if (this.selectDivision == "ALL" || !this.selectDivision) {
    //   filteredData = this.originalDataList;
    // } else {
    //   filteredData = filteredData.filter((x: any) => x.schemeData.divisionCode == this.selectDivision)

    // }
    // if (this.selectScheme) {
    //   filteredData = filteredData.filter((x: any) => x.schemeData?.schemeName == this.selectScheme)
    // }
    // if (this.selectSchemeType) {
    //   filteredData = filteredData.filter((x: any) => x.schemeData?.schemeType == this.selectSchemeType)
    // }
    // if (this.selectTypeofHouse) {
    //   filteredData = filteredData.filter((x: any) => x.schemeData?.unitType == this.selectTypeofHouse)

    // }

    // if (this.selectedDateFrom && this.selectedDateTo) {
    //   filteredData = filteredData.filter((x: any) => {
    //     const formattedDate = x?.createdDateTime ? this.datePipe.transform(new Date(x?.createdDateTime), 'yyyy-MM-dd') : x?.createdDateTime;
    //     return formattedDate >= this.selectedDateFrom && formattedDate <= this.selectedDateTo;
    //   })

    // }
    // // if (this.selectedDateTo) {
    // //   filteredData = filteredData.filter((x: any) => {
    // //     const formattedDate = x?.createdDateTime ? this.datePipe.transform(new Date(x?.createdDateTime), 'yyyy-MM-dd') : x?.createdDateTime;
    // //     return formattedDate === this.selectedDateTo;
    // //   })
    // // }
    // this.dataSource.data = filteredData;
  }

  clearFilter() {

    this.selectDivision = "ALL";
    this.selectDivisionWithCode = "ALL";
    this.selectScheme = "ALL"
    this.selectSchemeType = "ALL";
    this.selectTypeofHouse = "ALL";
    this.getDashboardCount();
  }

  gotoPage(type: any, value: any, keyWord: any) {
    // if (type == "Scheme") {
    //   this.router.navigateByUrl('employee/all-schemes')
    // } else if (type == "Allotment") {
    //   this.router.navigateByUrl('employee/allotmentorder')

    // } else if (type == "unsold") {
    //   this.router.navigateByUrl('employee/unsoldstocks')


    // } else if (type == "Total Units") {
    //   let data = {
    //     countType: type,
    //     division: this.selectDivision,
    //     scheme: this.selectScheme,
    //     type: this.selectSchemeType,
    //     unitType: this.selectTypeofHouse
    //   }
    //   this.router.navigate(['/employee/dashboard-details'], {

    //     state: {
    //       selectedData: data
    //     }
    //   });
    // }


    let data = {
      countType: type,
      countValue: value,
      division: this.selectDivision,
      scheme: this.selectScheme,
      type: this.selectSchemeType,
      unitType: this.selectTypeofHouse,
      keyWord: keyWord
    }
    sessionStorage.setItem('selectedData', JSON.stringify(data))
    this.router.navigate(['/employee/dashboard-details']);
  }
}
