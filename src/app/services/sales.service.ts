import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private baseUrl = environment.apiURL;

  token = sessionStorage.getItem('token');
  headers = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',

    })
  };

  constructor(private httpClient: HttpClient) { }

  getAllSchemes(): Observable<any> {
    const encodedStatus = encodeURIComponent("Yes");
    return this.httpClient.get(`${this.baseUrl}/api/getSchemeDataByPublishedStatus?publishedStatus=${encodedStatus}`, this.headers);
  }

  getAllSchemesByUnitType(type: any): Observable<any> {
    const encodedType = encodeURIComponent(type);
    const encodedStatus = encodeURIComponent("Yes");
    return this.httpClient.get(`${this.baseUrl}/api/getSchemeDataByPublishedStatusAndUnitType?publishedStatus=${encodedStatus}&unitType=${encodedType}`, this.headers);
  }

  //Card View
  getAllSchemesCardView(): Observable<any> {
    const encodedStatus = encodeURIComponent("Yes");
    return this.httpClient.get(`${this.baseUrl}/api/websiteData/getWebsiteDataBySchemeDataPubishedStatus?publishedStatus=${encodedStatus}`, this.headers);
  }

  getSchemeDataById(schemeId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/schemedata/getById/${schemeId}`, this.headers);
  }

  //Scheme Counts
  getCountsBySchemeId(schemeId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/unitdata/counts/${schemeId}`, this.headers);
  }

  getUnitDataBySchemeId(schemeId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/unitdata/getBySchemeId/${schemeId}`, this.headers);
  }

  //get unit data by unit id
  getUnitById(unitId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/unitdata/getById/${unitId}`, this.headers);
  }

  getWebsiteDataBySchemeId(schemeId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/websiteData/getBySchemeId/${schemeId}`, this.headers);
  }

  getIconsById(id: any) {
    return this.httpClient.get(`${this.baseUrl}/api/attachment/getById/${id}`, this.headers);
  }

  //Enquiry Form
  sendEnquiry(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/enquiry/create`, data, this.headers);
  }

  //application form
  createCustomerApplication(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/application/create`, data, this.headers);
  }

  getAllApplicationByCustomerId(customerId: any, type: any): Observable<any> {
    // return this.httpClient.get(`${this.baseUrl}/api/application/getAllByCustomerId/${customerId}`, this.headers);
    // return this.httpClient.get(`${this.baseUrl}/api/application/getByCustomerIdAndAllotedStatus?customerId=${customerId}&allotedStatus=Yes`, this.headers);
    return this.httpClient.get(`${this.baseUrl}/api/application/getByCustomerIdAndApplicationStatus?customerId=${customerId}&applicationStatus=${type}`, this.headers);

  }

  getApplicationById(applicationId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/application/getById/${applicationId}`, this.headers);
  }

  getAllIncome(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/incomeLimit/getAll`, this.headers);
  }

  //File Upload
  fileUpload(file: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/fileUpload/upload`, file, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'


      })
    });
  }

  lcsRequestUpload(file: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/fileUpload/updateRequestLcs`, file, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'


      })
    });
  }

  updateLCSRequestStatus(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateRequestLcs`, data, this.headers);
  }

  updateHomeLoanStatus(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateHomeLoanStatus`, data, this.headers);
  }

  updateLoanSancStatus(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateLoansanction`, data, this.headers);
  }


  //Payments
  createTransaction(data: any): Observable<any> {
    // return this.httpClient.post(`${this.baseUrl}/api/payment/create`, data, this.headers);\
    return this.httpClient.post(`${this.baseUrl}/api/transaction/create`, data, this.headers);

  }

  createPayment(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/payments/create`, data, this.headers);

  }

  getAllPaymentsByApplicationId(UnitAccountNo: any): Observable<any> {
    // return this.httpClient.get(`${this.baseUrl}/api/payment/getByApplicationId/${applicationId}`, this.headers);
    // return this.httpClient.post(`${this.baseUrl}/api/transaction/getByUnitAccountNumber?unitAcccountNumber=${UnitAccountNo}`, this.headers);
    return this.httpClient.post(`${this.baseUrl}/api/payments/getByUnitAccountNumber?unitAcccountNumber=${UnitAccountNo}`, this.headers);

  }

  getAllApplicationDetails(UnitAccountNo: any): Observable<any> {


    return this.httpClient.get(`${this.baseUrl}/api/application/getByUnitAccountNumber?unitAccountNumber=${UnitAccountNo}`, this.headers);
  }


  //Template 
  getAllTemplate(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/template/getAll`, this.headers);
  }

  //Customer 
  getCustomerById(id: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/customer/getById/${id}`, this.headers);
  }

  //reservation page
  getReservationDataBySchemeId(schemeDataId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/reservation/getBySchemeId/${schemeDataId}`, this.headers);
  }

  //booking status
  getAllCarParkingBySchemeId(schemeDataId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/application/getAllCarParking/${schemeDataId}`, this.headers);
  }


  createSchemeData(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/categoryReservation/create`, this.headers);
  }
  getAllSChemesData(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/categoryReservation/getAll`, this.headers);
  }




  UpdatedTimeByUnit(data: any): Observable<any> {

    return this.httpClient.post(`${this.baseUrl}/api/unitdata/updateTimeByUnit`, data, this.headers);
    // return this.httpClient.post(`${this.baseUrl}/api/unitdata/getAllTimeBySchemeId/${id}`, this.headers);

  }

  // getUpdatedTimeByUnit(id: number): Observable<any> {
  getUpdatedTimeByUnit(schemeId: any, dummyId: any): Observable<any> {

    return this.httpClient.post(`${this.baseUrl}/api/unitdata/getAllTimeBySchemeId/${schemeId}`, this.headers);
    // return this.httpClient.get(`${this.baseUrl}/api/unitdata/getBySchemeDummyId/${schemeId}?dId=${dummyId}`, this.headers);



  }
  //booking Save

  bookingSave(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/bookingPaymentDetails/create`, data, this.headers);
  }
  getBookingDetails(unitAccountNumber: any): Observable<any> {
    // return this.httpClient.get(`${this.baseUrl}/api/bookingPaymentDetails/getById/${bookingId}`, this.headers);

    return this.httpClient.post(`${this.baseUrl}/api/bookingPaymentDetails/getByUnitAccountNumber?unitAccountNumber=${unitAccountNumber}`, {}, this.headers);

  }


  getPaymentHistoryBySchemeCode(id: any): Observable<any> {
    // return this.httpClient.post(`${this.baseUrl}/api/payment/getBySchemeCode?schemeCode=${id}`, {}, this.headers);
    // return this.httpClient.post(`${this.baseUrl}/api/transaction/getBySchemeCode?schemeCode=${id}`, {}, this.headers);
    return this.httpClient.post(`${this.baseUrl}/api/payments/getBySchemeCode?schemeCode=${id}`, {}, this.headers);

  }


  deleteALLBookingDetailsList() {


    return this.httpClient.post(`${this.baseUrl}/api/bookingPaymentDetails/deleteAll`, {}, this.headers);

  }

  allotePermitStatusChange(applicationId: any) {
    // return this.httpClient.post(`${this.baseUrl}/api/application/${applicationId}/applicationPaymentStatus`, {}, this.headers);
    return this.httpClient.post(`${this.baseUrl}/api/application/updateApplicationPaymentStatus/${applicationId}`, {}, this.headers);

  }

  updateBookingStatus(data: any) {

    let token = sessionStorage.getItem('token');
    console.log('token', token);
    debugger
    let headers = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };


    return this.httpClient.post(`${this.baseUrl}/api/unitdata/updateBookingStatus`, data, headers);

  }

  getUnitBySchemeId(schemeId: any, unitId: any) {

    return this.httpClient.post(`${this.baseUrl}/api/unitdata/getBySchemeinDummyId/${schemeId}?dId=${unitId}`, {}, this.headers);

  }
}
