import {Component, Host, Input, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../api/api.service";
import {FormResponse} from "../api/form";
import {CarrierPage} from "../carrier-page/carrier-page.component";

@Component({
  selector: 'app-secret-search',
  templateUrl: './carrier-page-search.component.html',
  styleUrls: ['./carrier-page-search.component.scss']
})
export class CarrierPageSearch implements OnInit {

  constructor(@Host() private page: CarrierPage, public api: ApiService) {}

  @Input() carrier: string;
  @Input() form: FormResponse;

  id: string;
  secret: any;
  error: string;

  ngOnInit() {
  }

  close() {
    this.page.page = '';
  }

  delete(secret: any) {
    this.api.patchSecret(this.carrier, secret.id, 'delete').subscribe(() => {
      this.secret = null;
      this.error = 'Το μυστικό διαγράφηκε!'
    });
  }

  onSubmit() {
    this.secret = null;
    this.api.getSecret(this.carrier, this.id).subscribe(
      data => {this.secret = data; this.error = null;},
      error => this.error = error.error.error,
    )
  }
}
