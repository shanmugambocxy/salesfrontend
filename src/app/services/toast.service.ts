import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) { }

  showToast(type: string, message: string, title: string) {
    const toastConfig = {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
      tapToDismiss: false
    };

    switch (type) {
      case 'success':
        this.toastr.success(message, title, toastConfig);
        break;
      case 'warning':
        this.toastr.warning(message, title, toastConfig);
        break;
      case 'info':
        this.toastr.warning(message, title, toastConfig);
        break;
      default:
        this.toastr.error(message, title, toastConfig);
        break;
    }
  }
}
