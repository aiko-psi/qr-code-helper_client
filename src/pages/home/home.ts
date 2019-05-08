import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/**
 * Home-Page View to show some static Information to the user
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

}
