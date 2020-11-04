import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-form-terms',
  templateUrl: './carrier-page-terms.component.html',
  styleUrls: ['./carrier-page-terms.component.scss']
})
export class CarrierPageTerms implements OnInit {

  constructor(public modal: NgbActiveModal) { }

  @Input() name: string;
  @Input() terms: string;

  ngOnInit() {
  }

}
