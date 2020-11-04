import {Component, Host, Input} from "@angular/core";
import {CarrierPage} from "../carrier-page/carrier-page.component";
import {Form} from "../api/form";

@Component({
  selector: 'app-carrier-page-report',
  templateUrl: './carrier-page-report.component.html',
  styleUrls: [ './carrier-page-report.component.scss' ]
})
export class CarrierPageReport {

  @Input() form: Form;

  constructor(@Host() public page: CarrierPage) {}

  hashtag = '';
  error = '';

  close() {
    this.page.page = '';
  }

}
