import {Component, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../api/api.service";
import {Title} from "@angular/platform-browser";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CarrierPageTerms} from "../carrier-page-terms/carrier-page-terms.component";
import {FormResponse} from "../api/form";

@Component({
  selector: 'app-form',
  templateUrl: './carrier-page.component.html',
  styleUrls: [ './carrier-page.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class CarrierPage implements OnInit {

  constructor(private api: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private renderer: Renderer2,
              private modalService: NgbModal,
              private titleService: Title) {}

  christmas = new Date() > new Date(1545696000000) && new Date() < new Date(1546732800000);
  page: string = '';
  carrier: string = '';
  response: FormResponse = null;
  successId: string = '';

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.initialize(params['carrier']);
      this.page = params['page'] || "";
    });
  }

  initialize(carrier: string) {
    this.carrier = carrier;
    this.api.getForm(this.carrier).subscribe(data => {
      if (data.error) {
        this.router.navigate(['error', data.error], { skipLocationChange: true }).then();
      } else {
        this.response = data;
        this.titleService.setTitle( data.facebook_name );
        this.renderer.setStyle(document.body, 'background-image', `url(${data.form.background_url})`);
      }
    });
  }

  openTerms(event) {
    let modal = this.modalService.open(CarrierPageTerms);
    (modal.componentInstance as CarrierPageTerms).name = this.response.facebook_name;
    (modal.componentInstance as CarrierPageTerms).terms = this.response.form.terms;
    event.stopPropagation();
    return false;
  }
}
