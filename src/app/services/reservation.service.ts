import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private baseUrl = environment.apiURL;

  token = sessionStorage.getItem('token');
  headers = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
  };

  constructor(private httpClient: HttpClient) { }

  setSharedData(data: any) {
    sessionStorage.setItem('sharedData', JSON.stringify(data));
  }

  getSharedData() {
    const data = sessionStorage.getItem('sharedData');
    return data ? JSON.parse(data) : null;
  }

  clearSharedData() {
    sessionStorage.removeItem('sharedData');
  }

  getReservationById(id: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/reservation/getById/${id}`, this.headers);
  }
}
