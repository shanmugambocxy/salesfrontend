import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reloadpage',
  standalone: true,
  imports: [],
  templateUrl: './reloadpage.component.html',
  styleUrl: './reloadpage.component.scss'
})
export class ReloadpageComponent {

  constructor(private router: Router) {

  }


  ngOnInit(): void {
    debugger
    this.router.navigateByUrl('');

  }

}
