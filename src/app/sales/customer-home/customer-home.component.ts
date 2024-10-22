import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer-home.component.html',
  styleUrl: './customer-home.component.scss'
})
export class CustomerHomeComponent {

  firstname: any;

  constructor(private title: Title) {

  }

  ngOnInit() {
    this.title.setTitle('Customer Home');
    this.firstname = sessionStorage.getItem('firstname');
  }

}
