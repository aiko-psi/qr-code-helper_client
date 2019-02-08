import { Component } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {Http_provider} from "../../providers/http_provider";

@Component({
  selector: 'page-print',
  templateUrl: 'QRCodeHelperPrint.html'
})
export class QRCodeHelperPrint {
  mailing: boolean;
  count: number;
  idlist: Array<number>;
  addressList: Array<string>;
  firstElement: string;

  constructor(public navCtrl: NavController, private toastCtrl: ToastController, private http: Http_provider,
              private platform: Platform) {
    this.count = 1;
    this.mailing = false;
    this.addressList = new Array<string>();
  }

  createQRCode(){
    this.clearLists();
    this.getListOfQRCodes()
      .then(() => {
        return this.addToList();
      })
      .catch(() => {
        this.presentToast("Leider nicht möglich!");
      })
  }

  addToList(){
    for (let num of this.idlist){
      this.addressList.push(this.buildQRCodeAddress(num));
    }
    this.firstElement = this.addressList[0];
  }

  clearLists(){
    this.addressList = new Array<string>();
    this.idlist = new Array<number>();
  }


  getListOfQRCodes(){
    return this.http.postQRCodes(this.count)
      .then(resp => {
        this.idlist = resp["qrCodeIdList"];
      })
  }

  buildQRCodeAddress(num: number){
    let base = this.http.baseURL.includes("/api") ?
      this.http.baseURL.slice(0,-4) :
      this.http.baseURL;
    return base + "/qrcodehelper/" + num.toString();
  }

  presentToast(text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });


    toast.present();
  }


}

