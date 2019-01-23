import { Component } from '@angular/core';
import {Loading, LoadingController, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {QRRedirect} from "../../model/QRRedirect";
import {Http_provider} from "../../providers/http_provider";
import {ScannerPage} from "../QRScanner/scanner-page";

@Component({
  selector: 'page-input',
  templateUrl: 'QRCodeHelperInput.html'
})
export class QRCodeHelperInput {
  private loading: Loading;
  private currentRedirect: QRRedirect = new QRRedirect();
  private update: boolean;
  private qrIdOkay: boolean;
  private searchUrl: string;

  constructor(public navCtrl: NavController, private toast: ToastController, private loadingCtrl: LoadingController,
              private navParams: NavParams , private http: Http_provider, private plt: Platform) {
    this.searchUrl = this.http.baseURL.replace("/api", "") + "/qrcodehelper/qrredirect/";


  }

  ionViewWillEnter(){
    if(this.navParams.data.scanning){
      this.processScanningResult();
    } else {
      this.checkLoad();
    }
  }

  checkLoad(){
    if(this.navParams.data.redirectId){
      this.loadFromRedirectId(this.navParams.data.redirectId).then(()=>{
        this.update = true;
      }).catch(()=>{
        this.loading.dismissAll();
        this.presentToast("Laden fehlgeschlagen.");
        this.update = false;
      })
    } else {
      this.update = false;
    }
  }


  loadFromRedirectId(redirectId: number): Promise<any>{
    return this.showLoading()
      .then(()=> {
        return this.http.getCurrentRedirectFromId(redirectId)
      })
      .then(resp => {
        return this.currentRedirect = resp;
      }).then(()=>{
        this.loading.dismissAll();
      })
  }


  request(){
    if(this.update){
      this.put();
    }else {
      this.post();
    }
  }

  post(){
    this.showLoading()
      .then(()=>{
        return this.http.postQRRedirect(this.currentRedirect)
      })
      .then(()=>{
        this.loading.dismissAll();
        return this.presentToast("Erfolgreich eingetragen!")
      })
      .catch(err => {
        this.loading.dismissAll();
        this.presentToast("Eintragunen fehlgeschlagen!" + err);
      })
  }

  put(){
    this.showLoading()
      .then(()=>{
        return this.http.updateQRRedirect(this.currentRedirect)
      })
      .then(()=>{
        this.loading.dismissAll();
        return this.presentToast("Erfolgreich geändert!")
      })
      .catch(err => {
        this.loading.dismissAll();
        this.presentToast("Änderung fehlgeschlagen!" + err);
      })

  }

  checkQRCodeId(){
    return this.http.isQRCodePossible(this.currentRedirect.qrcodeId)
      .then(()=> {
        this.qrIdOkay= true;
      })
      .catch(err => {
        this.qrIdOkay = false;
        this.presentToast("QR-Code-ID ist noch nicht registriert!")
      })
  }

  scan(){
    if (this.plt.is('cordova')){
      this.navCtrl.push(ScannerPage);
    } else {
      this.presentToast("QR-Code-Scanner nicht verfügbar.");
    }
  }

  processScanningResult(){
    let scanResult = this.navParams.get("scanResult");
    if(scanResult){
      this.processString(scanResult);
    } else {
      this.presentToast("Kein QR-Code gescannt");
    }
  }


  processString(text: string){
    if(text.match(this.searchUrl)){
      let numString = text.replace(this.searchUrl, "");
      let idCode = parseInt(numString, 10);
      this.currentRedirect.qrcodeId = idCode;
      this.checkQRCodeId();
    } else {
      this.presentToast("QR-Code gehört nicht zu verknüpfbaren QR-Codes dieser Anwendung!");
      this.qrIdOkay = false;
    }
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
