import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import {LoginPage} from "../pages/LoginPage/login-page";
import {Auth_provider} from "../providers/auth_provider";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public auth: Auth_provider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  logout(){
    this.auth.logout().then(() => {this.nav.setRoot(LoginPage)});

  }

  showInfo(){
    this.nav.push(TabsPage, {tab: 0})
  }

  showContact(){
    this.nav.push(TabsPage, {tab: 0})
  }
}
