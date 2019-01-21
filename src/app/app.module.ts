import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {QRCodeHelperInput} from "../pages/QRCodeHelperInput/QRCodeHelperInput";
import {QRCodeHelperList} from "../pages/QRCodeHelperList/QRCodeHelperList";
import {QRCodeHelperPrint} from "../pages/QRCodeHelperPrint/QRCodeHelperPrint";

import { IonicStorageModule } from '@ionic/storage';
import {HttpClientModule} from "@angular/common/http";
import {LoginPage} from "../pages/LoginPage/login-page";
import {Data_provider} from "../providers/data_provider";
import {Http_provider} from "../providers/http_provider";
import {Auth_provider} from "../providers/auth_provider";
import {SignupPage} from "../pages/SignupPage/signup-page";

@NgModule({
  declarations: [
    MyApp,
    ContactPage,
    HomePage,
    TabsPage,
    QRCodeHelperInput,
    QRCodeHelperList,
    QRCodeHelperPrint,
    LoginPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ContactPage,
    HomePage,
    TabsPage,
    QRCodeHelperInput,
    QRCodeHelperList,
    QRCodeHelperPrint,
    LoginPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClientModule,
    Data_provider,
    Http_provider,
    Auth_provider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
