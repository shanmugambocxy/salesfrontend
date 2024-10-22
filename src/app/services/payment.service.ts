import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = environment.apiURL;

  private ICICIBaseUrl = 'https://api.swirepay.com/v1/';


  token = sessionStorage.getItem('token');
  ICICI_headersCustomer = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      // 'x-api-key': 'sk_test_DtJdEbApeA8QH8R9jO2SvWtVVQSdrfna'
      'x-api-key': 'sk_test_CkzgrLjZnykv5KAoyqyefcDSy2kL2Jsy'

    })
  };


  ICICI_headers_PaymentLink = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'x-api-key': 'pk_test_5CiWc6P5D92bGdj9x6L4FPH67aUMOG0m'

    })
  };

  ICICI_headers_VerifyLink = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      // 'x-api-key': 'sk_test_DtJdEbApeA8QH8R9jO2SvWtVVQSdrfna'
      'x-api-key': 'sk_test_CkzgrLjZnykv5KAoyqyefcDSy2kL2Jsy'

    })
  };
  headers = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
  };
  public gid: any = '';
  public amount: any = '';



  constructor(private httpClient: HttpClient) {


  }

  //ICICI
  createCustomer(data: any) {
    // let customerdata = {
    //   "name": "John Wick",
    //   "email": "john@gmail.com",
    //   // "phoneNumber": "9014556652"
    // }
    return this.httpClient.post(`${this.ICICIBaseUrl}customer`, data, this.ICICI_headersCustomer);

  }

  paymentLink(data: any) {
    return this.httpClient.post(`${this.ICICIBaseUrl}payment-link`, data, this.ICICI_headers_PaymentLink);

  }

  verifyPaymentLink(data: any) {
    return this.httpClient.get(`${this.ICICIBaseUrl}payment-link/` + `${data}` + '/verify', this.ICICI_headers_VerifyLink);

  }

  refundProcess(data: any) {
    // /v1/refund/refundGid
    return this.httpClient.get(`${this.ICICIBaseUrl}/v1/refund/` + `${data}`, this.ICICI_headers_VerifyLink);

  }

  getSuccessorPending(data: any) {
    return this.httpClient.post('https://propertyapi.tnhb.in/api/customer/getSuccessorPending', data, this.headers)
  }



  //AXIS Bank


  AXIScreateOrder(data: any) {
    // return this.httpClient.post(${this.AXISBaseUrl}/axispaymentgateway, data);
    return this.httpClient.post(this.baseUrl + '/axispaymentgateway', data);

  }

  getAxisPaymentMethod(data: any) {

    return this.httpClient.get(this.baseUrl + '/axispaymentstatus/' + `${data}`);

  }


  //HDFC


  hdfcCreateOrder(data: any) {
    return this.httpClient.post(this.baseUrl + '/hdfcpaymentgateway', data);

  }


  getHdfcPaymentMethod(data: any) {

    return this.httpClient.get(this.baseUrl + '/hdfcpaymentstatus/' + `${data}`);

  }

  //IndusInd

  // initiatePayment(url: any) {
  //   return this.httpClient.post(url, {});

  // }


  indusIndCreateOrder(data: any) {
    return this.httpClient.post(this.baseUrl + '/Induspaymentgateway', data);

  }


  getindusIndPaymentMethod(data: any) {

    return this.httpClient.get(this.baseUrl + '/Induspaymentstatus/' + `${data}`);

  }




  //canara bank

  canaraBankCreateOrder(data: any) {
    return this.httpClient.post(this.baseUrl + '/api/CanaraBank/canaraBankCraetePayment', data);

  }


  getcanaraBankPaymentMethod(data: any) {

    return this.httpClient.get(this.baseUrl + '/api/CanaraBank/canaraBankpaymentstatus/' + `${data}`);

  }

  //union bank




  UBIPaymentgateway() {
    return this.httpClient
      .post(`${this.baseUrl}/api/ubi/initiateSale/merchantTxnNo`, {})
      .pipe(catchError(this.handleError));
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

  UBIHashcode(data: any) {
    return this.httpClient
      .post(`${this.baseUrl}/api/ubi/initiateSale/secureHash`, data)
      .pipe(catchError(this.handleError1));
  }
  private handleError1(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = 'Client-side error:' + `${error.error.message}`;
    } else {
      errorMessage = ' Server-side error:' + `${error.status} - ${error.message}`;
    }

    console.error(errorMessage);

    return throwError(() => new Error(errorMessage));
  }
  dataStore(data: any) {
    return this.httpClient
      .post(`${this.baseUrl}/api/ubi/initiateSale/receiveData`, data)
      .pipe(catchError(this.handleError1));
  }

  getUnionBankDataById(id: any) {

    return this.httpClient.get(this.baseUrl + `/api/transaction/getById/${id}`, {});

  }
  unionBankStatusCheck(data: any) {

    const body = new HttpParams()
      .set('merchantId', data.merchantId)
      .set('merchantTxnNo', data.merchantTxnNo)
      .set('originalTxnNo', data.merchantTxnNo)
      .set('transactionType', data.transactionType)
      .set('secureHash', data.secureHash);

    // Set the headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.httpClient.post('https://qa.phicommerce.com/pg/api/command', body.toString(), { headers })
  }



  //indian bank


  createOrderIdIndianBank() {
    // let endUrl = '/api/create';
    let endUrl = '/api/generate-uuid';


    let finalUrl = this.baseUrl + endUrl;
    return this.httpClient.get(finalUrl, { responseType: 'text' as 'json' }).pipe(catchError(this.handleError));
  }

  IndianBankPaymentGateWay(payload: any, iv: string, key: string) {
    let endUrl = '/api/encrypt'
    let finalUrl = this.baseUrl + endUrl;
    let params = this.constructParams(payload, iv, key);
    return this.httpClient.post(finalUrl, null, { params: params, responseType: 'text' as 'json' }).pipe(catchError(this.handleError));
  }

  constructParams(payload: any, iv: string, key: string): HttpParams {
    return new HttpParams()
      .set('text', JSON.stringify(payload))
      .set('iv', iv)
      .set('key', key);
  }

  redirectUrlIndianBankPaymentGateway(payload: any, iv: string, key: string) {
    let endUrl = '/api/decrypt'
    let finalUrl = this.baseUrl + endUrl;
    let params = this.constructParamsDecrypted(payload, iv, key);
    return this.httpClient.post(finalUrl, null, { params, responseType: 'text' }).pipe(catchError(this.handleError));
  }

  constructParamsDecrypted(payload: any, iv: string, key: string): HttpParams {
    return new HttpParams()
      .set('encryptedText', payload)
      .set('iv', iv)
      .set('key', key);
  }
  getApiByTransID(id: any) {
    // let endUrl = '/api/payment/getById/'
    // let endUrl = '/api/transaction/getById/'

    // let finalUrl = this.baseUrl + endUrl + id;
    // console.log(finalUrl);
    // return this.httpClient.post(finalUrl, {}).pipe(catchError(this.handleError));

    // let endUrl = '/api/transaction/getById/'
    // let finalUrl = `${this.baseUrl}${endUrl}{id}?id=${id}`;

    let endUrl = `/api/transaction/getById/${id}`
    // let finalUrl = `${this.baseUrl}${endUrl}{id}?id=${id}`;

    debugger
    return this.httpClient.get(this.baseUrl + endUrl, {}).pipe(catchError(this.handleError));

  }

  oRequestIndianBankPaymentGateWay(payload: any, iv: string, key: string) {
    let endUrl = '/api/encrypt'
    let finalUrl = this.baseUrl + endUrl;
    let params = this.constructParams(payload, iv, key);
    return this.httpClient.post(finalUrl, null, { params: params, responseType: 'text' as 'json' }).pipe(catchError(this.handleError));
  }

  oRequestDecryptedIndianBankPaymentGateway(payload: any, iv: string, key: string) {
    let endUrl = '/api/decrypt'
    let finalUrl = this.baseUrl + endUrl;
    let params = this.constructParamsDecrypted(payload, iv, key);
    return this.httpClient.post(finalUrl, null, { params, responseType: 'text' }).pipe(catchError(this.handleError));
  }



  //sbi

  getSBIGenearteId() {


    return this.httpClient.get(`${this.baseUrl}/api/sbi/generateRandomString`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'text/plain'

      }), responseType: 'text'
    });

  }

  paymentInitiateSBI(data: any) {

    return this.httpClient.post(`${this.baseUrl}/api/sbi/encrypt`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'
        'Content-Type': 'application/json',


      }), responseType: 'text'
    });

  }
  paymentStatusCheckSBI(merchantID: any, queryRequest: any, aggregator: any) {
    // const bodyReq = new HttpParams()
    //   .set('merchantId', merchantID)
    //   .set('queryRequest', queryRequest)
    //   .set('aggregatorId', aggregator)



    // return this.httpClient.post(`${this.baseUrl}/api/sbi/double-verification`, bodyReq.toString(), {
    return this.httpClient.post(`${this.baseUrl}/api/sbi/double-verification?merchantId=${merchantID}&queryRequest=${queryRequest}&aggregatorId=${aggregator}`, {}, {

      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'
        // 'Content-Type': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',



      }), responseType: 'text'
    });





  }


}
