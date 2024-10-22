import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private baseUrl = environment.apiURL;

  token = sessionStorage.getItem('token');
  headers = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    })
  };

  constructor(private httpClient: HttpClient) { }

  //Scheme Data
  getAllSchemesByDivision(division: any): Observable<any> {
    const encodedDivision = encodeURIComponent(division);
    return this.httpClient.get(`${this.baseUrl}/api/schemeData/getALL?userType=${encodedDivision}`, this.headers);
  }


  getAllotedUnsoldUnits(id: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/getCountForScheme`, id, this.headers);
  }
  publishStatusChange(id: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/${id}/publishedStatus`, { id: id }, this.headers);
  }

  createScheme(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/schemedata/create`, data, this.headers);
  }

  editScheme(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/schemedata/edit`, data, this.headers);
  }

  getSchemeById(id: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/schemedata/getById/${id}`, this.headers);
  }

  deleteSchemeById(id: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/schemedata/deleteById/${id}`, { id: id }, this.headers);
  }

  getCountsBySchemeId(schemeId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/unitdata/counts/${schemeId}`, this.headers);
  }

  getAllSchemes(): Observable<any> {
    const encodedDivision = encodeURIComponent("Admin");
    return this.httpClient.get(`${this.baseUrl}/api/schemeData/getALL?userType=${encodedDivision}`, this.headers);

    // return this.httpClient.get(`${this.baseUrl}/api/application/getByPaymentStatusandAlottedStatusByAscOrder?allotedStatus=No&applicationPaymentStatus=Yes`, this.headers);
  }

  getAlloteApplication(status: any) {
    return this.httpClient.post(`${this.baseUrl}/api/application/getByPaymentStatusandApplicationStatus?applicationStatus=${status}&applicationPaymentStatus=Yes`, {}, this.headers);

  }
  getUnsoldData(status: any) {

    return this.httpClient.get(`${this.baseUrl}/api/unitdata/getByUnitAllotedStatus?allotmentStatus=${status}`, this.headers);

  }

  createReservationDataForScheme(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/reservation/create`, data, this.headers);
  }

  //Unit Data
  getAllUnitsBySchemeId(schemeId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/unitdata/getBySchemeId/${schemeId}`, this.headers);
  }

  getCommonSchemeData(schemeId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/schemedata/getCommonDataById/${schemeId}`, this.headers);
  }

  createUnit(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/unitdata/create`, data, this.headers);
  }

  getUnitById(unitId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/unitdata/getById/${unitId}`, this.headers);
  }

  editUnit(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/unitdata/edit`, data, this.headers);
  }

  //Scheme Media
  createSchemeMedia(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/websiteData/create`, data, this.headers);
  }

  getWebsiteDataBySchemeId(schemeId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/websiteData/getBySchemeId/${schemeId}`, this.headers);
  }

  updateSchemeMedia(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/websiteData/edit`, data, this.headers);
  }

  deleteAmenities(id: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/websiteData/amenities/deleteById/${id}`, this.headers);
  }

  //Applications
  getAllApplicationsBySchemeId(schemeId: any, allotedStatus: any): Observable<any> {
    // return this.httpClient.get(`${this.baseUrl}/api/application/getBySchemeDataId/${schemeId}?allotedStatus=${allotedStatus}`, this.headers);
    return this.httpClient.get(`${this.baseUrl}/api/application/getBySchemeDataId/${schemeId}?allotedStatus=${allotedStatus}&applicationPaymentStatus=Yes`, this.headers);

  }

  getApplicationById(applicationId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/application/getById/${applicationId}`, this.headers);
  }

  allot(applicationId: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/application/${applicationId}/unitAlotedStatus`, this.headers);
  }

  allotApplicationByAccept(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateApplicationStatus`, data, this.headers);

  }

  saveAlloteApplicationForUnit(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/unitdata/editAloteeDetails`, data, this.headers);

  }

  updateAllotmentOrder(data: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/updateAllotmentOrder`, data, this.headers);

  }

  uploadSignedAllotmentFile(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/fileUpload/uploadSighnedAlotmentOrder`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'


      })
    });
  }

  addSignedAllotmentStatus(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateAllotmentOrder`, data, this.headers);
  }

  uploadSignedLCSFile(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/fileUpload/updateSighnedLcs`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'


      })
    });
  }

  addSignedLCSStatus(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateLcs`, data, this.headers);
  }

  uploadSignedABCerticate(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/fileUpload/updateAnB`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'


      })
    });
  }

  addSignedABStatus(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateAnB`, data, this.headers);
  }

  uploadSignedHOReport(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/fileUpload/updateHandingOver`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'


      })
    });
  }

  addSignedHOStatus(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateHandingOver`, data, this.headers);
  }

  getAllApplicationsByHandingOver(schemeDataId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/application/getBySchemeDataId/handingOverCreatedDateTime/${schemeDataId}`, this.headers);
  }

  uploadChecklist(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/fileUpload/updateChecklist`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'


      })
    });
  }

  updateChecklist2(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateChecklist2`, data, this.headers);
  }

  changeChecklistStatus(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateChecklist`, data, this.headers);
  }

  addExecutionDates(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateDate`, data, this.headers);
  }

  uploadSaleDeed(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/fileUpload/updateSaledeed`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'


      })
    });
  }

  updateSaleDeedStatus(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateSaleDeed`, data, this.headers);
  }

  //Reservation
  createReservation(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/categoryReservation/create`, data, this.headers);
  }

  getAllReservation(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/categoryReservation/getAll`, this.headers);
  }

  updateReservation(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/categoryReservation/edit`, data, this.headers);
  }

  deleteReservation(id: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/categoryReservation/deleteById/${id}`, this.headers);
  }
  deleteReservationSubcategory(id: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/categoryReservation/subCategoryReservation/deleteById/${id}`, this.headers);
  }

  //Income Category
  createIncomeCategory(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/incomeLimit/create`, data, this.headers);
  }

  getAllIncome(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/incomeLimit/getAll`, this.headers);
  }

  editIncomeCategory(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/incomeLimit/edit`, data, this.headers);
  }
  //application fees
  createApplicationCategory(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/applicationFees/create`, data, this.headers);
  }

  getAllApplication(): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/applicationFees/getAll`, this.headers);
  }

  editApplicationCategory(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/applicationFees/edit`, data, this.headers);
  }

  deleteApplicationFees(id: any): Observable<any> {


    return this.httpClient.post(`${this.baseUrl}/api/applicationFees/deleteById/${id}`, {}, this.headers);

  }

  //bank details

  createbankIFSC(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/bank/create`, data, this.headers);
  }

  getAllBankIFSC(): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/bank/getAll`, this.headers);
  }


  editBankIFSC(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/bank/edit`, data, this.headers);
  }

  deleteBankIFSC(id: any): Observable<any> {


    return this.httpClient.post(`${this.baseUrl}/api/bank/deleteById/${id}`, {}, this.headers);

  }

  //scrunity fees
  createScrunityFeesCategory(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/scrunityFees/create`, data, this.headers);
  }

  getAllScrunity(): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/scrunityFees/getAll`, this.headers);
  }

  editScrunityFeesCategory(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/scrunityFees/edit`, data, this.headers);
  }

  deleteScrunityFees(id: any): Observable<any> {


    return this.httpClient.post(`${this.baseUrl}/api/scrunityFees/deleteById/${id}`, {}, this.headers);

  }
  getScrunityByType(type: any) {

    return this.httpClient.get(`${this.baseUrl}/api/scrunityFees/getByType?type=${type}`, this.headers);

  }

  //unit code fees
  createUnitCode(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/code/create`, data, this.headers);
  }

  getAllUnitCode(): Observable<any> {


    return this.httpClient.post(`${this.baseUrl}/api/code/getAll`, this.headers);
  }

  editUnitCode(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/code/edit`, data, this.headers);
  }

  deleteUnitCode(id: any): Observable<any> {


    return this.httpClient.post(`${this.baseUrl}/api/code/deleteById/${id}`, {}, this.headers);

  }
  //rate of interest
  createRateOfInterest(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/rateOfInterest/create`, data, this.headers);
  }

  getAllRateOfInterest(): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/rateOfInterest/getAll`, this.headers);
  }

  editRateOfInterest(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/rateOfInterest/schemedata/edit`, data, this.headers);
  }

  deleteRateOfInterest(id: any): Observable<any> {


    return this.httpClient.post(`${this.baseUrl}/api/rateOfInterest/deleteById/${id}`, {}, this.headers);

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

  deleteSchemeImage(id: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/websiteData/schemeImagePath/deleteById/${id}`, this.headers);
  }

  deleteFloorImage(id: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/websiteData/floorImagePath/deleteById/${id}`, this.headers);
  }

  deleteModelImage(id: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/websiteData/modelImagePath/deleteById/${id}`, this.headers);
  }

  deleteCurrentImage(id: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/websiteData/currentStatusImage/deleteById/${id}`, this.headers);
  }

  //template uploads
  templateFileUpload(file: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/fileUpload/uploadTemplates`, file, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'


      })
    });
  }

  createTemplateData(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/template/create`, data, this.headers);
  }

  getAllTemplate(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/template/getAll`, this.headers);
  }
  getTemplateBuDocument(documentName: any) {

    return this.httpClient.get(`${this.baseUrl}/api/template/getByDocumentName?documentName=${documentName}`, this.headers);

  }

  deleteTemplateById(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/unitdata/getById/{id}`, this.headers);
  }

  //Icons
  createIcons(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/attachment/create`, data, this.headers);
  }

  getAllIcons(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/attachment/getAll`, this.headers);
  }

  deleteIcon(id: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/attachment/deleteById/${id}`, {}, this.headers);
  }

  //Payments
  createPayment(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/payment/create`, data, this.headers);
  }

  createReservationForm(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/categoryReservation/create`, data, this.headers);
  }
  updateReservationForm(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/categoryReservation/edit`, data, this.headers);
  }
  deleteSavedReservation(data: number): Observable<any> {

    return this.httpClient.post(`${this.baseUrl}/api/reservation/deleteBySchemeDataId/${data}`, data, this.headers);
  }

  getDivisionList() {
    return this.httpClient.get('https://personnelapi.tnhb.in/getAllDivisionCode', this.headers);
  }

  getPayment_historyByApplicationId(id: any) {

    return this.httpClient.get(this.baseUrl + '/api/payment/getByApplicationId/' + id, this.headers);
  }

  getAllSchemeDataByAllote(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/getSchemeDataByPublishedStatus?publishedStatus=yes`, this.headers);
  }

  getUnitDataBySchemeId(schemeID: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/application/getBySchemeIdandapplicationPaymentStatus?schemeId=${schemeID}&applicationPaymentStatus=Yes`, this.headers);

  }

  getSchemeCode(schemeId: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/search?query=${schemeId}`, this.headers);
  }
  getunitAccountNumber() {
    return this.httpClient.get(`${this.baseUrl}/api/unitdata/search`, this.headers);


  }

  //challan



  createChallan(data: any): Observable<any> {
    debugger
    return this.httpClient.post(`${this.baseUrl}/api/Echallan/create`, data, this.headers);

  }
  getEchallanbycustomerid(customerId: any): Observable<any> {
    debugger
    return this.httpClient.post(`${this.baseUrl}/api/Echallan/getByCustomerId?customerId=${customerId}`, {}, this.headers);

  }
  getApplicationbyCustomerId(status: any, customerId: any) {
    return this.httpClient.post(`${this.baseUrl}/api/application/getByPaymentStatusandApplicationStatusandCustomerId?applicationStatus=${status}&applicationPaymentStatus=Yes&customerId=${customerId}`, {}, this.headers);

  }

  getChallanBYId(id: any) {
    return this.httpClient.get(`${this.baseUrl}/api/Echallan/getById/${id}`, this.headers);


  }


  //convert amount to words

  private ones: string[] = [
    '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
    'eighteen', 'nineteen'
  ];

  private tens: string[] = [
    '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
  ];

  // private scales: string[] = ['', 'thousand', 'million', 'billion', 'trillion'];
  private scales: string[] = ['', 'thousand', 'lakh', 'crore'];

  convertAmountToWords(amount: number): string {
    if (amount === 0) return 'zero';

    const parts = amount.toString().split('.');
    const integerPart = parseInt(parts[0], 10);
    const decimalPart = parts[1] ? parseInt(parts[1], 10) : 0;

    let words = this.convertNumberToWords(integerPart);
    if (decimalPart > 0) {
      words += ` and ${this.convertNumberToWords(decimalPart)} cents`;
    }
    return words.trim();
  }

  private convertNumberToWords(num: number): string {
    if (num === 0) return 'zero';
    if (num < 20) return this.ones[num];
    if (num < 100) return this.tens[Math.floor(num / 10)] + (num % 10 ? ' ' + this.ones[num % 10] : '');
    if (num < 1000) return this.ones[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' ' + this.convertNumberToWords(num % 100) : '');
    if (num < 100000) { // Handle numbers up to 1 lakh (100,000)
      return this.convertNumberToWords(Math.floor(num / 1000)) + ' thousand' + (num % 1000 ? ' ' + this.convertNumberToWords(num % 1000) : '');
    }

    if (num < 10000000) { // Handle numbers up to 1 crore (10,000,000)
      return this.convertNumberToWords(Math.floor(num / 100000)) + ' lakh' + (num % 100000 ? ' ' + this.convertNumberToWords(num % 100000) : '');
    }
    if (num < 1000000000) { // Numbers up to 99 crore
      return this.convertNumberToWords(Math.floor(num / 10000000)) + ' crore' + (num % 10000000 ? ' ' + this.convertNumberToWords(num % 10000000) : '');
    }
    for (let i = 0; i < this.scales.length; i++) {
      const unit = Math.pow(1000, i + (i === 2 ? 2 : 1)); // Adjust for lakh (1e5) and crore (1e7)
      if (num < unit) {
        return this.convertNumberToWords(Math.floor(num / Math.pow(1000, i + (i === 2 ? 2 : 1)))) + ' ' + this.scales[i] + (num % Math.pow(1000, i + (i === 2 ? 2 : 1)) ? ' ' + this.convertNumberToWords(num % Math.pow(1000, i + (i === 2 ? 2 : 1))) : '');
      }
    }

    return '';
  }

  getAllotmentDownloadedAll(status: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/getByAllottmentDownloadedStatus?allottmentDownloadedStatus=${status}`, {}, this.headers);

  }

  //lcs generate

  // /api/application/updateLcsWithoutSighn



  generateLcsList(status: any) {
    return this.httpClient.post(`${this.baseUrl}/api/application/getByLcsStatus?lcsStatus=${status}`, {}, this.headers);

  }

  updateLcsganerated(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateLcsWithoutSighn`, data, this.headers);

  }
  getApplicationbyCustomerIdAllottee(customerId: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/getApplicationByCustomerId?customerId=${customerId}`, this.headers);

  }
  getAllotteeAllotmentOrder(status: any, customerId: any) {

    return this.httpClient.get(`${this.baseUrl}/api/application/getByCustomerIdAndApplicationStatus?customerId=${customerId}&applicationStatus=${status}`, this.headers);

  }
  getAllotteeLcsDownload(status: any, customerId: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/getByLcsStatusByCustomerId?lcsStatus=${status}&customerId=${customerId}`, this.headers);

  }

  updateAllottmentDownloadedStatusForBuyers(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateAllottmentDownloadedStatus`, data, this.headers);

  }

  updateLcsAllotteeDownloaded(data: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/updateLcsDownloadStatus`, data, this.headers);

  }
  updateRequestLCStoApprove(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateRequestLcs`, data, this.headers);

  }

  updateLCSStatusToApprove(data: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/updateLcsWithDigitalsighn`, data, this.headers);



  }

  updateHomeLoanStatusforLCS(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateHomeLoanStatus`, data, this.headers);

  }

  getDownloadedLcsForBuyer(status: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/getByLcsDownloadedStatus?lcsDownloadStatus=${status}`, {}, this.headers);

  }

  getLcsUploadedStatusforBuyers(status: any) {


    return this.httpClient.get(`${this.baseUrl}/api/application/getByLcsApprovedDownloadStatus?lcsApprovedDownloadStatus=${status}`, this.headers);

  }

  //A & B
  getHomeLoanStatusForAandB(status: any, customerId: any) {


    return this.httpClient.post(`${this.baseUrl}/api/application/getHomeLoanStatusAndCustomerId?homeLoanStatus=${status}&customerId=${customerId}`, {}, this.headers);

  }

  allotteeUploadAandB(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateInprincipalLetter`, data, this.headers);

  }

  getAandBGenerate(status: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/getByAnBStatus?aAndbStatus=${status}`, {}, this.headers);

  }

  updateAandBToGenerated(data: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/updateAnB`, data, this.headers);

  }
  getUploadInPrincipleLetterForBuyer(status: any) {


    return this.httpClient.post(`${this.baseUrl}/api/application/getByAnBStatus?aAndbStatus=${status}`, {}, this.headers);

  }

  updateDownloadedAandB(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateAnbApprovedStatus`, data, this.headers);

  }

  getAandBDownloadedForBuyer(status: any) {
    return this.httpClient.get(`${this.baseUrl}/api/application/getByAnbApprovedStatus?anbApprovedStatus=${status}`, this.headers);
  }

  //unit cost
  updateUnitCostDemand(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/updateUnitCostDetails`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'
        'Content-Type': 'application/json',


      })
    });

  }

  //GST

  updateGstPaidCost(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/updateGstPaidCost`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'
        'Content-Type': 'application/json',


      })
    });

  }

  //mc
  updatemcCostDetails(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/updatemcCostDetails`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'
        'Content-Type': 'application/json',


      })
    });

  }


  //dc
  updateDifferentCostDetails(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/updateDifferentCostDetails`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'
        'Content-Type': 'application/json',


      })
    });

  }


  //car

  updateCarParkingCostDetails(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/updateCarParkingCostDetails`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'
        'Content-Type': 'application/json',


      })
    });

  }

  //scrunity fees


  updateScrunityFeesCostDetails(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/updateScrunityFees`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'
        'Content-Type': 'application/json',


      })
    });

  }

  //handding over


  getHandingOverByOfficer(unitcost: any, handingoverstatus: any) {
    return this.httpClient.post(`${this.baseUrl}/api/application/getByUnitCostRemainingBalanceAndHandingOverStatus?unitCostRemainingBalance=${unitcost}&handingOverStatus=${handingoverstatus}`, {}, this.headers);

  }
  getGeneratedHandingOver(unitCost: any, handingOverStatus: any, surveyorStatus: any, aeeStatus: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/getByUnitCostRemainingBalanceAndHandingOverStatusAndSurveyorStatusAndAeeStatus?unitCostRemainingBalance=${unitCost}&handingOverStatus=${handingOverStatus}&surveyorStatus=${surveyorStatus}&aeeStatus=${aeeStatus}`, {}, this.headers);


  }
  getGeneratedHandingOverByCustomerID(customerId: any, handingOverStatus: any, surveyorStatus: any, aeeStatus: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/getByCustomerIdAndHandingOverStatusAndSurveyorStatusAndAeeStatus?customerId=${customerId}&handingOverStatus=${handingOverStatus}&surveyorStatus=${surveyorStatus}&aeeStatus=${aeeStatus}`, {}, this.headers);


  }


  generateHandingOver(data: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/updateEligibleForHandingOver`, data, this.headers);

  }
  surveyorCheckListPlot(data: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/updateChecklist`, data, this.headers);

  }

  surveyorCheckListHouse(data: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/updateCheckListForBoth`, data, this.headers);

  }

  AeeCheckListFlat(data: any) {


    return this.httpClient.post(`${this.baseUrl}/api/application/updateChecklist2`, data, this.headers);

  }

  //draftsale deed
  getGenerateDraftSaleDeed(demandtotalCost: any, status: any) {


    return this.httpClient.post(`${this.baseUrl}/api/application/getByTotalCostAndDraftSaleDeedStatus?demandTotalCost=${demandtotalCost}&draftSaleDeedStatus=${status}`, {}, this.headers);

  }

  getGenerateDraftSaleDeedByCustomerId(customerId: any, demandtotalCost: any, status: any) {


    return this.httpClient.post(`${this.baseUrl}/api/application/getByCustomerIdAndTotalCostAndDraftSaleDeedStatus?customerId=${customerId}&demandTotalCost=${demandtotalCost}&draftSaleDeedStatus=${status}`, {}, this.headers);

  }
  updateDraftSaleDeedToGenerated(data: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/updateDraftSaleDeed`, data, this.headers);

  }

  downloadDraftSaleDeed_allottee(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateDraftSaleDeedDownloadStatus`, data, this.headers);

  }
  getDownlodedStatusDraftsaledeedBuyersRole(status: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/getByDraftSaleDeedDownloadStatus?draftSaleDeedDownloadStatus=${status}`, {}, this.headers);


  }

  getNocuploadDataDraftsaledeed(status: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/getByNocStatus?nocStatus=${status}`, {}, this.headers);

  }
  getNocuploadDataDraftsaledeedbyCustomerId(customerId: any, status: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/getByCustomerIdAndNocStatus?customerId=${customerId}&nocStatus=${status}`, {}, this.headers);

  }
  uploadNocDraftSaleDeedAllottee(data: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/updateNocStatus`, data, this.headers);

  }

  getUploadNocDraftsaleDeed() {

  }
  getSaledeedShedule(nocStatus1: any, nocStatus2: any, customerId: any, saleDeedStatus: any) {
    return this.httpClient.post(`${this.baseUrl}/api/application/getBySaledeedStatusAndCustomerIdAndNocStatus?nocStatus=${nocStatus1}&nocStatus=${nocStatus2}&customerId=${customerId}&saledeedStatus=${saleDeedStatus}`, {}, this.headers);


  }
  getScheduleByOfficerSaleDeed(nocStatus1: any, nocStatus2: any, saleDeedStatus: any) {
    return this.httpClient.post(`${this.baseUrl}/api/application/getBySaledeedStatusAndCustomerIdAndNocStatus?nocStatus=${nocStatus1}&nocStatus=${nocStatus2}&customerId=1&saledeedStatus=${saleDeedStatus}`, {}, this.headers);


  }
  checkAppointmentCountSaledeed(date: any) {

    return this.httpClient.get(`${this.baseUrl}/api/application/count?date=${date}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'text/plain'

      }), responseType: 'text'
    });

  }
  updateAppointmentDateSaledeed(data: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/updateDate`, data, this.headers);

  }
  getScheduledDataSaleDeed(status: any) {


    return this.httpClient.post(`${this.baseUrl}/api/application/getByExecutedStatus?executedStatus=${status}`, {}, this.headers);


  }

  approveSaleDeed(data: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/updateAppointmentDate`, data, this.headers);

  }

  executeSaleDeed(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/application/updateSaleDeed`, data, this.headers);


  }

  getIssuedSaleDeed(status: any, customerID: any) {

    return this.httpClient.post(`${this.baseUrl}/api/application/getBySaledeedStatusAndCustomerId?saledeedStatus=${status}&customerId=${customerID}`, {}, this.headers);

  }

  //template

  deleteTemplateFileByID(id: any) {

    return this.httpClient.post(`${this.baseUrl}/api/template/deleteById/${id}`, {}, this.headers);

  }
  getTemplateByName(type: any) {

    return this.httpClient.get(`${this.baseUrl}/api/template/getByTemplateName?templateName=${type}`, this.headers);

  }

  //findInterest

  findInterestForSfs(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/Interest/findInterest`, data, this.headers);

  }

  //sfs Interest



  updateInterestSFS(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/updateInterestForSfs`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'
        'Content-Type': 'application/json',


      })
    });

  }
  updateDueAmountSFS(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/updateUnitCostForSfs`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'
        'Content-Type': 'application/json',


      })
    });

  }

  //dashboard

  dashboardCount(data: any) {
    return this.httpClient.post(`${this.baseUrl}/api/Dashboard/getCountForDashboard`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        // 'Content-Type': 'text/plain'
        'Content-Type': 'application/json',


      })
    });

  }

}
