import {Component, ViewChild, ViewChildren} from '@angular/core';

import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import {QRCodeHelperInput} from "../QRCodeHelperInput/QRCodeHelperInput";
import {QRCodeHelperList} from "../QRCodeHelperList/QRCodeHelperList";
import {QRCodeHelperPrint} from "../QRCodeHelperPrint/QRCodeHelperPrint";
import {NavController, NavParams, Tabs} from "ionic-angular";
import {createViewChildren} from "@angular/compiler/src/core";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = QRCodeHelperInput;
  tab3Root = QRCodeHelperList;
  tab4Root = QRCodeHelperPrint;

  private currentTab: number;
  params;


  /**
   * Constructor
   * @param navCtrl
   * @param nav
   */
  constructor(public navCtrl: NavController, public nav: NavParams) {
    this.currentTab = this.nav.data.tab;
    this.params = this.nav.data;
  }

  /**
   * When entering View: Sets current tab to tab from the nav data
   * @see [[nav]]
   */
  ionViewWillEnter(){
    this.currentTab = this.nav.data.tab;
  }

  /**
   * When View loaded: Sets current tab to tab from the nav data
   * @see [[nav]]
   */
  ionViewDidLoad(){
    this.currentTab = this.nav.data.tab;
  }


}
