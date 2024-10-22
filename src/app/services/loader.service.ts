import { Injectable, inject } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private ngxLoader: NgxUiLoaderService = inject(NgxUiLoaderService);

  startLoader() {
    this.ngxLoader.start();
  }

  stopLoader() {
    this.ngxLoader.stop();
  }
}
