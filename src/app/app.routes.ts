import { Routes } from '@angular/router';
import { LayoutComponent } from './property/layout/layout.component';
import { SalesLayoutComponent } from './sales/layout/layout.component';
import { AuthguardService } from './services/authguard.service';

export const routes: Routes = [
    { path: '', redirectTo: 'all-schemes', pathMatch: 'full', },
    {
        path: 'officer-login',
        loadComponent: () => import('./property/officer-login/officer-login.component').then((c) => c.OfficerLoginComponent,),
        canActivate: [AuthguardService]
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./property/officer-forgot-password/officer-forgot-password.component').then((c) => c.OfficerForgotPasswordComponent)
    },
    {
        path: 'employee',
        component: LayoutComponent,
        children: [
            { path: 'all-schemes', loadComponent: () => import('./property/schemes/list-view-schemes/list-view-schemes.component').then((c) => c.ListViewSchemesComponent) },
            { path: 'scheme-data', loadComponent: () => import('./property/schemes/add-view-edit-scheme/add-view-edit-scheme.component').then((c) => c.AddViewEditSchemeComponent) },
            { path: 'scheme-media', loadComponent: () => import('./property/schemes/scheme-media/scheme-media.component').then((c) => c.SchemeMediaComponent) },
            { path: 'all-units', loadComponent: () => import('./property/schemes/list-view-units/list-view-units.component').then((c) => c.ListViewUnitsComponent) },
            { path: 'unit-data', loadComponent: () => import('./property/schemes/add-view-edit-unit/add-view-edit-unit.component').then((c) => c.AddViewEditUnitComponent) },
            { path: 'reservation', loadComponent: () => import('./property/reservation/reservation.component').then((c) => c.ReservationComponent) },
            { path: 'income-category', loadComponent: () => import('./property/income-category/income-category.component').then((c) => c.IncomeCategoryComponent) },

            { path: 'pending-applications', loadComponent: () => import('./property/applications/employee-applications/employee-applications.component').then((c) => c.EmployeeApplicationsComponent) },
            { path: 'verified-applications', loadComponent: () => import('./property/verified/verified.component').then((c) => c.VerifiedComponent) },

            { path: 'scheme/applications', loadComponent: () => import('./property/applications/employee-scheme-applications/employee-scheme-applications.component').then((c) => c.EmployeeSchemeApplicationsComponent) },
            { path: 'view-application', loadComponent: () => import('./property/applications/employee-view-application/employee-view-application.component').then((c) => c.EmployeeViewApplicationComponent) },

            { path: 'schemes-allotment', loadComponent: () => import('./property/allottees/list-view-schemes-allotment/list-view-schemes-allotment.component').then((c) => c.ListViewSchemesAllotmentComponent) },
            { path: 'all-allotment', loadComponent: () => import('./property/allottees/list-view-allotment/list-view-allotment.component').then((c) => c.ListViewAllotmentComponent) },
            { path: 'view-allotment', loadComponent: () => import('./property/allottees/view-allotment/view-allotment.component').then((c) => c.ViewAllotmentComponent) },

            { path: 'templates', loadComponent: () => import('./property/templates/templates.component').then((c) => c.TemplatesComponent) },
            { path: 'templates_allotmentorder', loadComponent: () => import('./property/templatesallotmentorder/templatesallotmentorder.component').then((c) => c.TemplatesallotmentorderComponent) },
            { path: 'templates_LCS', loadComponent: () => import('./property/templates-lcs/templates-lcs.component').then((c) => c.TemplatesLCSComponent) },
            { path: 'templates_A&B', loadComponent: () => import('./property/templates-aand-b/templates-aand-b.component').then((c) => c.TemplatesAandBComponent) },
            { path: 'templates_Cancellation', loadComponent: () => import('./property/templatescancellation/templatescancellation.component').then((c) => c.TemplatescancellationComponent) },
            { path: 'templates_handingOver', loadComponent: () => import('./property/templateshandingover/templateshandingover.component').then((c) => c.TemplateshandingoverComponent) },
            { path: 'templates_draftdeed', loadComponent: () => import('./property/templatesdraftdeed/templatesdraftdeed.component').then((c) => c.TemplatesdraftdeedComponent) },
            { path: 'templates_subregistrar', loadComponent: () => import('./property/templatessubregistrar/templatessubregistrar.component').then((c) => c.TemplatessubregistrarComponent) },
            { path: 'templates_nametransferorder', loadComponent: () => import('./property/templatesnametransferorder/templatesnametransferorder.component').then((c) => c.TemplatesnametransferorderComponent) },

            { path: 'icons', loadComponent: () => import('./property/icons/icons.component').then((c) => c.IconsComponent) },

            { path: 'handing-over', loadComponent: () => import('./property/handing-over/handing-over-all-schemes/handing-over-all-schemes.component').then((c) => c.HandingOverAllSchemesComponent) },
            { path: 'handing-over/scheme', loadComponent: () => import('./property/handing-over/handing-over-allotees/handing-over-allotees.component').then((c) => c.HandingOverAlloteesComponent) },
            { path: 'handing-over/view-allotee', loadComponent: () => import('./property/handing-over/handing-over-view-allotee/handing-over-view-allotee.component').then((c) => c.HandingOverViewAlloteeComponent) },
            { path: 'reservationlist', loadComponent: () => import('./property/reservation-saleslist/reservation-saleslist.component').then((c) => c.ReservationSaleslistComponent) },
            // { path: 'reservationlist', loadComponent: () => import('./property/reservation-saleslist/reservation-saleslist.component').then((c) => c.ReservationSaleslistComponent) },
            { path: 'payment-history', loadComponent: () => import('./paymenthistory/paymenthistory.component').then((c) => c.PaymenthistoryComponent) },
            { path: 'allscheme-data', loadComponent: () => import('./allschemedata/allschemedata.component').then((c) => c.AllschemedataComponent) },
            { path: 'view-payment', loadComponent: () => import('./payment-view/payment-view.component').then((c) => c.PaymentViewComponent) },
            { path: 'unitdata-byschemeID', loadComponent: () => import('./unitbyschemeid/unitbyschemeid.component').then((c) => c.UnitbyschemeidComponent) },
            { path: 'applicationfees', loadComponent: () => import('./property/applicationfees/applicationfees.component').then((c) => c.ApplicationfeesComponent) },
            { path: 'scrunityfees', loadComponent: () => import('./property/scrunityfees/scrunityfees.component').then((c) => c.ScrunityfeesComponent) },
            { path: 'unitcodefees', loadComponent: () => import('./property/unitcodefees/unitcodefees.component').then((c) => c.UnitcodefeesComponent) },
            { path: 'bankifsccode', loadComponent: () => import('./property/bankifsccode/bankifsccode.component').then((c) => c.BankifsccodeComponent) },

            { path: 'allotmentorder', loadComponent: () => import('./property/allotmentorder/allotmentorder.component').then((c) => c.AllotmentorderComponent) },
            { path: 'ao_download', loadComponent: () => import('./property/ao-download/ao-download.component').then((c) => c.AoDownloadComponent) },
            { path: 'ao_downloaded', loadComponent: () => import('./property/ao-downloaded/ao-downloaded.component').then((c) => c.AoDownloadedComponent) },
            { path: 'lcs-generate', loadComponent: () => import('./property/lcs-generate/lcs-generate.component').then((c) => c.LcsGenerateComponent) },
            { path: 'lcs-generated', loadComponent: () => import('./property/lcs-generated/lcs-generated.component').then((c) => c.LcsGeneratedComponent) },
            { path: 'lcs-approve', loadComponent: () => import('./property/lcs-approve/lcs-approve.component').then((c) => c.LcsApproveComponent) },
            { path: 'lcs-approved', loadComponent: () => import('./property/lcs-approved/lcs-approved.component').then((c) => c.LcsApprovedComponent) },
            { path: 'lcs-downloaded', loadComponent: () => import('./property/lcs-downloaded/lcs-downloaded.component').then((c) => c.LcsDownloadedComponent) },
            { path: 'lcs-uploaded', loadComponent: () => import('./property/lcs-uploaded/lcs-uploaded.component').then((c) => c.LcsUploadedComponent) },
            { path: 'AandB-generate', loadComponent: () => import('./property/aand-bcertificate-generate/aand-bcertificate-generate.component').then((c) => c.AandBcertificateGenerateComponent) },
            { path: 'AandB-generated', loadComponent: () => import('./property/aand-bcertificate-generated/aand-bcertificate-generated.component').then((c) => c.AandBcertificateGeneratedComponent) },
            { path: 'AandB-uploaded-principle', loadComponent: () => import('./property/aand-bcertificate-uploadedprinciple/aand-bcertificate-uploadedprinciple.component').then((c) => c.AandBcertificateUploadedprincipleComponent) },
            { path: 'rateOfInterest', loadComponent: () => import('./property/rateofinterest/rateofinterest.component').then((c) => c.RateofinterestComponent) },
            { path: 'unsoldstocks', loadComponent: () => import('./property/unsoldstocks/unsoldstocks.component').then((c) => c.UnsoldstocksComponent) },
            { path: 'paymentstatus', loadComponent: () => import('./property/paymentstatus/paymentstatus.component').then((c) => c.PaymentstatusComponent) },
            { path: 'tobecancel', loadComponent: () => import('./property/tobecancel/tobecancel.component').then((c) => c.TobecancelComponent) },
            { path: 'cancelled', loadComponent: () => import('./property/cancelled/cancelled.component').then((c) => c.CancelledComponent) },
            { path: 'handingover_generate', loadComponent: () => import('./property/handingover-generate/handingover-generate.component').then((c) => c.HandingoverGenerateComponent) },
            { path: 'handingover_generated', loadComponent: () => import('./property/handingover-generated/handingover-generated.component').then((c) => c.HandingoverGeneratedComponent) },
            { path: 'handover', loadComponent: () => import('./property/handover/handover.component').then((c) => c.HandoverComponent) },
            { path: 'handedover', loadComponent: () => import('./property/handedover/handedover.component').then((c) => c.HandedoverComponent) },
            { path: 'echallan_generated', loadComponent: () => import('./property/echallan-generated/echallan-generated.component').then((c) => c.EchallanGeneratedComponent) },
            { path: 'echallan_cleared', loadComponent: () => import('./property/echallan-cleared/echallan-cleared.component').then((c) => c.EchallanClearedComponent) },
            { path: 'carparking_generate', loadComponent: () => import('./property/carparking-generate/carparking-generate.component').then((c) => c.CarparkingGenerateComponent) },
            { path: 'carparking_generated', loadComponent: () => import('./property/carparking-generated/carparking-generated.component').then((c) => c.CarparkingGeneratedComponent) },
            { path: 'draftsaledeed_generate', loadComponent: () => import('./property/draftsaledeed-generate/draftsaledeed-generate.component').then((c) => c.DraftsaledeedGenerateComponent) },
            { path: 'draftsaledeed_generated', loadComponent: () => import('./property/draftsaledeed-generated/draftsaledeed-generated.component').then((c) => c.DraftsaledeedGeneratedComponent) },
            { path: 'noc_upload', loadComponent: () => import('./property/noc-upload/noc-upload.component').then((c) => c.NocUploadComponent) },
            { path: 'noc_uploaded', loadComponent: () => import('./property/noc-uploaded/noc-uploaded.component').then((c) => c.NocUploadedComponent) },
            { path: 'saledeed_schedule', loadComponent: () => import('./property/saledeed-schedule/saledeed-schedule.component').then((c) => c.SaledeedScheduleComponent) },
            { path: 'saledeed_scheduled', loadComponent: () => import('./property/saledeed-scheduled/saledeed-scheduled.component').then((c) => c.SaledeedScheduledComponent) },
            { path: 'saledeed_appointment', loadComponent: () => import('./property/saledeed-appointment/saledeed-appointment.component').then((c) => c.SaledeedAppointmentComponent) },
            { path: 'saledeed_execute', loadComponent: () => import('./property/saledeed-execute/saledeed-execute.component').then((c) => c.SaledeedExecuteComponent) },
            { path: 'saledeed_executed', loadComponent: () => import('./property/saledeed-executed/saledeed-executed.component').then((c) => c.SaledeedExecutedComponent) },
            { path: 'allotmentorder_download', loadComponent: () => import('./property/allotmentorder-download/allotmentorder-download.component').then((c) => c.AllotmentorderDownloadComponent) },
            { path: 'allotmentorder_downloaded', loadComponent: () => import('./property/allotmentorder-downloaded/allotmentorder-downloaded.component').then((c) => c.AllotmentorderDownloadedComponent) },
            { path: 'draftsaledeed_downloaded', loadComponent: () => import('./property/draftsaledeed-downloaded/draftsaledeed-downloaded.component').then((c) => c.DraftsaledeedDownloadedComponent) },
            { path: 'draftsaledeed_upload_NOC', loadComponent: () => import('./property/draftsaledeed-upload-noc/draftsaledeed-upload-noc.component').then((c) => c.DraftsaledeedUploadNOCComponent) },
            { path: 'draftsaledeed_uploaded_NOC', loadComponent: () => import('./property/draftsaledeed-uploaded-noc/draftsaledeed-uploaded-noc.component').then((c) => c.DraftsaledeedUploadedNOCComponent) },
            { path: 'saledeed_issued', loadComponent: () => import('./property/saledeed-issued/saledeed-issued.component').then((c) => c.SaledeedIssuedComponent) },

            { path: 'all-payments', loadComponent: () => import('./sales/payments/payments.component').then((c) => c.PaymentsComponent) },
            { path: 'dashboard-officer', loadComponent: () => import('./property/dashboard-officer/dashboard-officer.component').then((c) => c.DashboardOfficerComponent) },
            { path: 'dashboard-details', loadComponent: () => import('./property/dashboard-details/dashboard-details.component').then((c) => c.DashboardDetailsComponent) },

            { path: 'AandB_Downloaded', loadComponent: () => import('./property/aand-b-downloaded/aand-b-downloaded.component').then((c) => c.AandBDownloadedComponent) },
            { path: 'pdfviewer', loadComponent: () => import('./property/pdfviewer/pdfviewer.component').then((c) => c.PdfviewerComponent) },

            { path: 'TotalUnits', loadComponent: () => import('./property/allunits/allunits.component').then((c) => c.AllunitsComponent) },
            { path: 'timeoutapplication', loadComponent: () => import('./property/timeoutapplication/timeoutapplication.component').then((c) => c.TimeoutapplicationComponent) },

        ],
    },
    {
        path: 'customer',
        component: SalesLayoutComponent,
        children: [
            { path: 'home', loadComponent: () => import('./sales/customer-home/customer-home.component').then((c) => c.CustomerHomeComponent) },
            { path: 'application-history', loadComponent: () => import('./sales/customer-application-history/customer-application-history.component').then((c) => c.CustomerApplicationHistoryComponent) },
            { path: 'view-allotment', loadComponent: () => import('./sales/customer-view-allotment/customer-view-allotment.component').then((c) => c.CustomerViewAllotmentComponent) },
            { path: 'all-payments', loadComponent: () => import('./sales/payments/payments.component').then((c) => c.PaymentsComponent) },
            { path: 'all-payments/:name', loadComponent: () => import('./sales/payments/payments.component').then((c) => c.PaymentsComponent) },

            { path: 'application', loadComponent: () => import('./sales/customer-application/customer-application.component').then((c) => c.CustomerApplicationComponent) },
            { path: 'selectbank', loadComponent: () => import('./select-bank/select-bank.component').then((c) => c.SelectBankComponent) },
            { path: 'paymentSuccess', loadComponent: () => import('./payment-success/payment-success.component').then((c) => c.PaymentSuccessComponent) },
            { path: 'payment-history', loadComponent: () => import('./paymenthistory/paymenthistory.component').then((c) => c.PaymenthistoryComponent) },
            { path: 'payment-failed', loadComponent: () => import('./payment-failure/payment-failure.component').then((c) => c.PaymentFailureComponent) },

            { path: 'view-application', loadComponent: () => import('./property/applications/employee-view-application/employee-view-application.component').then((c) => c.EmployeeViewApplicationComponent) },
            { path: 'view-payment', loadComponent: () => import('./payment-view/payment-view.component').then((c) => c.PaymentViewComponent) },
            { path: 'goToPaymentHistory', loadComponent: () => import('./gotopaymenthistory/gotopaymenthistory.component').then((c) => c.GotopaymenthistoryComponent) },
            // { path: 'view-application', loadComponent: () => import('./property/applications/employee-view-application/employee-view-application.component').then((c) => c.EmployeeViewApplicationComponent) },
            { path: 'E_ChallenCreate', loadComponent: () => import('./sales/echallencreate/echallencreate.component').then((c) => c.EchallencreateComponent) },
            { path: 'allotmentorder_download', loadComponent: () => import('./property/allotee-allotmentorder-download/allotee-allotmentorder-download.component').then((c) => c.AlloteeAllotmentorderDownloadComponent) },
            { path: 'allotmentorder_downloaded', loadComponent: () => import('./property/allotee-allotmentorder-downloaded/allotee-allotmentorder-downloaded.component').then((c) => c.AlloteeAllotmentorderDownloadedComponent) },
            { path: 'allottee_application', loadComponent: () => import('./property/allotee-application/allotee-application.component').then((c) => c.AlloteeApplicationComponent) },
            { path: 'allottee_LCS_Approve_downloaded', loadComponent: () => import('./property/allottee-lcs-approved-download/allottee-lcs-approved-download.component').then((c) => c.AllotteeLcsApprovedDownloadComponent) },

            { path: 'allottee_LCS_downloaded', loadComponent: () => import('./property/allotee-lcs-downloaded/allotee-lcs-downloaded.component').then((c) => c.AlloteeLCSDownloadedComponent) },
            { path: 'allottee_LCS_upload', loadComponent: () => import('./property/allotee-lcs-upload/allotee-lcs-upload.component').then((c) => c.AlloteeLCSUploadComponent) },
            { path: 'allottee_uploadPrinciple', loadComponent: () => import('./property/allotee-lcs-upload-principle/allotee-lcs-upload-principle.component').then((c) => c.AlloteeLCSUploadPrincipleComponent) },
            { path: 'allottee_echallan_generated', loadComponent: () => import('./property/allotee-echallan-generated/allotee-echallan-generated.component').then((c) => c.AlloteeEchallanGeneratedComponent) },
            { path: 'allottee_challan_cleared', loadComponent: () => import('./property/allotee-echallan-cleared/allotee-echallan-cleared.component').then((c) => c.AlloteeEchallanClearedComponent) },
            { path: 'allottee_handover', loadComponent: () => import('./property/allotee-handover/allotee-handover.component').then((c) => c.AlloteeHandoverComponent) },
            { path: 'allottee_drafsaledeed_download', loadComponent: () => import('./property/allotee-draftsale-download/allotee-draftsale-download.component').then((c) => c.AlloteeDraftsaleDownloadComponent) },
            { path: 'allottee_drafsaledeed_upload', loadComponent: () => import('./property/allotee-draftsale-upload/allotee-draftsale-upload.component').then((c) => c.AlloteeDraftsaleUploadComponent) },
            { path: 'allottee_drafsaledeed_uploaded', loadComponent: () => import('./property/allotee-draftsale-uploaded/allotee-draftsale-uploaded.component').then((c) => c.AlloteeDraftsaleUploadedComponent) },
            { path: 'allottee_saledeed_schedule', loadComponent: () => import('./property/allotee-saledeed-schedule/allotee-saledeed-schedule.component').then((c) => c.AlloteeSaledeedScheduleComponent) },
            { path: 'allottee_saledeed_scheduled', loadComponent: () => import('./property/allotee-saledeed-scheduled/allotee-saledeed-scheduled.component').then((c) => c.AlloteeSaledeedScheduledComponent) },
            { path: 'allottee_saledeed_issued', loadComponent: () => import('./property/allotee-saledeed-issued/allotee-saledeed-issued.component').then((c) => c.AlloteeSaledeedIssuedComponent) },
            { path: 'allottee_echallan_view', loadComponent: () => import('./sales/allottee-challan-view/allottee-challan-view.component').then((c) => c.AllotteeChallanViewComponent) },
            { path: 'allottee_echallan_generate', loadComponent: () => import('./property/allottee-echallan-generate/allottee-echallan-generate.component').then((c) => c.AllotteeEchallanGenerateComponent) },
            { path: 'allottee_echallan_create', loadComponent: () => import('./sales/echallencreate/echallencreate.component').then((c) => c.EchallencreateComponent) },
            { path: 'allottee_AandB_download', loadComponent: () => import('./property/allottee-aandb-download/allottee-aandb-download.component').then((c) => c.AllotteeAandbDownloadComponent) },
            { path: 'customer_dashboard', loadComponent: () => import('./property/customerdashboard/customerdashboard.component').then((c) => c.CustomerdashboardComponent) },



        ],
    },
    { path: 'all-schemes', loadComponent: () => import('./sales/view-all-schemes/view-all-schemes.component').then((c) => c.ViewAllSchemesComponent), canActivate: [AuthguardService] },
    { path: 'all-unsold-units', loadComponent: () => import('./sales/view-all-unsold/view-all-unsold.component').then((c) => c.ViewAllUnsoldComponent) },
    { path: 'reservation-category', loadComponent: () => import('./sales/customer-reservation-page/customer-reservation-page.component').then((c) => c.CustomerReservationPageComponent) },
    { path: 'booking-status', loadComponent: () => import('./sales/booking-status/booking-status.component').then((c) => c.BookingStatusComponent) },
    { path: 'view-scheme', loadComponent: () => import('./sales/view-scheme/view-scheme.component').then((c) => c.ViewSchemeComponent), canActivate: [AuthguardService] },
    { path: 'customer-login', loadComponent: () => import('./sales/customer-login/customer-login.component').then((c) => c.CustomerLoginComponent), canActivate: [AuthguardService] },
    { path: 'customer-register', loadComponent: () => import('./sales/customer-register/customer-register.component').then((c) => c.CustomerRegisterComponent) },
    { path: 'application', loadComponent: () => import('./sales/customer-application/customer-application.component').then((c) => c.CustomerApplicationComponent) },
    { path: 'selectbank', loadComponent: () => import('./select-bank/select-bank.component').then((c) => c.SelectBankComponent) },
    { path: 'paymentSuccess', loadComponent: () => import('./payment-success/payment-success.component').then((c) => c.PaymentSuccessComponent) },
    { path: 'payment-failed', loadComponent: () => import('./payment-failure/payment-failure.component').then((c) => c.PaymentFailureComponent) },
    { path: 'verify-otp', loadComponent: () => import('./sales/customer-verify-otp/customer-verify-otp.component').then((c) => c.CustomerVerifyOtpComponent) },
    { path: 'all-schemes/:id', loadComponent: () => import('./sales/view-all-schemes/view-all-schemes.component').then((c) => c.ViewAllSchemesComponent), canActivate: [AuthguardService] },
    { path: 'reload', loadComponent: () => import('./sales/reloadpage/reloadpage.component').then((c) => c.ReloadpageComponent) },
    { path: 'customer-allottee-login', loadComponent: () => import('./sales/customer-allottee-login/customer-allottee-login.component').then((c) => c.CustomerAllotteeLoginComponent), canActivate: [AuthguardService] },
    { path: 'customer-forgot-password', loadComponent: () => import('./sales/customer-forgot-password/customer-forgot-password.component').then((c) => c.CustomerForgotPasswordComponent) },



];


