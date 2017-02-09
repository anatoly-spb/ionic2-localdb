import { Injectable } from '@angular/core';
import { DBProvider } from './db-provider';
import 'rxjs/add/operator/map';

enum LogLevel {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR
}

export class LogRecord {
  id: number;
  datetime: Date;
  level: LogLevel;
  msg: string;
}

@Injectable()
export class LogProvider {

  constructor(private db: DBProvider) {
    console.info(`LogProvider: Поставщик службы логирования успешно сконструирован.`);
    console.debug(`LogProvider: Старт асинхронной инициализации структуры хранения лога.`);
    db.query(`
        CREATE TABLE IF NOT EXISTS log(
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          datetime TEXT NOT NULL,
          level INTEGER NOT NULL,
          msg TEXT NOT NULL
        )
      `)
      .then(data => {
        console.debug(`LogProvider: Финиш асинхронной инициализации структуры хранения лога.`);
        console.info(`LogProvider: Структура хранения лога инициализирована успешно.`);
        this.log(LogLevel.INFO, "Служба логирования запущена успешно");
      }).catch(error => {
        console.debug(`LogProvider: Финиш асинхронной инициализации структуры хранения лога.`);
        console.error(`LogProvider: Ошибка инициализации структуры хранения лога: ${JSON.stringify(error)}`);
      });
  }

  log(level: LogLevel, msg: string) {
    let date = new Date();
    this.db.query(`INSERT INTO log (datetime, level, msg) VALUES (?, ?, ?)`, [date.toISOString(), level, msg])
      .then(data => {
        console.trace(`LogProvider: Сообщение "${msg}" успешно записано в лог.`);
      }).catch(error => {
        console.error(`LogProvider: Ошибка записи сообщения "${msg}" в лог: ${error}`);
      });
  }

  findAll(): Promise<LogRecord[]> {
    return new Promise( (resolve, reject)=>{
    this.db.query(`SELECT id, datetime, level, msg FROM log`)
      .then(data => {
        let result : LogRecord[] = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            let r : any = data.rows.item(i);
            let o = new LogRecord();
            o.id = r.id;
            o.datetime = new Date(Date.parse(r.datetime));
            o.level = r.level;
            o.msg = r.msg;
            result.push(o);
          }
          resolve(result);
        }
      }).catch(error => {
        reject(error);
      });
    });
  }
}
