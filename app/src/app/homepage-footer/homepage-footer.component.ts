import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage-footer',
  templateUrl: './homepage-footer.component.html',
  styleUrls: ['./homepage-footer.component.scss']
})
export class HomepageFooterComponent implements OnInit {

  year: number;

  constructor() {
    this.year = new Date().getFullYear();
  }

  ngOnInit() {
  }

}
