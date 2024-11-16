import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SharedModule } from './shared/shared.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { httpInterceptor } from './services/http.interceptor';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { authtokenInterceptor } from './services/authtoken.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([httpInterceptor])),
    provideToastr(),
    NgxUiLoaderService,
    SharedModule,
    provideHttpClient(withInterceptors([authtokenInterceptor])),
  ]
};
