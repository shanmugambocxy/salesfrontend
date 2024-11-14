import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-payment-failure',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './payment-failure.component.html',
  styleUrl: './payment-failure.component.scss'
})
export class PaymentFailureComponent {
  status: any = ''
  constructor(private router: Router, private route: ActivatedRoute,
  ) {

    this.route.queryParams.subscribe(params => {

      this.status = params['status'] ? params['status'] : "";
    })

  }




  goToApplicationHistory() {
    // this.router.navigateByUrl('customer/application-history')
    this.router.navigateByUrl('customer/home')

  }
}
