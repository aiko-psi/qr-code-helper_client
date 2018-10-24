import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import {QRCodeHelperInput} from "../QRCodeHelperInput/QRCodeHelperInput";
import {QRCodeHelperList} from "../QRCodeHelperList/QRCodeHelperList";
import {QRCodeHelperPrint} from "../QRCodeHelperPrint/QRCodeHelperPrint";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = QRCodeHelperInput;
  tab3Root = QRCodeHelperList;
  tab4Root = QRCodeHelperPrint;

  constructor() {

  }
}
