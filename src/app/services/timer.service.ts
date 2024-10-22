import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

interface IInterval {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private countdownSubject: BehaviorSubject<IInterval> = new BehaviorSubject<IInterval>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  getCountDown(timeToGo: number): Observable<IInterval> {
    const currentTime = Date.now();
    const timeDiff = timeToGo - currentTime;

    return timer(0, 1000).pipe(
      map(() => this.getIntervalTime(timeToGo, Date.now())),
      takeWhile(interval => interval.seconds >= 0),
    );
  }

  private getIntervalTime(timeToGo: number, currentTime: number): IInterval {
    const timeDiff = timeToGo - currentTime;
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return {
      days,
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60,
    };
  }
}
