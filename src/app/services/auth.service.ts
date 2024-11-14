import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private targetUrl: string | null = null;
  private baseURL = environment.apiURL;
  token = sessionStorage.getItem('token');
  constructor(private httpClient: HttpClient) { }

  authenticate(data: any) {
    return this.httpClient.post<any>(`${this.baseURL}/api/auth/signIn`, data);
  }

  //Forgot Password for Officer
  officerSendOtp(username: any) {
    return this.httpClient.post<any>(`${this.baseURL}/api/auth/forgotPassword?username=${username}`, {});
  }

  resetPasswordForOfficer(data: any) {
    return this.httpClient.post<any>(`${this.baseURL}/api/auth/resetPasswordToken`, data);
  }

  //Customer Login and Register
  sentOtpToCustomer(data: any) {
    return this.httpClient.post<any>(`${this.baseURL}/api/customer/create`, data);
  }
  resendOtp(email: any) {
    return this.httpClient.post<any>(`${this.baseURL}/api/customer/resend-otp?email=${email}`, {});

  }

  customerOtpVerification(data: any) {
    return this.httpClient.post<any>(`${this.baseURL}/api/customer/verify`, data);
  }

  rendOtp(data: any) {
    return this.httpClient.post<any>(`${this.baseURL}/api/customer/resend-otp`, data);
  }

  customerLogin(data: any) {
    return this.httpClient.post<any>(`${this.baseURL}/api/customer/signIn`, data);
  }

  //sales
  getToken() {
    return sessionStorage.getItem('token');
  }

  setTargetUrl(url: string): void {
    this.targetUrl = url;
  }

  clearTargetUrl(): void {
    this.targetUrl = null; // You can set it to null or an empty string
  }

  getTargetUrl(): string | null {
    return this.targetUrl;
  }


  //Login state
  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  login() {
    this.loggedIn.next(true);
  }

  logout() {
    this.loggedIn.next(false);
  }


  customerLogout(customerID: any) {


    return this.httpClient.post(`${this.baseURL}/api/customer/logout?userId=${customerID}`, {}, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'
        'Content-Type': 'application/json',


      })
    });

  }
  createRegistration(data: any) {

    return this.httpClient.post(`${this.baseURL}/api/accountVerify/create`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'
        'Content-Type': 'application/json',


      })
    });

  }

  verifyOTP(data: any) {

    return this.httpClient.post(`${this.baseURL}/api/accountVerify/verify`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'
        'Content-Type': 'application/json',


      })
    });

  }
  resendOTP(data: any) {

    return this.httpClient.post(`${this.baseURL}/api/accountVerify/resend-otp`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'
        'Content-Type': 'application/json',


      })
    });

  }

}
