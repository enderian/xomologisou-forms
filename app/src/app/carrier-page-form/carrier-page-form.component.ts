import {Component, Host, Input} from '@angular/core';
import {ApiService} from "../api/api.service";
import {Form} from "../api/form";

import {CarrierPage} from "../carrier-page/carrier-page.component";
import { environment } from 'src/environments/environment';

declare var grecaptcha: any;
const SITE_KEY = '6LdrTsAUAAAAAGMnEouh7S28CZAZ5jF7kakdKv8J';

@Component({
  selector: 'app-form-submit',
  templateUrl: './carrier-page-form.component.html',
  styleUrls: [ './carrier-page-form.component.scss' ]
})
export class CarrierPageForm {

  constructor(@Host() private page: CarrierPage, public api: ApiService) { }

  @Input() form: Form;
  @Input() carrier: string;
  @Input() facebookName: string;

  error: string;
  secret: any = {
    content: "",
    options: {},
  };
  secretImage: any = null;

  hasError(): boolean {
    return !this.secret.content.trim() && !this.secretImage
  }

  onFileChanged(event) {
    this.secretImage = event.target.files[ 0 ];
  }

  optionSetsKeys() {
    return Object.keys(this.form.option_sets || {})
  }

  optionSetKeys(id) {
    return Object.keys(this.form.option_sets[id].options || {})
  }

  submit() {
    this.api.loading = true;
    grecaptcha.execute(SITE_KEY, {action: 'form'}).then((token: string) => {

      const uploadData = new FormData();
      if (this.secretImage) {
        uploadData.append('file', this.secretImage, this.secretImage.name);
      }
      this.secret.content = this.secret.content.trim();
      uploadData.append('secret', JSON.stringify(this.secret));
      uploadData.append('captcha', token);

      this.api.submitForm(this.carrier, uploadData).subscribe((data) => {
        if (data.error) {
          this.error = data.error.error;
        } else {
          this.page.successId = data.id;
          this.page.page = 'success';
        }
        this.api.loading = false;
      }, () => {
        this.api.loading = false;
      });

    }).catch((error: any) => {
      this.error = error;
      this.api.loading = false;
    });
  }

  search() {
    this.page.page = 'search';
  }

  report() {
    this.page.page = 'report';
  }
}
