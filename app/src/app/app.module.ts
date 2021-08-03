import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {CarrierPage} from './carrier-page/carrier-page.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ApiService} from "./api/api.service";
import {RedirectGuard} from "./redirect.guard";
import {FormsModule} from "@angular/forms";

import {CarrierPageForm} from './carrier-page-form/carrier-page-form.component';
import {CarrierPageFormSuccess} from './carrier-page-form-success/carrier-page-form-success.component';
import {CarrierPageSearch} from './carrier-page-search/carrier-page-search.component';
import {ErrorComponent} from './error/error.component';
import {ApiInterceptor} from "./api/api.interceptor";
import {PrivacyComponent} from './privacy/privacy.component';
import {TosComponent} from './tos/tos.component';
import {CarrierPageTerms} from './carrier-page-terms/carrier-page-terms.component';
import {LinkifyPipe} from './linkify.pipe';
import {CarrierPageReport} from "./carrier-page-report/carrier-page-report.component";

import { NtuaComponent } from './static/ntua/ntua.component';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [RedirectGuard],
    component: RedirectGuard,
    data: {
      externalUrl: 'https://xomologisou.gr/exit'
    }
  },
  {path: 'error', component: ErrorComponent},
  {path: 'privacy', component: PrivacyComponent},
  {path: 'tos', component: TosComponent},
  {path: 'ntua', component: NtuaComponent},
  {path: ':carrier', component: CarrierPage},
  {
    path: '**',
    canActivate: [RedirectGuard],
    component: RedirectGuard,
    data: {
      externalUrl: 'https://xomologisou.gr/exit'
    }
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    CarrierPage,
    CarrierPageForm,
    CarrierPageFormSuccess,
    CarrierPageSearch,
    CarrierPageTerms,
    CarrierPageReport,
    PrivacyComponent,
    TosComponent,
    LinkifyPipe,
    NtuaComponent,
    CookieConsentComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    ApiService,
    RedirectGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [CarrierPageTerms]
})
export class AppModule {

}
