import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentRefundService {

  token = sessionStorage.getItem('token');
  ICICI_headers_VerifyLink = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      // 'x-api-key': 'sk_test_DtJdEbApeA8QH8R9jO2SvWtVVQSdrfna'
      'x-api-key': 'sk_test_CkzgrLjZnykv5KAoyqyefcDSy2kL2Jsy'

    })
  };

  headers = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      // 'Content-Type': 'text/plain'

    })
  };

  private axisMainUrl = "https://sakshamuat.axisbank.co.in/gateway/api/txb/v1/payments/transfer-payment"

  private ICICIBaseUrl = 'https://api.swirepay.com/v1/';
  private baseUrl = environment.apiURL;

  constructor(private httpClient: HttpClient) { }



  //ICICI
  initiateRefundICICI(id: any, data: any) {
    debugger
    return this.httpClient.patch(this.ICICIBaseUrl + 'payment-session/' + id + '/refund', data, this.ICICI_headers_VerifyLink)

  }
  getAllRefundDetails() {
    return this.httpClient.get(this.ICICIBaseUrl + 'refund?page=1&size=5000&sortBy=createdAt', this.ICICI_headers_VerifyLink)
  }

  getRefundById(id: any) {
    return this.httpClient.get(this.ICICIBaseUrl + 'refund/' + id, this.ICICI_headers_VerifyLink)

  }

  ICICIBankConvertToCSV(data: any) {

    return this.httpClient.get(this.baseUrl + '/api/convertToCsv', data)

  }

  //canara bank


  initiateRefundCanarabank(data: any) {
    return this.httpClient.post<any>(`${this.baseUrl}/api/CanaraBank/fundTransfer`, data);
  }

  decryptcanarabank(data: any) {
    // Create headers with Content-Type as text/plain
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain'
    });

    // Post request with headers
    return this.httpClient.post<any>(`${this.baseUrl}/api/CanaraBank/decrypt`, data, { headers });
  }


  checkRefundStatusCanarabank(data: any) {
    return this.httpClient.post<any>(`${this.baseUrl}/api/CanaraBank/checkStatus`, data);
  }



  // axis bank



  getReferenceId(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/generateApiReferenceId`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'text/plain'

      }), responseType: 'text'
    });
  }

  getCustomerReferenceId(): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/generateCustomerReferenceId`, {}, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'text/plain'

      }), responseType: 'text'
    });
  }

  refundAmonutData(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/generateChecksum`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'

      }), responseType: 'text'
    });
  }

  encryptData(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/encrypt`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'

      }), responseType: 'text'
    });
  }

  getLiveApiAxis(data: any): Observable<any> {



    return this.httpClient.post(`${this.axisMainUrl}`, data, {
      headers: new HttpHeaders({
        // 'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',

        'X-IBM-Client-Id': 'af23e1905af559ad7ad1f87c4237022b',
        'X-IBM-Client-Secret': '78b3101e57f76cfb93a8046f6d2ee085'

      })
    });
  }

  //union bank

  ubiTokenRegistration(payload: any) {
    let firstUrl = this.baseUrl
    let endUrl = '/api/ubi/fundTransfer'
    let finalUrl = firstUrl + endUrl

    const queryParams = this.constructParamsUnionBank(payload);
    const finalUrlWithParams = `${finalUrl}?${queryParams}`;

    return this.httpClient.post(finalUrlWithParams, {}).pipe(catchError(this.handleError));
  }
  constructParamsUnionBank(payload: any): HttpParams {
    let params = new HttpParams();
    Object.keys(payload).forEach(key => {
      params = params.set(key, payload[key]);
    });
    return params;
  }


  //hdfc


  generateHDFCAlphaNumeric() {

    return this.httpClient.get(this.baseUrl + '/api/hdfc/generateAlphaNumericKey?keySize=32', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'text/plain'

      }), responseType: 'text'
    })


  }

  encryptPayloadHDFC(data: any) {

    return this.httpClient.post(this.baseUrl + '/api/hdfc/encrypts', data,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'text/plain'

        }), responseType: 'text'
      }
    ).pipe(catchError(this.handleError));

  }
  generateHDFCSignature(key: any, encryptData: any) {

    return this.httpClient.post(this.baseUrl + `/api/hdfc/generateSignature?key=${key}`, encryptData,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'text/plain'

        }), responseType: 'text'
      }
    ).pipe(catchError(this.handleError));
  }

  generateHDFCSymetric(encryptData: any) {

    return this.httpClient.post(this.baseUrl + `/api/hdfc/symmetricEncrypt`, encryptData,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'text/plain'

        }), responseType: 'text'
      }
    ).pipe(catchError(this.handleError));
  }

  getOauthValueHDFC() {

    const encodedCredentials = btoa(`${'rt39ACF4ohxU8wdtEw9HN4qXYFFl7JVwA9SptI0sYYPwfYuo'}:${'3AdqG7BJKBTioqBRAf5mTIO0v9coy2YVFfVAft43uVtm0DazXweziz9c2lpu6Hy0'}`);

    return this.httpClient.post(`https://api-uat.hdfcbank.com/auth/oauth/v2/token?grant_type=client_credentials&scope=CBXMGRT3`, {},
      {
        headers: new HttpHeaders({
          'Authorization': `Basic  ${encodedCredentials}`,
          'Content-Type': 'application/json',
        }), responseType: 'text'
      }
    ).pipe(catchError(this.handleError));
  }

  liveHDFCEncrypt(symetricData: any) {

    return this.httpClient.post(`https://api-uat.hdfcbank.com/API/CBX_InitiatePayment`, symetricData,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'text/plain'

        }), responseType: 'text'
      }
    ).pipe(catchError(this.handleError));

  }








  private handleError(error: HttpErrorResponse) {
    let errorMessage: any = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = "Client-side error:" + `${error.error.message}`;
    } else {
      errorMessage = ' Server-side error:' + ` ${error.status} - ${error.message}`;
    }

    console.error(errorMessage);

    return throwError(() => new Error(errorMessage));
  }
}
