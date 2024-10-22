import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { io, Socket } from 'socket.io-client';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';


@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  // private socket!: Socket;

  private socket$!: WebSocketSubject<any>;


  constructor() {

    // this.socket = io('http://localhost:3000'); // Replace with your backend URL
    // this.socket = io('http://localhost:8085'); // Replace with your backend URL

    // this.connect();


  }


  // Method to listen to an event from the server
  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      // this.socket.on(eventName, (data) => {
      //   subscriber.next(data);
      // });
    });
  }

  // Method to emit an event to the server
  emit(eventName: string, data: any) {
    // this.socket.emit(eventName, data);
  }

  // Close the connection
  disconnect() {
    // this.socket.disconnect();
  }




  private connect(): void {
    // this.socket$ = webSocket('ws://localhost:8080/ws');
    this.socket$ = webSocket('ws://localhost:8080/topic/unitData');

    // WebSocket URL (Spring Boot server)
  }

  // Send a message to the server
  public sendMessage(message: any): void {
    this.socket$.next(message);
  }

  // Listen to messages from the WebSocket server
  public onMessage(): Observable<any> {
    return this.socket$.asObservable();
  }

  // Close the WebSocket connection
  public close(): void {
    this.socket$.complete();
  }

}
