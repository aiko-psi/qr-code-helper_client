import { Component } from '@angular/core';
import {Loading, LoadingController, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {QRRedirect} from "../../model/QRRedirect";
import {Http_provider} from "../../providers/http_provider";
import {ScannerPage} from "../QRScanner/scanner-page";
import {QRCode} from "../../model/QRCode";

/**
 * View for showing and editing QRRedirects
 */
@Component({
  selector: 'page-input',
  templateUrl: 'QRCodeHelperInput.html'
})
export class QRCodeHelperInput {
  private loading: Loading;
  private currentRedirect: QRRedirect = new QRRedirect();
  readonly searchUrl: string;
  // Bool-values for managing functionality
  /**
   * If true, update existing QRRedirect, if false, create new QRRedirect
   */
  private update: boolean;
  /**
   * indicated if qrCodeId is valid
   */
  private qrIdOkay: boolean;
  /**
   * clear page when going back to list, don't clear if going to scan
   */
  private clearPageWhenLeaving: boolean;

  /**
   *
   * @param navCtrl
   * @param toast
   * @param loadingCtrl
   * @param navParams
   * @param http
   * @param plt
   */
  constructor(public navCtrl: NavController, private toast: ToastController, private loadingCtrl: LoadingController,
              private navParams: NavParams , private http: Http_provider, private plt: Platform) {
    this.searchUrl = this.http.baseURL.replace("/api", "") + "/qrcodehelper/qrredirect/";
  }

  /**
   * Lifecycle Events: When entering view, check if there is scanning data available from [[ScannerPage]]
   * @see [[processScanningResult]]
   * @see [[checkLoadFromPrevious]]
   */
  ionViewWillEnter(){
    // check if page is loaded after scanning a code
    if(this.navParams.data.scanning){
      this.processScanningResult();
      this.navParams.data.scanning = false;
    } else {
      this.checkLoadFromPrevious();
    }
  }

  /**
   * Checks if there is a existing redirectIc available from the previous site [[QRCodeHelperList]]
   * @see [[loadFromRedirectId]]
   */
  checkLoadFromPrevious(){
    if(this.navParams.data.redirectId){
      this.loadFromRedirectId(this.navParams.data.redirectId).then(()=>{
        this.update = true;
        this.navParams.data.redirectId = null;
      }).catch(()=> {
        // loading data for redirectId  failed, user has to try again or insert other redirectId
        this.loading.dismissAll();
        this.presentToast("Laden fehlgeschlagen.");
        this.update = false;
      })
    } else {
      // no redirectId available, give user the chance to scan or insert redirectID
      this.update = false;
    }
  }

  /**
   * Loads data for a QRRedirectId from the given redirectId, sets [[currentRedirect]]
   * @see [[http]]
   * @see [[qrIdOkay]]
   * @see [[update]]
   * @param redirectId ID of an existing QRRedirect from prevoius view
   */
  loadFromRedirectId(redirectId: number): Promise<any>{
    return this.showLoading()
      .then(()=> {
        return this.http.getCurrentRedirectFromId(redirectId)
      })
      .then(resp => {
        this.qrIdOkay= true;
        return this.currentRedirect = resp;
      })
      .then(()=>{
        this.qrIdOkay = true;
        this.update = true;
        return this.loading.dismissAll();
      })

  }

  /**
   * checks if QRRedirect for currently added redirectId is ready for use;
   * is performed each time the redirectId changes;
   * if one check fails, [[qrIdOkay]] is set to false;
   * if QRCodeis in Use, load the QRRedirect and set [[update]] to true
   * @see [[http]]
   * @see [[loadFromRedirectId]]
   */
  checkQRCodeId(){
    // TODO: Refactor
    // first check: is redirectId registered on Server?
    return this.http.isQRCodePossible(this.currentRedirect.qrcodeId)
      .then(()=> {
        return this.qrIdOkay= true;
      })
      .catch(err => {
        this.qrIdOkay = false;
        return this.presentToast("QR-Code-ID ist noch nicht registriert!")
      })
      // second check: is QRCode in use?
      .then(()=>{
        return this.http.isQRinUse(this.currentRedirect.qrcodeId)
      })
      .catch(() => {})
      .then(() => {
        // QRCode is in use, load it
        return this.http.getQRCode(this.currentRedirect.qrcodeId)
      }).then((resp) => {
        // load QRRedirect
        let response: QRCode = resp;
        return this.loadFromRedirectId(response.redirect.id);
      })
  }

  /**
   * Redirects to other function depending on [[update]]
   * @see [[putQRRedirect]]
   * @see [[postQRRedirect]]
   */
  request(){
    if(this.update){
      this.putQRRedirect();
    }else {
      this.postQRRedirect();
    }
  }

  /**
   * Posts new QRRedirect to Server; handles errors
   * @see [[http]]
   */
  postQRRedirect(){
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
        this.presentToast("Eintragunen fehlgeschlagen!" + err.toString());
      })
  }

  /**
   * Updates existing QRRedirect on Server
   * @see [[http]]
   */
  putQRRedirect(){
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
        this.presentToast("Änderung fehlgeschlagen!" + err.toString());
      })

  }

  /**
   * Navigates to [[ScannerPage]] if platform is cordova
   */
  scan(){
    if (this.plt.is('cordova')){
      this.navCtrl.push(ScannerPage);
    } else {
      this.presentToast("QR-Code-Scanner nicht verfügbar.");
    }
  }

  /**
   * Checks if there is a scanning result from [[ScanningPage]] and starts processing it
   * @see [[processString]]
   */
  processScanningResult(){
    let scanResult = this.navParams.get("scanResult");
    if(scanResult){
      this.processString(scanResult);
    } else {
      this.presentToast("Kein QR-Code gescannt");
    }
  }

  /**
   * Extracts QRCodeId from the sanning result string and saves the id in [[currentRedirect]]
   * @see [[checkQRCodeId]]
   * @param text
   */
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

  /**
   * Presents message to user
   * @param message
   */
  presentToast(message: string){
    let toast = this.toast.create({
      message: message,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  /**
   * Shows loading screen
   */
  showLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Bitte warten..."
    });
    return this.loading.present();
  }

}
