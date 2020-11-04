import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api/api.service";

@Component({
  selector: 'app-homepage-everyone',
  templateUrl: './homepage-everyone.component.html',
  styleUrls: ['./homepage-everyone.component.scss']
})
export class HomepageEveryoneComponent implements OnInit {

  constructor(private api: ApiService) { }

  carriers: any[];

  ngOnInit() {
    this.api.getCarriers().subscribe(c => this.carriers = c)
  }

}
