import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { HomePage } from '../pages/home/home';
import { DBProvider } from '../providers/db-provider';
import { LogProvider } from '../providers/log-provider';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HomePage;

  constructor(platform: Platform, storage: Storage, db : DBProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      db.open().then(db=>{
        console.info(`База данных открыта успешно.`);
      }).catch(error=>{
        console.error(`Ошибка открытия базы данных: ${JSON.stringify(error)}`);
      })
    });
  }
}
