import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-ntua',
  templateUrl: './ntua.component.html',
  styleUrls: ['./ntua.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NtuaComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('RIP NTUA Wanna Know?');
  }

}
