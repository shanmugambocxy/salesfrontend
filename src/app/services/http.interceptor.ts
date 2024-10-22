import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { ProgressBarService } from './progress-bar.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoaderService } from './loader.service';

export const httpInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const loaderService = inject(LoaderService);
  loaderService.startLoader();

  return next(req).pipe(finalize(() => loaderService.stopLoader()));
};
