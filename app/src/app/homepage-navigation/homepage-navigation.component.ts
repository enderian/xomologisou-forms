import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage-navigation',
  templateUrl: './homepage-navigation.component.html',
  styleUrls: ['./homepage-navigation.component.scss']
})
export class HomepageNavigationComponent implements OnInit {

  constructor() { }

  christmas = new Date() > new Date(1545696000000) && new Date() < new Date(1546732800000);
  navigationCollapse = true;

  ngOnInit() {
  }

}
