import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Storage } from '@ionic/storage';
import { DBProvider } from '../providers/db-provider';
import { LogProvider } from '../providers/log-provider';
import { GridComponent } from '../components/grid/grid';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GridComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Storage,
    DBProvider,
    LogProvider 
  ]
})
export class AppModule { }
