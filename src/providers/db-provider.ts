import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SQLite } from 'ionic-native';

import 'rxjs/add/operator/map';

const OPTIONS = {
  name: 'demo.db',
  location: "default",
  androidDatabaseImplementation: 2
};


@Injectable()
export class DBProvider {
  private opening: Promise<any>;
  private db: any;

  constructor(public http: Http) {
    console.log('DBProvider has been constructed.');
  }

  open(): Promise<any> {
    if (this.db) {
      return Promise.resolve(this.db);
    }
    if (this.opening) {
      return this.opening;
    }
    console.debug(`DBProvider: Старт асинхронного процесса открытия базы.`);
    return this.opening = this.doOpen()
      .then(db => {
        console.debug(`DBProvider: Финиш асинхронного процесса открытия базы.`);
        console.info(`DBProvider: База данных открыта успешно.`);
        this.opening = null;
        return this.db = db;
      });
  }

  close() {
    if (this.opening) {
      return this.opening
        .then(db => (this.db = null, db.close()));
    }
    if (this.db) {
      return this.db.close()
        .then(r => {
          this.db = null;
          return r;
        });
    }
    return Promise.resolve();
  }

  query(sql: string, params?: any[]): Promise<any> {
    return this.open().then(db => this.doQuery(sql, params));
  }

  transaction(callback: (tx: any) => any): Promise<any> {
    return this.open().then(db => {
      return db.transaction(tx => {
        return callback(tx);
      })
    });
  }

  private doQuery(sql: string, params?: any[]): Promise<any> {
    params = params || [];
    if (this.db.executeSql) {
      // выполняем в случае наличия метода в интерфейсе
      return new Promise((resolve, reject) => {
        this.db.executeSql(sql, params, data => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    // обходим через транзакцию
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(sql, params, (tx, data) => {
          resolve(data);
        }, (tx, error) => {
          reject(error.message);
        });
      });
    });

  }

  private doOpen(): Promise<any> {
    let w: any = window;
    if (w.cordova) {
      return SQLite.openDatabase(OPTIONS);
    }
    console.warn(`DBProvider: Cordova недоступна, пытаемся открыть WebSQL базу данных.`);
    return new Promise((resolve, reject) => {
      let db = w.openDatabase('data', '1.0', 'Data', 5 * 1024 * 1024);
      if (db)
        resolve(db);
      else
        reject('Невозможно открыть базу данных');
    });
  }

}
