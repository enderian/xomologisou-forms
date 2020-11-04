import {Component, Host, Input, OnInit} from '@angular/core';
import {Form} from "../api/form";
import {CarrierPage} from "../carrier-page/carrier-page.component";

@Component({
  selector: 'app-form-success',
  templateUrl: './carrier-page-form-success.component.html',
  styleUrls: ['./carrier-page-form-success.component.scss']
})
export class CarrierPageFormSuccess implements OnInit {

  @Input() form: Form;

  constructor(@Host() public page: CarrierPage) { }

  private successId: string;

  ngOnInit() {

  }

  close() {
    this.page.successId = '';
    this.page.page = '';
  }

}
