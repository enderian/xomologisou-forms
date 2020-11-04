import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {CarrierPage} from './carrier-page/carrier-page.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ApiService} from "./api/api.service";
import {FormsModule} from "@angular/forms";

import {HomepageEveryoneComponent} from './homepage-everyone/homepage-everyone.component';
import {HomepagePagesComponent} from './homepage-pages/homepage-pages.component';
import {HomepageNavigationComponent} from './homepage-navigation/homepage-navigation.component';

import {CarrierPageForm} from './carrier-page-form/carrier-page-form.component';
import {CarrierPageFormSuccess} from './carrier-page-form-success/carrier-page-form-success.component';
import {CarrierPageSearch} from './carrier-page-search/carrier-page-search.component';
import {ErrorComponent} from './error/error.component';
import {ApiInterceptor} from "./api/api.interceptor";
import {PrivacyComponent} from './privacy/privacy.component';
import {TosComponent} from './tos/tos.component';
import {HomepageFooterComponent} from './homepage-footer/homepage-footer.component';
import {CarrierPageTerms} from './carrier-page-terms/carrier-page-terms.component';
import {LinkifyPipe} from './linkify.pipe';
import {CarrierPageReport} from "./carrier-page-report/carrier-page-report.component";

import { NtuaComponent } from './static/ntua/ntua.component';

const appRoutes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'error', component: ErrorComponent},
  {path: 'home', component: HomepageEveryoneComponent},
  {path: 'page', component: HomepagePagesComponent},
  {path: 'privacy', component: PrivacyComponent},
  {path: 'tos', component: TosComponent},

  {path: 'ntua', component: NtuaComponent},

  {path: ':carrier', component: CarrierPage},
  {path: '**', redirectTo: 'home'},
];

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    HomepageEveryoneComponent,
    HomepagePagesComponent,
    HomepageNavigationComponent,
    HomepageFooterComponent,
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
