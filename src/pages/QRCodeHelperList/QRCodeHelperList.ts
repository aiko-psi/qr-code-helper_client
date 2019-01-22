import { Component } from '@angular/core';
import {Loading, LoadingController, NavController, ToastController} from 'ionic-angular';
import {QRRedirect} from "../../model/QRRedirect";
import {Http_provider} from "../../providers/http_provider";
import {catchError} from "rxjs/operators";
import {Pro} from "@ionic/pro";

@Component({
  selector: 'page-list',
  templateUrl: 'QRCodeHelperList.html'
})
export class QRCodeHelperList {
  private qrRedirectArray: Array<QRRedirect> = new Array<QRRedirect>();
  private user: boolean;
  private loading: Loading;

  constructor(public navCtrl: NavController, public http: Http_provider, private toast: ToastController,
              private loadingCtrl: LoadingController) {

  }

  ionViewWillEnter(){
    this.update();
  }

  update(): Promise<any>{
    return this.showLoading()
      .then(()=> {return this.load()})
      .then(() => {this.loading.dismissAll();})
      .catch(err => {
        this.loading.dismissAll();
        this.presentToast("Laden der Daten fehlgeschlagen. " + err);
      })
  }

  load():Promise<any>{
    let whichRedirect = this.user ? "user": "all";
    return this.http.getRedirects(whichRedirect)
      .then(resp => {
        this.qrRedirectArray = Array.from(resp);
        return this.qrRedirectArray;
      })
  }

  doRefresh(refresher) {
    this.update().then(() => {refresher.complete();});
  }

  presentToast(message: string){
    let toast = this.toast.create({
      message: message,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  showLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Bitte warten..."
    });
    return this.loading.present();
  }
}
