import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent {

  @Output() select = new EventEmitter<string>();

  constructor() { }

}
