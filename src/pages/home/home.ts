import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { LogProvider, LogRecord } from '../../providers/log-provider';
import { sortBy } from 'lodash';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  styles: string[] = [
    "trace",
    "debug",
    "info",
    "warning",
    "error"
  ];
  items: LogRecord[] = [];
  constructor(public navCtrl: NavController, private log: LogProvider) {
    log.findAll().then(data => {
      this.items = data;
    })
  }

}
