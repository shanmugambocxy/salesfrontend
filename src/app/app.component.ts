import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { ProgressBarService } from './services/progress-bar.service';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SharedModule, NgxUiLoaderModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private router: Router, public progressBarService: ProgressBarService, private location: Location) {
    this.router.events.subscribe((event: any) => {
      switch (true) {
        case event instanceof NavigationStart: {
          setTimeout(() => {
            this.progressBarService.show();
          });
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          setTimeout(() => {
            this.progressBarService.hide();
          });
          break;
        }
        default: {
          break;
        }
      }
    });


  }
  ngOnInit() {
    debugger
    // let role = sessionStorage.getItem('role');
    // let alloteStatus = sessionStorage.getItem('allottmentStatus');
    // if (role && role == 'Customer') {
    //   if (alloteStatus == "No") {
    //     this.router.navigate([''])
    //   } else {
    //     this.router.navigate(['/customer/customer_dashboard'])

    //   }
    // } else if (role == 'AE' || role == 'AEE' || role == 'Surveyor') {
    //   this.router.navigate(['/employee/handingover_generate']);

    // } else {
    //   this.router.navigate(['/employee/all-schemes']);

    // }
    let getToken = sessionStorage.getItem('token');
    // if (!getToken) {
    //   this.router.navigateByUrl('all-schemes');
    // }
  }
}
