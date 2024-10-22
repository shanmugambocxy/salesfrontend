import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {

  private visibilitySubject = new Subject<boolean>();
  visibility$ = this.visibilitySubject.asObservable();

  show(): void {
    this.visibilitySubject.next(true);
  }

  hide(): void {
    this.visibilitySubject.next(false);
  }
}
