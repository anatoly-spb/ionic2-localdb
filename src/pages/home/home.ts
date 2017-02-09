import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { LogProvider, LogRecord } from '../../providers/log-provider';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  items : LogRecord[] = [];
  constructor(public navCtrl: NavController, private  log: LogProvider) {
    log.findAll().then(data=>{
      this.items = data;
    })
  }

}
