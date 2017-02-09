import { Component } from '@angular/core';

/*
  Generated class for the Grid component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'grid',
  templateUrl: 'grid.html'
})
export class GridComponent {

  text: string;

  constructor() {
    console.log('Hello Grid Component');
    this.text = 'Hello World';
  }

}
