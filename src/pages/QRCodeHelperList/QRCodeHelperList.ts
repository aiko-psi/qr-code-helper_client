import { Component } from '@angular/core';
import {Loading, LoadingController, NavController, ToastController} from 'ionic-angular';
import {QRRedirect} from "../../model/QRRedirect";
import {Http_provider} from "../../providers/http_provider";
import {TabsPage} from "../tabs/tabs";

/**
 * View which shows a list of cards with QRRedirects (with or without filter)
 */
@Component({
  selector: 'page-list',
  templateUrl: 'QRCodeHelperList.html'
})
export class QRCodeHelperList {
  private qrRedirectArray: Array<QRRedirect> = new Array<QRRedirect>();
  private user: boolean;
  private loading: Loading;

  /**
   *
   * @param navCtrl
   * @param http
   * @param toast
   * @param loadingCtrl
   */
  constructor(public navCtrl: NavController, public http: Http_provider, private toast: ToastController,
              private loadingCtrl: LoadingController) {
  }

  /**
   * Lifecycle Event: Updates list when entering the view
   */
  ionViewWillEnter(){
    this.update();
  }

  /**
   * Starts updating [[qrRedirectArray]] and therefore the content of the view
   * @see [[load]]
   * @return Promise resolving if loading succeeded
   */
  update(): Promise<any>{
    return this.showLoading()
      .then(()=> {return this.load()})
      .then(() => {this.loading.dismissAll();})
      .catch(err => {
        this.loading.dismissAll();
        this.presentToast("Laden der Daten fehlgeschlagen. " + err.toString());
      })
  }

  /**
   * Requests QRRedirects from server and sets [[qrRedirectArray]]
   * @see [[http]]
   * @return Promise resolving if requests succeeded
   */
  load():Promise<any>{
    let whichRedirect = this.user ? "user": "all";
    return this.http.getRedirects(whichRedirect)
      .then(resp => {
        this.qrRedirectArray = Array.from(resp);
        return this.qrRedirectArray;
      })
  }

  /**
   * Navigates to [[QRCodeHelperInput]] to show details of QRRedirect and edit it
   * @param redirect selected QRRedirect
   */
  showRedirect(redirect: QRRedirect){
    let id = redirect.id;
    this.navCtrl.push(TabsPage, {redirectId: id, tab: 1});
  }

  /**
   * Refresh view, see documentation for Ionic Native Refresher
   * @param refresher
   */
  doRefresh(refresher) {
    this.update().then(() => {refresher.complete();});
  }

  /**
   * Present message to user
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
   * Show loading screen
   */
  showLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Bitte warten..."
    });
    return this.loading.present();
  }
}
