import {Component, OnInit} from '@angular/core';

declare let gtag: Function;
const CONSENT_VERSION = 1;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  consent: string | null;

  ngOnInit() {
    this.consent = localStorage.getItem(`cookie_consent_v${CONSENT_VERSION}`);
    window['ga-disable-G-25B5EM0873'] = this.consent === '0';

    gtag('js', new Date());
    gtag('set', 'allow_google_signals', this.consent === '1');
    gtag('set', 'allow_ad_personalization_signals', this.consent === '1');
    gtag('config', 'G-25B5EM0873');
  }

  consented(result: boolean) {
    this.consent = result ? '1' : '0';
    localStorage.setItem(`cookie_consent_v${CONSENT_VERSION}`, this.consent);
  }
}
