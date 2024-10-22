import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
// import { Stomp } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StompserviceService {
  // private stompClient: any;
  // private unitDataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  // constructor() {

  //   this.initializeWebSocketConnection();
  // }

  // private initializeWebSocketConnection(): void {
  //   const serverUrl = 'http://localhost:8080/socket.io';
  //   const ws = new SockJS(serverUrl);
  //   this.stompClient = Stomp.over(ws);

  //   const that = this;
  //   this.stompClient.connect({}, function (frame: any) {
  //     that.stompClient.subscribe('/topic/unitData', (message: any) => {
  //       if (message.body) {
  //         const unitData = JSON.parse(message.body);
  //         const currentData = that.unitDataSubject.value;
  //         that.unitDataSubject.next([...currentData, unitData]);
  //       }
  //     });
  //   });
  // }

  // public getUnitData(): Observable<any[]> {
  //   return this.unitDataSubject.asObservable();
  // }

  // public sendMessage(data: any): void {
  //   this.stompClient.send('/app/sendData', {}, JSON.stringify(data));
  // }
}
