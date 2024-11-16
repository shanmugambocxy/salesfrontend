import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SharedModule } from '../../shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnDestroy {
  username: any = '';
  role: any;
  mobileQuery: MediaQueryList;
  subMenu: string = '';
  mainMenu: string = '';


  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    let subItem = localStorage.getItem('subItem');
    this.subMenu = subItem ? subItem : '';
    let mainItem = localStorage.getItem('mainMenu');
    this.mainMenu = mainItem ? mainItem : '';
  }

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    this.role = sessionStorage.getItem('role');
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);

  toggleDropdown() {
    var dropdownMenu = document.getElementById("dropdownMenu");
    if (dropdownMenu) {
      dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
    }
  }
  toggleSubMenu(menuName: string) {
    this.subMenu = this.subMenu === menuName ? '' : menuName;
    localStorage.setItem('subItem', menuName)

  }
  toggleMainMenu(menuName: string) {
    this.mainMenu = this.mainMenu === menuName ? '' : menuName;
    localStorage.setItem('mainMenu', menuName)

  }

  goToDashboard() {
    this.router.navigateByUrl('//employee/dashboard-officer');
    this.subMenu = "";
    this.mainMenu = "Dashboard";
  }
  logout() {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Logout',
        message: 'Are you sure to Logout?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        sessionStorage.clear();
        localStorage.clear();
        // window.location.reload();
        this.router.navigateByUrl('/officer-login');
      }
    })


  }
}