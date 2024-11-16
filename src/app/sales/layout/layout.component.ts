import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class SalesLayoutComponent implements OnDestroy {
  username: any = '';
  role: any;
  mobileQuery: MediaQueryList;
  navData = [{
    routeLink: 'office-data/list-head-office',
    icon: 'apartment',
    label: 'Office Data',
    subItems: [
      { routeLink: 'office-data/list-head-office', icon: 'assessment', label: 'Head Office' },
      { routeLink: 'office-data/list-circle-office', icon: 'assessment', label: 'Circle Office' },
      { routeLink: 'office-data/list-division-office', icon: 'assessment', label: 'Division Office' },

    ]
  },]
  @Output() onToogleSideNav: EventEmitter<SideNavToggle> = new EventEmitter
  subMenu: string = '';
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toast: ToastService,
    private dialog: MatDialog,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    let subItem = localStorage.getItem('subItem');
    this.subMenu = subItem ? subItem : '';
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

  logout() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Logout',
        message: `Are you sure you want to Logout?`
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let customerId = sessionStorage.getItem('customerId');
        debugger
        sessionStorage.clear();
        this.authService.customerLogout(customerId).subscribe((res: any) => {
          if (res.message) {
            sessionStorage.clear();
            this.router.navigate(['customer-allottee-login']);
            this.toast.showToast('warning', " Logout Successfully.", "")

          }
        })
      }
    })

  }


}
