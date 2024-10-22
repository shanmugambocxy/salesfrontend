import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-common',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './common.component.html',
  styleUrl: './common.component.scss'
})
export class CommonComponent {
  constructor(private router: Router) {
    setTimeout(() => {
      this.router.navigateByUrl('customer/paymentSuccess');
    }, 500);
  }
}
